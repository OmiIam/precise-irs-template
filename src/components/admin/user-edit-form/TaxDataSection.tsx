
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { UserFormData } from './types';

type TaxDataSectionProps = {
  formData: UserFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateChange: (date: Date | undefined) => void;
};

const TaxDataSection = ({ formData, handleChange, handleDateChange }: TaxDataSectionProps) => {
  return (
    <>
      <div className="border-t pt-4 mt-2">
        <h3 className="font-medium mb-2 text-sm">Dashboard Data</h3>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="taxDue" className="text-right">
          Tax Due ($)
        </Label>
        <Input
          id="taxDue"
          name="taxDue"
          type="number"
          value={formData.taxDue}
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
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.filingDeadline ? (
                  format(formData.filingDeadline, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.filingDeadline}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="availableCredits" className="text-right">
          Available Credits ($)
        </Label>
        <Input
          id="availableCredits"
          name="availableCredits"
          type="number"
          value={formData.availableCredits}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>
    </>
  );
};

export default TaxDataSection;
