
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/components/admin/user-list/types';
import { useAuth } from '@/contexts/auth';

export const useUserCreate = (users: User[], setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

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
      
      // Get the current admin user's ID for activity logging
      const adminId = currentUser?.id;
      
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
            filing_deadline: newUser.filingDeadline ? new Date(newUser.filingDeadline).toISOString() : null,
            created_by: adminId // Add the admin ID who created this user
          }
        })
      });
      
      let responseData;
      try {
        const responseText = await response.text();
        console.log("Raw response from edge function:", responseText);
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error("Error parsing response:", e);
        toast({
          title: "Error Creating User",
          description: "Invalid response from server. Please try again later.",
          variant: "destructive"
        });
        return false;
      }
      
      // Handle all success cases (including partial success)
      if (responseData.success || responseData.partialSuccess) {
        // Create formatted user for the UI
        let userId: string;
        let formattedUser: User;
        
        if (responseData.data?.user?.id) {
          userId = responseData.data.user.id;
        } else if (responseData.authUser?.id) {
          userId = responseData.authUser.id;
        } else {
          // Generate a temporary ID just for UI purposes
          userId = crypto.randomUUID();
        }
        
        // Format the filingDeadline properly for UI display
        let filingDeadlineDate: Date | undefined;
        if (newUser.filingDeadline instanceof Date) {
          filingDeadlineDate = newUser.filingDeadline;
        } else if (newUser.filingDeadline) {
          filingDeadlineDate = new Date(newUser.filingDeadline);
        }
        
        formattedUser = {
          id: userId,
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
        
        // Log activity using current user's session - safely handle activity logging
        try {
          if (adminId) {
            await supabase
              .from('activity_logs')
              .insert({
                user_id: adminId,
                action: 'ADMIN_CREATED_USER',
                details: {
                  timestamp: new Date().toISOString(),
                  target_user_email: newUser.email,
                  target_user_id: userId
                }
              });
          }
        } catch (logError) {
          console.error("Error logging user creation activity:", logError);
          // Don't fail the overall operation if logging fails
        }
        
        // Show a success toast, but include warning if partial success
        if (responseData.partialSuccess) {
          toast({
            title: "User Partially Created",
            description: "User account created but there may be issues with the profile. User can still log in.",
          });
        } else {
          toast({
            title: "User Created",
            description: `New user ${formattedUser.name} has been created successfully.`
          });
        }
        
        // Force a refresh from the server to ensure data consistency
        try {
          window.dispatchEvent(new CustomEvent('refresh-users'));
        } catch (e) {
          console.error("Error dispatching refresh event:", e);
        }
        
        return true;
      } else {
        // Handle error
        console.error("Error response from server:", responseData);
        toast({
          title: "Error Creating User",
          description: responseData.error || "Failed to create user. Please try again.",
          variant: "destructive"
        });
        return false;
      }
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
