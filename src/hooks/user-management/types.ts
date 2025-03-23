
import { User } from '@/components/admin/user-list/types';

export interface UserManagementState {
  users: User[];
  isLoading: boolean;
}

export interface ActivityTimerState {
  activityTimerRef: React.MutableRefObject<number | null>;
  inactivityTimeoutMs: number;
}

export interface FetchUsersState {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  isLoading: boolean;
  fetchUsers: () => Promise<void>;
}
