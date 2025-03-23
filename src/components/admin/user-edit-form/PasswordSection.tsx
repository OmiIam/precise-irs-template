
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Copy } from 'lucide-react';
import { UserFormData } from './types';
import { generateRandomPassword } from './utils';
import { useToast } from '@/hooks/use-toast';

type PasswordSectionProps = {
  formData: UserFormData;
  showResetPassword: boolean;
  setShowResetPassword: React.Dispatch<React.SetStateAction<boolean>>;
  setFormData: React.Dispatch<React.SetStateAction<UserFormData>>;
};

const PasswordSection = ({ 
  formData, 
  showResetPassword, 
  setShowResetPassword,
  setFormData 
}: PasswordSectionProps) => {
  const { toast } = useToast();
  
  const handleResetPassword = () => {
    const newPassword = generateRandomPassword();
    setFormData(prev => ({ ...prev, password: newPassword }));
    setShowResetPassword(true);
  };

  const handleCopyPassword = () => {
    if (formData.password) {
      navigator.clipboard.writeText(formData.password);
      toast({
        title: "Password Copied",
        description: "Password has been copied to clipboard"
      });
    }
  };

  return (
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
              onClick={handleCopyPassword}
            >
              <Copy className="h-4 w-4 mr-1" />
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
  );
};

export default PasswordSection;
