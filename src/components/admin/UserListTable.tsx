
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Edit, 
  Trash2, 
  Search, 
  UserCheck, 
  UserX, 
  Eye,
  ShieldCheck, 
  ShieldX, 
  Filter,
  DollarSign
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  status: string;
  taxDue?: number;
  filingDeadline?: Date;
  availableCredits?: number;
};

type UserListTableProps = {
  users: User[];
  onEditUser: (user: User) => void;
  onViewUser: (user: User) => void;
  onImpersonateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onToggleUserStatus: (userId: string) => void;
  onToggleUserRole: (userId: string) => void;
};

const UserListTable = ({ 
  users,
  onEditUser, 
  onViewUser, 
  onImpersonateUser,
  onDeleteUser,
  onToggleUserStatus,
  onToggleUserRole
}: UserListTableProps) => {
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

  const formatCurrency = (amount: number = 0) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <Filter className="mr-2 h-4 w-4" />
                Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter('Active')}>
                <UserCheck className="mr-2 h-4 w-4 text-green-500" />
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('Inactive')}>
                <UserX className="mr-2 h-4 w-4 text-red-500" />
                Inactive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                Clear Filter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <Filter className="mr-2 h-4 w-4" />
                Role
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setRoleFilter('Admin')}>
                <ShieldCheck className="mr-2 h-4 w-4 text-irs-blue" />
                Admin
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleFilter('User')}>
                <ShieldX className="mr-2 h-4 w-4" />
                User
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleFilter(null)}>
                Clear Filter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {(statusFilter !== null || roleFilter !== null || searchTerm !== '') && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-10">
              Clear All
            </Button>
          )}
        </div>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>User ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden sm:table-cell">Role</TableHead>
              <TableHead className="hidden lg:table-cell">Last Login</TableHead>
              <TableHead className="hidden md:table-cell">Tax Data</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'Admin' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'Admin' && <ShieldCheck className="mr-1 h-3 w-3" />}
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{user.lastLogin}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1 text-red-500" />
                        <span>Due: {formatCurrency(user.taxDue)}</span>
                      </div>
                      <div>
                        Deadline: {user.filingDeadline ? format(new Date(user.filingDeadline), "MM/dd/yyyy") : "N/A"}
                      </div>
                      <div>
                        Credits: {formatCurrency(user.availableCredits)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onViewUser(user)}
                        className="hidden sm:flex"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onToggleUserStatus(user.id)}
                        className="hidden md:flex"
                      >
                        {user.status === 'Active' ? 
                          <UserX className="h-4 w-4 text-red-500" /> : 
                          <UserCheck className="h-4 w-4 text-green-500" />
                        }
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onToggleUserRole(user.id)}
                        className="hidden lg:flex"
                      >
                        {user.role === 'Admin' ? 
                          <ShieldX className="h-4 w-4" /> : 
                          <ShieldCheck className="h-4 w-4 text-blue-500" />
                        }
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onImpersonateUser(user)}
                        className="text-irs-blue hover:text-irs-darkBlue"
                      >
                        <span className="sr-only sm:not-sr-only sm:inline-block sm:text-xs">Impersonate</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => onDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserListTable;
