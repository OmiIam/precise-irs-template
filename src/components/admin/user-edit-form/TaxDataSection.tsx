
import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserFormData } from './types';
import { Alert, AlertDescription } from '@/components/ui/alert';

type TaxDataSectionProps = {
  formData: UserFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateChange: (date: Date | undefined) => void;
};

const TaxDataSection = ({ formData, handleChange, handleDateChange }: TaxDataSectionProps) => {
  // Parse existing deadline or set to current date if undefined
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    formData.filingDeadline || new Date()
  );
  
  // Track if date is valid
  const [dateError, setDateError] = React.useState<string | null>(null);
  
  // Ensure dates are synchronized when form data changes
  useEffect(() => {
    if (formData.filingDeadline) {
      try {
        const dateValue = formData.filingDeadline instanceof Date 
          ? formData.filingDeadline 
          : new Date(formData.filingDeadline);
          
        if (!isNaN(dateValue.getTime())) {
          setSelectedDate(dateValue);
          setDateError(null);
        } else {
          console.warn("Invalid filing deadline date:", formData.filingDeadline);
          setSelectedDate(new Date());
          setDateError("Invalid date format was corrected");
        }
      } catch (error) {
        console.error("Error parsing filing deadline:", error);
        setSelectedDate(new Date());
        setDateError("Error parsing date - using current date");
      }
    }
  }, [formData.filingDeadline]);
  
  const handleSetDate = (date: Date | undefined) => {
    if (date) {
      console.log("Setting new date:", date);
      setSelectedDate(date);
      setDateError(null);
      handleDateChange(date);
    }
  };

  // Format function to safely format dates - using a format compatible with date-fns v3
  const formatDate = (date: Date | undefined) => {
    try {
      return date ? format(date, "PPP") : "Select a date";
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Select a date";
    }
  };

  // Handle numeric input validation
  const validateNumericInput = (value: string): boolean => {
    // Allow empty strings or valid numbers
    return value === '' || /^-?\d*\.?\d*$/.test(value);
  };
  
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="taxDue" className="text-right">
          Tax Due
        </Label>
        <div className="col-span-3">
          <Input
            id="taxDue"
            name="taxDue"
            type="number"
            placeholder="0.00"
            value={formData.taxDue === undefined || formData.taxDue === 0 ? '' : formData.taxDue}
            onChange={(e) => {
              if (validateNumericInput(e.target.value)) {
                handleChange(e);
              }
            }}
            className="w-full"
            step="0.01"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="availableCredits" className="text-right">
          Available Credits
        </Label>
        <div className="col-span-3">
          <Input
            id="availableCredits"
            name="availableCredits"
            type="number"
            placeholder="0.00"
            value={formData.availableCredits === undefined || formData.availableCredits === 0 ? '' : formData.availableCredits}
            onChange={(e) => {
              if (validateNumericInput(e.target.value)) {
                handleChange(e);
              }
            }}
            className="w-full"
            step="0.01"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="filingDeadline" className="text-right">
          Filing Deadline
        </Label>
        <div className="col-span-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground",
                  dateError && "border-red-300"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDate(selectedDate)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleSetDate}
                initialFocus
                disabled={(date) => date < new Date('1900-01-01')}
              />
            </PopoverContent>
          </Popover>
          
          {dateError && (
            <Alert variant="destructive" className="mt-2 py-2">
              <AlertDescription className="text-xs">{dateError}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </>
  );
};

export default TaxDataSection;
