
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/auth';
import LoginContainer from '@/components/auth/LoginContainer';
import UserLoginForm from '@/components/auth/UserLoginForm';
import AdminLoginForm from '@/components/auth/AdminLoginForm';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const { signIn, user, isAdmin: userIsAdmin } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Prevent redirect loops
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
        if (userIsAdmin) {
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
  }, [user, userIsAdmin, navigate, isRedirecting]);

  const toggleAdminMode = () => {
    setIsAdmin(!isAdmin);
  };

  return (
    <div className="min-h-screen bg-irs-gray">
      <Header />
      <div className="container mx-auto pt-32 pb-20 px-4">
        <div className="max-w-md mx-auto">
          <LoginContainer isAdmin={isAdmin}>
            {isAdmin ? (
              <AdminLoginForm 
                onToggleMode={toggleAdminMode} 
                setIsRedirecting={setIsRedirecting} 
              />
            ) : (
              <UserLoginForm 
                onToggleMode={toggleAdminMode} 
                signIn={signIn} 
              />
            )}
          </LoginContainer>
        </div>
      </div>
    </div>
  );
};

export default Login;
