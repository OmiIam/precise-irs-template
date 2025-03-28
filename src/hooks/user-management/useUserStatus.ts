
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/components/admin/user-list/types';

export const useUserStatus = (users: User[], setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const { toast } = useToast();

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

      // Log the action
      await supabase
        .from('activity_logs')
        .insert({
          user_id: userId,
          action: `USER_STATUS_CHANGED_TO_${newStatus.toUpperCase()}`,
          details: {
            timestamp: new Date().toISOString(),
            performedBy: (await supabase.auth.getUser()).data.user?.id
          }
        });

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

      // Log the action
      await supabase
        .from('activity_logs')
        .insert({
          user_id: userId,
          action: `USER_ROLE_CHANGED_TO_${newRole.toUpperCase()}`,
          details: {
            timestamp: new Date().toISOString(),
            performedBy: (await supabase.auth.getUser()).data.user?.id
          }
        });

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

  const isAdminUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      
      return data?.role === 'Admin';
    } catch (error) {
      console.error("Error checking admin role:", error);
      return false;
    }
  };

  return {
    handleToggleUserStatus,
    handleToggleUserRole,
    isAdminUser
  };
};
