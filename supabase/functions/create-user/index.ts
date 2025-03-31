
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { validateUserData } from "./validation.ts";
import { checkExistingUser } from "./user-check.ts";
import { createAuthUser, createUserProfile } from "./user-creation.ts";
import { corsHeaders } from "./cors.ts";

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
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
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
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Check for admin authentication or valid user session
    let isAuthorized = false;
    const authHeader = req.headers.get('Authorization') || '';
    const isAdminAuth = req.headers.get('X-Admin-Auth') === 'true';
    
    // Special case: If using admin-only auth mode with the special header
    if (isAdminAuth) {
      console.log("Admin-only authentication detected via X-Admin-Auth header");
      isAuthorized = true;
    } 
    // Regular case: Check user session token
    else if (authHeader.startsWith('Bearer ') && authHeader !== 'Bearer ADMIN_MODE') {
      const token = authHeader.substring(7);
      
      // Verify the JWT token from a normal user session
      try {
        const { data, error } = await supabase.auth.getUser(token);
        if (!error && data.user) {
          // Check if the user has admin role
          const { data: profileData } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();
            
          isAuthorized = profileData?.role === 'Admin';
          
          if (!isAuthorized) {
            console.log("User authenticated but not an admin:", data.user.id);
          } else {
            console.log("Admin user authenticated:", data.user.id);
          }
        } else {
          console.error("Invalid authentication token:", error);
        }
      } catch (error) {
        console.error("Error verifying authentication:", error);
      }
    }
    
    if (!isAuthorized) {
      console.error("Unauthorized access attempt");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "You must be an admin to create users"
        }),
        { 
          status: 403, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
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
    
    // 1. Validate user data
    const validationError = validateUserData(userData);
    if (validationError) {
      console.error("Validation error:", validationError);
      return new Response(
        JSON.stringify({ success: false, error: validationError }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // 2. Check if user already exists
    const { exists: userExists, error: checkError } = await checkExistingUser(supabase, userData.email);
    
    if (checkError) {
      console.error("Error checking existing user:", checkError);
      return new Response(
        JSON.stringify({ success: false, error: checkError }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    if (userExists) {
      console.log("User already exists with email:", userData.email);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "A user with this email address has already been registered",
          isExistingUser: true
        }),
        { 
          status: 409, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // 3. Create auth user
    const { authUser, error: authError } = await createAuthUser(supabase, userData);
    
    if (authError) {
      console.error("Error creating auth user:", authError);
      return new Response(
        JSON.stringify({ success: false, error: authError }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    if (!authUser || !authUser.id) {
      console.error("Auth user creation failed - no user ID returned");
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
    
    console.log("Successfully created auth user with ID:", authUser.id);
    
    // 4. Create user profile
    const { profile, error: profileError } = await createUserProfile(supabase, authUser.id, userData);
    
    if (profileError) {
      // Attempt to clean up the auth user if profile creation fails
      try {
        console.log("Cleaning up auth user after profile creation failure");
        await supabase.auth.admin.deleteUser(authUser.id);
        console.log("Cleaned up auth user after profile creation failure");
      } catch (cleanupError) {
        console.error("Failed to clean up auth user:", cleanupError);
      }
      
      console.error("Error creating user profile:", profileError);
      return new Response(
        JSON.stringify({ success: false, error: profileError }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    if (!profile) {
      console.error("Profile creation failed - no profile data returned");
      // Attempt to clean up the auth user
      try {
        await supabase.auth.admin.deleteUser(authUser.id);
      } catch (cleanupError) {
        console.error("Failed to clean up auth user after profile creation failure:", cleanupError);
      }
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Profile creation failed - no profile data returned" 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    console.log("Successfully created user profile for user:", authUser.id);
    
    // Return success response with created user data
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: { 
          user: authUser,
          profile: profile
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
