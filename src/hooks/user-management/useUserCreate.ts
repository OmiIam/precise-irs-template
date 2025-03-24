
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
      
      // First check if user already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('users')
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
      
      // Create the new user directly in the users table
      const newUserId = newUser.id || crypto.randomUUID();
      
      const userData = {
        id: newUserId,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password, // Note: In a real app, you'd hash this password
        role: newUser.role || 'User',
        status: newUser.status || 'Active',
        tax_due: newUser.taxDue || 0,
        credits: newUser.availableCredits || 0,
        deadline: newUser.filingDeadline ? newUser.filingDeadline.toISOString().split('T')[0] : null, // Convert Date to YYYY-MM-DD string format
        last_login: null // Set to null instead of 'Never' string which can't be stored in a timestamp field
      };
      
      const { error: insertError } = await supabase
        .from('users')
        .insert(userData); // Pass the single object, not an array
      
      if (insertError) {
        console.error("Error creating user:", insertError);
        toast({
          title: "Error Creating User",
          description: insertError.message || "There was a problem creating the user account.",
          variant: "destructive"
        });
        return false;
      }
      
      // Create formatted user object for the UI
      const formattedUser: User = {
        id: newUserId,
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
