
'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-irs-gray p-8">
        <h1 className="text-3xl font-bold text-irs-darkest mb-6">User Dashboard</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-irs-darkGray">Welcome to your dashboard. This area is protected and only accessible to authenticated users.</p>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
