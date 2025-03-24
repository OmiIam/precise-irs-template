
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserSubscription = (handleDataChange: () => Promise<void>) => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    console.log("Setting up realtime subscription for user changes");
    
    // Enable the subscription 
    const channel = supabase
      .channel('public:profiles')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles' 
        }, 
        async (payload) => {
          console.log('Change received!', payload);
          // Trigger data refresh when changes are detected
          await handleDataChange();
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
        setIsSubscribed(status === 'SUBSCRIBED');
      });

    return () => {
      console.log("Cleaning up realtime subscription");
      supabase.removeChannel(channel);
    };
  }, [handleDataChange]);

  return { isSubscribed };
};
