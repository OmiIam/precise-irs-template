
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserFormData } from './types';

type BasicInfoSectionProps = {
  formData: UserFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const BasicInfoSection = ({ formData, handleChange }: BasicInfoSectionProps) => {
  return (
    <>
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
    </>
  );
};

export default BasicInfoSection;
