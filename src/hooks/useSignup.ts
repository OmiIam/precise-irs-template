
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SignupFormValues } from '@/components/auth/signup/signupSchema';
import { toast as sonnerToast } from 'sonner';

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [signupComplete, setSignupComplete] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSignup = async (values: SignupFormValues): Promise<{ userId: string } | void> => {
    setIsLoading(true);
    
    try {
      console.log("Starting signup process for email:", values.email);
      
      // Create a new user account with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        console.error("Supabase auth signup error:", error);
        throw error;
      }

      if (!data.user) {
        console.error("No user returned from signUp operation");
        throw new Error("Failed to create user account");
      }
      
      console.log("Auth signup successful for user ID:", data.user.id);

      // Create or update the profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          created_at: new Date().toISOString(),
          role: 'User',
          status: 'Pending',
          tax_due: Math.floor(Math.random() * 5000) + 1000, // Random tax due amount for demo
          filing_deadline: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(), // 30 days from now
          available_credits: Math.floor(Math.random() * 500) // Random credits for demo
        }, { onConflict: 'id' });

      if (profileError) {
        console.error("Error creating/updating profile:", profileError);
        // Continue anyway since the auth account was created
      } else {
        console.log("Profile created/updated successfully");
      }
      
      // Log the signup activity
      try {
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
        console.log("Signup activity logged");
      } catch (logError) {
        console.error("Error logging activity:", logError);
        // Continue anyway since this is non-critical
      }

      // Sign in the user automatically after signup
      try {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password
        });
        
        if (signInError) {
          console.error("Auto-login after signup failed:", signInError);
          // Continue with the flow even if auto-login fails
        } else {
          console.log("User automatically logged in after signup");
          sonnerToast.success('Account created and logged in successfully!');
        }
      } catch (signInError) {
        console.error("Error during auto-login:", signInError);
        // Continue with the flow even if auto-login fails
      }

      setUserId(data.user.id);
      setUserEmail(values.email);
      setSignupComplete(true);
      
      toast({
        title: "Account created",
        description: "You're now logged in. Welcome to your dashboard!",
      });

      return { userId: data.user.id };
    } catch (error: any) {
      console.error("Error during signup:", error);
      
      let errorMessage = error.message || "There was an error creating your account. Please try again.";
      
      // Handle specific error cases
      if (error.message?.includes("already registered")) {
        errorMessage = "This email is already registered. Please log in or use a different email.";
      }
      
      toast({
        title: "Signup failed",
        description: errorMessage,
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
