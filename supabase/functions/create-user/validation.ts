
/**
 * Validates user data to ensure all required fields are present and correctly formatted
 * @param userData User data to validate
 * @returns Error message if validation fails, null if validation passes
 */
export function validateUserData(userData: any): string | null {
  if (!userData) {
    return "User data is required";
  }
  
  // Check required fields
  if (!userData.email) {
    return "Email is required";
  }
  
  if (!userData.password) {
    return "Password is required";
  }
  
  if (userData.password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userData.email)) {
    return "Invalid email format";
  }
  
  // First name validation
  if (!userData.firstName || userData.firstName.trim() === '') {
    return "First name is required";
  }
  
  return null; // Validation passed
}
