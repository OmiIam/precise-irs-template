
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

/**
 * Creates a new user in Supabase Auth with reduced security checks
 * @param supabase Supabase client
 * @param userData User data including email and password
 * @returns Object containing created auth user and any errors
 */
export async function createAuthUser(supabase: any, userData: any): Promise<{ authUser: any, error: string | null }> {
  try {
    console.log("Creating auth user with email:", userData.email);
    
    // Make sure email is normalized
    const email = userData.email.toLowerCase().trim();
    
    // Attempt to create user directly, bypassing additional checks
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: userData.password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name: userData.firstName || userData.first_name || '',
        last_name: userData.lastName || userData.last_name || '',
        created_by: 'admin_panel'
      },
      // Bypass any additional security measures
      app_metadata: {
        provider: 'email',
        admin_created: true
      }
    });
    
    if (error) {
      console.error("Error in createAuthUser:", error);
      
      // Handle specific error cases
      if (error.message.includes("already been registered")) {
        // Try to find and delete the conflicting user to allow recreation
        try {
          const { data: existingUsers } = await supabase.auth.admin.listUsers({
            filter: {
              email: email
            }
          });
          
          if (existingUsers?.users && existingUsers.users.length > 0) {
            const existingUserId = existingUsers.users[0].id;
            console.log("Attempting to remove conflicting user:", existingUserId);
            
            // Delete the conflicting user
            await supabase.auth.admin.deleteUser(existingUserId);
            console.log("Deleted conflicting user, retrying creation");
            
            // Retry user creation after deletion
            const { data: retryData, error: retryError } = await supabase.auth.admin.createUser({
              email: email,
              password: userData.password,
              email_confirm: true,
              user_metadata: {
                first_name: userData.firstName || userData.first_name || '',
                last_name: userData.lastName || userData.last_name || '',
                created_by: 'admin_panel_retry'
              }
            });
            
            if (retryError) {
              console.error("Error in retry createAuthUser:", retryError);
              return { 
                authUser: null, 
                error: "Failed to create user after conflict resolution: " + retryError.message 
              };
            }
            
            if (!retryData.user) {
              return {
                authUser: null,
                error: "User creation retry failed: No user data returned"
              };
            }
            
            console.log("Successfully created auth user on retry with ID:", retryData.user.id);
            return { authUser: retryData.user, error: null };
          }
        } catch (deleteError) {
          console.error("Error resolving user conflict:", deleteError);
        }
        
        return { 
          authUser: null, 
          error: "This email is already registered and conflict resolution failed" 
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
 * Creates a new user profile with simplified and reliable approach
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
    
    // First attempt to delete any existing profile with the same email
    try {
      const { data: existingProfiles, error: findError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .neq('id', userId) // Don't delete our own profile
        .limit(1);
        
      if (!findError && existingProfiles && existingProfiles.length > 0) {
        console.log("Found existing profile with same email, attempting cleanup");
        const conflictId = existingProfiles[0].id;
        
        // Delete the conflicting profile
        const { error: deleteError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', conflictId);
          
        if (deleteError) {
          console.error("Error cleaning up conflicting profile:", deleteError);
        } else {
          console.log("Successfully cleaned up conflicting profile");
        }
      }
    } catch (cleanupError) {
      console.error("Error during profile cleanup:", cleanupError);
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
    
    // Force upsert to replace any existing profile
    const { data, error } = await supabase
      .from('profiles')
      .upsert([profileData], { onConflict: 'id' })
      .select();
    
    if (error) {
      console.error("Error in createUserProfile:", error);
      return { 
        profile: null, 
        error: "Failed to create user profile: " + error.message 
      };
    }
    
    if (!data || data.length === 0) {
      console.error("No profile data returned after insertion");
      return { 
        profile: null, 
        error: "Profile creation failed: No profile data returned" 
      };
    }
    
    console.log("User profile created successfully:", data[0]);
    return { profile: data[0], error: null };
  } catch (error) {
    console.error("Unexpected error in createUserProfile:", error);
    return { 
      profile: null, 
      error: "Unexpected error creating user profile: " + error.message 
    };
  }
}
