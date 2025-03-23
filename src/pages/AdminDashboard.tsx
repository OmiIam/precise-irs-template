
import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';

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
  const [isLoading, setIsLoading] = useState(true);

  // State to store all users
  const [users, setUsers] = useState<User[]>([]);

  // Fetch users from Supabase
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;

      const formattedUsers = data.map(profile => ({
        id: profile.id,
        name: `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
        role: profile.role,
        lastLogin: profile.last_login ? new Date(profile.last_login).toLocaleString() : 'Never',
        status: profile.status,
        taxDue: profile.tax_due || 0,
        filingDeadline: profile.filing_deadline ? new Date(profile.filing_deadline) : undefined,
        availableCredits: profile.available_credits || 0
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load user data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchUsers();
    
    // Set up realtime subscription for profiles
    const channel = supabase
      .channel('public:profiles')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles'
      }, (payload) => {
        fetchUsers(); // Refresh data when changes occur
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

  const handleSaveUser = async (updatedUser: User) => {
    try {
      if (isCreateMode) {
        // This would be handled through auth in a real implementation
        // For demo, we'll just add to the local state
        setUsers([...users, updatedUser]);
        
        toast({
          title: "User Created",
          description: "New user has been created successfully."
        });
      } else {
        // Update existing user in Supabase
        const { error } = await supabase
          .from('profiles')
          .update({
            first_name: updatedUser.name.split(' ')[0],
            last_name: updatedUser.name.split(' ').slice(1).join(' '),
            email: updatedUser.email,
            role: updatedUser.role,
            status: updatedUser.status,
            tax_due: updatedUser.taxDue,
            filing_deadline: updatedUser.filingDeadline?.toISOString(),
            available_credits: updatedUser.availableCredits
          })
          .eq('id', updatedUser.id);

        if (error) throw error;
        
        // Update local state
        setUsers(users.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        ));
        
        toast({
          title: "User Updated",
          description: "User information has been updated successfully."
        });
      }
    } catch (error) {
      console.error("Error saving user:", error);
      toast({
        title: "Error",
        description: "Failed to save user data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Note: In a real application, you would delete the user from auth.users
      // Here we just update the profile status since we can't delete auth users directly
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'Deleted' })
        .eq('id', userId);

      if (error) throw error;

      // Update the local state
      setUsers(users.filter(user => user.id !== userId));
      
      toast({
        title: "User deleted",
        description: `User ID: ${userId} has been removed from the system.`
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
      
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(users.map(user => {
        if (user.id === userId) {
          toast({
            title: `User ${newStatus.toLowerCase()}`,
            description: `User ID: ${userId} is now ${newStatus.toLowerCase()}.`
          });
          return { ...user, status: newStatus };
        }
        return user;
      }));
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleToggleUserRole = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const newRole = user.role === 'Admin' ? 'User' : 'Admin';
      
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(users.map(user => {
        if (user.id === userId) {
          toast({
            title: "Role Updated",
            description: `User ID: ${userId} role changed to ${newRole}.`
          });
          return { ...user, role: newRole };
        }
        return user;
      }));
    } catch (error) {
      console.error("Error toggling user role:", error);
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRefresh = () => {
    fetchUsers();
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
                disabled={isLoading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? "Loading..." : "Refresh"}
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
