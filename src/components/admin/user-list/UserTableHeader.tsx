
import React from 'react';
import { TableHeader, TableHead, TableRow } from '@/components/ui/table';

const UserTableHeader: React.FC = () => {
  return (
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
  );
};

export default UserTableHeader;
