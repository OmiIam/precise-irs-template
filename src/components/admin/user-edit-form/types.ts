
export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  status: string;
  taxDue?: number;
  filingDeadline?: Date;
  availableCredits?: number;
  password?: string; // Add the optional password property to match the updated User type
};

export type UserFormData = User;
