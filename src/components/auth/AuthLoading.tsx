
'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

const AuthLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-irs-gray">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-irs-blue" />
        <p className="text-irs-darkGray font-medium">Loading authentication...</p>
        <p className="text-sm text-irs-darkGray">Please wait while we verify your credentials</p>
      </div>
    </div>
  );
};

export default AuthLoading;
