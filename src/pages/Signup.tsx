
import React from 'react';
import { Header } from '@/components/Header';
import IDVerificationForm from '@/components/IDVerificationForm';
import SignupForm from '@/components/auth/signup/SignupForm';
import { useSignup } from '@/hooks/useSignup';

const Signup = () => {
  const { isLoading, signupComplete, userId, userEmail, handleSignup } = useSignup();

  return (
    <div className="min-h-screen bg-irs-gray">
      <Header />
      <div className="container mx-auto pt-32 pb-20 px-4">
        <div className="max-w-md mx-auto">
          {!signupComplete ? (
            <SignupForm onSubmit={handleSignup} isLoading={isLoading} />
          ) : (
            userId && userEmail && <IDVerificationForm userId={userId} userEmail={userEmail} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
