
import React, { useState } from 'react';
import UserEditDialog from '@/components/admin/UserEditDialog';
import { User } from '@/components/admin/user-list/types';
import { useToast } from '@/hooks/use-toast';

interface UserDialogContainerProps {
  onSaveUser: (user: User) => Promise<boolean>;
  onCreateUser: (user: User) => Promise<boolean>;
  children: (handlers: {
    handleEditUser: (user: User) => void;
    handleAddUser: () => void;
    dialogComponent: React.ReactNode;
  }) => React.ReactNode;
}

const UserDialogContainer: React.FC<UserDialogContainerProps> = ({ 
  onSaveUser,
  onCreateUser,
  children
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const { toast } = useToast();
  
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsCreateMode(false);
    setDialogOpen(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsCreateMode(true);
    setDialogOpen(true);
  };

  const handleSaveUser = async (updatedUser: User) => {
    try {
      let success;
      
      if (isCreateMode) {
        // Ensure password exists for create mode
        if (!updatedUser.password) {
          toast({
            title: "Error",
            description: "Password is required when creating a new user",
            variant: "destructive"
          });
          return;
        }
        
        success = await onCreateUser(updatedUser);
      } else {
        success = await onSaveUser(updatedUser);
      }
      
      if (success) {
        setDialogOpen(false);
      }
    } catch (error) {
      console.error("Error saving user:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  const dialogComponent = (
    <UserEditDialog 
      user={selectedUser} 
      open={dialogOpen} 
      onOpenChange={setDialogOpen}
      onSave={handleSaveUser}
      isCreateMode={isCreateMode}
    />
  );

  return (
    <>
      {children({
        handleEditUser,
        handleAddUser,
        dialogComponent
      })}
    </>
  );
};

export default UserDialogContainer;
