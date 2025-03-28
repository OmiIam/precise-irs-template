
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Home, Search, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  ssn: z.string().length(9, "Enter a valid 9-digit Social Security Number without dashes").regex(/^\d{9}$/, "SSN must be 9 digits"),
  filingStatus: z.string({
    required_error: "Please select your filing status",
  }),
  refundAmount: z.string().min(1, "Please enter your expected refund amount"),
});

const RefundStatus = () => {
  const { toast } = useToast();
  const [refundStatus, setRefundStatus] = useState<null | "processing" | "approved" | "sent">(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ssn: "",
      filingStatus: "",
      refundAmount: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real application, this would make an API call to check the refund status
    console.log(values);
    
    // Simulate API response with a random status for demo purposes
    const statusOptions = ["processing", "approved", "sent"] as const;
    const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    
    setRefundStatus(randomStatus);
    
    toast({
      title: "Refund Status Check",
      description: "Your refund status has been retrieved.",
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32">
        <div className="container mx-auto px-4">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/refunds">
                  Refunds
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Check Refund Status</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="max-w-3xl mx-auto mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-irs-darkest mb-6">
              Check Your Refund Status
            </h1>
            <p className="text-lg text-irs-darkGray mb-8">
              Enter your information below to check the status of your tax refund. You'll need your Social Security Number, 
              filing status, and exact refund amount from your tax return.
            </p>
            
            <div className="bg-white rounded-lg shadow-md p-6 border border-irs-lightGray mb-10">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="ssn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Social Security Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 123456789" {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="filingStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Filing Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your filing status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="married_joint">Married Filing Jointly</SelectItem>
                            <SelectItem value="married_separate">Married Filing Separately</SelectItem>
                            <SelectItem value="head_household">Head of Household</SelectItem>
                            <SelectItem value="qualifying_widow">Qualifying Widow(er)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="refundAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Refund Amount</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 1,234.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">Check Status</Button>
                </form>
              </Form>
            </div>
            
            {refundStatus && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-irs-lightGray mb-10">
                <h2 className="text-xl font-bold text-irs-darkest mb-4">Your Refund Status</h2>
                
                {refundStatus === "processing" && (
                  <div className="flex items-start">
                    <Clock className="text-irs-blue mt-1 mr-4 flex-shrink-0" size={24} />
                    <div>
                      <h3 className="font-bold text-irs-darkBlue mb-2">Your Return Is Being Processed</h3>
                      <p className="text-irs-darkGray">Your tax return is currently being processed. This usually takes up to 21 days for e-filed returns.</p>
                    </div>
                  </div>
                )}
                
                {refundStatus === "approved" && (
                  <div className="flex items-start">
                    <CheckCircle className="text-green-600 mt-1 mr-4 flex-shrink-0" size={24} />
                    <div>
                      <h3 className="font-bold text-green-600 mb-2">Your Refund Has Been Approved</h3>
                      <p className="text-irs-darkGray">Your tax refund has been approved and is being prepared. If you chose direct deposit, you should receive your refund within 5 business days.</p>
                    </div>
                  </div>
                )}
                
                {refundStatus === "sent" && (
                  <div className="flex items-start">
                    <CheckCircle className="text-green-600 mt-1 mr-4 flex-shrink-0" size={24} />
                    <div>
                      <h3 className="font-bold text-green-600 mb-2">Your Refund Has Been Sent</h3>
                      <p className="text-irs-darkGray">Your tax refund has been sent to your bank or a check has been mailed. For direct deposits, allow up to 5 business days for your bank to credit your account.</p>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 pt-6 border-t border-irs-lightGray">
                  <p className="text-sm text-irs-darkGray">
                    <span className="flex items-center mb-2">
                      <AlertCircle className="text-irs-blue mr-2" size={16} />
                      <span className="font-semibold">Refund Status Check Date:</span>
                    </span>
                    {new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            )}
            
            <div className="bg-irs-gray p-6 rounded-lg">
              <h3 className="text-xl font-bold text-irs-darkest mb-3">Important Information</h3>
              <ul className="space-y-2 text-irs-darkGray">
                <li className="flex items-start">
                  <AlertCircle className="text-irs-blue mt-1 mr-2 flex-shrink-0" size={16} />
                  <span>Refund status updates are typically available 24 hours after e-filing or 4 weeks after mailing a paper return.</span>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="text-irs-blue mt-1 mr-2 flex-shrink-0" size={16} />
                  <span>The system is updated once daily, usually overnight. Checking multiple times during the day won't provide new information.</span>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="text-irs-blue mt-1 mr-2 flex-shrink-0" size={16} />
                  <span>If it's been more than 21 days since you e-filed or more than 6 weeks since you mailed your paper return, call our refund hotline at +1-252-691-2474.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RefundStatus;
