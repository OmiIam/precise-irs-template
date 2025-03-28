
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/user';

export const useFetchUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchInProgress, setFetchInProgress] = useState(false);

  const fetchUsers = useCallback(async () => {
    // Prevent concurrent fetch operations
    if (fetchInProgress) {
      console.log('Fetch already in progress, skipping...');
      return;
    }
    
    setIsLoading(true);
    setFetchInProgress(true);
    
    try {
      // Fetch from profiles table with detailed logging
      console.log('Fetching user profiles...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      console.log('Profiles data received:', data);

      if (!data || data.length === 0) {
        console.log('No user profiles found in the database');
        setUsers([]);
        return;
      }

      // Format the data with proper date handling
      const formattedUsers = data.map(user => {
        // Create a properly formatted name from first_name and last_name
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown User';
        
        return {
          id: user.id,
          email: user.email || '',
          name: fullName
        };
      });

      console.log('Formatted users:', formattedUsers);
      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load user data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setFetchInProgress(false);
    }
  }, [toast]);

  // Add event listener for manual refresh
  useEffect(() => {
    const handleRefresh = () => {
      console.log("Manual refresh triggered");
      fetchUsers();
    };
    
    window.addEventListener('refresh-users', handleRefresh);
    
    return () => {
      window.removeEventListener('refresh-users', handleRefresh);
    };
  }, [fetchUsers]);

  return { users, setUsers, isLoading, fetchUsers };
};
