
'use client';

import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface AdminDashboardLayoutProps {
  activePage: string;
  children: React.ReactNode;
}

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({ 
  activePage,
  children 
}) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-irs-gray">
        <AdminSidebar activePage={activePage} />
        
        <SidebarInset className="p-0">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboardLayout;
