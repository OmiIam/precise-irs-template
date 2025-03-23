
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/components/admin/user-list/types';

export const useUserActions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleViewUser = (user: User) => {
    toast({
      title: "Viewing User Details",
      description: `Accessing detailed information for ${user.name}`
    });
  };

  const handleImpersonateUser = (user: User) => {
    toast({
      title: "Impersonating User",
      description: `You are now viewing the system as ${user.name}`,
      variant: "default"
    });
    navigate('/dashboard');
  };

  return {
    handleViewUser,
    handleImpersonateUser
  };
};
