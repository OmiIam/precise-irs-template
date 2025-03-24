
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useToast } from '@/hooks/use-toast';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useUserActions } from '@/components/admin/dashboard/userActions';
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader';
import DashboardContent from '@/components/admin/dashboard/DashboardContent';
import UserDialogContainer from '@/components/admin/dashboard/UserDialogContainer';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react'; // Changed from ReloadIcon to RefreshCw
import { format } from 'date-fns';

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
      toast({
        title: "Data Refreshed",
        description: "User data has been refreshed successfully."
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh user data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleUserCreated = async () => {
    console.log("User created, triggering data refresh");
    await fetchUsers();
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-irs-gray">
        <AdminSidebar activePage="dashboard" />
        
        <SidebarInset className="p-0">
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
                  
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-500">
                      {isSubscribed ? (
                        <span className="text-green-500 flex items-center">
                          <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span> Realtime updates active
                        </span>
                      ) : (
                        <span className="text-amber-500 flex items-center">
                          <span className="h-2 w-2 bg-amber-500 rounded-full mr-1"></span> Realtime updates inactive
                        </span>
                      )}
                      <div className="text-xs mt-1">
                        Last updated: {format(lastRefresh, 'HH:mm:ss')}
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleManualRefresh}
                      disabled={isRefreshing}
                    >
                      {isRefreshing ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> // Changed from ReloadIcon to RefreshCw
                      ) : (
                        <RefreshCw className="mr-2 h-4 w-4" /> // Changed from ReloadIcon to RefreshCw
                      )}
                      Refresh
                    </Button>
                  </div>
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
