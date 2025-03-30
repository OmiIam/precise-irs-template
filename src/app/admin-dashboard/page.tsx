
'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminDashboardLayout from '@/components/admin/dashboard/AdminDashboardLayout';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { toast } = useToast();

  React.useEffect(() => {
    // Notify user that they've accessed the admin dashboard successfully
    toast({
      title: "Admin Dashboard",
      description: "Welcome to the admin dashboard",
    });
  }, [toast]);

  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminDashboardLayout activePage="dashboard">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-irs-darkest mb-6">Admin Dashboard</h1>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-irs-darkGray">Welcome to the admin dashboard. This area is protected and only accessible to administrators.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-irs-gray p-4 rounded-md">
                <h3 className="font-semibold text-irs-darkBlue">User Management</h3>
                <p className="text-sm mt-2">Manage users, roles, and permissions</p>
              </div>
              
              <div className="bg-irs-gray p-4 rounded-md">
                <h3 className="font-semibold text-irs-darkBlue">System Settings</h3>
                <p className="text-sm mt-2">Configure system-wide settings</p>
              </div>
              
              <div className="bg-irs-gray p-4 rounded-md">
                <h3 className="font-semibold text-irs-darkBlue">Reports</h3>
                <p className="text-sm mt-2">Generate and view system reports</p>
              </div>
              
              <div className="bg-irs-gray p-4 rounded-md">
                <h3 className="font-semibold text-irs-darkBlue">Activity Logs</h3>
                <p className="text-sm mt-2">View user and system activity</p>
              </div>
            </div>
          </div>
        </div>
      </AdminDashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
