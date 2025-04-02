
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

/**
 * Creates a new user in Supabase Auth
 * @param supabase Supabase client
 * @param userData User data including email and password
 * @returns Object containing created auth user and any errors
 */
export async function createAuthUser(supabase: any, userData: any): Promise<{ authUser: any, error: string | null }> {
  try {
    console.log("Creating auth user with email:", userData.email);
    
    // Make sure email is normalized
    const email = userData.email.toLowerCase().trim();
    
    // Double-check if the user already exists (safeguard)
    try {
      const { data: existingUsers } = await supabase.auth.admin.listUsers({
        filter: {
          email: email
        }
      });
      
      if (existingUsers?.users && existingUsers.users.length > 0) {
        console.error("User already exists in auth system:", email);
        return { 
          authUser: null, 
          error: "This email is already registered in the system." 
        };
      }
    } catch (checkError) {
      console.error("Error checking for existing users before creation:", checkError);
      // Continue with creation attempt despite error
    }
    
    // Process user metadata to ensure we have the correct field names
    const firstName = userData.firstName || userData.first_name || '';
    const lastName = userData.lastName || userData.last_name || '';

    // Create user in Auth with email already confirmed
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: userData.password,
      email_confirm: true, // This is crucial - confirms the email automatically
      user_metadata: {
        first_name: firstName,
        last_name: lastName
      }
    });
    
    if (error) {
      console.error("Error in createAuthUser:", error);
      if (error.message.includes("already been registered")) {
        return { 
          authUser: null, 
          error: "This email is already registered in the system." 
        };
      }
      return { 
        authUser: null, 
        error: "Failed to create auth user: " + error.message 
      };
    }
    
    if (!data.user) {
      console.error("No user returned from auth.admin.createUser");
      return { 
        authUser: null, 
        error: "User creation failed: No user data returned" 
      };
    }
    
    console.log("Auth user created successfully with ID:", data.user.id);
    return { authUser: data.user, error: null };
  } catch (error) {
    console.error("Unexpected error in createAuthUser:", error);
    return { 
      authUser: null, 
      error: "Unexpected error creating auth user: " + error.message 
    };
  }
}

/**
 * Creates a new user profile in the profiles table
 * @param supabase Supabase client
 * @param userId User ID from auth
 * @param userData User profile data
 * @returns Object containing created profile and any errors
 */
export async function createUserProfile(supabase: any, userId: string, userData: any): Promise<{ profile: any, error: string | null }> {
  try {
    if (!userId) {
      console.error("Missing user ID for profile creation");
      return { 
        profile: null, 
        error: "Cannot create profile: Missing user ID" 
      };
    }
    
    console.log("Creating user profile for user ID:", userId);
    
    // Use either the snake_case or camelCase versions of fields
    const firstName = userData.first_name || userData.firstName || '';
    const lastName = userData.last_name || userData.lastName || '';
    const taxDue = userData.tax_due !== undefined ? userData.tax_due : (userData.taxDue !== undefined ? userData.taxDue : 0);
    const availableCredits = userData.available_credits !== undefined ? userData.available_credits : 
                             (userData.availableCredits !== undefined ? userData.availableCredits : 0);
    
    // Format date for PostgreSQL if present
    let filingDeadline = null;
    if (userData.filing_deadline || userData.filingDeadline) {
      try {
        const deadline = userData.filing_deadline || userData.filingDeadline;
        filingDeadline = new Date(deadline).toISOString();
      } catch (e) {
        console.error("Invalid date format for filingDeadline:", userData.filing_deadline || userData.filingDeadline);
      }
    }
    
    // Ensure email is normalized
    const email = userData.email.toLowerCase().trim();
    
    // Check for duplicate email in profiles table
    const { data: existingProfiles, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .ilike('email', email)
      .limit(1);
      
    if (!checkError && existingProfiles && existingProfiles.length > 0) {
      console.error("A profile with this email already exists:", email);
      return { 
        profile: null, 
        error: "A profile with this email already exists" 
      };
    }
    
    // Prepare profile data
    const profileData = {
      id: userId,
      first_name: firstName,
      last_name: lastName,
      email: email,
      role: userData.role || 'User',
      status: userData.status || 'Active',
      tax_due: taxDue,
      filing_deadline: filingDeadline,
      available_credits: availableCredits,
      created_at: new Date().toISOString()
    };
    
    console.log("Profile data to insert:", profileData);
    
    // Insert profile record
    const { data, error } = await supabase
      .from('profiles')
      .upsert([profileData])
      .select()
      .single();
    
    if (error) {
      console.error("Error in createUserProfile:", error);
      if (error.message.includes("duplicate key") || error.message.includes("already exists")) {
        return { 
          profile: null, 
          error: "A profile with this email already exists" 
        };
      }
      return { 
        profile: null, 
        error: "Failed to create user profile: " + error.message 
      };
    }
    
    if (!data) {
      console.error("No profile data returned after insertion");
      return { 
        profile: null, 
        error: "Profile creation failed: No profile data returned" 
      };
    }
    
    console.log("User profile created successfully:", data);
    return { profile: data, error: null };
  } catch (error) {
    console.error("Unexpected error in createUserProfile:", error);
    return { 
      profile: null, 
      error: "Unexpected error creating user profile: " + error.message 
    };
  }
}
