
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { generateRandomPassword } from './user-edit-form/utils';
import { User, UserFormData } from './user-edit-form/types';
import UserEditForm from './user-edit-form/UserEditForm';

type UserEditDialogProps = {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (user: User) => void;
  isCreateMode?: boolean;
  isProcessing?: boolean;
};

const UserEditDialog = ({
  user,
  open,
  onOpenChange,
  onSave,
  isCreateMode = false,
  isProcessing = false
}: UserEditDialogProps) => {
  const [formData, setFormData] = React.useState<UserFormData>({
    id: '',
    name: '',
    email: '',
    role: 'User',
    lastLogin: '',
    status: 'Active',
    taxDue: 0,
    filingDeadline: new Date(),
    availableCredits: 0
  });

  const [showResetPassword, setShowResetPassword] = React.useState(false);

  // Reset form data when the dialog opens or when user/mode changes
  React.useEffect(() => {
    if (open) {
      if (user) {
        // Editing existing user
        setFormData({
          ...user,
          taxDue: user.taxDue || 0,
          filingDeadline: user.filingDeadline ? new Date(user.filingDeadline) : new Date(),
          availableCredits: user.availableCredits || 0
        });
        setShowResetPassword(false);
      } else if (isCreateMode) {
        // Creating new user
        const newUserId = crypto.randomUUID();
        const initialPassword = generateRandomPassword();
        
        setFormData({
          id: newUserId,
          name: '',
          email: '',
          role: 'User',
          lastLogin: 'Never',
          status: 'Active',
          taxDue: 0,
          filingDeadline: new Date(),
          availableCredits: 0,
          password: initialPassword // Ensure password is set for new users
        });
        setShowResetPassword(true);
      }
    }
  }, [user, isCreateMode, open]);

  const dialogTitle = isCreateMode ? "Create New User" : "Edit User";
  const dialogDescription = isCreateMode 
    ? "Create a new user account with the following details." 
    : "Make changes to the user account details.";

  if ((!user && !isCreateMode)) return null;

  const handleSaveWrapper = (userData: User) => {
    // For create mode, ensure password exists
    if (isCreateMode && !userData.password) {
      console.error("Password is missing for new user");
      return;
    }
    
    console.log("Submitting user data:", {
      ...userData,
      password: userData.password ? "[REDACTED]" : undefined
    });
    
    onSave(userData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        
        <UserEditForm 
          formData={formData}
          setFormData={setFormData}
          onSave={handleSaveWrapper}
          onCancel={() => onOpenChange(false)}
          isCreateMode={isCreateMode}
          showResetPassword={showResetPassword}
          setShowResetPassword={setShowResetPassword}
          isProcessing={isProcessing}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserEditDialog;
