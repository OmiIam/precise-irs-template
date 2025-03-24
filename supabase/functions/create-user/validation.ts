
/**
 * Validates required user data fields
 * @param userData The user data to validate
 * @returns Error message string if validation fails, null if validation passes
 */
export function validateUserData(userData: any): string | null {
  if (!userData) {
    return "No user data provided";
  }
  
  // Check required fields
  if (!userData.email || !userData.firstName) {
    console.error("Missing required fields:", { 
      hasEmail: !!userData.email,
      hasFirstName: !!userData.firstName,
      hasPassword: !!userData.password
    });
    
    return "Required fields missing: email, first name, and password are required";
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userData.email)) {
    console.error("Invalid email format:", userData.email);
    return "Please provide a valid email address";
  }
  
  // Validate password
  if (typeof userData.password !== 'string' || userData.password.length < 6) {
    console.error("Invalid password format:", { 
      passwordType: typeof userData.password,
      passwordLength: userData.password ? userData.password.length : 0
    });
    
    return "Valid password is required (minimum 6 characters)";
  }
  
  // Validate names
  if (typeof userData.firstName !== 'string' || userData.firstName.trim().length === 0) {
    console.error("Invalid first name:", userData.firstName);
    return "First name is required";
  }
  
  return null;
}
