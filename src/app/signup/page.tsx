
'use client';

import React from 'react';
import { Header } from '@/components/Header';
import SignupForm from '@/components/auth/signup/SignupForm';
import { useNextAuth } from '@/hooks/useNextAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Signup = () => {
  const { signUp, isAuthenticated } = useNextAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);
  
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
        router.push('/dashboard');
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
