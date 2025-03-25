
import { User } from '@/components/admin/user-list/types';
import { useUserCreate } from './useUserCreate';
import { useUserUpdate } from './useUserUpdate';
import { useUserDelete } from './useUserDelete';

export const useUserCrud = (users: User[], setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const { handleCreateUser, isCreating } = useUserCreate(users, setUsers);
  const { handleSaveUser } = useUserUpdate(users, setUsers);
  const { handleDeleteUser } = useUserDelete(users, setUsers);

  return {
    handleSaveUser,
    handleCreateUser,
    handleDeleteUser,
    isCreating
  };
};
