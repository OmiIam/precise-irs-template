
import { useEffect } from 'react';
import { useFetchUsers } from './useFetchUsers';
import { useUserSubscription } from './useUserSubscription';

export const useUserData = () => {
  const { users, setUsers, isLoading, fetchUsers } = useFetchUsers();
  
  // Initial data fetch
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Set up realtime subscription
  useUserSubscription(fetchUsers);

  return { users, setUsers, isLoading, fetchUsers };
};
