
'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const File = () => {
  return (
    <div className="min-h-screen bg-irs-gray">
      <Header />
      <div className="container mx-auto pt-32 pb-20 px-4">
        <h1 className="text-3xl font-bold text-irs-darkest mb-6">File Your Taxes</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-irs-darkGray">
            This is the file taxes page. It would normally contain forms and instructions for filing taxes.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default File;
