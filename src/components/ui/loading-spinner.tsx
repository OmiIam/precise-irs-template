
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-irs-lightGray animate-spin"></div>
        <div className="w-12 h-12 rounded-full border-t-4 border-irs-blue animate-spin absolute top-0 left-0"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
