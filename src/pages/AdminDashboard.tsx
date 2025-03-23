
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import UserListTable from '@/components/admin/UserListTable';
import UserEditDialog from '@/components/admin/UserEditDialog';
import ActivityLog from '@/components/admin/ActivityLog';
import StatsSummary from '@/components/admin/StatsSummary';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { useToast } from '@/hooks/use-toast';
import { User, Plus, RefreshCw } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  status: string;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleViewUser = (user: User) => {
    toast({
      title: "Viewing User Details",
      description: `Accessing detailed information for ${user.name}`
    });
    // In a real app, this would navigate to a detailed user view
  };

  const handleImpersonateUser = (user: User) => {
    toast({
      title: "Impersonating User",
      description: `You are now viewing the system as ${user.name}`,
      variant: "default"
    });
    // In a real app, this would set up an impersonation session
    navigate('/dashboard');
  };

  const handleSaveUser = (updatedUser: User) => {
    console.log('User updated:', updatedUser);
    // In a real app, this would update the user in the database
  };

  const handleRefresh = () => {
    toast({
      title: "Data Refreshed",
      description: "Latest data has been loaded from the server."
    });
  };

  const handleAddUser = () => {
    toast({
      title: "Add User",
      description: "The add user form would open here."
    });
    // In a real app, this would open a form to add a new user
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-irs-gray">
        <AdminSidebar activePage="dashboard" />
        
        <SidebarInset className="p-0">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-4 py-3">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="font-semibold text-lg text-irs-darkest">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh} 
                className="hidden sm:flex"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button size="sm" onClick={handleAddUser}>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>
          
          <main className="flex-1 p-4 md:p-6">
            <div className="space-y-6">
              <StatsSummary />
              
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-8 space-y-6">
                  <div className="rounded-lg border bg-card shadow-sm">
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-irs-darkest mb-6">User Management</h2>
                      <UserListTable 
                        onEditUser={handleEditUser} 
                        onViewUser={handleViewUser}
                        onImpersonateUser={handleImpersonateUser}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="xl:col-span-4 space-y-6">
                  <div className="rounded-lg border bg-card shadow-sm">
                    <div className="p-6">
                      <ActivityLog />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          
          <UserEditDialog 
            user={selectedUser} 
            open={dialogOpen} 
            onOpenChange={setDialogOpen}
            onSave={handleSaveUser}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
