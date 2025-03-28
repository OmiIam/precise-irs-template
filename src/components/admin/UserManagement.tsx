
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PencilIcon, Trash2Icon, RefreshCw, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserData } from '@/hooks/user-management/useUserData';
import { useUserDelete } from '@/hooks/user-management/useUserDelete';
import { useUserUpdate } from '@/hooks/user-management/useUserUpdate';
import UserEditDialog from './UserEditDialog';
import { User } from '@/types/user';

const UserManagement = () => {
  const { toast } = useToast();
  const { users, setUsers, isLoading, refreshUsers, isSubscribed, lastRefresh } = useUserData();
  const { handleDeleteUser } = useUserDelete(users, setUsers);
  const { handleSaveUser } = useUserUpdate(users, setUsers);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setShowEditDialog(true);
  };

  const closeEditDialog = () => {
    setShowEditDialog(false);
    setEditingUser(null);
  };

  const handleEdit = async (updatedUser: User) => {
    const success = await handleSaveUser(updatedUser);
    if (success) {
      closeEditDialog();
    }
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      await handleDeleteUser(userId);
    }
  };

  const handleRefresh = () => {
    refreshUsers();
    toast({
      title: "Refreshed",
      description: "User data has been refreshed successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage user accounts and permissions
            </CardDescription>
          </div>
          <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search users..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">User</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Email</th>
                  <th className="whitespace-nowrap px-4 py-3 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-center">Loading users...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-center">No users found</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-t hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3">{user.name || 'Unknown User'}</td>
                      <td className="whitespace-nowrap px-4 py-3">{user.email}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(user)}
                            title="Edit user"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                            title="Delete user"
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="text-xs text-gray-500">
            {lastRefresh && (
              <p>Last updated: {new Date(lastRefresh).toLocaleString()}</p>
            )}
            <p>
              Realtime updates: {isSubscribed ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>
      </CardContent>
      
      {/* Edit User Dialog */}
      {showEditDialog && editingUser && (
        <UserEditDialog 
          user={editingUser} 
          onSave={handleEdit} 
          onCancel={closeEditDialog} 
          isOpen={showEditDialog}
        />
      )}
    </Card>
  );
};

export default UserManagement;
