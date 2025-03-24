
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { signupSchema, SignupFormValues } from './signupSchema';
import { DocumentUpload } from './DocumentUpload';
import { useToast } from '@/hooks/use-toast';

interface SignupFormProps {
  onSubmit: (values: SignupFormValues) => Promise<{ userId: string } | void>;
  isLoading: boolean;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, isLoading }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [documentInfo, setDocumentInfo] = useState<{ path: string; name: string } | null>(null);
  
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
    const result = await onSubmit(values);
    
    // Type guard to check if result exists and has userId property
    if (result && 'userId' in result) {
      console.log('User created with ID:', result.userId);
      setUserId(result.userId);
    }
  };

  const handleUploadComplete = (info: { path: string; name: string }) => {
    setDocumentInfo(info);
    
    // Once document is uploaded, redirect to dashboard
    toast({
      title: "Signup complete",
      description: "Your account has been created and document uploaded successfully.",
    });
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <Card className="border-irs-lightGray">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-irs-darkest">
          Create an account
        </CardTitle>
        <CardDescription className="text-center text-irs-darkGray">
          Enter your information to create a Revenue Service Finance account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {!userId ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-irs-blue text-white hover:bg-irs-darkBlue"
                  disabled={isLoading}
                >
                  <UserPlus className="mr-2 h-4 w-4" /> 
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </>
            ) : (
              <DocumentUpload 
                userId={userId} 
                onUploadComplete={handleUploadComplete} 
              />
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="text-center text-sm text-irs-darkGray mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-irs-blue hover:text-irs-darkBlue font-medium">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
