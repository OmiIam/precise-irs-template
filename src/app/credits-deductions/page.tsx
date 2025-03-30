
'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const CreditsDeductions = () => {
  return (
    <div className="min-h-screen bg-irs-gray">
      <Header />
      <div className="container mx-auto pt-32 pb-20 px-4">
        <h1 className="text-3xl font-bold text-irs-darkest mb-6">Tax Credits & Deductions</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-irs-darkGray">
            This is the credits and deductions page. It would normally contain information about tax credits and deductions.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreditsDeductions;
