
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
  const [isProcessing, setIsProcessing] = useState(false);
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
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      
      let success;
      
      if (isCreateMode) {
        // Ensure password exists for create mode
        if (!updatedUser.password) {
          toast({
            title: "Error",
            description: "Password is required when creating a new user",
            variant: "destructive"
          });
          setIsProcessing(false);
          return;
        }
        
        console.log("Attempting to create user:", {
          ...updatedUser,
          password: updatedUser.password ? "******" : undefined
        });
        
        success = await onCreateUser(updatedUser);
        console.log("User creation result:", success);
      } else {
        success = await onSaveUser(updatedUser);
      }
      
      if (success) {
        // Only close dialog and show success message if the operation was successful
        setDialogOpen(false);
        
        toast({
          title: isCreateMode ? "User Created" : "User Updated",
          description: isCreateMode 
            ? `New user ${updatedUser.name} has been created.` 
            : `Changes to user ${updatedUser.name} have been saved.`
        });
      } else {
        // If not successful, show an error message but don't close the dialog
        toast({
          title: "Operation Failed",
          description: isCreateMode 
            ? "Failed to create user. Please try again." 
            : "Failed to update user. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error saving user:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
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
