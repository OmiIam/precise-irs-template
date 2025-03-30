
'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import LoginContainer from './LoginContainer';
import UserLoginForm from './UserLoginForm';
import AdminLoginForm from './AdminLoginForm';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const LoginPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const toggleAdminMode = () => {
    setIsAdmin(!isAdmin);
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated' && !isRedirecting) {
      setIsRedirecting(true);
      
      setTimeout(() => {
        if (session?.user?.role === 'Admin') {
          router.push('/admin-dashboard');
        } else {
          router.push('/dashboard');
        }
      }, 50);
    }
  }, [status, session, isRedirecting, router]);

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
              />
            )}
          </LoginContainer>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
