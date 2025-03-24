
import { useEffect, useCallback } from 'react';
import { useFetchUsers } from './useFetchUsers';
import { useUserSubscription } from './useUserSubscription';

export const useUserData = () => {
  const { users, setUsers, isLoading, fetchUsers } = useFetchUsers();
  
  // Callback for handling user data changes
  const handleDataChange = useCallback(() => {
    console.log("Data change detected, refreshing users");
    fetchUsers();
  }, [fetchUsers]);
  
  // Initial data fetch
  useEffect(() => {
    console.log("Initial data fetch in useUserData");
    fetchUsers();
    
    // Set up a listener for manual refresh
    window.addEventListener('refresh-users', handleDataChange);
    
    return () => {
      window.removeEventListener('refresh-users', handleDataChange);
    };
  }, [fetchUsers, handleDataChange]);
  
  // Set up realtime subscription
  useUserSubscription(fetchUsers);

  return { users, setUsers, isLoading, fetchUsers };
};
