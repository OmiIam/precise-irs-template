
import React, { useState } from 'react';
import { useAdmin } from '@/contexts/admin/AdminContext';
import { User } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon, KeyRound, Copy, Eye, EyeOff } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface UserFormProps {
  mode: 'create' | 'edit';
  initialData?: User;
  onSuccess: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ mode, initialData, onSuccess }) => {
  const { createUser, updateUser } = useAdmin();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState<Partial<User> & { password?: string }>(() => {
    if (mode === 'edit' && initialData) {
      return { ...initialData };
    }
    return {
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

  function generateRandomPassword(length = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

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
        success = await createUser(formData as (Partial<User> & { password: string }));
      } else if (mode === 'edit' && initialData?.id) {
        success = await updateUser({ ...formData, id: initialData.id } as User);
      }
      
      if (success) {
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

  const handleCopyPassword = () => {
    if (formData.password) {
      navigator.clipboard.writeText(formData.password);
      toast({
        title: 'Password Copied',
        description: 'Password has been copied to clipboard'
      });
    }
  };

  const handleGeneratePassword = () => {
    setFormData(prev => ({ ...prev, password: generateRandomPassword() }));
  };

  // Convert filingDeadline to a proper Date object
  const selectedDate = formData.filingDeadline ? 
    (formData.filingDeadline instanceof Date ? 
      formData.filingDeadline : 
      new Date(formData.filingDeadline)) : 
    undefined;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 py-4">
        {/* Basic Information */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>
        
        {/* Role and Status */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="role" className="text-right">
            Role
          </Label>
          <Select
            value={formData.role || 'User'}
            onValueChange={(value) => handleSelectChange('role', value)}
          >
            <SelectTrigger className="col-span-3" id="role">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="User">User</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">
            Status
          </Label>
          <Select
            value={formData.status || 'Active'}
            onValueChange={(value) => handleSelectChange('status', value)}
          >
            <SelectTrigger className="col-span-3" id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              {mode === 'edit' && <SelectItem value="Deleted">Deleted</SelectItem>}
            </SelectContent>
          </Select>
        </div>
        
        {/* Tax Information */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="taxDue" className="text-right">
            Tax Due
          </Label>
          <Input
            id="taxDue"
            name="taxDue"
            type="number"
            placeholder="0.00"
            value={formData.taxDue === undefined ? '' : formData.taxDue}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="availableCredits" className="text-right">
            Available Credits
          </Label>
          <Input
            id="availableCredits"
            name="availableCredits"
            type="number"
            placeholder="0.00"
            value={formData.availableCredits === undefined ? '' : formData.availableCredits}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="filingDeadline" className="text-right">
            Filing Deadline
          </Label>
          <div className="col-span-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate
                    ? format(selectedDate, "PPP")
                    : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Password (only for create mode) */}
        {mode === 'create' && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <div className="col-span-3 relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password || ''}
                onChange={handleChange}
                className="pr-20"
                required
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={handleCopyPassword}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {mode === 'create' && (
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-3 col-start-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleGeneratePassword}
                className="flex items-center gap-2"
              >
                <KeyRound className="h-4 w-4" />
                Generate New Password
              </Button>
            </div>
          </div>
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

export default UserForm;
