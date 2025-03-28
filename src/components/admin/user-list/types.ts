
// Type definitions for user data in admin dashboard
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin?: string;
  taxDue?: number;
  filingDeadline?: Date;
  availableCredits?: number;
  password?: string;
}
