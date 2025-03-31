
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/components/admin/user-list/utils';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [impersonating, setImpersonating] = useState(false);
  const [impersonatedUser, setImpersonatedUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we're impersonating a user
    const isImpersonating = localStorage.getItem('impersonating') === 'true';
    
    if (isImpersonating) {
      try {
        const userData = JSON.parse(localStorage.getItem('impersonatedUser') || '{}');
        if (userData.id) {
          setImpersonating(true);
          setImpersonatedUser(userData);
          
          // Fetch complete profile data for the impersonated user
          fetchUserProfile(userData.id);
          
          toast({
            title: "Impersonation Mode",
            description: `You are viewing as ${userData.name} (${userData.email})`,
          });
        }
      } catch (error) {
        console.error("Error parsing impersonated user data:", error);
      }
    } else if (user) {
      // Fetch user profile data if not impersonating
      fetchUserProfile(user.id);
    }
  }, [user, toast]);

  const fetchUserProfile = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching user profile:", error);
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive"
        });
      } else if (data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error("Unexpected error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEndImpersonation = () => {
    localStorage.removeItem('impersonating');
    localStorage.removeItem('impersonatedUser');
    setImpersonating(false);
    setImpersonatedUser(null);
    setUserProfile(null);
    navigate('/admin-dashboard');
    
    toast({
      title: "Impersonation Ended",
      description: "Returned to admin view",
    });
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid date';
    }
  };

  const currentUser = impersonating ? impersonatedUser : user;
  const displayName = userProfile ? 
    `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() : 
    (currentUser?.name || currentUser?.email || 'User');

  return (
    <div className="min-h-screen bg-gray-50">
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

        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          </div>
        </header>
        
        <main>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {loading ? (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">User Information</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="mt-1 text-lg">{displayName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="mt-1 text-lg">{userProfile?.email || currentUser?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Role</p>
                      <p className="mt-1 text-lg">{userProfile?.role || "User"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Tax Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm font-medium text-gray-500">Tax Due</p>
                      <p className="mt-1 text-2xl font-semibold text-blue-600">
                        {formatCurrency(userProfile?.tax_due || 0)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm font-medium text-gray-500">Filing Deadline</p>
                      <p className="mt-1 text-lg">
                        {userProfile?.filing_deadline ? 
                          formatDate(userProfile.filing_deadline) : 
                          'Not set'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm font-medium text-gray-500">Available Credits</p>
                      <p className="mt-1 text-2xl font-semibold text-green-600">
                        {formatCurrency(userProfile?.available_credits || 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
