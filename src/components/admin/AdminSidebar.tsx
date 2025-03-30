
'use client';

import React from 'react';
import { 
  Users, 
  LayoutDashboard, 
  FileText, 
  Settings, 
  ShieldAlert, 
  Clock, 
  LogOut 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { signOut } from 'next-auth/react';

type SidebarLinkProps = {
  icon: React.ElementType;
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
};

const SidebarLink = ({ 
  icon: Icon, 
  label, 
  href, 
  onClick, 
  isActive = false 
}: SidebarLinkProps) => {
  const router = useRouter();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    }
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        onClick={handleClick} 
        isActive={isActive}
        tooltip={label}
      >
        <Icon size={20} />
        <span>{label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

type AdminSidebarProps = {
  activePage: string;
};

const AdminSidebar = ({ activePage }: AdminSidebarProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin panel",
    });
    router.push('/login');
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center px-3.5 py-4">
          <ShieldAlert className="h-6 w-6 text-irs-blue mr-2" />
          <div className="font-semibold text-lg">Admin Panel</div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarLink 
                icon={LayoutDashboard} 
                label="Dashboard" 
                href="/admin-dashboard"
                isActive={activePage === 'dashboard'} 
              />
              <SidebarLink 
                icon={Users} 
                label="User Management" 
                href="/admin-dashboard/users"
                isActive={activePage === 'users'} 
              />
              <SidebarLink 
                icon={FileText} 
                label="System Logs" 
                href="/admin-dashboard/logs"
                isActive={activePage === 'logs'} 
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarLink 
                icon={Settings} 
                label="Admin Settings" 
                href="/admin-dashboard/settings"
                isActive={activePage === 'settings'} 
              />
              <SidebarLink 
                icon={Clock} 
                label="Activity History" 
                href="/admin-dashboard/activity"
                isActive={activePage === 'activity'} 
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="px-3 py-2">
          <Button
            variant="outline"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
