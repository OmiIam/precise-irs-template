
import { useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useActivityTimer = () => {
  const { toast } = useToast();
  const activityTimerRef = useRef<number | null>(null);
  const inactivityTimeoutMs = 30 * 60 * 1000; // 30 minutes
  
  const resetActivityTimer = () => {
    if (activityTimerRef.current) {
      window.clearTimeout(activityTimerRef.current);
    }
    
    activityTimerRef.current = window.setTimeout(() => {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          handleInactivityLogout();
        }
      });
    }, inactivityTimeoutMs);
  };

  const handleInactivityLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Session expired",
        description: "You have been logged out due to inactivity.",
        variant: "destructive"
      });
      window.location.href = '/login';
    } catch (error) {
      console.error("Error during inactivity logout:", error);
    }
  };

  useEffect(() => {
    const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    
    const handleUserActivity = () => {
      resetActivityTimer();
    };
    
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });
    
    resetActivityTimer();
    
    return () => {
      if (activityTimerRef.current) {
        window.clearTimeout(activityTimerRef.current);
      }
      
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, []);

  return { resetActivityTimer };
};
