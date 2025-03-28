
import React, { useState } from 'react';
import { useAdmin } from '@/contexts/admin/AdminContext';
import { User } from '@/types/user';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import BasicInfoSection from './user-edit-form/BasicInfoSection';
import RoleStatusSection from './user-edit-form/RoleStatusSection';
import TaxDataSection from './user-edit-form/TaxDataSection';
import PasswordSection from './user-edit-form/PasswordSection';
import { UserFormData } from './user-edit-form/types';
import { generateRandomPassword } from './user-edit-form/utils';

interface UserFormProps {
  mode: 'create' | 'edit';
  initialData?: User;
  onSuccess: () => void;
}

const UserFormRefactored: React.FC<UserFormProps> = ({ mode, initialData, onSuccess }) => {
  const { createUser, updateUser } = useAdmin();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(mode === 'create');
  
  // Initialize form data
  const [formData, setFormData] = useState<UserFormData>(() => {
    if (mode === 'edit' && initialData) {
      return {
        id: initialData.id,
        name: initialData.name || '',
        email: initialData.email,
        role: initialData.role || 'User',
        status: initialData.status || 'Active',
        taxDue: initialData.taxDue || 0,
        availableCredits: initialData.availableCredits || 0,
        filingDeadline: initialData.filingDeadline || new Date()
      };
    }
    return {
      id: crypto.randomUUID(),
      name: '',
      email: '',
      role: 'User',
      status: 'Active',
      taxDue: 0,
      availableCredits: 0,
      filingDeadline: new Date(),
      password: generateRandomPassword()
    };
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let success = false;
      
      if (mode === 'create') {
        if (!formData.email || !formData.password) {
          throw new Error('Email and password are required');
        }
        success = await createUser(formData as (UserFormData & { password: string }));
      } else if (mode === 'edit' && initialData?.id) {
        success = await updateUser(formData as User);
      }
      
      if (success) {
        toast({
          title: mode === 'create' ? 'User created' : 'User updated',
          description: `User was successfully ${mode === 'create' ? 'created' : 'updated'}.`,
        });
        onSuccess();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 py-4">
        {/* Basic Information Section */}
        <BasicInfoSection 
          formData={formData} 
          handleChange={handleChange} 
        />
        
        {/* Role and Status Section */}
        <RoleStatusSection 
          formData={formData} 
          handleSelectChange={handleSelectChange} 
        />
        
        {/* Tax Information Section */}
        <TaxDataSection 
          formData={formData} 
          handleChange={handleChange} 
          handleDateChange={handleDateChange} 
        />
        
        {/* Password (only for create mode or explicit reset) */}
        {(mode === 'create' || showResetPassword) && (
          <PasswordSection 
            formData={formData}
            showResetPassword={showResetPassword}
            setShowResetPassword={setShowResetPassword}
            setFormData={setFormData}
          />
        )}
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : mode === 'create' ? 'Create User' : 'Update User'}
        </Button>
      </div>
    </form>
  );
};

export default UserFormRefactored;
