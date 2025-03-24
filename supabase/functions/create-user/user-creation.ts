
/**
 * Creates a new auth user
 * @param supabase Supabase client
 * @param userData User data for creation
 * @returns The created auth user and any error
 */
export async function createAuthUser(supabase: any, userData: any): Promise<{ authUser: any | null, error: string | null }> {
  try {
    console.log("Creating auth user with email:", userData.email);
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true, // Auto-confirm email for admin-created users
      user_metadata: { 
        first_name: userData.firstName,
        last_name: userData.lastName
      }
    });
    
    if (authError) {
      console.error("Error creating auth user:", authError);
      return { 
        authUser: null, 
        error: "Failed to create user in authentication system: " + authError.message
      };
    }
    
    if (!authUser || !authUser.user) {
      console.error("Failed to create auth user - no user returned");
      return { 
        authUser: null, 
        error: "User creation failed - no user data returned from auth system"
      };
    }
    
    console.log("Auth user created successfully with ID:", authUser.user.id);
    return { authUser: authUser.user, error: null };
  } catch (error) {
    console.error("Unexpected error in createAuthUser:", error);
    return { authUser: null, error: "Error creating auth user: " + error.message };
  }
}

/**
 * Creates a new user profile
 * @param supabase Supabase client
 * @param userId User ID from auth
 * @param userData User data for profile
 * @returns The created profile and any error
 */
export async function createUserProfile(supabase: any, userId: string, userData: any): Promise<{ profile: any | null, error: string | null }> {
  try {
    console.log("Creating user profile with data:", {
      id: userId,
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      role: userData.role,
      status: userData.status
    });
    
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        role: userData.role || 'User',
        status: userData.status || 'Active',
        tax_due: userData.taxDue || 0,
        filing_deadline: userData.filingDeadline,
        available_credits: userData.availableCredits || 0
      })
      .select();
      
    if (profileError) {
      console.error("Error creating profile:", profileError);
      return { profile: null, error: "Failed to create user profile: " + profileError.message };
    }
    
    // Verify the profile was created by fetching it
    const { data: verifiedProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (fetchError) {
      console.error("Error verifying profile creation:", fetchError);
      return { 
        profile: null, 
        error: "User created but profile verification failed: " + fetchError.message
      };
    }
    
    if (!verifiedProfile) {
      console.error("Profile not found after creation - this should not happen");
      return { 
        profile: null, 
        error: "User created but profile not found after creation"
      };
    }
    
    console.log("User profile verified successfully with ID:", verifiedProfile.id);
    return { profile: verifiedProfile, error: null };
  } catch (error) {
    console.error("Unexpected error in createUserProfile:", error);
    return { profile: null, error: "Error creating user profile: " + error.message };
  }
}
