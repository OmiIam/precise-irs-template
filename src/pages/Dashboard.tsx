
import React, { Suspense } from 'react';
import { useAuth } from '@/contexts/auth';
import Header from '@/components/Header';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, UserCircle, FileText, Bell } from 'lucide-react';

const DashboardStat = ({ icon: Icon, title, value, color }: { icon: any, title: string, value: string, color: string }) => (
  <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-1 text-xl font-semibold">{value}</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          </div>
        </header>
        
        <main>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="space-y-6">
              {/* Welcome Card */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Welcome, {user?.email?.split('@')[0] || 'User'}</h2>
                <p className="text-gray-600">Here's an overview of your account and recent activity.</p>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardStat 
                  icon={FileText} 
                  title="Pending Forms" 
                  value="2" 
                  color="bg-irs-blue" 
                />
                <DashboardStat 
                  icon={UserCircle} 
                  title="Account Status" 
                  value="Active" 
                  color="bg-green-500" 
                />
                <DashboardStat 
                  icon={Bell} 
                  title="Notifications" 
                  value="3" 
                  color="bg-orange-500" 
                />
                <DashboardStat 
                  icon={Shield} 
                  title="Security Status" 
                  value="Good" 
                  color="bg-purple-500" 
                />
              </div>
              
              {/* User Info Card */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Your Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1 text-lg">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Role</p>
                    <p className="mt-1 text-lg">{user?.role || "User"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Account Created</p>
                    <p className="mt-1 text-lg">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Recently"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
