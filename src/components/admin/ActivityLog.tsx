
import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, CheckCircle, User, FileText, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, formatDistanceToNow } from 'date-fns';

type ActivityLogItem = {
  id: string;
  user_id: string;
  action: string;
  details: any;
  created_at: string;
  user?: {
    email: string;
    name: string;
  };
};

const ActivityLog = () => {
  const [activities, setActivities] = useState<ActivityLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        // Fetch the most recent 10 activities
        const { data, error } = await supabase
          .from('activity_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;

        // Fetch user details for each activity
        const activitiesWithUsers = await Promise.all(
          data.map(async (activity) => {
            const { data: userData, error: userError } = await supabase
              .from('profiles')
              .select('first_name, last_name, email')
              .eq('id', activity.user_id)
              .single();

            if (userError || !userData) {
              return {
                ...activity,
                user: { 
                  name: 'Unknown User', 
                  email: 'unknown@example.com' 
                }
              };
            }

            return {
              ...activity,
              user: {
                name: `${userData.first_name} ${userData.last_name}`,
                email: userData.email
              }
            };
          })
        );

        setActivities(activitiesWithUsers);
      } catch (error) {
        console.error("Error fetching activity logs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();

    // Set up realtime subscription for activity logs
    const channel = supabase
      .channel('public:activity_logs')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'activity_logs'
      }, (payload) => {
        fetchActivities(); // Refresh data when new activity is added
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'USER_LOGIN':
        return <User className="h-4 w-4 text-green-500" />;
      case 'USER_SIGNUP':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'ID_VERIFICATION_COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'ROLE_UPDATED':
        return <Shield className="h-4 w-4 text-purple-500" />;
      case 'DOCUMENT_UPLOADED':
        return <FileText className="h-4 w-4 text-indigo-500" />;
      case 'ERROR':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityTitle = (activity: ActivityLogItem) => {
    const userName = activity.user?.name || 'Unknown User';
    
    switch (activity.action) {
      case 'USER_LOGIN':
        return `${userName} logged in`;
      case 'USER_SIGNUP':
        return `${userName} signed up`;
      case 'ID_VERIFICATION_COMPLETED':
        return `${userName} completed ID verification`;
      case 'ROLE_UPDATED':
        return `User role updated for ${userName}`;
      case 'DOCUMENT_UPLOADED':
        return `${userName} uploaded a document`;
      case 'ERROR':
        return `Error occurred for ${userName}`;
      default:
        return `${activity.action} by ${userName}`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-irs-darkest">Activity Log</h3>
      </div>
      
      <div className="space-y-4 overflow-hidden">
        {isLoading ? (
          Array(5).fill(0).map((_, i) => (
            <div 
              key={i} 
              className="animate-pulse flex items-start gap-3 p-2"
            >
              <div className="h-8 w-8 rounded-full bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))
        ) : activities.length > 0 ? (
          activities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-start gap-3 p-2 border-b border-gray-100 last:border-0"
            >
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                {getActivityIcon(activity.action)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-irs-darkest">
                  {getActivityTitle(activity)}
                </p>
                <p className="text-xs text-irs-darkGray mt-1">
                  {formatDistanceToNow(new Date(activity.created_at))} ago · 
                  {format(new Date(activity.created_at), " MMM d, h:mm a")}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-irs-darkGray">
            <p>No activity recorded yet</p>
          </div>
        )}
      </div>
      
      <div className="text-center mt-2">
        <button className="text-sm text-irs-blue hover:text-irs-darkBlue font-medium">
          View All Activity
        </button>
      </div>
    </div>
  );
};

export default ActivityLog;
