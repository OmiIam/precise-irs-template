
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Copy, Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordStrength, setPasswordStrength] = React.useState<'weak' | 'medium' | 'strong' | null>(null);
  
  // Ensure password is a valid string when in create mode
  useEffect(() => {
    if (showResetPassword && (!formData.password || typeof formData.password !== 'string')) {
      const newPassword = generateRandomPassword();
      setFormData(prev => ({ ...prev, password: newPassword }));
    }
  }, [showResetPassword, formData.password, setFormData]);
  
  // Evaluate password strength when it changes
  useEffect(() => {
    if (!formData.password || typeof formData.password !== 'string') return;
    
    if (formData.password.length < 8) {
      setPasswordStrength('weak');
    } else if (formData.password.length >= 12 && 
               /[A-Z]/.test(formData.password) && 
               /[a-z]/.test(formData.password) && 
               /[0-9]/.test(formData.password) &&
               /[^A-Za-z0-9]/.test(formData.password)) {
      setPasswordStrength('strong');
    } else {
      setPasswordStrength('medium');
    }
  }, [formData.password]);

  const handleResetPassword = () => {
    const newPassword = generateRandomPassword();
    setFormData(prev => ({ ...prev, password: newPassword }));
    setShowResetPassword(true);
    setShowPassword(true);
  };

  const handleCopyPassword = () => {
    if (formData.password && typeof formData.password === 'string') {
      navigator.clipboard.writeText(formData.password);
      toast({
        title: "Password Copied",
        description: "Password has been copied to clipboard"
      });
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <div className="text-right">
        <Label htmlFor="password">Password</Label>
      </div>
      <div className="col-span-3 flex flex-col gap-2">
        {showResetPassword ? (
          <>
            <div className="flex-1 relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password || ''}
                className="pr-24"
                readOnly
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  className="h-8 px-1.5"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  className="h-8 px-1.5"
                  onClick={handleCopyPassword}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
            {passwordStrength && (
              <div className="text-xs flex items-center">
                <span className="mr-2">Strength:</span>
                <span className={`font-semibold ${
                  passwordStrength === 'weak' ? 'text-red-500' : 
                  passwordStrength === 'medium' ? 'text-yellow-500' : 
                  'text-green-500'
                }`}>
                  {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                </span>
                <div className="flex ml-2 gap-1">
                  <div className={`h-1.5 w-5 rounded-full ${passwordStrength !== 'weak' ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                  <div className={`h-1.5 w-5 rounded-full ${passwordStrength === 'strong' ? 'bg-green-500' : passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-gray-200'}`}></div>
                  <div className={`h-1.5 w-5 rounded-full ${passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                </div>
              </div>
            )}
          </>
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
