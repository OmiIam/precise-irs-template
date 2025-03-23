
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/auth';
import LoginContainer from './LoginContainer';
import UserLoginForm from './UserLoginForm';
import AdminLoginForm from './AdminLoginForm';
import { useLoginRedirect } from '@/hooks/useLoginRedirect';

const LoginPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { signIn } = useAuth();
  const { isRedirecting, setIsRedirecting } = useLoginRedirect();
  
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

export default LoginPage;
