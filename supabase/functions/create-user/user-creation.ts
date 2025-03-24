
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
    
    // Create user in Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        first_name: userData.firstName,
        last_name: userData.lastName || ''
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
    
    // Prepare profile data
    const profileData = {
      id: userId,
      first_name: userData.firstName,
      last_name: userData.lastName || '',
      email: userData.email,
      role: userData.role || 'User',
      status: userData.status || 'Active',
      tax_due: userData.taxDue || 0,
      available_credits: userData.availableCredits || 0,
      created_at: new Date().toISOString()
    };
    
    console.log("Profile data to insert:", profileData);
    
    // Insert profile record
    const { data, error } = await supabase
      .from('profiles')
      .insert([profileData])
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
