
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';

export const useAuthCheck = (requireAdmin = false) => {
  const { user, isAdmin, isLoading } = useAuth();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);
  
  useEffect(() => {
    const checkAuthentication = async () => {
      // Check for special admin authentication
      const adminAuth = localStorage.getItem('isAdminAuthenticated');
      setIsAdminAuthenticated(adminAuth === 'true');
      
      // If admin auth is set but we need to validate it for admin routes
      if (adminAuth === 'true' && requireAdmin) {
        console.log("Admin-only authentication enabled");
      } else if (user) {
        try {
          // Validate the current session is still valid if we have a user
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            console.log("No valid session found for user");
          }
        } catch (error) {
          console.error("Error validating session:", error);
        }
      }
      
      setCheckComplete(true);
    };
    
    checkAuthentication();
  }, [requireAdmin, user]);

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
    isLoading,
    checkComplete,
    hasAccess,
    isAuthenticated: !!user || isAdminAuthenticated
  };
};
