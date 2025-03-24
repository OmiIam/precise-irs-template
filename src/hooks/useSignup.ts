
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SignupFormValues } from '@/components/auth/signup/signupSchema';

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [signupComplete, setSignupComplete] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSignup = async (values: SignupFormValues): Promise<{ userId: string } | void> => {
    setIsLoading(true);
    
    try {
      // Create a new user account with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Log the signup activity
        await supabase
          .from('activity_logs')
          .insert({
            user_id: data.user.id,
            action: 'USER_SIGNUP',
            details: {
              email: values.email,
              timestamp: new Date().toISOString()
            }
          });

        setUserId(data.user.id);
        setUserEmail(values.email);
        
        toast({
          title: "Account created",
          description: "Please upload your identification document to complete the signup.",
        });

        return { userId: data.user.id };
      }
    } catch (error: any) {
      console.error("Error during signup:", error);
      toast({
        title: "Signup failed",
        description: error.message || "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
      return void 0; // Explicitly return void
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    signupComplete,
    userId,
    userEmail,
    handleSignup,
  };
};
