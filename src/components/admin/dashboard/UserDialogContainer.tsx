
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
    if (isProcessing) {
      console.log("Ignoring request - already processing");
      return;
    }
    
    try {
      setIsProcessing(true);
      console.log("Processing user data...");
      
      let success = false;
      
      if (isCreateMode) {
        // Validate required fields for new users
        if (!updatedUser.name?.trim()) {
          toast({
            title: "Validation Error",
            description: "Name is required",
            variant: "destructive"
          });
          setIsProcessing(false);
          return;
        }
        
        if (!updatedUser.email?.trim()) {
          toast({
            title: "Validation Error",
            description: "Email is required",
            variant: "destructive"
          });
          setIsProcessing(false);
          return;
        }
        
        // Ensure password exists for create mode
        if (!updatedUser.password) {
          toast({
            title: "Validation Error",
            description: "Password is required when creating a new user",
            variant: "destructive"
          });
          setIsProcessing(false);
          return;
        }
        
        console.log("Attempting to create user:", {
          ...updatedUser,
          password: updatedUser.password ? "[REDACTED]" : undefined
        });
        
        success = await onCreateUser(updatedUser);
        console.log("User creation result:", success);
      } else {
        success = await onSaveUser(updatedUser);
      }
      
      if (success) {
        // Only close dialog if the operation was successful
        setDialogOpen(false);
      }
    } catch (error) {
      console.error("Error processing user:", error);
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
      isProcessing={isProcessing}
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
