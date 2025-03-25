
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/components/admin/user-list/types';
import { supabase } from '@/integrations/supabase/client';

export const useUserCreate = (users: User[], setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateUser = async (newUser: User): Promise<boolean> => {
    if (isCreating) {
      console.log('User creation already in progress, skipping...');
      return false;
    }
    
    try {
      setIsCreating(true);
      console.log("Starting user creation for:", newUser.name);
      
      // Validate required fields
      if (!newUser.name || !newUser.email || !newUser.password) {
        toast({
          title: "Missing Required Fields",
          description: "Name, email, and password are required.",
          variant: "destructive"
        });
        return false;
      }

      // Extract name parts
      const nameParts = newUser.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      // Format date for API call if exists
      let filingDeadline = undefined;
      if (newUser.filingDeadline) {
        try {
          filingDeadline = newUser.filingDeadline instanceof Date 
            ? newUser.filingDeadline
            : new Date(newUser.filingDeadline);
        } catch (e) {
          console.error("Error parsing filing deadline:", e);
        }
      }
      
      // Prepare user data for edge function
      const userData = {
        name: newUser.name,
        firstName,
        lastName,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role || 'User',
        status: newUser.status || 'Active',
        taxDue: newUser.taxDue || 0,
        filingDeadline,
        availableCredits: newUser.availableCredits || 0
      };
      
      console.log("Calling create-user function with data:", {
        ...userData,
        password: "[REDACTED]"
      });

      // Call the edge function to create the user with explicit headers
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: { userData },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (error) {
        console.error("Error from create-user function:", error);
        toast({
          title: "Error Creating User",
          description: error.message || "Failed to create user. Please try again.",
          variant: "destructive"
        });
        return false;
      }
      
      if (!data || data.error) {
        console.error("Error response from create-user function:", data?.error || "Unknown error");
        
        if (data?.isExistingUser) {
          toast({
            title: "User Already Exists",
            description: "A user with this email address already exists.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error Creating User",
            description: data?.error || "Failed to create user. Please try again.",
            variant: "destructive"
          });
        }
        return false;
      }
      
      if (!data.success) {
        console.error("Failed to create user:", data.error);
        toast({
          title: "Error Creating User",
          description: data.error || "Failed to create user for an unknown reason.",
          variant: "destructive"
        });
        return false;
      }
      
      console.log("User created successfully:", data.data);
      
      // Create formatted user object for the UI
      const formattedUser: User = {
        id: data.data.user.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role || 'User',
        status: newUser.status || 'Active',
        lastLogin: 'Never',
        taxDue: newUser.taxDue || 0,
        filingDeadline: newUser.filingDeadline,
        availableCredits: newUser.availableCredits || 0
      };
      
      // Update UI immediately
      setUsers(prevUsers => [...prevUsers, formattedUser]);
      
      // Show success message
      toast({
        title: "User Created",
        description: `New user ${formattedUser.name} has been created successfully.`
      });
      
      // Force a full data refresh
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
    } finally {
      setIsCreating(false);
    }
  };

  return {
    handleCreateUser,
    isCreating
  };
};
