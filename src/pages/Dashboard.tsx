
import React, { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  BarChart3, 
  Calendar, 
  DollarSign, 
  Download, 
  FileText, 
  LayoutDashboard, 
  Menu, 
  Percent, 
  RefreshCw, 
  Settings, 
  UserCircle 
} from 'lucide-react';
import { InfoCard } from '@/components/InfoCard';
import { cn } from '@/lib/utils';
import { useActivityTimer } from '@/hooks/user-management/useActivityTimer';

const Dashboard = () => {
  const { resetActivityTimer } = useActivityTimer();
  
  // Reset activity timer on any user interaction with the page
  useEffect(() => {
    // Set up event listeners for dashboard activity
    const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    
    const handleUserActivity = () => {
      resetActivityTimer();
    };
    
    // Add event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });
    
    // Clean up event listeners on unmount
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [resetActivityTimer]);

  // Mock data for the tax information
  const taxData = {
    totalDue: 4250.75,
    lastUpdated: 'March 20, 2023',
    filingDeadline: 'April 15, 2023',
    refundStatus: 'Pending',
    taxCredits: [
      { name: 'Earned Income Credit', amount: 1500 },
      { name: 'Child Tax Credit', amount: 2000 },
      { name: 'Education Credit', amount: 500 },
    ],
    recentForms: [
      { id: 'W-2', name: 'Wage and Tax Statement', date: 'Jan 31, 2023' },
      { id: '1099-INT', name: 'Interest Income', date: 'Feb 10, 2023' },
      { id: '1098-E', name: 'Student Loan Interest', date: 'Feb 15, 2023' },
    ]
  };

  return (
    <div className="min-h-screen bg-irs-gray">
      <Header />
      
      <div className="container mx-auto pt-32 pb-20 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar for larger screens */}
          <aside className="hidden md:block w-64 space-y-4">
            <Card className="border-irs-lightGray">
              <CardContent className="p-4">
                <div className="space-y-1 py-2">
                  <h3 className="font-medium text-irs-darkest">John Doe</h3>
                  <p className="text-sm text-irs-darkGray">ID: 123-45-6789</p>
                </div>
                
                <nav className="space-y-1 mt-6">
                  <SidebarLink active icon={LayoutDashboard} href="#" label="Dashboard" />
                  <SidebarLink icon={FileText} href="#" label="Tax Forms" />
                  <SidebarLink icon={DollarSign} href="#" label="Payments" />
                  <SidebarLink icon={Calendar} href="#" label="Deadlines" />
                  <SidebarLink icon={UserCircle} href="#" label="Profile" />
                  <SidebarLink icon={Settings} href="#" label="Settings" />
                </nav>
              </CardContent>
            </Card>
          </aside>
          
          {/* Mobile sidebar */}
          <div className="md:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex justify-between items-center">
                  <span className="flex items-center">
                    <Menu className="mr-2 h-4 w-4" />
                    Navigation
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="space-y-1 py-2">
                  <h3 className="font-medium text-irs-darkest">John Doe</h3>
                  <p className="text-sm text-irs-darkGray">ID: 123-45-6789</p>
                </div>
                
                <nav className="space-y-1 mt-6">
                  <SidebarLink active icon={LayoutDashboard} href="#" label="Dashboard" />
                  <SidebarLink icon={FileText} href="#" label="Tax Forms" />
                  <SidebarLink icon={DollarSign} href="#" label="Payments" />
                  <SidebarLink icon={Calendar} href="#" label="Deadlines" />
                  <SidebarLink icon={UserCircle} href="#" label="Profile" />
                  <SidebarLink icon={Settings} href="#" label="Settings" />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Main content */}
          <main className="flex-1">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-irs-darkest mb-2">Dashboard</h1>
              <p className="text-irs-darkGray">
                Welcome back, John. Here's your tax summary for 2023.
              </p>
            </div>
            
            {/* Tax Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <InfoCard 
                title="Total Tax Due" 
                description={`$${taxData.totalDue.toLocaleString()}`}
                ctaText="Make a payment"
                ctaLink="#"
                variant="featured"
                icon={<DollarSign size={20} />}
              />
              
              <InfoCard 
                title="Filing Deadline" 
                description={taxData.filingDeadline}
                ctaText="View calendar"
                ctaLink="#"
                icon={<Calendar size={20} />}
              />
              
              <InfoCard 
                title="Available Credits" 
                description={`$${taxData.taxCredits.reduce((sum, credit) => sum + credit.amount, 0).toLocaleString()}`}
                ctaText="See all credits"
                ctaLink="#"
                icon={<Percent size={20} />}
              />
            </div>
            
            {/* Recent Forms and Refund Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="border-irs-lightGray">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Recent Forms</CardTitle>
                  <CardDescription>Your most recent tax documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {taxData.recentForms.map((form) => (
                      <li key={form.id} className="flex justify-between items-center py-2 border-b border-irs-lightGray">
                        <div>
                          <p className="font-medium text-irs-darkest">{form.id}</p>
                          <p className="text-sm text-irs-darkGray">{form.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-irs-darkGray">{form.date}</span>
                          <Button size="sm" variant="ghost" className="p-1 h-auto">
                            <Download size={16} />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  <Button variant="outline" className="w-full mt-4 text-irs-blue">
                    View All Documents
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-irs-lightGray">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Refund Status</CardTitle>
                  <CardDescription>Track your refund</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <RefreshCw size={40} className="text-irs-blue mb-4" />
                    <h3 className="text-lg font-semibold text-irs-darkest mb-1">
                      {taxData.refundStatus}
                    </h3>
                    <p className="text-sm text-irs-darkGray mb-4">
                      Your refund is being processed
                    </p>
                    <Button variant="outline" className="text-irs-blue">
                      Check Status
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Additional Information */}
            <Card className="border-irs-lightGray">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Tax Summary</CardTitle>
                <CardDescription>Last updated: {taxData.lastUpdated}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-irs-darkGray">
                    Your tax information is up to date. Below is a summary of your tax credits for the current year.
                  </p>
                  
                  <div className="space-y-2">
                    {taxData.taxCredits.map((credit) => (
                      <div key={credit.name} className="flex justify-between py-2 border-b border-irs-lightGray">
                        <span className="font-medium">{credit.name}</span>
                        <span className="text-irs-darkBlue font-medium">${credit.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between py-2 font-bold">
                      <span>Total Credits</span>
                      <span className="text-irs-blue">${taxData.taxCredits.reduce((sum, credit) => sum + credit.amount, 0).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" className="flex items-center gap-2">
                      <BarChart3 size={16} />
                      View Full Report
                    </Button>
                    <Button className="bg-irs-blue text-white hover:bg-irs-darkBlue flex items-center gap-2">
                      Download PDF <Download size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

// Helper component for sidebar links
const SidebarLink = ({ 
  icon: Icon, 
  href, 
  label, 
  active 
}: { 
  icon: React.ElementType; 
  href: string; 
  label: string; 
  active?: boolean;
}) => (
  <a 
    href={href} 
    className={cn(
      "flex items-center py-2 px-3 rounded-md text-sm transition-colors",
      active 
        ? "bg-irs-blue/10 text-irs-blue font-medium" 
        : "text-irs-darkGray hover:bg-irs-gray hover:text-irs-darkBlue"
    )}
  >
    <Icon size={18} className="mr-2" />
    {label}
  </a>
);

export default Dashboard;
