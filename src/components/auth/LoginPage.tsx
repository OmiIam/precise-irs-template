
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/auth';
import LoginContainer from './LoginContainer';
import UserLoginForm from './UserLoginForm';
import AdminLoginForm from './AdminLoginForm';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  // Toggle between admin and user login modes
  const toggleMode = () => {
    setIsAdminMode(!isAdminMode);
  };
  
  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      if (isAdmin) {
        // Redirect admin users to admin dashboard
        navigate('/admin/dashboard', { replace: true });
      } else {
        // Redirect regular users to user dashboard
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, isAdmin, navigate]);

  return (
    <div className="min-h-screen bg-irs-gray">
      <Header />
      <div className="container mx-auto pt-32 pb-20 px-4">
        <div className="max-w-md mx-auto">
          <LoginContainer isAdmin={isAdminMode}>
            {isAdminMode ? (
              <AdminLoginForm onToggleMode={toggleMode} />
            ) : (
              <UserLoginForm onToggleMode={toggleMode} signIn={useAuth().signIn} />
            )}
          </LoginContainer>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
