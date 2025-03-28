
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, CreditCard, DollarSign, FileText, HelpCircle, User } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow, format } from 'date-fns';
import DashboardWelcomeBanner from '@/components/dashboard/DashboardWelcomeBanner';
import DashboardQuickActions from '@/components/dashboard/DashboardQuickActions';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  tax_due: number;
  filing_deadline: string;
  available_credits: number;
  status: string;
  role: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast: hookToast } = useToast();
  const [impersonating, setImpersonating] = useState(false);
  const [impersonatedUser, setImpersonatedUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Check if we're impersonating a user
    const isImpersonating = localStorage.getItem('impersonating') === 'true';
    
    if (isImpersonating) {
      try {
        const userData = JSON.parse(localStorage.getItem('impersonatedUser') || '{}');
        if (userData.id) {
          setImpersonating(true);
          setImpersonatedUser(userData);
          
          hookToast({
            title: "Impersonation Mode",
            description: `You are viewing as ${userData.name} (${userData.email})`,
          });
        }
      } catch (error) {
        console.error("Error parsing impersonated user data:", error);
      }
    }
  }, [hookToast]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setUserProfile(data as UserProfile);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load your profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  const handleEndImpersonation = () => {
    localStorage.removeItem('impersonating');
    localStorage.removeItem('impersonatedUser');
    setImpersonating(false);
    setImpersonatedUser(null);
    navigate('/admin-dashboard');
    
    hookToast({
      title: "Impersonation Ended",
      description: "Returned to admin view",
    });
  };

  const handleFileNow = () => {
    navigate('/file');
  };

  const handlePayNow = () => {
    navigate('/pay');
  };

  const handleViewCredits = () => {
    navigate('/credits-deductions');
  };

  const handleContactSupport = () => {
    toast.info('Support request sent. A representative will contact you shortly.');
  };

  const currentUser = impersonating ? impersonatedUser : user;
  const fullName = userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : currentUser?.name || currentUser?.email;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTaxStatusColor = () => {
    if (!userProfile) return 'bg-gray-100';
    
    if (userProfile.status === 'Pending') return 'bg-yellow-50 border-yellow-200';
    if (userProfile.status === 'Overdue') return 'bg-red-50 border-red-200';
    return 'bg-green-50 border-green-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {impersonating && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You are impersonating <span className="font-medium">{impersonatedUser?.name}</span>
                  <button
                    onClick={handleEndImpersonation}
                    className="ml-3 font-medium text-yellow-700 underline"
                  >
                    End impersonation
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        <DashboardWelcomeBanner 
          fullName={fullName} 
          userStatus={userProfile?.status}
          filingDeadline={userProfile?.filing_deadline}
        />
        
        <main>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-irs-blue"></div>
            </div>
          ) : (
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {/* Tax Status Overview */}
              <div className={`rounded-lg border p-6 mb-6 ${getTaxStatusColor()}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Tax Filing Status</h2>
                    <p className="mt-1 text-gray-600">{userProfile?.status || 'Pending'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Filing Deadline</p>
                    <p className="font-medium">
                      {userProfile?.filing_deadline ? format(new Date(userProfile.filing_deadline), 'MMMM d, yyyy') : 'Not set'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
                {/* Amount Due Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-irs-blue" />
                      Amount Due
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">
                      {formatCurrency(userProfile?.tax_due || 0)}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {userProfile?.tax_due ? 'Payment needed before deadline' : 'No taxes due at this time'}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={handlePayNow}>
                      Pay Now
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Available Credits Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-irs-blue" />
                      Available Credits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">
                      {formatCurrency(userProfile?.available_credits || 0)}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {userProfile?.available_credits ? 'Credits available to apply to taxes' : 'No credits available'}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={handleViewCredits}>
                      View Credits & Deductions
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Filing Deadline Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium flex items-center">
                      <CalendarDays className="w-5 h-5 mr-2 text-irs-blue" />
                      Filing Deadline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">
                      {userProfile?.filing_deadline ? 
                        format(new Date(userProfile.filing_deadline), 'MMM d, yyyy') : 
                        'Not set'}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={handleFileNow}>
                      File Now
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              {/* Quick Actions */}
              <DashboardQuickActions 
                onFileNow={handleFileNow}
                onPayNow={handlePayNow}
                onCheckRefund={() => navigate('/refund-status')}
                onContactSupport={handleContactSupport}
              />
              
              {/* User Information */}
              <h2 className="text-xl font-semibold mb-4 mt-8">Account Information</h2>
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p className="mt-1 text-base font-medium">{fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="mt-1 text-base">{userProfile?.email || currentUser?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Account Status</p>
                        <p className="mt-1 text-base">{userProfile?.status || 'Active'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Account Type</p>
                        <p className="mt-1 text-base">{userProfile?.role || 'User'}</p>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Button variant="outline" className="mr-2" onClick={() => navigate('/forms-instructions')}>
                        Tax Forms & Instructions
                      </Button>
                      <Button variant="ghost" onClick={() => navigate('/refunds')}>
                        View Refund Options
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
