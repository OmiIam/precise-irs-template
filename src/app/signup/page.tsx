
'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import SignupForm from '@/components/auth/signup/SignupForm';
import { useNextAuth } from '@/hooks/useNextAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Signup = () => {
  const { signUp, isAuthenticated } = useNextAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const handleSignup = async (values: any) => {
    setIsLoading(true);
    try {
      const result = await signUp(
        values.email, 
        values.password, 
        values.firstName, 
        values.lastName
      );
      
      setIsLoading(false);
      
      if (!result.error) {
        navigate('/dashboard');
        return { userId: result.userId };
      }
      
      return void 0;
    } catch (error) {
      setIsLoading(false);
      console.error("Error during signup:", error);
      return void 0;
    }
  };

  return (
    <div className="min-h-screen bg-irs-gray">
      <Header />
      <div className="container mx-auto pt-32 pb-20 px-4">
        <div className="max-w-md mx-auto">
          <SignupForm onSubmit={handleSignup} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Signup;
