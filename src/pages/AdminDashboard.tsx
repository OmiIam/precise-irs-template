
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
    refreshUsers
  } = useUserManagement();
  const { handleViewUser, handleImpersonateUser } = useUserActions();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Ensure user is allowed to access admin dashboard
  useEffect(() => {
    const checkAdminAccess = async () => {
      // Get admin status from localStorage as a fallback
      const adminAuth = localStorage.getItem('isAdminAuthenticated');
      
      // If user isn't admin and doesn't have admin auth, redirect
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
  
  // Reset activity timer on any user interaction with the page
  useEffect(() => {
    // Set up event listeners for admin dashboard activity
    const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    
    const handleUserActivity = () => {
      resetActivityTimer();
    };
    
    // Add event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });
    
    // Clean up event listeners on unmount
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [resetActivityTimer]);

  // Log admin access for audit purposes
  useEffect(() => {
    const logAdminAccess = async () => {
      try {
        // Use localStorage admin flag if user is null (admin-only login)
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
          // Log admin access without user ID
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
  }, [user]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchUsers();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleUserCreated = async () => {
    console.log("User created, triggering data refresh");
    await fetchUsers();
  };

  return (
    <AdminDashboardLayout activePage="dashboard">
      <UserDialogContainer
        onSaveUser={handleSaveUser}
        onCreateUser={async (user) => {
          const success = await handleCreateUser(user);
          if (success) {
            handleUserCreated();
          }
          return success;
        }}
      >
        {({ handleAddUser, handleEditUser, dialogComponent }) => (
          <>
            <div className="flex justify-between items-center p-4 bg-white border-b">
              <DashboardHeader 
                onAddUser={handleAddUser}
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
