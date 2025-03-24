
/**
 * Checks if a user with the given email already exists
 * @param supabase Supabase client
 * @param email Email to check
 * @returns Object containing existence status and any errors
 */
export async function checkExistingUser(supabase: any, email: string): Promise<{ exists: boolean, error: string | null }> {
  try {
    // Check if email already exists in auth users
    console.log("Checking if email exists in auth users:", email);
    const { data: authData, error: authCheckError } = await supabase.auth.admin.listUsers({
      filter: {
        email: email
      }
    });
    
    if (authCheckError) {
      console.error("Error checking for existing auth users:", authCheckError);
      return { 
        exists: false, 
        error: "Failed to check for existing users: " + authCheckError.message
      };
    }
    
    // Check if user exists in auth
    if (authData?.users && authData.users.length > 0) {
      console.log("User with email already exists in auth:", email);
      return { exists: true, error: null };
    }
    
    // Check if email already exists in profiles
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
    
    return { exists: false, error: null };
  } catch (error) {
    console.error("Unexpected error in checkExistingUser:", error);
    return { exists: false, error: "Error checking for existing users: " + error.message };
  }
}
