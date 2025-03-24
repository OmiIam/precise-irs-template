
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
      
      // If admin auth is set but we need to validate it
      if (adminAuth === 'true' && requireAdmin) {
        try {
          // Validate the current session is still valid
          const { data: { session } } = await supabase.auth.getSession();
          setIsAdminAuthenticated(!!session);
        } catch (error) {
          console.error("Error validating session:", error);
          setIsAdminAuthenticated(false);
          // Clear invalid admin auth
          localStorage.removeItem('isAdminAuthenticated');
        }
      } else {
        setIsAdminAuthenticated(adminAuth === 'true');
      }
      
      setCheckComplete(true);
    };
    
    checkAuthentication();
  }, [requireAdmin]);

  // Determine access status
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
