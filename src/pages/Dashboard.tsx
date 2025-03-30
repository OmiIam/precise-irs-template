import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [impersonating, setImpersonating] = useState(false);
  const [impersonatedUser, setImpersonatedUser] = useState<any>(null);

  useEffect(() => {
    // Check if we're impersonating a user
    const isImpersonating = localStorage.getItem('impersonating') === 'true';
    
    if (isImpersonating) {
      try {
        const userData = JSON.parse(localStorage.getItem('impersonatedUser') || '{}');
        if (userData.id) {
          setImpersonating(true);
          setImpersonatedUser(userData);
          
          toast({
            title: "Impersonation Mode",
            description: `You are viewing as ${userData.name} (${userData.email})`,
          });
        }
      } catch (error) {
        console.error("Error parsing impersonated user data:", error);
      }
    }
  }, [toast]);

  const handleEndImpersonation = () => {
    localStorage.removeItem('impersonating');
    localStorage.removeItem('impersonatedUser');
    setImpersonating(false);
    setImpersonatedUser(null);
    navigate('/admin-dashboard');
    
    toast({
      title: "Impersonation Ended",
      description: "Returned to admin view",
    });
  };

  const currentUser = impersonating ? impersonatedUser : user;

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
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">User Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="mt-1 text-lg">{currentUser?.name || currentUser?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="mt-1 text-lg">{currentUser?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Role</p>
                  <p className="mt-1 text-lg">{currentUser?.role || "User"}</p>
                </div>
                {/* Add more user details here as needed */}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
