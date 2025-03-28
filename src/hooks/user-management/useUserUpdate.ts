
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/user';

export const useUserUpdate = (users: User[], setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const { toast } = useToast();

  const handleSaveUser = async (updatedUser: User) => {
    try {
      // Split name into first and last name
      const nameParts = updatedUser.name?.trim().split(' ') || ['', ''];
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      console.log("Updating user with data:", {
        first_name: firstName,
        last_name: lastName,
        email: updatedUser.email
      });
      
      // Update profiles table instead of users table
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          email: updatedUser.email
        })
        .eq('id', updatedUser.id);

      if (error) throw error;
      
      // Log the action
      await supabase
        .from('activity_logs')
        .insert({
          user_id: updatedUser.id,
          action: 'USER_UPDATED',
          details: {
            timestamp: new Date().toISOString(),
            performedBy: (await supabase.auth.getUser()).data.user?.id
          }
        });
      
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

  return {
    handleSaveUser
  };
};
