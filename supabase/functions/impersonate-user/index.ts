
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseServiceKey) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
    }
    
    const adminAuthClient = createClient(supabaseUrl, supabaseServiceKey).auth;

    // Get the user's ID from the request body
    const { user_id } = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({ success: false, error: "User ID is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Get the authorization header to validate admin access
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: "Authorization header is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await adminAuthClient.getUser(token);
    
    if (userError || !userData) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid authorization" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Verify the requesting user is an admin
    const { data: profileData, error: profileError } = await createClient(supabaseUrl, supabaseServiceKey)
      .from('profiles')
      .select('role')
      .eq('id', userData.id)
      .single();
      
    if (profileError || !profileData || profileData.role !== 'Admin') {
      return new Response(
        JSON.stringify({ success: false, error: "Only admins can impersonate users" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    // Log the impersonation action
    await createClient(supabaseUrl, supabaseServiceKey)
      .from('activity_logs')
      .insert({
        user_id: userData.id,
        action: 'USER_IMPERSONATION',
        details: {
          impersonated_user_id: user_id,
          timestamp: new Date().toISOString()
        }
      });

    // Generate a link to sign in as the user
    const { data, error } = await adminAuthClient.admin.generateLink({
      type: 'magiclink',
      email: userData.email,
      options: {
        redirectTo: `${new URL(req.url).origin}/dashboard`,
      }
    });

    if (error) {
      throw error;
    }

    // Create a sign-in token for the specified user
    const { data: impersonationData, error: impersonationError } = await adminAuthClient.admin.createUserSession({
      userId: user_id,
      expiresIn: 3600, // Session expiration in seconds
      invalidateAllSessions: false
    });
    
    if (impersonationError) {
      throw impersonationError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        token: impersonationData.access_token,
        refresh_token: impersonationData.refresh_token
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in impersonation:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
