
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
      throw new Error("Server configuration error");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse request body
    const { userData } = await req.json();
    
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
    
    // Validate password
    if (!userData.password || typeof userData.password !== 'string' || userData.password.length < 6) {
      console.error("Invalid password format:", { 
        passwordProvided: !!userData.password,
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
    
    // Check if email already exists in profiles before creating user
    const { data: existingProfiles, error: profileCheckError } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', userData.email)
      .limit(1);
      
    if (profileCheckError) {
      console.error("Error checking for existing profiles:", profileCheckError);
    } else if (existingProfiles && existingProfiles.length > 0) {
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
    
    // Check if email already exists in auth users before creating user
    const { data: authData, error: authCheckError } = await supabase.auth.admin.listUsers({
      filter: {
        email: userData.email
      }
    });
    
    if (authCheckError) {
      console.error("Error checking for existing auth users:", authCheckError);
    } else if (authData?.users && authData.users.length > 0) {
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
    
    // First, create the auth user
    console.log("Creating auth user with email:", userData.email);
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: { 
        first_name: userData.firstName,
        last_name: userData.lastName
      }
    });
    
    if (authError) {
      console.error("Error creating auth user:", authError);
      // Check if the error is due to existing user
      if (authError.message.includes("already been registered")) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "A user with this email address has already been registered",
            isExistingUser: true
          }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw authError;
    }
    
    if (!authUser || !authUser.user) {
      console.error("Failed to create auth user - no user returned");
      throw new Error("User creation failed");
    }
    
    const userId = authUser.user.id;
    console.log("Auth user created successfully:", userId);
    
    // Now insert/update the profile data
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
      .upsert({
        id: userId,
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        role: userData.role || 'User',
        status: userData.status || 'Active',
        tax_due: userData.taxDue || 0,
        filing_deadline: userData.filingDeadline,
        available_credits: userData.availableCredits || 0
      }, { returning: 'minimal' })
      .select();
      
    if (profileError) {
      console.error("Error updating profile:", profileError);
      
      // If profile creation fails, attempt to clean up by deleting the auth user
      try {
        console.log("Cleaning up auth user after profile creation failure");
        await supabase.auth.admin.deleteUser(userId);
        console.log("Cleaned up auth user after profile creation failure");
      } catch (cleanupError) {
        console.error("Failed to clean up auth user:", cleanupError);
      }
      
      throw profileError;
    }
    
    // Fetch the complete profile
    const { data: completeProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (fetchError) {
      console.error("Error fetching complete profile:", fetchError);
    }
    
    console.log("User profile created/updated successfully");
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: { 
          user: authUser.user,
          profile: completeProfile || null 
        } 
      }),
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
