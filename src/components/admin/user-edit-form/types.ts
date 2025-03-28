
import { User } from '@/types/user';

export type UserEditFormMode = 'create' | 'edit';

export interface UserEditFormProps {
  user?: User;
  onSave: (user: User) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  mode: UserEditFormMode;
}

export interface BasicInfoSectionProps {
  form: any;
}

export interface RoleStatusSectionProps {
  form: any;
}

export interface TaxDataSectionProps {
  form: any;
}

export interface PasswordSectionProps {
  form: any;
  mode: UserEditFormMode;
}
