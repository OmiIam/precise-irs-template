
/**
 * Checks if a user with the given email already exists
 * @param supabase Supabase client
 * @param email Email to check
 * @returns Object containing existence status and any errors
 */
export async function checkExistingUser(supabase: any, email: string): Promise<{ exists: boolean, error: string | null }> {
  try {
    if (!email) {
      console.error("No email provided to checkExistingUser");
      return { exists: false, error: "Email is required to check for existing users" };
    }
    
    // Normalize email before any checks
    const normalizedEmail = email.toLowerCase().trim();
    console.log("Checking if email exists in auth users:", normalizedEmail);
    
    // Check if email already exists in auth users - this is the most reliable check
    try {
      const { data: authData, error: authCheckError } = await supabase.auth.admin.listUsers({
        filter: {
          email: normalizedEmail
        }
      });
      
      if (authCheckError) {
        console.error("Error checking for existing auth users:", authCheckError);
        // Continue to profile check instead of failing immediately
      } else if (authData?.users && authData.users.length > 0) {
        console.log("User with email already exists in auth:", normalizedEmail);
        return { exists: true, error: null };
      }
    } catch (authError) {
      console.error("Error during auth user check:", authError);
      // Continue to profile check instead of failing immediately
    }
    
    // Also check in profiles table as a fallback
    try {
      console.log("Checking if email exists in profiles:", normalizedEmail);
      const { data: existingProfiles, error: profileCheckError } = await supabase
        .from('profiles')
        .select('email')
        .ilike('email', normalizedEmail)
        .limit(1);
        
      if (profileCheckError) {
        console.error("Error checking for existing profiles:", profileCheckError);
        return { 
          exists: false, 
          error: "Failed to check for existing profiles: " + profileCheckError.message
        };
      }
      
      if (existingProfiles && existingProfiles.length > 0) {
        console.log("User with email already exists in profiles:", normalizedEmail);
        return { exists: true, error: null };
      }
    } catch (profileError) {
      console.error("Error during profile check:", profileError);
      return { exists: false, error: "Error checking profiles: " + profileError.message };
    }
    
    // As a last resort, check in the old users table if it exists
    try {
      console.log("Checking if email exists in users table:", normalizedEmail);
      const { data: oldUsers, error: oldUsersError } = await supabase
        .from('users')
        .select('email')
        .ilike('email', normalizedEmail)
        .limit(1);
        
      if (!oldUsersError && oldUsers && oldUsers.length > 0) {
        console.log("User with email already exists in old users table:", normalizedEmail);
        return { exists: true, error: null };
      }
    } catch (error) {
      // If the table doesn't exist or other error, just ignore it
      console.log("Error or non-existent users table, continuing:", error);
    }
    
    console.log("No existing user found with email:", normalizedEmail);
    return { exists: false, error: null };
  } catch (error) {
    console.error("Unexpected error in checkExistingUser:", error);
    return { exists: false, error: "Error checking for existing users: " + error.message };
  }
}
