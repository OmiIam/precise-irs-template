
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { Navigate } from 'react-router-dom';
import AdminDashboardContent from '@/components/admin/AdminDashboardContent';
import Header from '@/components/Header';
import AuthLoading from '@/components/auth/AuthLoading';

const AdminDashboard = () => {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <AuthLoading />;
  }

  // If not logged in or not an admin, redirect to login
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AdminDashboardContent />
    </div>
  );
};

export default AdminDashboard;
