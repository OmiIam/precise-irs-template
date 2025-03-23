
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
};

export type UserFormData = User & {
  password?: string;
};
