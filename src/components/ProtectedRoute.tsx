
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import AuthLoading from '@/components/auth/AuthLoading';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isLoading, checkComplete, hasAccess, isAuthenticated } = useAuthCheck(requireAdmin);
  const { toast } = useToast();

  // Perform additional auth validation
  useEffect(() => {
    const validateAuth = async () => {
      try {
        // Check if the session is valid
        const { data, error } = await supabase.auth.getSession();
        
        if (error || !data.session) {
          console.log("No valid session found in ProtectedRoute check");
          
          // Clear admin authentication if session is invalid
          if (localStorage.getItem('isAdminAuthenticated') === 'true') {
            localStorage.removeItem('isAdminAuthenticated');
            localStorage.removeItem('adminAuthTimestamp');
          }
        }
      } catch (e) {
        console.error("Error validating auth in ProtectedRoute:", e);
      }
    };
    
    validateAuth();
  }, []);

  // Show loading state while checking authentication
  if (isLoading || !checkComplete) {
    return <AuthLoading />;
  }

  // If not authenticated at all, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If requires admin but user doesn't have access, redirect to dashboard
  if (requireAdmin && !hasAccess) {
    // Clear any potential admin authentication since access is denied
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminAuthTimestamp');
    
    toast({
      title: "Access Denied",
      description: "You don't have permission to access the admin area.",
      variant: "destructive"
    });
    
    return <Navigate to="/login" replace />;
  }

  // Render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
