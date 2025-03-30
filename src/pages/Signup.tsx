
import React from 'react';
import { Header } from '@/components/Header';
import SignupForm from '@/components/auth/signup/SignupForm';
import { useSignup } from '@/hooks/useSignup';
import { Footer } from '@/components/Footer';

const Signup = () => {
  const { isLoading, handleSignup } = useSignup();

  return (
    <div className="min-h-screen bg-irs-gray">
      <Header />
      <div className="container mx-auto pt-32 pb-20 px-4">
        <div className="max-w-md mx-auto">
          <SignupForm onSubmit={handleSignup} isLoading={isLoading} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
