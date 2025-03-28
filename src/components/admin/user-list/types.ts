
import { User } from '@/types/user';

export interface UserListItem extends User {
  selected?: boolean;
}

export interface UserListProps {
  users: UserListItem[];
  isLoading?: boolean;
  onSelect?: (userId: string) => void;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  onImpersonate?: (userId: string) => void;
}

export interface UserActionProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onImpersonate: (userId: string) => void;
}
