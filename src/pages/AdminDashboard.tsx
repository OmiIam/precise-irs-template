
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
import { Plus, RefreshCw } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  status: string;
  taxDue?: number;
  filingDeadline?: Date;
  availableCredits?: number;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);

  // State to store all users
  const [users, setUsers] = useState<User[]>([
    {
      id: '001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'User',
      lastLogin: '2023-06-10 08:30 AM',
      status: 'Active',
      taxDue: 3500,
      filingDeadline: new Date(2023, 3, 15), // April 15, 2023
      availableCredits: 750
    },
    {
      id: '002',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Admin',
      lastLogin: '2023-06-12 11:45 AM',
      status: 'Active',
      taxDue: 0,
      filingDeadline: new Date(2023, 3, 15), // April 15, 2023
      availableCredits: 0
    },
    {
      id: '003',
      name: 'Robert Johnson',
      email: 'robert.j@example.com',
      role: 'User',
      lastLogin: '2023-06-05 03:20 PM',
      status: 'Inactive',
      taxDue: 1200,
      filingDeadline: new Date(2023, 3, 15), // April 15, 2023
      availableCredits: 200
    },
    {
      id: '004',
      name: 'Emily Williams',
      email: 'emily.w@example.com',
      role: 'User',
      lastLogin: '2023-06-11 09:15 AM',
      status: 'Active',
      taxDue: 2800,
      filingDeadline: new Date(2023, 3, 15), // April 15, 2023
      availableCredits: 500
    },
    {
      id: '005',
      name: 'Michael Brown',
      email: 'michael.b@example.com',
      role: 'User',
      lastLogin: '2023-06-08 02:40 PM',
      status: 'Active',
      taxDue: 1750,
      filingDeadline: new Date(2023, 3, 15), // April 15, 2023
      availableCredits: 0
    }
  ]);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsCreateMode(false);
    setDialogOpen(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsCreateMode(true);
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
    if (isCreateMode) {
      // Add the new user to the users array
      setUsers([...users, updatedUser]);
    } else {
      // Update existing user
      setUsers(users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "User deleted",
      description: `User ID: ${userId} has been removed from the system.`
    });
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
        toast({
          title: `User ${newStatus.toLowerCase()}`,
          description: `User ID: ${userId} is now ${newStatus.toLowerCase()}.`
        });
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  const handleToggleUserRole = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        const newRole = user.role === 'Admin' ? 'User' : 'Admin';
        toast({
          title: "Role Updated",
          description: `User ID: ${userId} role changed to ${newRole}.`
        });
        return { ...user, role: newRole };
      }
      return user;
    }));
  };

  const handleRefresh = () => {
    toast({
      title: "Data Refreshed",
      description: "Latest data has been loaded from the server."
    });
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
                        users={users}
                        onEditUser={handleEditUser} 
                        onViewUser={handleViewUser}
                        onImpersonateUser={handleImpersonateUser}
                        onDeleteUser={handleDeleteUser}
                        onToggleUserStatus={handleToggleUserStatus}
                        onToggleUserRole={handleToggleUserRole}
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
            isCreateMode={isCreateMode}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
