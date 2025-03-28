
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import AuthLoading from '@/components/auth/AuthLoading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Prefetch user data
  useEffect(() => {
    // This is where you could prefetch additional user data if needed
    // The goal is to do this in parallel while showing the loading state
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return <AuthLoading />;
  }

  // If not authenticated, redirect to login with the current path in state
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
