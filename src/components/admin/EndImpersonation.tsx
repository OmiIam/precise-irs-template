
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserX } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const EndImpersonation: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isImpersonating, setIsImpersonating] = React.useState(false);
  
  // Check if there's an admin session stored in localStorage
  React.useEffect(() => {
    const adminSession = localStorage.getItem('admin_session');
    setIsImpersonating(!!adminSession);
  }, []);
  
  if (!isImpersonating) {
    return null;
  }
  
  const handleEndImpersonation = async () => {
    try {
      // Retrieve the original admin session
      const adminSessionString = localStorage.getItem('admin_session');
      if (!adminSessionString) {
        throw new Error('No admin session found');
      }
      
      const adminSession = JSON.parse(adminSessionString);
      
      // Sign out the current (impersonated) user
      await supabase.auth.signOut();
      
      // Restore the admin session
      await supabase.auth.setSession({
        access_token: adminSession.access_token,
        refresh_token: adminSession.refresh_token,
      });
      
      // Clear the stored admin session
      localStorage.removeItem('admin_session');
      
      toast({
        title: 'Impersonation Ended',
        description: 'You have returned to your admin account.',
      });
      
      // Navigate back to the admin dashboard
      navigate('/admin');
    } catch (error) {
      console.error('Error ending impersonation:', error);
      toast({
        title: 'Error',
        description: 'Failed to end impersonation. Try signing out and back in as admin.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Button
      variant="destructive"
      size="sm"
      className="flex items-center gap-2 fixed bottom-4 right-4 z-50"
      onClick={handleEndImpersonation}
    >
      <UserX size={16} />
      End Impersonation
    </Button>
  );
};
