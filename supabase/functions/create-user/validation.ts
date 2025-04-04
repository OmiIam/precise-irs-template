
export function validateUserData(userData: any): string | null {
  if (!userData) {
    return "User data is required";
  }
  
  if (!userData.email) {
    return "Email is required";
  }
  
  if (!userData.password) {
    return "Password is required";
  }
  
  return null; // Validation passed
}
