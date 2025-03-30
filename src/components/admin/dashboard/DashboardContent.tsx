
import React from 'react';
import UserListTable from '@/components/admin/UserListTable';
import ActivityLog from '@/components/admin/ActivityLog';
import StatsSummary from '@/components/admin/StatsSummary';
import { User } from '@/components/admin/user-list/types';

interface DashboardContentProps {
  users: User[];
  onEditUser: (user: User) => void;
  onViewUser: (user: User) => void;
  onImpersonateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onToggleUserStatus: (userId: string) => void;
  onToggleUserRole: (userId: string) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  users,
  onEditUser,
  onViewUser,
  onImpersonateUser,
  onDeleteUser,
  onToggleUserStatus,
  onToggleUserRole
}) => {
  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="space-y-6">
        <StatsSummary />
        
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 space-y-6">
            <div className="rounded-lg border bg-card shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-irs-darkest mb-6">User Management</h2>
                {users.length === 0 ? (
                  <div className="text-center p-6 bg-gray-50 rounded-md">
                    <p className="text-gray-500">No users found in the system.</p>
                    <p className="text-sm text-gray-400 mt-1">Add a user to get started or refresh the page.</p>
                  </div>
                ) : (
                  <UserListTable 
                    users={users}
                    onEditUser={onEditUser} 
                    onViewUser={onViewUser}
                    onImpersonateUser={onImpersonateUser}
                    onDeleteUser={onDeleteUser}
                    onToggleUserStatus={onToggleUserStatus}
                    onToggleUserRole={onToggleUserRole}
                  />
                )}
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
  );
};

export default DashboardContent;
