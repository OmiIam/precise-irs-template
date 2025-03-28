
import React, { useEffect } from 'react';
import { Header } from '@/components/Header';
import SignupForm from '@/components/auth/signup/SignupForm';
import { useSignup } from '@/hooks/useSignup';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const { isLoading, handleSignup } = useSignup();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      console.log("User already authenticated, redirecting from signup to dashboard");
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

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
