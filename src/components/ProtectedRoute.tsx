
import React from 'react';
import { Navigate } from 'react-router-dom';
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

  // Show loading spinner while checking authentication
  if (isLoading || !checkComplete) {
    return <AuthLoading />;
  }

  // If not authenticated at all, redirect to login
  if (!isAuthenticated) {
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
