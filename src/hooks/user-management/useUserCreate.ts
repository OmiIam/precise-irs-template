
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

      // Extract first and last name
      const nameParts = newUser.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      if (!firstName) {
        toast({
          title: "Invalid Name",
          description: "First name is required.",
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
      
      console.log("Creating user with data:", {
        ...newUser,
        password: "[REDACTED]"
      });
      
      // First check if user already exists by email
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', newUser.email)
        .limit(1);
      
      if (checkError) {
        console.error("Error checking for existing user:", checkError);
        toast({
          title: "Error",
          description: "Failed to check if user already exists. Please try again.",
          variant: "destructive"
        });
        return false;
      }
      
      if (existingUsers && existingUsers.length > 0) {
        toast({
          title: "User Already Exists",
          description: "A user with this email address already exists.",
          variant: "destructive"
        });
        return false;
      }
      
      // Prepare user data
      const userData = {
        email: newUser.email,
        password: newUser.password,
        firstName: firstName,
        lastName: lastName || '',
        role: newUser.role || 'User',
        status: newUser.status || 'Active',
        taxDue: newUser.taxDue || 0,
        availableCredits: newUser.availableCredits || 0,
        filingDeadline: newUser.filingDeadline ? newUser.filingDeadline.toISOString() : null
      };
      
      // Call the Supabase Edge Function to create the user in Auth and profiles table
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: { userData }
      });
      
      if (error) {
        console.error("Error invoking create-user function:", error);
        toast({
          title: "Error Creating User",
          description: error.message || "There was a problem creating the user account.",
          variant: "destructive"
        });
        return false;
      }
      
      if (!data.success) {
        console.error("Error from create-user function:", data.error);
        toast({
          title: "Error Creating User",
          description: data.error || "Failed to create user account.",
          variant: "destructive"
        });
        return false;
      }
      
      console.log("User created successfully:", data);
      
      // Create formatted user object for the UI
      const userId = data.data?.user?.id || crypto.randomUUID();
      const formattedUser: User = {
        id: userId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role || 'User',
        status: newUser.status || 'Active',
        lastLogin: 'Never', // This is just for UI display, not the database value
        taxDue: newUser.taxDue || 0,
        filingDeadline: newUser.filingDeadline,
        availableCredits: newUser.availableCredits || 0
      };
      
      // Update UI
      setUsers(prevUsers => [...prevUsers, formattedUser]);
      
      // Show success message
      toast({
        title: "User Created",
        description: `New user ${formattedUser.name} has been created successfully.`
      });
      
      return true;
    } catch (error) {
      console.error("Unexpected error creating user:", error);
      
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    handleCreateUser
  };
};
