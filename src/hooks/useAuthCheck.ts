import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';

export const useAuthCheck = (requireAdmin = false) => {
  const { user, isAdmin, isLoading } = useAuth();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);
  
  useEffect(() => {
    // Check for special admin authentication
    const adminAuth = localStorage.getItem('isAdminAuthenticated');
    setIsAdminAuthenticated(adminAuth === 'true');
    setCheckComplete(true);
  }, []);

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
