
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
      
      console.log("User doesn't exist, proceeding with auth.signUp");
      
      // Create auth user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });
      
      if (authError) {
        console.error("Error creating auth user:", authError);
        toast({
          title: "Error Creating User",
          description: authError.message || "Failed to create user account.",
          variant: "destructive"
        });
        return false;
      }
      
      console.log("Auth.signUp response:", authData);
      
      if (!authData.user) {
        console.error("No user returned from signUp operation");
        toast({
          title: "Error Creating User",
          description: "Failed to create user account. No user data returned.",
          variant: "destructive"
        });
        return false;
      }
      
      console.log("Updating profile with additional data for user ID:", authData.user.id);
      
      // Update the profile with additional data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: newUser.role || 'User',
          status: newUser.status || 'Active',
          tax_due: newUser.taxDue || 0,
          filing_deadline: newUser.filingDeadline?.toISOString(),
          available_credits: newUser.availableCredits || 0
        })
        .eq('id', authData.user.id);
      
      if (profileError) {
        console.error("Error updating profile:", profileError);
        toast({
          title: "Warning",
          description: "User created but profile data could not be fully updated.",
          variant: "default" 
        });
      }
      
      // Log the activity
      console.log("Logging activity for user creation");
      try {
        await supabase
          .from('activity_logs')
          .insert({
            user_id: authData.user.id,
            action: 'USER_CREATED',
            details: {
              email: newUser.email,
              timestamp: new Date().toISOString(),
              createdBy: (await supabase.auth.getUser()).data.user?.id || 'system'
            }
          });
      } catch (logError) {
        console.error("Error logging activity:", logError);
      }
      
      // Create formatted user object for the UI
      const formattedUser: User = {
        id: authData.user.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role || 'User',
        status: newUser.status || 'Active',
        lastLogin: 'Never',
        taxDue: newUser.taxDue || 0,
        filingDeadline: newUser.filingDeadline,
        availableCredits: newUser.availableCredits || 0
      };
      
      console.log("User created successfully, updating UI with formatted user:", formattedUser);
      
      // Update UI immediately
      setUsers(prevUsers => [...prevUsers, formattedUser]);
      
      // Show success message
      toast({
        title: "User Created",
        description: `New user ${formattedUser.name} has been created successfully.`
      });
      
      // Force a fetch from the server to ensure data consistency
      setTimeout(() => {
        console.log("Triggering user data refresh after creation");
        window.dispatchEvent(new CustomEvent('refresh-users'));
      }, 1000);
      
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
