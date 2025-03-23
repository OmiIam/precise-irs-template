
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/components/admin/user-list/types';

export const useUserCreate = (users: User[], setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const { toast } = useToast();

  const handleCreateUser = async (newUser: User) => {
    try {
      // Validate required fields
      if (!newUser.name || !newUser.email) {
        toast({
          title: "Missing Required Fields",
          description: "Name and email are required.",
          variant: "destructive"
        });
        return false;
      }

      // Validate password
      if (!newUser.password || typeof newUser.password !== 'string' || newUser.password.length < 6) {
        toast({
          title: "Invalid Password",
          description: "Password must be at least 6 characters long.",
          variant: "destructive"
        });
        return false;
      }
      
      // Start by creating a temporary ID for UI
      const tempId = crypto.randomUUID();
      const createdUser = {
        ...newUser,
        id: tempId,
        status: newUser.status || 'Active',
        lastLogin: 'Never'
      };
      
      // Prepare user data for the API call
      const userData = {
        firstName: newUser.name.split(' ')[0],
        lastName: newUser.name.split(' ').slice(1).join(' ') || 'User',
        email: newUser.email,
        role: newUser.role || 'User',
        status: newUser.status || 'Active',
        taxDue: newUser.taxDue || 0,
        filingDeadline: newUser.filingDeadline?.toISOString(),
        availableCredits: newUser.availableCredits || 0,
        password: newUser.password
      };
      
      console.log("Creating user with data:", {
        ...userData,
        password: userData.password ? "******" : undefined
      });
      
      // First add to UI for better UX
      setUsers(prevUsers => [...prevUsers, createdUser]);
      
      // Then save to database
      const response = await supabase.functions.invoke('create-user', {
        body: { userData }
      });
      
      console.log("Edge Function response:", response);
      
      if (response.error) {
        console.error("Error from Edge Function:", response.error);
        
        // Remove the temporary user from UI
        setUsers(prevUsers => prevUsers.filter(user => user.id !== tempId));
        
        // Handle specific error cases
        if (response.error.message && (
            response.error.message.includes("409") || 
            response.error.message.includes("already been registered") || 
            response.error.message.includes("already exists"))) {
          
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
      
      const data = response.data;
      
      if (!data || !data.success) {
        console.error("Unsuccessful response from Edge Function:", data);
        // Remove the temporary user from UI
        setUsers(prevUsers => prevUsers.filter(user => user.id !== tempId));
        
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
      
      // Get the tempId from the error context if possible
      const tempId = error.tempId || "";
      
      // Remove the temporary user from UI in case of exception
      if (tempId) {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== tempId));
      } else {
        // If we can't identify the specific user, refresh the user list
        setUsers(users);
      }
      
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    handleCreateUser
  };
};
