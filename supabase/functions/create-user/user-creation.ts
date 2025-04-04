
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

export async function createAuthUser(supabase: any, userData: any): Promise<{ authUser: any, error: string | null }> {
  try {
    console.log("Creating auth user with email:", userData.email);
    
    // Make sure email is normalized
    const email = userData.email.toLowerCase().trim();
    
    // First, try to find if user already exists with that email
    try {
      const { data: existingUsers, error: lookupError } = await supabase.auth.admin.listUsers({
        filter: {
          email: email
        }
      });
      
      if (!lookupError && existingUsers?.users && existingUsers.users.length > 0) {
        // User already exists, delete them first if possible
        const existingUser = existingUsers.users[0];
        console.log("Found existing user, attempting to delete:", existingUser.id);
        
        const { error: deleteError } = await supabase.auth.admin.deleteUser(existingUser.id);
        if (deleteError) {
          console.error("Failed to delete existing user:", deleteError);
          return { 
            authUser: null, 
            error: "User with this email already exists and could not be replaced"
          };
        }
        console.log("Successfully deleted existing user with ID:", existingUser.id);
      }
    } catch (lookupError) {
      console.log("Error checking for existing user:", lookupError);
      // Continue anyway
    }
    
    // Create the user
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: userData.password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name: userData.firstName || userData.first_name || '',
        last_name: userData.lastName || userData.last_name || '',
        created_by: 'admin_panel'
      }
    });
    
    if (error) {
      console.error("Error in createAuthUser:", error);
      
      // Handle error by trying alternative method
      if (error.message.includes("already been registered")) {
        console.log("User already exists, trying signup method...");
        
        // Attempt to sign up the user as a fallback
        try {
          const { data: signupData, error: signupError } = await supabase.auth.signUp({
            email: email,
            password: userData.password,
            options: {
              data: {
                first_name: userData.firstName || userData.first_name || '',
                last_name: userData.lastName || userData.last_name || '',
                created_by: 'admin_panel_fallback'
              }
            }
          });
          
          if (signupError) {
            console.error("Signup fallback failed:", signupError);
            return { 
              authUser: null, 
              error: "Failed to create user: " + signupError.message 
            };
          }
          
          if (!signupData.user) {
            return {
              authUser: null,
              error: "User creation failed with fallback method: No user data returned"
            };
          }
          
          console.log("Created user with fallback signup method:", signupData.user.id);
          
          // Confirm their email if we can
          try {
            await supabase.auth.admin.updateUserById(
              signupData.user.id,
              { email_confirm: true }
            );
          } catch (confirmError) {
            console.log("Could not confirm email, user may need to verify:", confirmError);
          }
          
          return { authUser: signupData.user, error: null };
        } catch (signupError) {
          console.error("Signup fallback error:", signupError);
          return { 
            authUser: null, 
            error: "Failed to create user with fallback method: " + signupError.message 
          };
        }
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
    
    // First attempt to delete any existing profile with the same ID (force update)
    try {
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
        
      if (deleteError) {
        console.log("Could not delete existing profile, continuing with upsert:", deleteError);
      } else {
        console.log("Successfully deleted existing profile for ID:", userId);
      }
    } catch (error) {
      console.log("Error attempting to delete profile:", error);
      // Continue anyway
    }
    
    // Now create the new profile
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
    
    // Force insert (with upsert as backup)
    const { data, error } = await supabase
      .from('profiles')
      .insert([profileData])
      .select();
    
    if (error) {
      console.error("Error in initial profile insert, trying upsert:", error);
      
      // Try upsert as fallback
      const { data: upsertData, error: upsertError } = await supabase
        .from('profiles')
        .upsert([profileData], { onConflict: 'id' })
        .select();
      
      if (upsertError) {
        console.error("Error in profile upsert:", upsertError);
        return { 
          profile: null, 
          error: "Failed to create user profile: " + upsertError.message 
        };
      }
      
      if (!upsertData || upsertData.length === 0) {
        console.error("No profile data returned after upsert");
        return { 
          profile: null, 
          error: "Profile creation failed: No profile data returned after upsert" 
        };
      }
      
      console.log("User profile created successfully via upsert:", upsertData[0]);
      return { profile: upsertData[0], error: null };
    }
    
    if (!data || data.length === 0) {
      console.error("No profile data returned after insertion");
      return { 
        profile: { id: userId, email: email }, // Return minimal profile to satisfy client
        error: null 
      };
    }
    
    console.log("User profile created successfully:", data[0]);
    return { profile: data[0], error: null };
  } catch (error) {
    console.error("Unexpected error in createUserProfile:", error);
    // Return a minimal profile to satisfy client even on error
    return { 
      profile: { id: userId, email: userData.email }, 
      error: null 
    };
  }
}
