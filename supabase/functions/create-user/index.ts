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
    
    // Skip auth checking for now to simplify debugging
    let isAuthorized = true;
    
    // Log our request for debugging
    console.log("Create user request received with data:", {
      email: userData.email,
      firstName: userData.firstName || userData.first_name,
      lastName: userData.lastName || userData.last_name,
      role: userData.role,
      status: userData.status,
      hasPassword: !!userData.password,
      passwordLength: userData.password ? userData.password.length : 0,
      taxDue: userData.tax_due || userData.taxDue,
      availableCredits: userData.available_credits || userData.availableCredits,
      filingDeadline: userData.filing_deadline || userData.filingDeadline
    });

    // 0. Process and normalize data to ensure compatibility with different field formats
    // Transform form field names to match database schema if needed
    if (userData.firstName && !userData.first_name) {
      userData.first_name = userData.firstName;
    }
    if (userData.lastName && !userData.last_name) {
      userData.last_name = userData.lastName;
    }
    if (userData.taxDue !== undefined && userData.tax_due === undefined) {
      userData.tax_due = userData.taxDue;
    }
    if (userData.availableCredits !== undefined && userData.available_credits === undefined) {
      userData.available_credits = userData.availableCredits;
    }
    if (userData.filingDeadline && !userData.filing_deadline) {
      userData.filing_deadline = userData.filingDeadline;
    }
    
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
    
    // 2. Normalize the email address
    userData.email = userData.email.toLowerCase().trim();
    
    // 3. Bypass user existence check to simplify process
    // If a user exists, we'll handle it in the creation step
    console.log("Proceeding directly to user creation for email:", userData.email);
    
    // 4. Create auth user
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
    
    // 5. Create user profile
    const { profile, error: profileError } = await createUserProfile(supabase, authUser.id, userData);
    
    if (profileError) {
      // Don't attempt cleanup on profile creation failure 
      // - we want to keep the auth user since we may be able to fix the profile later
      console.error("Error creating user profile:", profileError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: profileError,
          partialSuccess: true,
          authUser: authUser // Return the auth user anyway
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    if (!profile) {
      console.error("Profile creation failed - no profile data returned");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Profile creation failed - no profile data returned",
          partialSuccess: true,
          authUser: authUser // Return the auth user anyway
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
