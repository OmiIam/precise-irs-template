
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, isAdmin, isLoading } = useAuth();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    try {
      // Check for special admin authentication
      const adminAuth = localStorage.getItem('isAdminAuthenticated');
      setIsAdminAuthenticated(adminAuth === 'true');
    } catch (error) {
      console.error('Error checking admin authentication:', error);
    }
  }, []);

  if (isLoading) {
    // Show loading state while checking authentication
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-irs-blue"></div>
      </div>
    );
  }

  try {
    // Allow access if we have the special admin flag and this route requires admin
    if (isAdminAuthenticated && requireAdmin) {
      return <>{children}</>;
    }

    // If not authenticated, redirect to login
    if (!user && !isAdminAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    // If requires admin but user is not admin, redirect to dashboard
    if (requireAdmin && !isAdmin && !isAdminAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }

    // Render the protected content
    return <>{children}</>;
  } catch (error) {
    console.error('Protected route navigation error:', error);
    // Return a fallback if navigation fails
    return <div>Authentication error. Please try again later.</div>;
  }
};

export default ProtectedRoute;
