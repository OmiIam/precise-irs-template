
import React, { useState } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { UserListTableProps } from './user-list/types';
import SearchFilterBar from './user-list/SearchFilterBar';
import UserTableHeader from './user-list/UserTableHeader';
import UserTableRow from './user-list/UserTableRow';

const UserListTable: React.FC<UserListTableProps> = ({ 
  users,
  onEditUser, 
  onViewUser, 
  onImpersonateUser,
  onDeleteUser,
  onToggleUserStatus,
  onToggleUserRole
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id.includes(searchTerm);
    
    const matchesStatusFilter = statusFilter === null || user.status === statusFilter;
    const matchesRoleFilter = roleFilter === null || user.role === roleFilter;
    
    return matchesSearch && matchesStatusFilter && matchesRoleFilter;
  });

  const clearFilters = () => {
    setStatusFilter(null);
    setRoleFilter(null);
    setSearchTerm('');
  };

  return (
    <div className="space-y-4">
      <SearchFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        clearFilters={clearFilters}
      />
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <UserTableHeader />
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  onEditUser={onEditUser}
                  onViewUser={onViewUser}
                  onImpersonateUser={onImpersonateUser}
                  onDeleteUser={onDeleteUser}
                  onToggleUserStatus={onToggleUserStatus}
                  onToggleUserRole={onToggleUserRole}
                />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="h-24 text-center p-4">
                  No users found.
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserListTable;
