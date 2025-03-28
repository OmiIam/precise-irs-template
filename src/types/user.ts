
export type UserRole = 'Admin' | 'User';
export type UserStatus = 'Active' | 'Inactive' | 'Deleted';

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
  status?: UserStatus;
  lastLogin?: string;
  taxDue?: number;
  filingDeadline?: Date;
  availableCredits?: number;
}
