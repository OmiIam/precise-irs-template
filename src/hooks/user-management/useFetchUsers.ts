
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
      // Fetch from profiles table instead of users table
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;

      const formattedUsers = data.map(user => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role,
        lastLogin: user.last_login ? new Date(user.last_login).toLocaleString() : 'Never',
        status: user.status,
        taxDue: user.tax_due || 0,
        filingDeadline: user.filing_deadline ? new Date(user.filing_deadline) : undefined,
        availableCredits: user.available_credits || 0
      }));

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
