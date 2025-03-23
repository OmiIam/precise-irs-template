
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, UserCheck, UserX, ShieldCheck, ShieldX } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SearchFilterBarProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
  roleFilter: string | null;
  setRoleFilter: (role: string | null) => void;
  clearFilters: () => void;
};

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  roleFilter,
  setRoleFilter,
  clearFilters
}) => {
  return (
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
  );
};

export default SearchFilterBar;
