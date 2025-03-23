
import { supabase } from '@/integrations/supabase/client';

// Log auth activity for security auditing
export const logAuthActivity = async (userId: string, action: string) => {
  try {
    await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        action: action,
        details: {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        }
      });
  } catch (error) {
    console.error("Error logging auth activity:", error);
  }
};

// Check if the user has the admin role
export const checkUserRole = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    
    return data?.role === 'Admin';
  } catch (error) {
    console.error("Error checking user role:", error);
    return false;
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    // Update last login timestamp
    if (data.user) {
      await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.user.id);
    }
    
    return { error: null };
  } catch (error) {
    console.error("Error during sign in:", error);
    return { error };
  }
};

// Sign up with email and password
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string
) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });
    
    if (error) throw error;
    
    return { error: null };
  } catch (error) {
    console.error("Error during sign up:", error);
    return { error };
  }
};

// Reset password
export const resetPasswordWithEmail = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    
    return { error: null };
  } catch (error) {
    console.error("Error during password reset:", error);
    return { error };
  }
};
