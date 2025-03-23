
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/components/admin/user-list/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export const useUserCrud = (users: User[], setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const { toast } = useToast();

  const handleSaveUser = async (updatedUser: User) => {
    try {
      console.log("Updating user with data:", {
        first_name: updatedUser.name.split(' ')[0],
        last_name: updatedUser.name.split(' ').slice(1).join(' '),
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
        tax_due: updatedUser.taxDue,
        filing_deadline: updatedUser.filingDeadline?.toISOString(),
        available_credits: updatedUser.availableCredits
      });
      
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
      // Start by creating a temporary ID for UI
      const tempId = crypto.randomUUID();
      const createdUser = {
        ...newUser,
        id: tempId,
        status: 'Active',
        lastLogin: 'Never'
      };
      
      // Prepare user data for the API call
      const userData = {
        firstName: newUser.name.split(' ')[0],
        lastName: newUser.name.split(' ').slice(1).join(' '),
        email: newUser.email,
        role: newUser.role,
        status: 'Active',
        taxDue: newUser.taxDue || 0,
        filingDeadline: newUser.filingDeadline?.toISOString(),
        availableCredits: newUser.availableCredits || 0
      };
      
      // Only add password if it's a valid string with minimum length
      if (typeof newUser.password === 'string' && newUser.password.length >= 6) {
        Object.assign(userData, { password: newUser.password });
      } else {
        console.error("Invalid password format:", newUser.password);
        toast({
          title: "Invalid Password",
          description: "Password must be at least 6 characters long.",
          variant: "destructive"
        });
        return false;
      }
      
      console.log("Creating user with data:", userData);
      
      // First add to UI for better UX
      setUsers([...users, createdUser]);
      
      // Then save to database
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: { userData }
      });
      
      if (error) {
        console.error("Error from Edge Function:", error);
        
        // Remove the temporary user from UI
        setUsers(users);
        
        // Handle specific error cases
        if (error.message && (
            error.message.includes("409") || 
            error.message.includes("already been registered") || 
            error.message.includes("already exists"))) {
          
          toast({
            title: "Email Already Exists",
            description: "The email address is already registered in the system. Please use a different email.",
            variant: "destructive"
          });
          return false;
        }
        
        toast({
          title: "Error Creating User",
          description: "There was a problem creating the user. Please try again.",
          variant: "destructive"
        });
        return false;
      }
      
      if (!data || !data.success) {
        console.error("Unsuccessful response from Edge Function:", data);
        // Remove the temporary user from UI
        setUsers(users);
        
        // Check for specific error messages
        if (data?.isExistingUser) {
          toast({
            title: "Email Already Exists",
            description: "The email address is already registered in the system. Please use a different email.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error Creating User",
            description: data?.error || "There was a problem creating the user. Please try again.",
            variant: "destructive"
          });
        }
        return false;
      }
      
      console.log("Edge Function response:", data);
      
      // Update the users array with the correct ID from the server response
      if (data.data && data.data.user && data.data.user.id) {
        setUsers(currentUsers => 
          currentUsers.map(user => 
            user.id === tempId ? { ...user, id: data.data.user.id } : user
          )
        );
      }
      
      toast({
        title: "User Created",
        description: "New user has been created successfully."
      });
      
      return true;
    } catch (error) {
      console.error("Error creating user:", error);
      
      // Remove the temporary user from UI in case of exception
      setUsers(users);
      
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

  return {
    handleSaveUser,
    handleCreateUser,
    handleDeleteUser,
  };
};
