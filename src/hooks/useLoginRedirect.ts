
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

export const useLoginRedirect = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  useEffect(() => {
    try {
      if (isRedirecting) return;
      
      // Check for special admin authentication first
      const adminAuth = localStorage.getItem('isAdminAuthenticated');
      if (adminAuth === 'true') {
        setIsRedirecting(true);
        navigate('/admin-dashboard', { replace: true });
        return;
      }
      
      // Then check for regular user authentication
      if (user) {
        setIsRedirecting(true);
        if (isAdmin) {
          navigate('/admin-dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // Reset redirecting state if there was an error
      setIsRedirecting(false);
    }
  }, [user, isAdmin, navigate, isRedirecting]);

  return { isRedirecting, setIsRedirecting };
};
