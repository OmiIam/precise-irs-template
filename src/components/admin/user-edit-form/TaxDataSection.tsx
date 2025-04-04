
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserFormData } from './types';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="filingDeadline"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.filingDeadline && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.filingDeadline ? format(formData.filingDeadline, "PPP") : <span>Select a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.filingDeadline instanceof Date ? formData.filingDeadline : undefined}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
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
