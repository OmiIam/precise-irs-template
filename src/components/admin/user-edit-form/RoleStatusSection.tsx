
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserFormData } from './types';

type RoleStatusSectionProps = {
  formData: UserFormData;
  handleSelectChange: (name: string, value: string) => void;
};

const RoleStatusSection = ({ formData, handleSelectChange }: RoleStatusSectionProps) => {
  return (
    <>
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
    </>
  );
};

export default RoleStatusSection;
