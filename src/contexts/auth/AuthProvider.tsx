
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { AuthContextType } from './types';
import { 
  logAuthActivity, 
  checkUserRole, 
  signInWithEmail, 
  signUpWithEmail, 
  resetPasswordWithEmail 
} from './authService';

// Create the auth context with undefined default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          const isUserAdmin = await checkUserRole(currentSession.user.id);
          setIsAdmin(isUserAdmin);
          
          // Log the auth event for security auditing
          await logAuthActivity(currentSession.user.id, event);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        const isUserAdmin = await checkUserRole(currentSession.user.id);
        setIsAdmin(isUserAdmin);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      if (user) {
        await logAuthActivity(user.id, 'SIGN_OUT');
      }
      
      await supabase.auth.signOut();
      // Navigate to home instead of login
      navigate('/');
    } catch (error) {
      console.error("Error during sign out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Create the auth context value
  const value: AuthContextType = {
    session,
    user,
    isAdmin,
    isLoading,
    signIn: signInWithEmail,
    signUp: signUpWithEmail,
    signOut,
    resetPassword: resetPasswordWithEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
