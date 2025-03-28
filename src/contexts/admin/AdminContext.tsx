
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AdminContextType } from './types';
import { useNavigate } from 'react-router-dom';

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      // Transform the data to match our User type
      const formattedUsers: User[] = data.map(profile => ({
        id: profile.id,
        email: profile.email,
        name: `${profile.first_name} ${profile.last_name}`.trim(),
        role: profile.role,
        status: profile.status,
        lastLogin: profile.last_login,
        taxDue: profile.tax_due,
        filingDeadline: profile.filing_deadline ? new Date(profile.filing_deadline) : undefined,
        availableCredits: profile.available_credits
      }));
      
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Set up realtime subscription
  useEffect(() => {
    fetchUsers();
    
    const channel = supabase
      .channel('profiles_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles' 
        }, 
        () => {
          fetchUsers();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createUser = async (userData: Partial<User> & { password: string }) => {
    try {
      const response = await fetch(`${window.location.origin}/.supabase/functions/v1/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          firstName: userData.name?.split(' ')[0] || '',
          lastName: userData.name?.split(' ').slice(1).join(' ') || '',
          role: userData.role || 'User',
          status: userData.status || 'Active',
          taxDue: userData.taxDue || 0,
          availableCredits: userData.availableCredits || 0,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user');
      }
      
      toast({
        title: 'Success',
        description: 'User created successfully.',
      });
      
      await fetchUsers();
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create user.',
        variant: 'destructive'
      });
      return false;
    }
  };

  const updateUser = async (user: User) => {
    try {
      // Split name into first and last name
      const nameParts = user.name?.split(' ') || ['', ''];
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          email: user.email,
          role: user.role,
          status: user.status,
          tax_due: user.taxDue,
          filing_deadline: user.filingDeadline,
          available_credits: user.availableCredits
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'User updated successfully.',
      });
      
      await fetchUsers();
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user.',
        variant: 'destructive'
      });
      return false;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'Deleted' })
        .eq('id', userId);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'User deleted successfully.',
      });
      
      await fetchUsers();
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user.',
        variant: 'destructive'
      });
      return false;
    }
  };

  const impersonateUser = async (userId: string) => {
    try {
      // Store current admin session
      const { data: session } = await supabase.auth.getSession();
      if (session?.session) {
        localStorage.setItem('admin_session', JSON.stringify(session.session));
      }
      
      // Call impersonate function
      const { data, error } = await supabase.functions.invoke('impersonate-user', {
        body: { user_id: userId }
      });
      
      if (error) throw error;
      
      if (data?.token) {
        // Set the impersonation session
        await supabase.auth.setSession({
          access_token: data.token,
          refresh_token: data.refresh_token
        });
        
        toast({
          title: 'Success',
          description: 'Now impersonating user.',
        });
        
        navigate('/dashboard');
        return true;
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('Error impersonating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to impersonate user.',
        variant: 'destructive'
      });
      return false;
    }
  };

  return (
    <AdminContext.Provider
      value={{
        users,
        isLoading,
        refreshUsers: fetchUsers,
        createUser,
        updateUser,
        deleteUser,
        impersonateUser
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
