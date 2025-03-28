
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from 'react-router-dom';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { signupSchema, SignupFormValues } from './signupSchema';
import { useToast } from '@/hooks/use-toast';
import { AccountCreationStep } from './AccountCreationStep';
import { DocumentUploadStep } from './DocumentUploadStep';
import { SignupFormFooter } from './SignupFormFooter';
import { useAuth } from '@/contexts/auth';
import { toast as sonnerToast } from 'sonner';
import SignupProgress from './SignupProgress';
import { CheckCircle, Loader2 } from 'lucide-react';

interface SignupFormProps {
  onSubmit: (values: SignupFormValues) => Promise<{ userId: string } | void>;
  isLoading: boolean;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, isLoading }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [signupComplete, setSignupComplete] = useState(false);
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange", // Enable real-time validation feedback
  });

  // Redirect if the user is already authenticated
  useEffect(() => {
    if (user && !isRedirecting && !userId) {
      setIsRedirecting(true);
      sonnerToast.info('You are already signed in', {
        description: 'Redirecting to dashboard...'
      });
      
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 500);
    }
  }, [user, navigate, isRedirecting, userId]);

  const handleSubmit = async (values: SignupFormValues) => {
    try {
      setIsProcessing(true);
      setCurrentStep(1);
      console.log("Submitting signup form with values:", { ...values, password: "[REDACTED]" });
      
      const result = await onSubmit(values);
      
      // Type guard to check if result exists and has userId property
      if (result && 'userId' in result) {
        console.log('User created with ID:', result.userId);
        setUserId(result.userId);
        setCurrentStep(2);
        setSignupComplete(true);
        
        // Redirect to dashboard directly - document verification handled separately
        sonnerToast.success('Account created successfully!', {
          description: 'Redirecting to your dashboard...'
        });
        
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 2000);
      }
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      setCurrentStep(0); // Reset to first step on error
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
    navigate('/dashboard', { replace: true });
  };

  return (
    <Card className="border-irs-lightGray">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-irs-darkest">
          {!signupComplete ? "Create an account" : "Account Created"}
        </CardTitle>
        <CardDescription className="text-center text-irs-darkGray">
          {!signupComplete 
            ? "Enter your information to create a Revenue Service Finance account" 
            : "Your account has been created successfully!"}
        </CardDescription>
        
        <SignupProgress currentStep={currentStep} totalSteps={3} />
      </CardHeader>
      <CardContent>
        {signupComplete ? (
          <div className="py-6 text-center">
            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-green-50 mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-medium mb-1">Registration Complete</h3>
            <p className="text-gray-500 mb-4">Your account has been created successfully</p>
            <div className="flex justify-center">
              <div className="animate-pulse flex items-center text-irs-blue">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redirecting to dashboard...
              </div>
            </div>
          </div>
        ) : (
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
        )}
      </CardContent>
      <CardFooter className="flex flex-col">
        <SignupFormFooter />
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
