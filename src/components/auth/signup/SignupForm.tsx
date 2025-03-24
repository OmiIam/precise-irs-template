
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from 'react-router-dom';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { signupSchema, SignupFormValues } from './signupSchema';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AccountCreationStep } from './AccountCreationStep';
import { DocumentUploadStep } from './DocumentUploadStep';
import { SignupFormFooter } from './SignupFormFooter';

interface SignupFormProps {
  onSubmit: (values: SignupFormValues) => Promise<{ userId: string } | void>;
  isLoading: boolean;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, isLoading }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: SignupFormValues) => {
    try {
      setIsProcessing(true);
      console.log("Submitting signup form with values:", { ...values, password: "[REDACTED]" });
      
      const result = await onSubmit(values);
      
      // Type guard to check if result exists and has userId property
      if (result && 'userId' in result) {
        console.log('User created with ID:', result.userId);
        setUserId(result.userId);
        
        toast({
          title: "Account created",
          description: "Our team will contact you shortly with document verification instructions.",
        });
      }
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Signup failed",
        description: error.message || "There was an error. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerificationComplete = (info: { path: string; name: string }) => {
    navigate('/dashboard');
  };

  return (
    <Card className="border-irs-lightGray">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-irs-darkest">
          {!userId ? "Create an account" : "Account Created"}
        </CardTitle>
        <CardDescription className="text-center text-irs-darkGray">
          {!userId 
            ? "Enter your information to create a Revenue Service Finance account" 
            : "Please review the verification information below"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {!userId ? (
              <AccountCreationStep 
                form={form} 
                isLoading={isLoading} 
                isProcessing={isProcessing} 
              />
            ) : (
              <DocumentUploadStep 
                userId={userId} 
                onUploadComplete={handleVerificationComplete} 
              />
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <SignupFormFooter />
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
