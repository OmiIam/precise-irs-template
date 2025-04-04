
import { useEffect, useCallback, useState } from 'react';
import { useFetchUsers } from './useFetchUsers';
import { useUserSubscription } from './useUserSubscription';

export const useUserData = () => {
  const { users, setUsers, isLoading, fetchUsers } = useFetchUsers();
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Update handleDataChange to be async and return a Promise
  const handleDataChange = useCallback(async () => {
    console.log("Data change detected, refreshing users");
    setIsRefreshing(true);
    try {
      await fetchUsers();
      setLastRefresh(new Date());
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchUsers]);
  
  // Initial data fetch
  useEffect(() => {
    console.log("Initial data fetch in useUserData");
    fetchUsers();
    
    // Set up a listener for manual refresh
    const handleRefreshEvent = () => {
      console.log("Manual refresh event received");
      handleDataChange();
    };
    
    window.addEventListener('refresh-users', handleRefreshEvent);
    
    return () => {
      window.removeEventListener('refresh-users', handleRefreshEvent);
    };
  }, [fetchUsers, handleDataChange]);
  
  // Set up realtime subscription
  const { isSubscribed } = useUserSubscription(handleDataChange);

  // Automatic refresh every 15 seconds as a fallback
  useEffect(() => {
    const intervalId = setInterval(async () => {
      console.log("Performing scheduled refresh of user data");
      setIsRefreshing(true);
      try {
        await fetchUsers();
        setLastRefresh(new Date());
      } finally {
        setIsRefreshing(false);
      }
    }, 15000); // 15 seconds
    
    return () => clearInterval(intervalId);
  }, [fetchUsers]);

  const refreshUsers = useCallback(async () => {
    console.log("Manual refresh triggered from component");
    setIsRefreshing(true);
    try {
      await handleDataChange();
    } finally {
      setIsRefreshing(false);
    }
  }, [handleDataChange]);

  return { 
    users, 
    setUsers, 
    isLoading, 
    fetchUsers, 
    isSubscribed, 
    lastRefresh,
    refreshUsers,
    isRefreshing
  };
};
