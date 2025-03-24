
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/components/admin/user-list/types';

export const useUserUpdate = (users: User[], setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const { toast } = useToast();

  const handleSaveUser = async (updatedUser: User) => {
    try {
      console.log("Updating user with data:", {
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
        tax_due: updatedUser.taxDue,
        deadline: updatedUser.filingDeadline?.toISOString().split('T')[0],
        credits: updatedUser.availableCredits
      });
      
      const { error } = await supabase
        .from('users')
        .update({
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          status: updatedUser.status,
          tax_due: updatedUser.taxDue,
          deadline: updatedUser.filingDeadline?.toISOString().split('T')[0],
          credits: updatedUser.availableCredits
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

  return {
    handleSaveUser
  };
};
