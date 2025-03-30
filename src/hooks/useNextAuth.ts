
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';

export const useNextAuth = () => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            // Check if user is admin
            const { data } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();
              
            setIsAdmin(data?.role === 'Admin');
          } catch (error) {
            console.error('Error checking user role:', error);
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
      }
    );
    
    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          // Check if user is admin
          const { data } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
            
          setIsAdmin(data?.role === 'Admin');
        } catch (error) {
          console.error('Error checking user role:', error);
          setIsAdmin(false);
        }
      }
      
      setHasCheckedSession(true);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  const isAuthenticated = !!user;
  
  const handleSignIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error) {
        console.log("Sign in successful");
        return { error: null };
      }
      
      console.error("Sign in error:", error);
      return { error };
    } catch (error) {
      console.error("Error during sign in:", error);
      return { error };
    }
  };
  
  const handleSignUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });
      
      if (!error && data.user) {
        // Create profile entry
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            email: email,
            created_at: new Date().toISOString(),
            role: 'User',
            status: 'Pending'
          });
        
        if (profileError) {
          console.error("Error creating profile:", profileError);
          return { error: profileError, userId: null };
        }
        
        return { error: null, userId: data.user.id };
      }
      
      return { error, userId: null };
    } catch (error) {
      console.error("Error during signup:", error);
      return { error, userId: null };
    }
  };
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };
  
  // A function to check if user has access to protected routes
  const checkAccess = (requireAdmin: boolean = false) => {
    if (!isAuthenticated) {
      return false;
    }
    
    if (requireAdmin && !isAdmin) {
      return false;
    }
    
    return true;
  };
  
  return {
    session,
    user,
    isAdmin,
    isLoading,
    isAuthenticated,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    checkAccess
  };
};
