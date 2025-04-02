
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

      // Normalize email
      newUser.email = newUser.email.toLowerCase().trim();
      
      // Check if the email already exists locally (faster pre-check)
      const emailExists = users.some(user => 
        user.email.toLowerCase() === newUser.email.toLowerCase()
      );
      
      if (emailExists) {
        toast({
          title: "User Already Exists",
          description: "A user with this email address already exists.",
          variant: "destructive"
        });
        return false;
      }
      
      // Check if the email already exists in the database (slower but more reliable)
      console.log("Checking if user email already exists:", newUser.email);
      const { data: existingProfiles, error: checkError } = await supabase
        .from('profiles')
        .select('email')
        .ilike('email', newUser.email)
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
      
      if (existingProfiles && existingProfiles.length > 0) {
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
      
      // Prepare authorization header
      let authHeader = '';
      let adminAuthHeader = 'false';
      
      // If we have a regular session, use it
      if (sessionData?.session?.access_token) {
        authHeader = `Bearer ${sessionData.session.access_token}`;
      } else {
        // Check for admin-specific authentication
        const isAdminAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
        
        if (!isAdminAuthenticated) {
          toast({
            title: "Authorization Error",
            description: "You must be logged in with admin privileges to create users.",
            variant: "destructive"
          });
          return false;
        }
        
        // For admin-only authentication, we'll use a special header
        authHeader = 'Bearer ADMIN_MODE';
        adminAuthHeader = 'true';
      }
      
      // Create the user with admin auth endpoint which directly creates a confirmed user
      const response = await fetch(`https://mhocdqtqohcnxrxhczhx.functions.supabase.co/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
          'X-Admin-Auth': adminAuthHeader,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-auth'
        },
        body: JSON.stringify({
          userData: {
            email: newUser.email,
            password: newUser.password,
            first_name: firstName,
            last_name: lastName,
            firstName, // Include both formats to ensure compatibility
            lastName,
            role: newUser.role || 'User',
            status: newUser.status || 'Active',
            tax_due: newUser.taxDue || 0,
            available_credits: newUser.availableCredits || 0,
            filing_deadline: newUser.filingDeadline ? newUser.filingDeadline.toISOString() : null
          }
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response from edge function:", errorText);
        try {
          const errorJson = JSON.parse(errorText);
          toast({
            title: "Error Creating User",
            description: errorJson.error || "Failed to create user. Please try again.",
            variant: "destructive"
          });
        } catch (e) {
          toast({
            title: "Error Creating User",
            description: "Failed to create user. Server returned: " + errorText,
            variant: "destructive"
          });
        }
        return false;
      }
      
      const result = await response.json();
      
      if (!result.success || !result.data || !result.data.user) {
        console.error("Error creating user via edge function:", result.error || "No user data returned");
        toast({
          title: "Error Creating User",
          description: result.error || "Failed to create user. No data returned.",
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
