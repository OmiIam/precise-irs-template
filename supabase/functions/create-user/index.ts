
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseServiceKey) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
      return new Response(
        JSON.stringify({ success: false, error: "Server configuration error" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse request body
    const { userData } = await req.json();
    
    if (!userData) {
      console.error("Missing userData in request body");
      return new Response(
        JSON.stringify({ error: "User data is required", success: false }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    console.log("Create user request received with data:", {
      email: userData.email,
      name: userData.name,
      role: userData.role,
      status: userData.status,
      hasPassword: !!userData.password
    });
    
    // Validate required fields
    if (!userData.email || !userData.password || !userData.name) {
      console.error("Missing required fields in user data");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Email, password, and name are required" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Check if user already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', userData.email)
      .limit(1);
    
    if (checkError) {
      console.error("Error checking for existing user:", checkError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to check if user already exists: " + checkError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    if (existingUsers && existingUsers.length > 0) {
      console.log("User already exists with email:", userData.email);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "A user with this email address already exists", 
          isExistingUser: true 
        }),
        { 
          status: 409, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Extract name parts for user metadata
    const nameParts = userData.name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    
    // Create the user in Supabase Auth
    console.log("Creating auth user with email:", userData.email);
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
      }
    });
    
    if (authError) {
      console.error("Error creating auth user:", authError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to create user account: " + authError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    if (!authData.user) {
      console.error("No user returned from createUser operation");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "User creation failed - no user ID returned from auth system" 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    console.log("Successfully created auth user with ID:", authData.user.id);
    
    // Format the filing deadline if it exists
    let filingDeadline = null;
    if (userData.filingDeadline) {
      try {
        filingDeadline = new Date(userData.filingDeadline).toISOString();
      } catch (error) {
        console.warn("Invalid filing deadline format:", error);
      }
    }
    
    // Create profile data for the new user
    const profileData = {
      id: authData.user.id,
      first_name: firstName,
      last_name: lastName,
      email: userData.email,
      role: userData.role || 'User',
      status: userData.status || 'Active',
      tax_due: userData.taxDue || 0,
      filing_deadline: filingDeadline,
      available_credits: userData.availableCredits || 0,
      created_at: new Date().toISOString()
    };
    
    console.log("Creating profile with data:", profileData);
    
    // Insert profile record
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([profileData])
      .select();
    
    if (profileError) {
      console.error("Error creating user profile:", profileError);
      
      // Attempt to clean up the auth user if profile creation fails
      try {
        console.log("Cleaning up auth user after profile creation failure");
        await supabase.auth.admin.deleteUser(authData.user.id);
      } catch (cleanupError) {
        console.error("Failed to clean up auth user after profile creation failure:", cleanupError);
      }
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to create user profile: " + profileError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    console.log("Successfully created user profile");
    
    // Return success response with created user data
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: { 
          user: authData.user,
          profile: profileData
        } 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Uncaught error in create-user function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Server error: " + (error.message || "Unknown error")
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
