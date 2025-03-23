
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/components/admin/user-list/types';

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
      // Ensure password is a string or undefined, but not an object
      const password = typeof newUser.password === 'string' ? newUser.password : undefined;
      
      console.log("Creating user with data:", {
        firstName: newUser.name.split(' ')[0],
        lastName: newUser.name.split(' ').slice(1).join(' '),
        email: newUser.email,
        role: newUser.role,
        status: 'Active',
        taxDue: newUser.taxDue || 0,
        filingDeadline: newUser.filingDeadline?.toISOString(),
        availableCredits: newUser.availableCredits || 0,
        password: password // Ensure it's a proper string
      });

      const createdUser = {
        ...newUser,
        status: 'Active',
        lastLogin: 'Never'
      };
      
      // First add to UI
      setUsers([...users, createdUser]);
      
      // Then save to database
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: {
          userData: {
            firstName: newUser.name.split(' ')[0],
            lastName: newUser.name.split(' ').slice(1).join(' '),
            email: newUser.email,
            role: newUser.role,
            status: 'Active',
            taxDue: newUser.taxDue || 0,
            filingDeadline: newUser.filingDeadline?.toISOString(),
            availableCredits: newUser.availableCredits || 0,
            password: password // Pass properly formatted password
          }
        }
      });

      if (error) {
        console.error("Error from Edge Function:", error);
        
        // Check for duplicate email
        if (error.message.includes("409") || 
            (error.message.includes("Edge Function returned a non-2xx status code") &&
             error.message.includes("already been registered") || 
             error.message.includes("already exists"))) {
          
          // Remove the user we just added to UI
          setUsers(users.filter(u => u.id !== createdUser.id));
          
          toast({
            title: "Email Already Exists",
            description: "The email address is already registered in the system. Please use a different email.",
            variant: "destructive"
          });
          return false;
        }
        
        toast({
          title: "Warning",
          description: "User was added to the UI but there was an issue saving to the database. Changes may not persist after reload.",
          variant: "destructive"
        });
        return true;
      }
      
      console.log("Edge Function response:", data);
      
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

  return {
    handleSaveUser,
    handleCreateUser,
    handleDeleteUser,
  };
};
