
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

      // Check if the email already exists
      console.log("Checking if user email already exists:", newUser.email);
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
      
      // Password validation
      if (!newUser.password || newUser.password.length < 6) {
        toast({
          title: "Invalid Password",
          description: "Password must be at least 6 characters long.",
          variant: "destructive"
        });
        return false;
      }
      
      console.log("Creating user with data:", {
        ...newUser,
        password: "[REDACTED]",
        filingDeadline: newUser.filingDeadline ? newUser.filingDeadline.toISOString() : null
      });
      
      // Extract name parts for user metadata
      const nameParts = newUser.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      // Get the session for authorization or fallback to admin auth
      const { data: sessionData } = await supabase.auth.getSession();
      let accessToken = sessionData?.session?.access_token;
      
      // If no regular session token, check for admin-specific authentication
      if (!accessToken) {
        console.log("No standard auth session found, checking for admin authentication");
        const isAdminAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
        
        if (!isAdminAuthenticated) {
          toast({
            title: "Authorization Error",
            description: "You must be logged in with admin privileges to create users.",
            variant: "destructive"
          });
          return false;
        }
        
        // For admin-only authentication, we'll use a special header but need a token
        // Use the API URL directly instead of trying to access the protected supabaseKey
        accessToken = 'ADMIN_MODE'; // Just a placeholder, the real auth happens via the X-Admin-Auth header
      }
      
      if (!accessToken) {
        toast({
          title: "Authorization Error",
          description: "No valid authentication token found. Please log in again.",
          variant: "destructive"
        });
        return false;
      }
      
      // Create the user with admin auth endpoint which directly creates a confirmed user
      const response = await fetch(`https://mhocdqtqohcnxrxhczhx.functions.supabase.co/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          // Add a special header for admin-only authentication
          'X-Admin-Auth': localStorage.getItem('isAdminAuthenticated') === 'true' ? 'true' : 'false'
        },
        body: JSON.stringify({
          userData: {
            email: newUser.email,
            password: newUser.password,
            firstName,
            lastName,
            role: newUser.role || 'User',
            status: newUser.status || 'Active',
            taxDue: newUser.taxDue || 0,
            availableCredits: newUser.availableCredits || 0,
            filingDeadline: newUser.filingDeadline ? newUser.filingDeadline.toISOString() : null
          }
        })
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        console.error("Error creating user via edge function:", result.error);
        toast({
          title: "Error Creating User",
          description: result.error || "Failed to create user. Please try again.",
          variant: "destructive"
        });
        return false;
      }
      
      if (!result.data || !result.data.user) {
        console.error("No user data returned from edge function");
        toast({
          title: "Error Creating User",
          description: "Failed to create user account. No user data returned.",
          variant: "destructive"
        });
        return false;
      }
      
      const authUser = result.data.user;
      
      // Format the filingDeadline properly for UI display
      let filingDeadlineDate: Date | undefined;
      if (newUser.filingDeadline instanceof Date) {
        filingDeadlineDate = newUser.filingDeadline;
      } else if (newUser.filingDeadline) {
        filingDeadlineDate = new Date(newUser.filingDeadline);
      }
      
      // Create formatted user object for the UI
      const formattedUser: User = {
        id: authUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role || 'User',
        status: newUser.status || 'Active',
        lastLogin: 'Never',
        taxDue: newUser.taxDue || 0,
        filingDeadline: filingDeadlineDate,
        availableCredits: newUser.availableCredits || 0
      };
      
      // Update UI immediately
      setUsers(prevUsers => [...prevUsers, formattedUser]);
      
      // Show success message
      toast({
        title: "User Created",
        description: `New user ${formattedUser.name} has been created successfully.`
      });
      
      // Force a refresh from the server to ensure data consistency
      window.dispatchEvent(new CustomEvent('refresh-users'));
      
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
