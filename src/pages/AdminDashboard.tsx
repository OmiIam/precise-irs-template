
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User',
    status: 'Active',
    taxDue: 0,
    availableCredits: 0,
    filingDeadline: new Date()
  });

  useEffect(() => {
    // Check admin access
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive"
      });
      navigate('/dashboard', { replace: true });
    }
    
    // Fetch users
    fetchUsers();
  }, [isAdmin, navigate, toast]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setUsers(data || []);
    } catch (error) {
      toast({
        title: "Error fetching users",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "Validation Error",
        description: "Name, email, and password are required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsCreating(true);
      
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: { userData: newUser }
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.success) {
        throw new Error(data.error || "Failed to create user");
      }
      
      toast({
        title: "Success",
        description: `User ${newUser.name} created successfully`
      });
      
      // Reset form and refresh user list
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'User',
        status: 'Active',
        taxDue: 0,
        availableCredits: 0,
        filingDeadline: new Date()
      });
      
      setShowAddUserForm(false);
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error creating user",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="mb-6">
        <Button onClick={() => setShowAddUserForm(!showAddUserForm)}>
          {showAddUserForm ? "Cancel" : "Add New User"}
        </Button>
      </div>
      
      {showAddUserForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New User</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={newUser.name} 
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={newUser.email} 
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={newUser.password} 
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    placeholder="********"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={newUser.role} 
                    onValueChange={(value) => setNewUser({...newUser, role: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="User">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={newUser.status} 
                    onValueChange={(value) => setNewUser({...newUser, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="taxDue">Tax Due</Label>
                  <Input 
                    id="taxDue" 
                    type="number"
                    value={newUser.taxDue} 
                    onChange={(e) => setNewUser({...newUser, taxDue: parseFloat(e.target.value) || 0})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="availableCredits">Available Credits</Label>
                  <Input 
                    id="availableCredits" 
                    type="number"
                    value={newUser.availableCredits} 
                    onChange={(e) => setNewUser({...newUser, availableCredits: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddUserForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create User"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>User List ({isLoading ? "Loading..." : users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-6">Loading users...</div>
          ) : users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Due</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.first_name} {user.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${user.tax_due ? user.tax_due.toFixed(2) : '0.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6">No users found</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
