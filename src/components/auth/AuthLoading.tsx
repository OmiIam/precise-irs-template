
import React from 'react';
import { Header } from '@/components/Header';

const AuthLoading = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-irs-blue"></div>
        <p className="mt-4 text-gray-500 text-sm">Verifying your credentials...</p>
      </div>
    </div>
  );
};

export default AuthLoading;
