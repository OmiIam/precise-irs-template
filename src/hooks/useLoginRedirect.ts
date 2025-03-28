
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { toast as sonnerToast } from 'sonner';

export const useLoginRedirect = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  useEffect(() => {
    // Wait until auth loading is complete
    if (isLoading) {
      return;
    }
    
    // Don't attempt additional redirects if we're already redirecting
    if (isRedirecting) return;
    
    const handleRedirect = () => {
      try {
        // Check for special admin authentication first
        const adminAuth = localStorage.getItem('isAdminAuthenticated');
        
        if (adminAuth === 'true') {
          setIsRedirecting(true);
          console.log('Redirecting to admin dashboard from admin auth');
          sonnerToast.success('Logged in as admin', {
            description: 'Redirecting to admin dashboard...'
          });
          
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
          sonnerToast.success('Login successful', {
            description: `Redirecting to ${isAdmin ? 'admin' : ''} dashboard...`
          });
          
          // Use a slight delay to avoid the security error
          setTimeout(() => {
            if (isAdmin) {
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
    
  }, [user, isAdmin, navigate, isRedirecting, isLoading]);

  return { isRedirecting, setIsRedirecting };
};
