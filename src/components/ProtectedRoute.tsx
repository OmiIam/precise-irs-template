
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import AuthLoading from '@/components/auth/AuthLoading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, isLoading, isAdmin } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return <AuthLoading />;
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check admin authorization if required
  if (requireAdmin && !isAdmin) {
    // Redirect to regular dashboard if user is not an admin
    return <Navigate to="/dashboard" replace />;
  }

  // Render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
