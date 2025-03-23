
import React from 'react';
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
  
  const handleSetDate = (date: Date | undefined) => {
    setSelectedDate(date);
    handleDateChange(date);
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
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleSetDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  );
};

export default TaxDataSection;
