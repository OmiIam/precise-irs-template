
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
  
  // Ensure dates are synchronized
  useEffect(() => {
    if (formData.filingDeadline) {
      setSelectedDate(new Date(formData.filingDeadline));
    }
  }, [formData.filingDeadline]);
  
  const handleSetDate = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      handleDateChange(date);
    }
  };

  // Format function to safely format dates
  const formatDate = (date: Date | undefined) => {
    try {
      return date ? format(date, "PPP") : "Select a date";
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Select a date";
    }
  };
  
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="taxDue" className="text-right">
          Tax Due
        </Label>
        <Input
          id="taxDue"
          name="taxDue"
          type="number"
          placeholder="0.00"
          value={formData.taxDue === 0 ? '' : formData.taxDue}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="availableCredits" className="text-right">
          Available Credits
        </Label>
        <Input
          id="availableCredits"
          name="availableCredits"
          type="number"
          placeholder="0.00"
          value={formData.availableCredits === 0 ? '' : formData.availableCredits}
          onChange={handleChange}
          className="col-span-3"
        />
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
                  !selectedDate && "text-muted-foreground"
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
        </div>
      </div>
    </>
  );
};

export default TaxDataSection;
