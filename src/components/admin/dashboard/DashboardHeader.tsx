
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, UserPlus } from 'lucide-react';

interface DashboardHeaderProps {
  onAddUser: () => void;
  isCreatingUser?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  onAddUser,
  isCreatingUser = false 
}) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div>
        <h1 className="text-xl font-semibold text-irs-darkest">Admin Dashboard</h1>
        <p className="text-sm text-irs-gray">Manage users and system settings</p>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          onClick={onAddUser} 
          className="bg-irs-blue hover:bg-irs-darkBlue"
          disabled={isCreatingUser}
        >
          {isCreatingUser ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating User...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
