
import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useToast } from '@/hooks/use-toast';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useUserActions } from '@/components/admin/dashboard/userActions';
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader';
import DashboardContent from '@/components/admin/dashboard/DashboardContent';
import UserDialogContainer from '@/components/admin/dashboard/UserDialogContainer';

const AdminDashboard = () => {
  const { toast } = useToast();
  const { 
    users, 
    isLoading, 
    fetchUsers, 
    handleSaveUser, 
    handleCreateUser,
    handleDeleteUser,
    handleToggleUserStatus,
    handleToggleUserRole
  } = useUserManagement();
  const { handleViewUser, handleImpersonateUser } = useUserActions();

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
          <UserDialogContainer
            onSaveUser={handleSaveUser}
            onCreateUser={handleCreateUser}
          >
            {({ handleAddUser, handleEditUser, dialogComponent }) => (
              <>
                <DashboardHeader 
                  onRefresh={handleRefresh}
                  onAddUser={handleAddUser}
                  isLoading={isLoading}
                />
                
                <DashboardContent 
                  users={users}
                  onEditUser={handleEditUser}
                  onViewUser={handleViewUser}
                  onImpersonateUser={handleImpersonateUser}
                  onDeleteUser={handleDeleteUser}
                  onToggleUserStatus={handleToggleUserStatus}
                  onToggleUserRole={handleToggleUserRole}
                />
                
                {dialogComponent}
              </>
            )}
          </UserDialogContainer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
