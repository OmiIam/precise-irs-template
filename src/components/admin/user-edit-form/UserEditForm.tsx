
import React from 'react';
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UserFormData, User } from './types';
import BasicInfoSection from './BasicInfoSection';
import PasswordSection from './PasswordSection';
import RoleStatusSection from './RoleStatusSection';
import TaxDataSection from './TaxDataSection';

type UserEditFormProps = {
  formData: UserFormData;
  setFormData: React.Dispatch<React.SetStateAction<UserFormData>>;
  onSave: (user: User) => void;
  onCancel: () => void;
  isCreateMode: boolean;
  showResetPassword: boolean;
  setShowResetPassword: React.Dispatch<React.SetStateAction<boolean>>;
};

const UserEditForm = ({
  formData,
  setFormData,
  onSave,
  onCancel,
  isCreateMode,
  showResetPassword,
  setShowResetPassword
}: UserEditFormProps) => {
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric inputs
    if (name === 'taxDue' || name === 'availableCredits') {
      const numericValue = value === '' ? 0 : parseFloat(value);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, filingDeadline: date }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Name and email are required fields",
        variant: "destructive"
      });
      return;
    }

    // Remove the password field before saving to user object
    const { password, ...userDataToSave } = formData;
    
    onSave(userDataToSave);
    
    if (isCreateMode) {
      toast({
        title: "User Created",
        description: `New user ${formData.name} has been created.`
      });
    } else {
      toast({
        title: "User Updated",
        description: `Changes to user ${formData.name} have been saved.`
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <BasicInfoSection 
          formData={formData} 
          handleChange={handleChange} 
        />
        
        <PasswordSection 
          formData={formData}
          showResetPassword={showResetPassword}
          setShowResetPassword={setShowResetPassword}
          setFormData={setFormData}
        />
        
        <RoleStatusSection 
          formData={formData} 
          handleSelectChange={handleSelectChange} 
        />
        
        <TaxDataSection 
          formData={formData} 
          handleChange={handleChange}
          handleDateChange={handleDateChange}
        />
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isCreateMode ? "Create User" : "Save Changes"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default UserEditForm;
