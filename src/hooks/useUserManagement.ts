
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/components/admin/user-list/types';

export const useUserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;

      const formattedUsers = data.map(profile => ({
        id: profile.id,
        name: `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
        role: profile.role,
        lastLogin: profile.last_login ? new Date(profile.last_login).toLocaleString() : 'Never',
        status: profile.status,
        taxDue: profile.tax_due || 0,
        filingDeadline: profile.filing_deadline ? new Date(profile.filing_deadline) : undefined,
        availableCredits: profile.available_credits || 0
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
    }
  };

  useEffect(() => {
    fetchUsers();
    
    // Set up a real-time subscription to profile changes
    const channel = supabase
      .channel('public:profiles')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles'
      }, (payload) => {
        // When profiles table changes, refetch the users
        fetchUsers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSaveUser = async (updatedUser: User) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: updatedUser.name.split(' ')[0],
          last_name: updatedUser.name.split(' ').slice(1).join(' '),
          email: updatedUser.email,
          role: updatedUser.role,
          status: updatedUser.status,
          tax_due: updatedUser.taxDue,
          filing_deadline: updatedUser.filingDeadline?.toISOString(),
          available_credits: updatedUser.availableCredits
        })
        .eq('id', updatedUser.id);

      if (error) throw error;
      
      setUsers(users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
      
      toast({
        title: "User Updated",
        description: "User information has been updated successfully."
      });
      return true;
    } catch (error) {
      console.error("Error saving user:", error);
      toast({
        title: "Error",
        description: "Failed to save user data. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleCreateUser = async (newUser: User) => {
    try {
      setUsers([...users, newUser]);
      
      toast({
        title: "User Created",
        description: "New user has been created successfully."
      });
      return true;
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'Deleted' })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.filter(user => user.id !== userId));
      
      toast({
        title: "User deleted",
        description: `User ID: ${userId} has been removed from the system.`
      });
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return false;

      const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
      
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(user => {
        if (user.id === userId) {
          toast({
            title: `User ${newStatus.toLowerCase()}`,
            description: `User ID: ${userId} is now ${newStatus.toLowerCase()}.`
          });
          return { ...user, status: newStatus };
        }
        return user;
      }));
      return true;
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleToggleUserRole = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return false;

      const newRole = user.role === 'Admin' ? 'User' : 'Admin';
      
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(user => {
        if (user.id === userId) {
          toast({
            title: "Role Updated",
            description: `User ID: ${userId} role changed to ${newRole}.`
          });
          return { ...user, role: newRole };
        }
        return user;
      }));
      return true;
    } catch (error) {
      console.error("Error toggling user role:", error);
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    users,
    isLoading,
    fetchUsers,
    handleSaveUser,
    handleCreateUser,
    handleDeleteUser,
    handleToggleUserStatus,
    handleToggleUserRole
  };
};
