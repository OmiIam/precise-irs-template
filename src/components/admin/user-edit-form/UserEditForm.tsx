
import React from 'react';
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UserFormData, User } from './types';
import BasicInfoSection from './BasicInfoSection';
import PasswordSection from './PasswordSection';
import RoleStatusSection from './RoleStatusSection';
import TaxDataSection from './TaxDataSection';
import { Loader2 } from 'lucide-react';

type UserEditFormProps = {
  formData: UserFormData;
  setFormData: React.Dispatch<React.SetStateAction<UserFormData>>;
  onSave: (user: User) => void;
  onCancel: () => void;
  isCreateMode: boolean;
  showResetPassword: boolean;
  setShowResetPassword: React.Dispatch<React.SetStateAction<boolean>>;
  isProcessing?: boolean;
};

const UserEditForm = ({
  formData,
  setFormData,
  onSave,
  onCancel,
  isCreateMode,
  showResetPassword,
  setShowResetPassword,
  isProcessing = false
}: UserEditFormProps) => {
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric inputs
    if (name === 'taxDue' || name === 'availableCredits') {
      // Allow empty fields to be truly empty, not zero
      const numericValue = value === '' ? undefined : parseFloat(value);
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
    
    // Validate required fields
    if (!formData.name || !formData.name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.email || !formData.email.trim()) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive"
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    // Validate password for new users
    if (isCreateMode && (!formData.password || formData.password.length < 6)) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
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
        <Button type="button" variant="outline" onClick={onCancel} disabled={isProcessing}>
          Cancel
        </Button>
        <Button type="submit" disabled={isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isCreateMode ? "Creating..." : "Saving..."}
            </>
          ) : (
            isCreateMode ? "Create User" : "Save Changes"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default UserEditForm;
