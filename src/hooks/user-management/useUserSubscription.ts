
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserSubscription = (fetchUsers: () => Promise<void>) => {
  const channelRef = useRef<any>(null);

  useEffect(() => {
    // Set up Supabase realtime subscription
    const channel = supabase
      .channel('users-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'users'
      }, () => {
        // Only fetch users if there isn't already a fetch in progress
        fetchUsers();
      })
      .subscribe();
    
    channelRef.current = channel;

    // Clean up subscription on unmount
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [fetchUsers]);
};
