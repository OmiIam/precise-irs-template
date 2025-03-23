
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

// Instead of directly referencing IDVerificationSchema, use a generic type parameter
type IDVerificationFormValues = {
  idType: string;
  idNumber: string;
};

type IDNumberInputProps = {
  form: UseFormReturn<IDVerificationFormValues>;
};

const IDNumberInput: React.FC<IDNumberInputProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="idNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel>ID Number</FormLabel>
          <FormControl>
            <Input placeholder="Enter the number on your ID" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default IDNumberInput;
