
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useUserActions } from '@/components/admin/dashboard/userActions';
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader';
import DashboardContent from '@/components/admin/dashboard/DashboardContent';
import UserDialogContainer from '@/components/admin/dashboard/UserDialogContainer';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import AdminDashboardLayout from '@/components/admin/dashboard/AdminDashboardLayout';
import RefreshStatusIndicator from '@/components/admin/dashboard/RefreshStatusIndicator';

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { resetActivityTimer } = useUserManagement();
  const { user, isAdmin } = useAuth();
  const { 
    users, 
    isLoading, 
    fetchUsers, 
    handleSaveUser, 
    handleCreateUser,
    handleDeleteUser,
    handleToggleUserStatus,
    handleToggleUserRole,
    isSubscribed,
    lastRefresh,
    refreshUsers,
    isCreating
  } = useUserManagement();
  const { handleViewUser, handleImpersonateUser } = useUserActions();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    const checkAdminAccess = async () => {
      const adminAuth = localStorage.getItem('isAdminAuthenticated');
      
      if (!isAdmin && adminAuth !== 'true') {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin dashboard.",
          variant: "destructive"
        });
        navigate('/dashboard', { replace: true });
      }
    };
    
    checkAdminAccess();
  }, [isAdmin, navigate, toast]);
  
  useEffect(() => {
    const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    
    const handleUserActivity = () => {
      resetActivityTimer();
    };
    
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });
    
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [resetActivityTimer]);

  useEffect(() => {
    // Initial data fetch
    fetchUsers();
    
    // Log admin access
    const logAdminAccess = async () => {
      try {
        const adminAuth = localStorage.getItem('isAdminAuthenticated');
        
        if (user) {
          await supabase
            .from('activity_logs')
            .insert({
              user_id: user.id,
              action: 'ADMIN_DASHBOARD_ACCESS',
              details: {
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
              }
            });
        } else if (adminAuth === 'true') {
          await supabase
            .from('activity_logs')
            .insert({
              action: 'ADMIN_ONLY_DASHBOARD_ACCESS',
              details: {
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
              }
            });
        }
      } catch (error) {
        console.error("Error logging admin access:", error);
      }
    };
    
    logAdminAccess();
  }, [user, fetchUsers]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchUsers();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <AdminDashboardLayout activePage="dashboard">
      <UserDialogContainer
        onSaveUser={handleSaveUser}
        onCreateUser={handleCreateUser}
      >
        {({ handleAddUser, handleEditUser, dialogComponent }) => (
          <>
            <div className="flex justify-between items-center p-4 bg-white border-b">
              <DashboardHeader 
                onAddUser={handleAddUser}
                isCreatingUser={isCreating}
              />
              
              <RefreshStatusIndicator
                isSubscribed={isSubscribed}
                lastRefresh={lastRefresh}
                onRefresh={handleManualRefresh}
                isRefreshing={isRefreshing}
              />
            </div>
            
            <DashboardContent 
              users={users}
              isLoading={isLoading}
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
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
