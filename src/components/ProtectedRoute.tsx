
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import AuthLoading from '@/components/auth/AuthLoading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isLoading, checkComplete, hasAccess, isAuthenticated } = useAuthCheck(requireAdmin);
  const location = useLocation();
  const [timeoutExceeded, setTimeoutExceeded] = useState(false);
  
  // Set a timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log('Auth check timeout exceeded, redirecting to login');
        setTimeoutExceeded(true);
      }
    }, 5000); // 5 seconds timeout
    
    return () => clearTimeout(timer);
  }, [isLoading]);

  // Special case for authentication pages - never block these
  const isAuthPage = location.pathname === '/signup' || location.pathname === '/login';
  if (isAuthPage) {
    return <>{children}</>;
  }
  
  // Redirect if timeout is exceeded
  if (timeoutExceeded) {
    return <Navigate to="/login" replace />;
  }

  // Show loading spinner while checking authentication
  if (isLoading && !isAuthPage && !timeoutExceeded) {
    return <AuthLoading />;
  }

  // If not authenticated at all, redirect to login
  if (!isAuthenticated && !isAuthPage) {
    return <Navigate to="/login" replace />;
  }

  // If requires admin but user doesn't have access, redirect to dashboard
  if (requireAdmin && !hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
