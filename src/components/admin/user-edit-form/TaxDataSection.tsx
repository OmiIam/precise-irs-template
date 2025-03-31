
import React from 'react';
import DatePicker from 'react-datepicker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserFormData } from './types';
import "react-datepicker/dist/react-datepicker.css";

type TaxDataSectionProps = {
  formData: UserFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateChange: (date: Date | undefined) => void;
};

const TaxDataSection = ({ 
  formData, 
  handleChange,
  handleDateChange 
}: TaxDataSectionProps) => {
  // Helper function to handle numeric input validation
  const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Allow empty value
    if (value === '') {
      // Create a synthetic event
      const syntheticEvent = {
        target: {
          name,
          value: ''
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleChange(syntheticEvent);
      return;
    }
    
    // Only allow numeric input (including decimals and negative)
    if (/^-?\d*\.?\d*$/.test(value)) {
      handleChange(e);
    }
  };

  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <div className="text-right">
          <Label htmlFor="taxDue">Tax Due ($)</Label>
        </div>
        <div className="col-span-3">
          <Input 
            id="taxDue"
            name="taxDue"
            type="number"
            value={formData.taxDue === undefined ? '' : formData.taxDue}
            onChange={handleNumericInput}
            step="0.01"
            min="0"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <div className="text-right">
          <Label htmlFor="filingDeadline">Filing Deadline</Label>
        </div>
        <div className="col-span-3">
          <DatePicker
            id="filingDeadline"
            selected={formData.filingDeadline instanceof Date ? formData.filingDeadline : null}
            onChange={(date: Date) => handleDateChange(date)}
            className="w-full border border-gray-300 px-4 py-2 rounded"
            dateFormat="MM/dd/yyyy"
            placeholderText="Select a date"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <div className="text-right">
          <Label htmlFor="availableCredits">Available Credits ($)</Label>
        </div>
        <div className="col-span-3">
          <Input 
            id="availableCredits"
            name="availableCredits"
            type="number"
            value={formData.availableCredits === undefined ? '' : formData.availableCredits}
            onChange={handleNumericInput}
            step="0.01"
            min="0"
          />
        </div>
      </div>
    </>
  );
};

export default TaxDataSection;
