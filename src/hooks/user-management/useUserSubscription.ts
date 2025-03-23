
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserSubscription = (fetchUsers: () => Promise<void>) => {
  useEffect(() => {
    // Set up Supabase realtime subscription
    const channel = supabase
      .channel('public:profiles')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles'
      }, () => {
        fetchUsers();
      })
      .subscribe();

    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchUsers]);
};
