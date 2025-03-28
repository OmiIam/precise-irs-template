
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
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse the request body
    const { email, password, firstName, lastName, role, status, taxDue, availableCredits, filingDeadline } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ success: false, error: "Email and password are required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Create the user
    const { data: userData, error: createUserError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName || "",
        last_name: lastName || "",
      }
    });

    if (createUserError) {
      throw createUserError;
    }

    // If the user was created, we need to ensure the profile exists with the correct data
    if (userData.user) {
      // Set up profile data
      const profileData = {
        id: userData.user.id,
        email,
        first_name: firstName || "",
        last_name: lastName || "",
        role: role || "User",
        status: status || "Active",
        tax_due: taxDue || 0,
        available_credits: availableCredits || 0,
        filing_deadline: filingDeadline || null,
        created_at: new Date().toISOString()
      };

      // Insert or update the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData);

      if (profileError) {
        console.error("Error creating profile:", profileError);
        // If profile creation fails, attempt to delete the auth user
        await supabase.auth.admin.deleteUser(userData.user.id);
        throw new Error(`Profile creation failed: ${profileError.message}`);
      }

      // Log the user creation
      await supabase
        .from('activity_logs')
        .insert({
          user_id: userData.user.id,
          action: 'USER_CREATED',
          details: {
            created_by: req.headers.get('Authorization') ? 'Admin' : 'System',
            timestamp: new Date().toISOString()
          }
        });
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        user: userData.user,
        message: "User created successfully" 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
