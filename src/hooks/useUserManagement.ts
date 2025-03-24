
import { useActivityTimer } from './user-management/useActivityTimer';
import { useUserData } from './user-management/useUserData';
import { useUserCrud } from './user-management/useUserCrud';
import { useUserStatus } from './user-management/useUserStatus';

export const useUserManagement = () => {
  const { resetActivityTimer } = useActivityTimer();
  const { 
    users, 
    setUsers, 
    isLoading, 
    fetchUsers,
    isSubscribed,
    lastRefresh,
    refreshUsers
  } = useUserData();
  
  const { handleSaveUser, handleCreateUser, handleDeleteUser } = useUserCrud(users, setUsers);
  const { handleToggleUserStatus, handleToggleUserRole, isAdminUser } = useUserStatus(users, setUsers);

  return {
    // Activity timer
    resetActivityTimer,
    
    // User data
    users,
    isLoading,
    fetchUsers,
    isSubscribed,
    lastRefresh,
    refreshUsers,
    
    // User CRUD operations
    handleSaveUser,
    handleCreateUser,
    handleDeleteUser,
    
    // User status and role operations
    handleToggleUserStatus,
    handleToggleUserRole,
    isAdminUser
  };
};
