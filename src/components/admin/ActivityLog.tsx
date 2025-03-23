
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  User, 
  ShieldAlert, 
  Edit, 
  Trash2, 
  UserCheck, 
  Lock, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';

// Mock activity log data
const MOCK_ACTIVITIES = [
  {
    id: '1',
    action: 'User Created',
    user: 'Admin (Jane Smith)',
    target: 'Michael Brown',
    timestamp: '2023-06-15 14:23:45',
    details: 'Created new user account',
    icon: User
  },
  {
    id: '2',
    action: 'Permission Changed',
    user: 'Admin (Jane Smith)',
    target: 'Robert Johnson',
    timestamp: '2023-06-15 13:45:12',
    details: 'Changed user role from User to Admin',
    icon: ShieldCheck
  },
  {
    id: '3',
    action: 'Data Modified',
    user: 'Admin (Jane Smith)',
    target: 'John Doe',
    timestamp: '2023-06-15 11:32:08',
    details: 'Updated tax filing deadline',
    icon: Edit
  },
  {
    id: '4',
    action: 'User Deleted',
    user: 'Admin (Jane Smith)',
    target: 'Sarah Wilson',
    timestamp: '2023-06-14 16:54:21',
    details: 'Removed user account',
    icon: Trash2
  },
  {
    id: '5',
    action: 'Status Updated',
    user: 'Admin (Jane Smith)',
    target: 'Emily Williams',
    timestamp: '2023-06-14 10:15:33',
    details: 'Changed user status to Active',
    icon: UserCheck
  },
  {
    id: '6',
    action: 'Security Alert',
    user: 'System',
    target: 'Admin Panel',
    timestamp: '2023-06-14 08:02:17',
    details: 'Multiple failed login attempts detected',
    icon: ShieldAlert
  },
  {
    id: '7',
    action: 'Password Reset',
    user: 'Admin (Jane Smith)',
    target: 'Robert Johnson',
    timestamp: '2023-06-13 15:48:29',
    details: 'Initiated password reset for user',
    icon: Lock
  }
];

const ActivityLog = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-irs-darkest">Recent Activity</h2>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-4 w-4" />
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[100px]">Action</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="hidden md:table-cell">Target</TableHead>
              <TableHead className="hidden sm:table-cell">Timestamp</TableHead>
              <TableHead className="hidden lg:table-cell">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_ACTIVITIES.map((activity) => {
              const ActivityIcon = activity.icon;
              return (
                <TableRow key={activity.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-irs-gray p-1.5">
                        <ActivityIcon className="h-4 w-4 text-irs-darkBlue" />
                      </div>
                      <span className="hidden sm:inline">{activity.action}</span>
                    </div>
                  </TableCell>
                  <TableCell>{activity.user}</TableCell>
                  <TableCell className="hidden md:table-cell">{activity.target}</TableCell>
                  <TableCell className="hidden sm:table-cell">{activity.timestamp}</TableCell>
                  <TableCell className="hidden lg:table-cell">{activity.details}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ActivityLog;
