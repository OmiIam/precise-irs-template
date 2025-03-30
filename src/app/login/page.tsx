
'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { useNextAuth } from '@/hooks/useNextAuth';
import LoginContainer from '@/components/auth/LoginContainer';
import UserLoginForm from '@/components/auth/UserLoginForm';
import AdminLoginForm from '@/components/auth/AdminLoginForm';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const { signIn, isAuthenticated, isAdmin: userIsAdmin } = useNextAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const toggleAdminMode = () => {
    setIsAdmin(!isAdmin);
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isRedirecting) {
      setIsRedirecting(true);
      
      setTimeout(() => {
        if (userIsAdmin) {
          router.push('/admin-dashboard');
        } else {
          router.push('/dashboard');
        }
      }, 50);
    }
  }, [isAuthenticated, userIsAdmin, isRedirecting, router]);

  const handleAdminLogin = async (values: { email: string; password: string }) => {
    // For admin login, we'll use the same signIn method but handle redirection here
    try {
      const result = await signIn(values.email, values.password);
      
      if (!result.error) {
        setIsRedirecting(true);
        router.push('/admin-dashboard');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error during admin login:", error);
      return false;
    }
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
    </div>
  );
};

export default LoginPage;
