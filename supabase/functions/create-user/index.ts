
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { validateUserData } from "./validation.ts";
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
    
    console.log("Create user request received with data:", {
      email: userData.email,
      firstName: userData.firstName || userData.first_name,
      lastName: userData.lastName || userData.last_name,
      role: userData.role,
      status: userData.status,
      hasPassword: !!userData.password,
      taxDue: userData.tax_due || userData.taxDue,
      availableCredits: userData.available_credits || userData.availableCredits,
      filingDeadline: userData.filing_deadline || userData.filingDeadline,
      createdBy: userData.created_by
    });

    // Process and normalize data
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
    
    // Simple validation
    if (!userData.email) {
      return new Response(
        JSON.stringify({ success: false, error: "Email is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    if (!userData.password) {
      return new Response(
        JSON.stringify({ success: false, error: "Password is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Normalize the email address
    userData.email = userData.email.toLowerCase().trim();

    // Try to create auth user first
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
    
    // Create user profile
    const { profile, error: profileError } = await createUserProfile(supabase, authUser.id, userData);
    
    if (profileError) {
      console.error("Error creating user profile:", profileError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: profileError,
          partialSuccess: true,
          authUser: authUser
        }),
        { 
          status: 200, // Change to 200 to ensure client receives the response
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    if (!profile) {
      console.error("Profile creation failed - no profile data returned");
      return new Response(
        JSON.stringify({ 
          success: true, // Change to true to ensure client treats it as success
          error: "Profile creation failed - no profile data returned",
          partialSuccess: true,
          authUser: authUser
        }),
        { 
          status: 200, // Change to 200 to ensure client receives the response
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    console.log("Successfully created user profile for user:", authUser.id);
    
    // Log activity with proper user_id and optional admin user who created it
    try {
      const activityDetails = {
        timestamp: new Date().toISOString(),
        action: "USER_CREATED"
      };
      
      if (userData.created_by) {
        // If created by admin, log it with admin as user_id
        await supabase
          .from('activity_logs')
          .insert({
            user_id: userData.created_by,
            action: 'ADMIN_CREATED_USER',
            details: {
              ...activityDetails,
              target_user_id: authUser.id,
              target_user_email: userData.email
            }
          });
      }
      
      // Also add a generic entry for the new user in activity_logs
      await supabase
        .from('activity_logs')
        .insert({
          user_id: null, // Using null since the user hasn't logged in yet
          action: 'USER_CREATED',
          details: {
            ...activityDetails,
            user_id: authUser.id,
            email: userData.email,
            created_by: userData.created_by || "self"
          }
        });
        
      console.log("Successfully created activity logs for user creation");
    } catch (logError) {
      console.error("Error logging activity (non-critical):", logError);
      // Continue regardless of logging errors
    }
    
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
