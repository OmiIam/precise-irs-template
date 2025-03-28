
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import AuthLoading from '@/components/auth/AuthLoading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return <AuthLoading />;
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
