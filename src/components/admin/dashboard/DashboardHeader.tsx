
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardHeaderProps {
  onAddUser: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  onAddUser 
}) => {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-4 py-3">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="font-semibold text-lg text-irs-darkest">Admin Dashboard</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={onAddUser}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
