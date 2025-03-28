
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';

export const useAuthCheck = (requireAdmin = false) => {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuthentication = async () => {
      // If auth context is still loading, wait for it
      if (authLoading) {
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Check for special admin authentication
        const adminAuth = localStorage.getItem('isAdminAuthenticated');
        setIsAdminAuthenticated(adminAuth === 'true');
        
        // If admin auth is set but we need to validate it for admin routes
        if (adminAuth === 'true' && requireAdmin) {
          try {
            // Validate the current session is still valid if we have a user
            if (user) {
              const { data: { session } } = await supabase.auth.getSession();
              if (!session) {
                // Clear invalid admin auth if no valid session exists
                localStorage.removeItem('isAdminAuthenticated');
                setIsAdminAuthenticated(false);
              }
            }
          } catch (error) {
            console.error("Error validating session:", error);
            // Don't clear adminAuth here - we want to allow pure admin login too
          }
        }
      } catch (error) {
        console.error("Error in auth check:", error);
      } finally {
        setCheckComplete(true);
        setIsLoading(false);
      }
    };
    
    checkAuthentication();
  }, [requireAdmin, user, authLoading]);

  // Determine access status - note we're allowing admin access without user in certain cases
  const hasAccess = (
    // User exists for any protected route
    (user && !requireAdmin) || 
    // User exists and is admin for admin routes
    (user && requireAdmin && isAdmin) ||
    // Special admin authentication for admin routes
    (isAdminAuthenticated && requireAdmin)
  );

  return {
    isLoading: isLoading || authLoading,
    checkComplete,
    hasAccess,
    isAuthenticated: !!user || isAdminAuthenticated
  };
};
