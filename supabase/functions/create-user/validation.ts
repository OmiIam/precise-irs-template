
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
  
  // Normalize and validate email format
  userData.email = userData.email.toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userData.email)) {
    return "Invalid email format";
  }
  
  // First name validation - Changed from firstName to first_name to match database schema
  if (!userData.firstName && !userData.first_name) {
    return "First name is required";
  }
  
  // Ensure we have either firstName or first_name
  if (!userData.firstName && userData.first_name) {
    userData.firstName = userData.first_name;
  } else if (userData.firstName && !userData.first_name) {
    userData.first_name = userData.firstName;
  }
  
  return null; // Validation passed
}
