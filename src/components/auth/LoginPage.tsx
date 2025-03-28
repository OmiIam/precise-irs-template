
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/auth';
import LoginContainer from './LoginContainer';
import UserLoginForm from './UserLoginForm';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      // Redirect to user dashboard
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-irs-gray">
      <Header />
      <div className="container mx-auto pt-32 pb-20 px-4">
        <div className="max-w-md mx-auto">
          <LoginContainer isAdmin={false}>
            <UserLoginForm onToggleMode={() => {}} signIn={useAuth().signIn} />
          </LoginContainer>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
