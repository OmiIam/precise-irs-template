
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Define CORS headers for browser requests
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
    // Create a Supabase client with the service role key (admin privileges)
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ob2NkcXRxb2hjbnhyeGhjemh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mjc1ODc4MiwiZXhwIjoyMDU4MzM0NzgyfQ.8MzKzCf9J0Zc1dz9Pp6aDMmSZl0Ro5PLniGsFiwRnZk";
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse request body
    const { userData } = await req.json();
    
    if (!userData) {
      return new Response(
        JSON.stringify({ error: "User data is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("Creating user with data:", userData);
    
    // Ensure password is a string - fix for the undefined password issue
    let password = Math.random().toString(36).slice(-8); // Default random password
    
    // Check if password exists and is a valid string
    if (userData.password && typeof userData.password === 'string') {
      password = userData.password;
    } else if (userData.password && typeof userData.password === 'object' && userData.password._type === "undefined") {
      // If password is received as an object with _type: "undefined", use the default random password
      console.log("Received invalid password object, using random password instead");
    }
    
    // First, create the auth user
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      email_confirm: true,
      user_metadata: { 
        first_name: userData.firstName,
        last_name: userData.lastName
      },
      password: password
    });
    
    if (authError) {
      console.error("Error creating auth user:", authError);
      return new Response(
        JSON.stringify({ success: false, error: authError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("Auth user created successfully:", authUser);
    
    // Now insert/update the profile data
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: authUser.user.id,
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        role: userData.role,
        status: userData.status,
        tax_due: userData.taxDue || 0,
        filing_deadline: userData.filingDeadline,
        available_credits: userData.availableCredits || 0
      })
      .select();
      
    if (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
    
    console.log("User profile created/updated successfully:", data);
    
    return new Response(
      JSON.stringify({ success: true, data: { ...authUser, profile: data } }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
