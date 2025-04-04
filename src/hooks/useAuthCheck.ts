
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
      
      // Only consider admin auth valid if we're requiring admin access
      if (adminAuth === 'true' && requireAdmin) {
        // For admin routes, we need to validate on every visit
        try {
          // Add timestamp check to ensure admin session hasn't expired
          const adminAuthTimestamp = localStorage.getItem('adminAuthTimestamp');
          const currentTime = new Date().getTime();
          const adminAuthTime = adminAuthTimestamp ? parseInt(adminAuthTimestamp) : 0;
          
          // Admin session expires after 1 hour (3600000 ms)
          if (!adminAuthTimestamp || (currentTime - adminAuthTime > 3600000)) {
            console.log("Admin session expired");
            localStorage.removeItem('isAdminAuthenticated');
            localStorage.removeItem('adminAuthTimestamp');
            setIsAdminAuthenticated(false);
          } else {
            console.log("Admin-only authentication valid");
            setIsAdminAuthenticated(true);
          }
        } catch (error) {
          console.error("Error validating admin auth:", error);
          localStorage.removeItem('isAdminAuthenticated');
          localStorage.removeItem('adminAuthTimestamp');
          setIsAdminAuthenticated(false);
        }
      } else {
        setIsAdminAuthenticated(false);
      }
      
      if (user) {
        try {
          // Validate the current session is still valid if we have a user
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            console.log("No valid session found for user");
            // Don't do anything here, the auth context will handle the logout
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
