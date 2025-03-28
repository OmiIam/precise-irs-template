
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
  password?: string; // Add the optional password property
};

export type UserListTableProps = {
  users: User[];
  onEditUser: (user: User) => void;
  onViewUser: (user: User) => void;
  onImpersonateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onToggleUserStatus: (userId: string) => void;
  onToggleUserRole: (userId: string) => void;
};
