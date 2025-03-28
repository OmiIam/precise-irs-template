
import React, { useState } from 'react';
import { AdminProvider } from '@/contexts/admin/AdminContext';
import UserList from '@/components/admin/UserList';
import UserFormRefactored from '@/components/admin/UserFormRefactored';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users, Activity, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from '@/contexts/auth';
import { Badge } from '@/components/ui/badge';

const AdminDashboard: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'activity' | 'settings'>('users');
  const { user } = useAuth();
  
  return (
    <AdminProvider>
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Logged in as:</span>
              <span className="font-medium">{user?.email}</span>
              <Badge variant="outline">Admin</Badge>
            </div>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Create New User
            </Button>
          </div>
        </div>
        
        {/* Admin Info Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">User Information</CardTitle>
              <CardDescription>Your admin account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p>{user?.user_metadata?.name || user?.email || 'Admin'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{user?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Role</p>
                <p>Admin</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">System Stats</CardTitle>
              <CardDescription>Quick system overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <Badge variant="secondary">2</Badge>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <Badge variant="default">2</Badge>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-muted-foreground">System Status</p>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Online</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Common admin tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('users')}>
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('activity')}>
                <Activity className="mr-2 h-4 w-4" />
                View Activity
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('settings')}>
                <Settings className="mr-2 h-4 w-4" />
                System Settings
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Tab navigation */}
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'users' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('users')}
          >
            <Users className="inline mr-2 h-4 w-4" />
            User Management
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'activity' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('activity')}
          >
            <Activity className="inline mr-2 h-4 w-4" />
            Activity Log
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'settings' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="inline mr-2 h-4 w-4" />
            Settings
          </button>
        </div>
        
        {/* Tab content */}
        {activeTab === 'users' && <UserList />}
        {activeTab === 'activity' && (
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Recent system activities</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Activity logging will be implemented in future updates.
              </p>
            </CardContent>
          </Card>
        )}
        {activeTab === 'settings' && (
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure system preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                System settings configuration will be implemented in future updates.
              </p>
            </CardContent>
          </Card>
        )}
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <UserFormRefactored mode="create" onSuccess={() => setIsCreateModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </AdminProvider>
  );
};

export default AdminDashboard;
