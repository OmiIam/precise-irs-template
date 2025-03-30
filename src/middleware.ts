
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './integrations/supabase/client';

// This is a React Router based middleware using hooks
export function useAuthMiddleware(requireAdmin = false) {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const checkAuth = async () => {
      // Define public paths that don't require authentication
      const publicPaths = ['/', '/login', '/signup', '/file', '/pay', '/refunds', '/credits-deductions', '/forms-instructions'];
      const isPublicPath = publicPaths.some(pp => location.pathname === pp || location.pathname.startsWith(`${pp}/`));
      
      // Admin paths that require admin role
      const adminPaths = ['/admin-dashboard'];
      const isAdminPath = adminPaths.some(adminPath => location.pathname.startsWith(adminPath));
      
      // Check if auth is required
      if (!isPublicPath) {
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        
        // If no session is found, redirect to login
        if (!session) {
          navigate('/login', { state: { from: location.pathname } });
          return;
        }
        
        // If the path requires admin role
        if (isAdminPath || requireAdmin) {
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();
            
            if (profileData?.role !== 'Admin') {
              navigate('/dashboard');
              return;
            }
          } catch (error) {
            console.error('Error checking admin status:', error);
            navigate('/dashboard');
            return;
          }
        }
      }
    };
    
    checkAuth();
  }, [location.pathname, navigate]);
  
  return null;
}
