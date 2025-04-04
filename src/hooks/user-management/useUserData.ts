
import { useEffect, useCallback, useState } from 'react';
import { useFetchUsers } from './useFetchUsers';
import { useUserSubscription } from './useUserSubscription';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUserData = () => {
  const { users, setUsers, isLoading, fetchUsers } = useFetchUsers();
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  // Update handleDataChange to be async and return a Promise
  const handleDataChange = useCallback(async () => {
    console.log("Data change detected, refreshing users");
    setIsRefreshing(true);
    try {
      await fetchUsers();
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Error refreshing users:", error);
      toast({
        title: "Error refreshing users",
        description: "Failed to refresh user data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchUsers, toast]);
  
  // Initial data fetch
  useEffect(() => {
    console.log("Initial data fetch in useUserData");
    
    // Check authentication first
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn("User not authenticated, cannot fetch user data");
        return;
      }
      
      fetchUsers();
    };
    
    checkAuth();
    
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
      
      // Check authentication before refreshing
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn("User not authenticated, skipping scheduled refresh");
        return;
      }
      
      setIsRefreshing(true);
      try {
        await fetchUsers();
        setLastRefresh(new Date());
      } catch (error) {
        console.error("Error during scheduled refresh:", error);
      } finally {
        setIsRefreshing(false);
      }
    }, 15000); // 15 seconds
    
    return () => clearInterval(intervalId);
  }, [fetchUsers]);

  const refreshUsers = useCallback(async () => {
    console.log("Manual refresh triggered from component");
    
    // Check authentication before refreshing
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn("User not authenticated, cannot refresh");
      toast({
        title: "Authentication required",
        description: "You must be logged in to refresh user data.",
        variant: "destructive"
      });
      return;
    }
    
    setIsRefreshing(true);
    try {
      await handleDataChange();
    } catch (error) {
      console.error("Error during manual refresh:", error);
      toast({
        title: "Error refreshing data",
        description: "Failed to refresh user data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [handleDataChange, toast]);

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
