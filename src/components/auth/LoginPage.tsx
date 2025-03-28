
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/auth';
import LoginContainer from './LoginContainer';
import UserLoginForm from './UserLoginForm';
import AdminLoginForm from './AdminLoginForm';
import { useLoginRedirect } from '@/hooks/useLoginRedirect';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { signIn, user, isLoading } = useAuth();
  const { isRedirecting, setIsRedirecting } = useLoginRedirect();
  const navigate = useNavigate();
  
  const toggleAdminMode = () => {
    setIsAdmin(!isAdmin);
  };

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (user && !isLoading && !isRedirecting) {
      console.log("User already authenticated, redirecting to dashboard");
      setIsRedirecting(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    }
  }, [user, isLoading, isRedirecting, setIsRedirecting, navigate]);

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

export default LoginPage;
