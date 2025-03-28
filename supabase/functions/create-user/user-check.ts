
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
    
    // Check if email already exists in auth users
    console.log("Checking if email exists in auth users:", email);
    try {
      const { data: authData, error: authCheckError } = await supabase.auth.admin.listUsers({
        filter: {
          email: email
        }
      });
      
      if (authCheckError) {
        console.error("Error checking for existing auth users:", authCheckError);
        // Continue to profile check instead of failing immediately
      } else if (authData?.users && authData.users.length > 0) {
        console.log("User with email already exists in auth:", email);
        return { exists: true, error: null };
      }
    } catch (authError) {
      console.error("Error during auth user check:", authError);
      // Continue to profile check instead of failing immediately
    }
    
    // Check if email already exists in profiles
    try {
      console.log("Checking if email exists in profiles:", email);
      const { data: existingProfiles, error: profileCheckError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .limit(1);
        
      if (profileCheckError) {
        console.error("Error checking for existing profiles:", profileCheckError);
        return { 
          exists: false, 
          error: "Failed to check for existing profiles: " + profileCheckError.message
        };
      }
      
      if (existingProfiles && existingProfiles.length > 0) {
        console.log("User with email already exists in profiles:", email);
        return { exists: true, error: null };
      }
    } catch (profileError) {
      console.error("Error during profile check:", profileError);
      return { exists: false, error: "Error checking profiles: " + profileError.message };
    }
    
    console.log("No existing user found with email:", email);
    return { exists: false, error: null };
  } catch (error) {
    console.error("Unexpected error in checkExistingUser:", error);
    return { exists: false, error: "Error checking for existing users: " + error.message };
  }
}
