
// Type definitions for user forms in admin dashboard
export interface UserFormData {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  taxDue?: number;
  availableCredits?: number;
  filingDeadline?: Date;
  password?: string;
}
