
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/components/admin/user-list/types';

export const useFetchUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchInProgress, setFetchInProgress] = useState(false);

  const fetchUsers = async () => {
    // Prevent concurrent fetch operations
    if (fetchInProgress) {
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
        
        return {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          role: user.role,
          lastLogin: user.last_login ? new Date(user.last_login).toLocaleString() : 'Never',
          status: user.status,
          taxDue: parseFloat(user.tax_due) || 0,
          filingDeadline: filingDeadline,
          availableCredits: parseFloat(user.available_credits) || 0
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
  };

  return { users, setUsers, isLoading, fetchUsers };
};
