
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, UserStatus } from '@/types/user';
import { AdminContextType } from './types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Mock data for initial development
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'john.doe@example.com',
      name: 'John Doe',
      role: 'User',
      status: 'Active',
      lastLogin: new Date().toISOString(),
      taxDue: 1250.00,
      filingDeadline: new Date().toISOString(),
      availableCredits: 350
    },
    {
      id: '2',
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      role: 'Admin',
      status: 'Active',
      lastLogin: new Date().toISOString(),
      taxDue: 0,
      filingDeadline: new Date().toISOString(),
      availableCredits: 0
    }
  ];

  const refreshUsers = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch from Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) {
        throw error;
      }

      if (data) {
        // Transform the data to match our User type
        const transformedUsers: User[] = data.map((user: any) => ({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || '',
          role: (user.user_metadata?.role || 'User') as UserRole,
          status: (user.user_metadata?.status || 'Active') as UserStatus,
          lastLogin: user.last_sign_in_at || '',
          taxDue: user.user_metadata?.taxDue || 0,
          filingDeadline: user.user_metadata?.filingDeadline || new Date().toISOString(),
          availableCredits: user.user_metadata?.availableCredits || 0
        }));
        setUsers(transformedUsers);
      } else {
        // Use mock data if no data is returned
        setUsers(mockUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users. Using mock data instead.',
        variant: 'destructive'
      });
      // Fallback to mock data
      setUsers(mockUsers);
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (userData: Partial<User> & { password: string }) => {
    try {
      // In a real implementation, this would create a user in Supabase
      // and call an Edge Function to perform additional setup
      const response = await fetch('/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      toast({
        title: 'Success',
        description: 'User created successfully',
      });

      // Refresh the user list
      await refreshUsers();
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to create user',
        variant: 'destructive'
      });
      return false;
    }
  };

  const updateUser = async (user: User) => {
    try {
      // In a real implementation, this would update a user in Supabase
      const { error } = await supabase.auth.admin.updateUserById(
        user.id, 
        {
          email: user.email,
          user_metadata: {
            name: user.name,
            role: user.role,
            status: user.status,
            taxDue: user.taxDue,
            filingDeadline: user.filingDeadline,
            availableCredits: user.availableCredits
          }
        }
      );

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'User updated successfully',
      });

      // Update the local state
      setUsers(prev => prev.map(u => u.id === user.id ? user : u));
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user',
        variant: 'destructive'
      });
      return false;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // In a real implementation, this would delete a user in Supabase
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });

      // Update the local state
      setUsers(prev => prev.filter(u => u.id !== userId));
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive'
      });
      return false;
    }
  };

  const impersonateUser = async (userId: string) => {
    try {
      // In a real implementation, this would call an Edge Function to impersonate a user
      const response = await fetch('/api/impersonate-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to impersonate user');
      }

      const { token } = await response.json();

      // Set the session in Supabase
      const { error } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: '',
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Now impersonating user',
      });
      
      return true;
    } catch (error) {
      console.error('Error impersonating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to impersonate user',
        variant: 'destructive'
      });
      return false;
    }
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const contextValue: AdminContextType = {
    users,
    isLoading,
    refreshUsers,
    createUser,
    updateUser,
    deleteUser,
    impersonateUser
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};
