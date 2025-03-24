
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
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseServiceKey) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
      return new Response(
        JSON.stringify({ success: false, error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse request body
    const requestData = await req.json();
    const { userData } = requestData;
    
    if (!userData) {
      console.error("Missing userData in request body");
      return new Response(
        JSON.stringify({ error: "User data is required", success: false }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("Create user request received with data:", {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      status: userData.status,
      hasPassword: !!userData.password,
      passwordLength: userData.password ? userData.password.length : 0
    });
    
    // Validate required fields
    if (!userData.email || !userData.firstName || !userData.password) {
      console.error("Missing required fields:", { 
        hasEmail: !!userData.email,
        hasFirstName: !!userData.firstName,
        hasPassword: !!userData.password
      });
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Required fields missing: email, first name, and password are required" 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Validate password
    if (typeof userData.password !== 'string' || userData.password.length < 6) {
      console.error("Invalid password format:", { 
        passwordType: typeof userData.password,
        passwordLength: userData.password ? userData.password.length : 0
      });
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Valid password is required (minimum 6 characters)" 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Check if email already exists in auth users
    console.log("Checking if email exists in auth users:", userData.email);
    const { data: authData, error: authCheckError } = await supabase.auth.admin.listUsers({
      filter: {
        email: userData.email
      }
    });
    
    if (authCheckError) {
      console.error("Error checking for existing auth users:", authCheckError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to check for existing users: " + authCheckError.message
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } 
    
    // Check if user exists in auth
    if (authData?.users && authData.users.length > 0) {
      console.log("User with email already exists in auth:", userData.email);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "A user with this email address has already been registered",
          isExistingUser: true
        }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Check if email already exists in profiles
    console.log("Checking if email exists in profiles:", userData.email);
    const { data: existingProfiles, error: profileCheckError } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', userData.email)
      .limit(1);
      
    if (profileCheckError) {
      console.error("Error checking for existing profiles:", profileCheckError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to check for existing profiles: " + profileCheckError.message
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (existingProfiles && existingProfiles.length > 0) {
      console.log("User with email already exists in profiles:", userData.email);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "A user with this email address already exists",
          isExistingUser: true
        }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // First, create the auth user
    console.log("Creating auth user with email:", userData.email);
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true, // Auto-confirm email for admin-created users
      user_metadata: { 
        first_name: userData.firstName,
        last_name: userData.lastName
      }
    });
    
    if (authError) {
      console.error("Error creating auth user:", authError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to create user in authentication system: " + authError.message
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!authUser || !authUser.user) {
      console.error("Failed to create auth user - no user returned");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "User creation failed - no user data returned from auth system"
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const userId = authUser.user.id;
    console.log("Auth user created successfully with ID:", userId);
    
    // Now explicitly insert the profile data
    console.log("Creating user profile with data:", {
      id: userId,
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      role: userData.role,
      status: userData.status
    });
    
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        role: userData.role || 'User',
        status: userData.status || 'Active',
        tax_due: userData.taxDue || 0,
        filing_deadline: userData.filingDeadline,
        available_credits: userData.availableCredits || 0
      })
      .select();
      
    if (profileError) {
      console.error("Error creating profile:", profileError);
      
      // If profile creation fails, clean up by deleting the auth user
      try {
        console.log("Cleaning up auth user after profile creation failure");
        await supabase.auth.admin.deleteUser(userId);
        console.log("Cleaned up auth user after profile creation failure");
      } catch (cleanupError) {
        console.error("Failed to clean up auth user:", cleanupError);
      }
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to create user profile: " + profileError.message
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Verify the profile was created by fetching it
    const { data: verifiedProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (fetchError) {
      console.error("Error verifying profile creation:", fetchError);
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: { 
            user: authUser.user,
            profile: null,
            warning: "User created but profile verification failed"
          } 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!verifiedProfile) {
      console.error("Profile not found after creation - this should not happen");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "User created but profile not found after creation" 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("User profile verified successfully with ID:", verifiedProfile.id);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: { 
          user: authUser.user,
          profile: verifiedProfile
        } 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
