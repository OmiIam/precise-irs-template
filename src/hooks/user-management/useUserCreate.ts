
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
      
      // Password validation - simple check
      if (!newUser.password) {
        toast({
          title: "Invalid Password",
          description: "Password is required.",
          variant: "destructive"
        });
        return false;
      }
      
      console.log("Creating user with data:", {
        ...newUser,
        password: "[REDACTED]",
        filingDeadline: newUser.filingDeadline ? new Date(newUser.filingDeadline).toISOString() : null
      });
      
      // Extract name parts for user metadata
      const nameParts = newUser.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      // Send to edge function
      const response = await fetch(`https://mhocdqtqohcnxrxhczhx.functions.supabase.co/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*'
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
            filing_deadline: newUser.filingDeadline ? new Date(newUser.filingDeadline).toISOString() : null
          }
        })
      });
      
      const responseText = await response.text();
      console.log("Raw response from edge function:", responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error("Error parsing response:", e);
        toast({
          title: "Error Creating User",
          description: "Invalid response from server: " + responseText.substring(0, 100),
          variant: "destructive"
        });
        return false;
      }
      
      if (!response.ok) {
        console.error("Error response from edge function:", result);
        toast({
          title: "Error Creating User",
          description: result.error || "Failed to create user. Please try again.",
          variant: "destructive"
        });
        return false;
      }
      
      if (!result.success) {
        console.error("Error creating user via edge function:", result.error || "No success flag in response");
        toast({
          title: "Error Creating User",
          description: result.error || "Failed to create user. Server reported an error.",
          variant: "destructive"
        });
        return false;
      }
      
      // Handle partial success case where we have an auth user but profile creation failed
      if (result.partialSuccess && result.authUser) {
        console.log("Partial success - auth user created but profile failed");
        toast({
          title: "Partial Success",
          description: "User account created but profile could not be fully set up. User can still log in.",
        });
        
        // Format a user object from the partial data
        const partialUser: User = {
          id: result.authUser.id,
          name: `${firstName} ${lastName}`.trim(),
          email: newUser.email,
          role: newUser.role || 'User',
          status: newUser.status || 'Active',
          lastLogin: 'Never',
          taxDue: newUser.taxDue || 0,
          filingDeadline: newUser.filingDeadline,
          availableCredits: newUser.availableCredits || 0
        };
        
        // Update UI
        setUsers(prevUsers => [...prevUsers, partialUser]);
        return true;
      }
      
      // Check if we have the expected data structure
      if (!result.data || !result.data.user || !result.data.profile) {
        console.error("Unexpected data structure in successful response:", result);
        toast({
          title: "Error Creating User",
          description: "User created but unexpected data returned from server.",
          variant: "destructive"
        });
        return false;
      }
      
      const authUser = result.data.user;
      const profile = result.data.profile;
      
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
        name: `${firstName} ${lastName}`.trim(),
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
