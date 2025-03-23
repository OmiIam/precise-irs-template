
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
                <UserListTable 
                  users={users}
                  onEditUser={onEditUser} 
                  onViewUser={onViewUser}
                  onImpersonateUser={onImpersonateUser}
                  onDeleteUser={onDeleteUser}
                  onToggleUserStatus={onToggleUserStatus}
                  onToggleUserRole={onToggleUserRole}
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
  );
};

export default DashboardContent;
