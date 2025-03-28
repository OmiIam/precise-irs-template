
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth';
import { Users, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const AdminOverview = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-irs-blue mr-2" />
              <p className="text-2xl font-bold">24</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Recent Filings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-2xl font-bold">7</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Open Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
              <p className="text-2xl font-bold">3</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>
            Welcome to the Revenue Service Finance administration panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-gray-700">System Status: Operational</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Quick Links</h3>
              <ul className="mt-2 space-y-1 text-sm text-irs-blue">
                <li className="hover:underline cursor-pointer">View System Logs</li>
                <li className="hover:underline cursor-pointer">Review Pending Approvals</li>
                <li className="hover:underline cursor-pointer">Configure System Settings</li>
                <li className="hover:underline cursor-pointer">Export Reports</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Administrative Account Information</h3>
              <div className="mt-1 space-y-1 text-sm">
                <p><span className="font-medium">Admin Email:</span> {user?.email}</p>
                <p><span className="font-medium">Last Login:</span> {new Date().toLocaleString()}</p>
                <p><span className="font-medium">Account Status:</span> <span className="text-green-600">Active</span></p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
