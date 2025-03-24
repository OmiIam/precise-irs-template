
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
      
      // Step 1: Check if user already exists
      const { data: existingProfiles, error: checkError } = await supabase
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
      
      if (existingProfiles && existingProfiles.length > 0) {
        console.log("User already exists with email:", newUser.email);
        toast({
          title: "User Already Exists",
          description: "A user with this email address already exists.",
          variant: "destructive"
        });
        return false;
      }
      
      // Step 2: Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: newUser.password,
        email_confirm: true,
        user_metadata: {
          first_name: firstName,
          last_name: lastName
        }
      });
      
      if (authError) {
        console.error("Error creating auth user:", authError);
        if (authError.message.includes("already been registered")) {
          toast({
            title: "Email Already Exists",
            description: "This email is already registered in the system.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error Creating User",
            description: authError.message || "There was a problem creating the user account.",
            variant: "destructive"
          });
        }
        return false;
      }
      
      if (!authData.user) {
        console.error("No user data returned from auth.admin.createUser");
        toast({
          title: "Error",
          description: "Failed to create user account. No user data returned.",
          variant: "destructive"
        });
        return false;
      }
      
      const userId = authData.user.id;
      
      // Step 3: Create user profile
      const profileDataToInsert = {
        id: userId,
        first_name: firstName,
        last_name: lastName,
        email: newUser.email,
        role: newUser.role || 'User',
        status: newUser.status || 'Active',
        tax_due: newUser.taxDue || 0,
        available_credits: newUser.availableCredits || 0,
        filing_deadline: newUser.filingDeadline?.toISOString(),
        created_at: new Date().toISOString()
      };
      
      const { data: insertedProfile, error: profileError } = await supabase
        .from('profiles')
        .insert([profileDataToInsert])
        .select()
        .single();
      
      if (profileError) {
        console.error("Error creating user profile:", profileError);
        
        // Clean up the auth user if profile creation fails
        await supabase.auth.admin.deleteUser(userId);
        
        toast({
          title: "Error Creating User",
          description: "Failed to create user profile. The user account has been removed.",
          variant: "destructive"
        });
        return false;
      }
      
      // Create formatted user object for the UI
      const formattedUser: User = {
        id: userId,
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
