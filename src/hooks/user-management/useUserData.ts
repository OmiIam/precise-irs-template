
import { useEffect, useCallback, useState } from 'react';
import { useFetchUsers } from './useFetchUsers';
import { useUserSubscription } from './useUserSubscription';

export const useUserData = () => {
  const { users, setUsers, isLoading, fetchUsers } = useFetchUsers();
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  // Callback for handling user data changes
  const handleDataChange = useCallback(() => {
    console.log("Data change detected, refreshing users");
    fetchUsers();
    setLastRefresh(new Date());
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
  const { isSubscribed } = useUserSubscription(fetchUsers);

  // Force refresh every 30 seconds as a backup mechanism
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Performing scheduled refresh of user data");
      fetchUsers();
      setLastRefresh(new Date());
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [fetchUsers]);

  return { 
    users, 
    setUsers, 
    isLoading, 
    fetchUsers, 
    isSubscribed, 
    lastRefresh,
    refreshUsers: handleDataChange 
  };
};
