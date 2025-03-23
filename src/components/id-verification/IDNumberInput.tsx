
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import * as z from 'zod';

type IDVerificationFormValues = z.infer<typeof IDVerificationSchema>;

type IDNumberInputProps = {
  form: UseFormReturn<IDVerificationFormValues>;
  IDVerificationSchema: z.ZodObject<any>;
};

const IDNumberInput: React.FC<IDNumberInputProps> = ({ form, IDVerificationSchema }) => {
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
