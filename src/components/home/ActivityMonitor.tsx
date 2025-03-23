
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useActivityTimer } from '@/hooks/user-management/useActivityTimer';

export const ActivityMonitor = () => {
  const { user } = useAuth();
  const { resetActivityTimer } = useActivityTimer();
  
  // If user is logged in, monitor their activity
  useEffect(() => {
    if (user) {
      const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart'];
      
      const handleUserActivity = () => {
        resetActivityTimer();
      };
      
      activityEvents.forEach(event => {
        window.addEventListener(event, handleUserActivity);
      });
      
      return () => {
        activityEvents.forEach(event => {
          window.removeEventListener(event, handleUserActivity);
        });
      };
    }
  }, [user, resetActivityTimer]);

  return null; // This component doesn't render anything
};
