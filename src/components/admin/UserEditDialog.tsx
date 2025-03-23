
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, KeyRound } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  status: string;
  taxDue?: number;
  filingDeadline?: Date;
  availableCredits?: number;
};

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
  const { toast } = useToast();
  const [formData, setFormData] = React.useState<User & {password?: string}>({
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

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

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

  const handleResetPassword = () => {
    const newPassword = generateRandomPassword();
    setFormData(prev => ({ ...prev, password: newPassword }));
    setShowResetPassword(true);
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
    
    onOpenChange(false);
  };

  const dialogTitle = isCreateMode ? "Create New User" : "Edit User";
  const dialogDescription = isCreateMode 
    ? "Create a new user account with the following details." 
    : "Make changes to the user account details.";
  const submitButtonText = isCreateMode ? "Create User" : "Save Changes";

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
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="userId" className="text-right">
                User ID
              </Label>
              <Input
                id="userId"
                name="id"
                value={formData.id}
                className="col-span-3"
                disabled
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
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
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>

            {/* Password section */}
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="col-span-3 flex gap-2">
                {showResetPassword ? (
                  <div className="flex-1 relative">
                    <Input
                      id="password"
                      name="password"
                      value={formData.password || ''}
                      className="pr-12"
                      readOnly
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-1.5"
                      onClick={() => navigator.clipboard.writeText(formData.password || '')}
                    >
                      Copy
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    onClick={handleResetPassword}
                    variant="outline"
                    className="w-full"
                  >
                    <KeyRound className="mr-2 h-4 w-4" />
                    Reset Password
                  </Button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={formData.role}
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
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger className="col-span-3" id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tax Data Fields */}
            <div className="border-t pt-4 mt-2">
              <h3 className="font-medium mb-2 text-sm">Dashboard Data</h3>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="taxDue" className="text-right">
                Tax Due ($)
              </Label>
              <Input
                id="taxDue"
                name="taxDue"
                type="number"
                value={formData.taxDue}
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
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.filingDeadline ? (
                        format(formData.filingDeadline, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.filingDeadline}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="availableCredits" className="text-right">
                Available Credits ($)
              </Label>
              <Input
                id="availableCredits"
                name="availableCredits"
                type="number"
                value={formData.availableCredits}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{submitButtonText}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditDialog;
