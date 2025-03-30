
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import LoginContainer from './LoginContainer';
import UserLoginForm from './UserLoginForm';
import AdminLoginForm from './AdminLoginForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import AuthLoading from '@/components/auth/AuthLoading';
import { Footer } from '@/components/Footer';

const LoginPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin: userIsAdmin, isLoading, signIn } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const toggleAdminMode = () => {
    setIsAdmin(!isAdmin);
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !isRedirecting) {
      setIsRedirecting(true);
      
      setTimeout(() => {
        if (userIsAdmin) {
          navigate('/admin-dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }, 50);
    }
  }, [user, userIsAdmin, isRedirecting, navigate]);

  const handleAdminLogin = async (values: { email: string; password: string }) => {
    // For admin login, we'll use the same signIn method but handle redirection here
    try {
      const result = await signIn(values.email, values.password);
      
      if (!result.error) {
        setIsRedirecting(true);
        navigate('/admin-dashboard', { replace: true });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error during admin login:", error);
      return false;
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return <AuthLoading />;
  }

  return (
    <div className="min-h-screen bg-irs-gray">
      <Header />
      <div className="container mx-auto pt-32 pb-20 px-4">
        <div className="max-w-md mx-auto">
          <LoginContainer isAdmin={isAdmin}>
            {isAdmin ? (
              <AdminLoginForm 
                onToggleMode={toggleAdminMode} 
                onAdminLogin={handleAdminLogin}
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
      <Footer />
    </div>
  );
};

export default LoginPage;
