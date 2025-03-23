
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardHeaderProps {
  onRefresh: () => void;
  onAddUser: () => void;
  isLoading: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  onRefresh, 
  onAddUser, 
  isLoading 
}) => {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-4 py-3">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="font-semibold text-lg text-irs-darkest">Admin Dashboard</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh} 
          className="hidden sm:flex"
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? "Loading..." : "Refresh"}
        </Button>
        <Button size="sm" onClick={onAddUser}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
