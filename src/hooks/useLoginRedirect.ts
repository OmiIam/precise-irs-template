
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

export const useLoginRedirect = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  useEffect(() => {
    // Don't attempt additional redirects if we're already redirecting
    if (isRedirecting) return;
    
    const handleRedirect = () => {
      try {
        // Check if we're on the admin dashboard path
        const isAdminPath = window.location.hash.includes('/admin-dashboard');
        
        // Check for special admin authentication first
        const adminAuth = localStorage.getItem('isAdminAuthenticated');
        
        // Only redirect to admin dashboard if:
        // 1. Admin auth is valid AND
        // 2. We're already on an admin page 
        // This prevents automatic redirection to admin dashboard from other pages
        if (adminAuth === 'true' && isAdminPath) {
          setIsRedirecting(true);
          console.log('Redirecting to admin dashboard from admin auth');
          // Use a slight delay to avoid the security error
          setTimeout(() => {
            navigate('/admin-dashboard', { replace: true });
          }, 50);
          return;
        }
        
        // Then check for regular user authentication
        if (user) {
          setIsRedirecting(true);
          console.log('Redirecting based on user role:', isAdmin ? 'admin' : 'regular user');
          // Use a slight delay to avoid the security error
          setTimeout(() => {
            if (isAdmin && isAdminPath) {
              navigate('/admin-dashboard', { replace: true });
            } else {
              navigate('/dashboard', { replace: true });
            }
          }, 50);
        }
      } catch (error) {
        console.error('Navigation error:', error);
        // Reset redirecting state if there was an error
        setIsRedirecting(false);
      }
    };
    
    // Run the redirection logic
    handleRedirect();
    
  }, [user, isAdmin, navigate, isRedirecting]);

  return { isRedirecting, setIsRedirecting };
};
