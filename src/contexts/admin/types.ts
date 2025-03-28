
import { User } from '@/types/user';

export interface AdminContextType {
  users: User[];
  isLoading: boolean;
  refreshUsers: () => Promise<void>;
  createUser: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  updateUser: (user: User) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  impersonateUser: (userId: string) => Promise<boolean>;
}
