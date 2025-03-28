
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/components/admin/user-list/types';

export const useUserDelete = (users: User[], setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const { toast } = useToast();

  const handleDeleteUser = async (userId: string) => {
    try {
      // Update profiles table instead of users table
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'Deleted' })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.filter(user => user.id !== userId));
      
      // Log the action to activity_logs
      await supabase
        .from('activity_logs')
        .insert({
          user_id: userId,
          action: 'USER_DELETED',
          details: {
            timestamp: new Date().toISOString(),
            performedBy: (await supabase.auth.getUser()).data.user?.id
          }
        });
      
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

  return {
    handleDeleteUser
  };
};
