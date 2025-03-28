
import React, { useState } from 'react';
import { AdminProvider } from '@/contexts/admin/AdminContext';
import UserList from '@/components/admin/UserList';
import UserForm from '@/components/admin/UserForm';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/auth';
import { Navigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  
  // Redirect if not admin
  if (!user || !isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <AdminProvider>
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Create New User
          </Button>
        </div>
        
        <UserList />
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <UserForm mode="create" onSuccess={() => setIsCreateModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </AdminProvider>
  );
};

export default AdminDashboard;
