
'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminDashboardLayout from '@/components/admin/dashboard/AdminDashboardLayout';

const AdminDashboard = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminDashboardLayout activePage="dashboard">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-irs-darkest mb-6">Admin Dashboard</h1>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-irs-darkGray">Welcome to the admin dashboard. This area is protected and only accessible to administrators.</p>
          </div>
        </div>
      </AdminDashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
