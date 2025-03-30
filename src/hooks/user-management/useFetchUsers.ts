
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/components/admin/user-list/types';

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

      // Format the data with proper date handling
      const formattedUsers = data.map(user => {
        // Ensure proper date parsing for filing_deadline
        let filingDeadline = user.filing_deadline ? new Date(user.filing_deadline) : undefined;
        
        // Check if date is valid
        if (filingDeadline && isNaN(filingDeadline.getTime())) {
          console.warn(`Invalid filing deadline for user ${user.id}:`, user.filing_deadline);
          filingDeadline = undefined;
        }
        
        // Safely handle tax_due and available_credits which might be numbers or strings
        const taxDue = user.tax_due === null ? 0 : 
          (typeof user.tax_due === 'string' ? parseFloat(user.tax_due) : user.tax_due);
          
        const availableCredits = user.available_credits === null ? 0 : 
          (typeof user.available_credits === 'string' ? parseFloat(user.available_credits) : user.available_credits);
        
        // Create a properly formatted name from first_name and last_name
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown User';
        
        return {
          id: user.id,
          name: fullName,
          email: user.email || '',
          role: user.role || 'User',
          lastLogin: user.last_login ? new Date(user.last_login).toLocaleString() : 'Never',
          status: user.status || 'Active',
          taxDue,
          filingDeadline,
          availableCredits
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
