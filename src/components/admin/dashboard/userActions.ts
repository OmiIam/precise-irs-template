
import { User } from '@/components/admin/user-list/types';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useUserActions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleViewUser = (user: User) => {
    // Open user details in a modal or navigate to a user detail page
    toast({
      title: "User Details",
      description: `Viewing details for ${user.name}`,
    });
    
    // For now, we'll just show a toast, but this could navigate to a dedicated user view
    // navigate(`/admin/users/${user.id}`);
  };

  const handleImpersonateUser = (user: User) => {
    // Store the admin's impersonation action in localStorage
    localStorage.setItem('impersonating', 'true');
    localStorage.setItem('impersonatedUser', JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }));
    
    toast({
      title: "Impersonating User",
      description: `You are now viewing the dashboard as ${user.name}`,
    });
    
    // Navigate to the user dashboard
    navigate('/dashboard');
  };

  return {
    handleViewUser,
    handleImpersonateUser
  };
};
