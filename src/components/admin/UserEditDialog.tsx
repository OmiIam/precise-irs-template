
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
};

const UserEditDialog = ({
  user,
  open,
  onOpenChange,
  onSave,
  isCreateMode = false
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

  React.useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        taxDue: user.taxDue || 0,
        filingDeadline: user.filingDeadline ? new Date(user.filingDeadline) : new Date(),
        availableCredits: user.availableCredits || 0
      });
    } else if (isCreateMode) {
      const newUserId = `USER${Math.floor(100000 + Math.random() * 900000)}`;
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
        password: generateRandomPassword()
      });
      setShowResetPassword(true);
    }
  }, [user, isCreateMode]);

  const dialogTitle = isCreateMode ? "Create New User" : "Edit User";
  const dialogDescription = isCreateMode 
    ? "Create a new user account with the following details." 
    : "Make changes to the user account details.";

  if ((!user && !isCreateMode)) return null;

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
          onSave={onSave}
          onCancel={() => onOpenChange(false)}
          isCreateMode={isCreateMode}
          showResetPassword={showResetPassword}
          setShowResetPassword={setShowResetPassword}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserEditDialog;
