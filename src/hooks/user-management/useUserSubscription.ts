
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserSubscription = (fetchUsers: () => Promise<void>) => {
  const channelRef = useRef<any>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    console.log('Setting up Supabase realtime subscription for profiles table');
    
    // Set up Supabase realtime subscription
    const channel = supabase
      .channel('profiles-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles'
      }, (payload) => {
        console.log('Profiles table changed, refreshing user list with payload:', payload);
        // Fetch users when a change is detected
        fetchUsers();
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
        setIsSubscribed(status === 'SUBSCRIBED');
      });
    
    channelRef.current = channel;

    // Clean up subscription on unmount
    return () => {
      console.log('Cleaning up Supabase realtime subscription');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [fetchUsers]);

  return { isSubscribed };
};
