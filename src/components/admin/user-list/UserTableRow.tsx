
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, UserCheck, UserX, ShieldCheck, ShieldX } from 'lucide-react';
import { format } from "date-fns";
import { User } from './types';
import { formatCurrency } from './utils';

type UserTableRowProps = {
  user: User;
  onEditUser: (user: User) => void;
  onViewUser: (user: User) => void;
  onImpersonateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onToggleUserStatus: (userId: string) => void;
  onToggleUserRole: (userId: string) => void;
};

const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  onEditUser,
  onViewUser,
  onImpersonateUser,
  onDeleteUser,
  onToggleUserStatus,
  onToggleUserRole,
}) => {
  return (
    <TableRow>
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
  );
};

export default UserTableRow;
