
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

// Instead of directly referencing IDVerificationSchema, use a generic type parameter
type IDVerificationFormValues = {
  idType: string;
  idNumber: string;
};

type IDTypeSelectionProps = {
  form: UseFormReturn<IDVerificationFormValues>;
};

const IDTypeSelection: React.FC<IDTypeSelectionProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="idType"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>ID Document Type</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="driver_license" id="driver_license" />
                <label htmlFor="driver_license" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Driver's License
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="passport" id="passport" />
                <label htmlFor="passport" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Passport
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="national_id" id="national_id" />
                <label htmlFor="national_id" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  National ID Card
                </label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default IDTypeSelection;
