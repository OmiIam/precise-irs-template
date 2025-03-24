
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
      
      // Call the edge function to create the user
      const response = await supabase.functions.invoke('create-user', {
        body: { userData }
      });
      
      console.log("Edge Function response:", response);
      
      if (response.error) {
        console.error("Error from Edge Function:", response.error);
        
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
      
      // Now add to UI after successful API call
      if (data.data && data.data.user) {
        const formattedUser: User = {
          id: data.data.user.id,
          name: `${data.data.profile?.first_name || ''} ${data.data.profile?.last_name || ''}`.trim(),
          email: data.data.user.email,
          role: data.data.profile?.role || 'User',
          status: data.data.profile?.status || 'Active',
          lastLogin: 'Never',
          taxDue: data.data.profile?.tax_due || 0,
          filingDeadline: data.data.profile?.filing_deadline ? new Date(data.data.profile.filing_deadline) : undefined,
          availableCredits: data.data.profile?.available_credits || 0
        };
        
        console.log("Adding new user to UI:", formattedUser);
        setUsers(prevUsers => [...prevUsers, formattedUser]);
        return true;
      }
      
      return false;
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

  return {
    handleCreateUser
  };
};
