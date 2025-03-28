
import React from 'react';
import { Clock, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DashboardWelcomeBannerProps {
  fullName: string;
  userStatus?: string;
  filingDeadline?: string | null;
}

const DashboardWelcomeBanner: React.FC<DashboardWelcomeBannerProps> = ({ 
  fullName, 
  userStatus = 'Pending',
  filingDeadline
}) => {
  const getStatusColor = () => {
    if (userStatus === 'Pending') return 'bg-yellow-50 border-yellow-200';
    if (userStatus === 'Overdue') return 'bg-red-50 border-red-200';
    return 'bg-green-50 border-green-200';
  };

  const getDeadlineText = () => {
    if (!filingDeadline) return 'No deadline set';
    
    const deadline = new Date(filingDeadline);
    const today = new Date();
    
    if (deadline < today) {
      return `Overdue by ${formatDistanceToNow(deadline, { addSuffix: false })}`;
    }
    
    return `Due in ${formatDistanceToNow(deadline, { addSuffix: false })}`;
  };

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="bg-white shadow rounded-lg mb-6">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {getTimeOfDayGreeting()}, {fullName}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Here's an overview of your tax information and pending actions
            </p>
          </div>
          
          {filingDeadline && (
            <div className={`mt-3 sm:mt-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
              <Clock className="w-4 h-4 mr-1" />
              {getDeadlineText()}
            </div>
          )}
        </div>
        
        {userStatus === 'Pending' && (
          <div className="mt-4 flex items-start bg-blue-50 border border-blue-200 rounded-md p-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Complete your profile</h3>
              <p className="text-sm text-blue-600 mt-1">To ensure accurate tax calculations, please complete your profile information.</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardWelcomeBanner;
