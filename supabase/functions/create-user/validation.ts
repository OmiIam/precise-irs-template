
/**
 * Simplified validation for user data with minimal requirements
 * @param userData User data to validate
 * @returns Error message if validation fails, null if validation passes
 */
export function validateUserData(userData: any): string | null {
  if (!userData) {
    return "User data is required";
  }
  
  // Check for email (minimal validation)
  if (!userData.email) {
    return "Email is required";
  }
  
  // Check for password (minimal length requirement)
  if (!userData.password) {
    return "Password is required";
  }
  
  return null; // Validation passed
}
