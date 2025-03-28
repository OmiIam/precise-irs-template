
import React from 'react';

const AuthLoading: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-irs-blue"></div>
    </div>
  );
};

export default AuthLoading;
