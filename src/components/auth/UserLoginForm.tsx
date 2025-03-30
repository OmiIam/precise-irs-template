
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogIn, ShieldCheck, Loader2 } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { signIn as nextAuthSignIn } from "next-auth/react";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type UserLoginFormProps = {
  onToggleMode: () => void;
  signIn?: (email: string, password: string) => Promise<{ error: any }>;
};

const UserLoginForm = ({ onToggleMode, signIn }: UserLoginFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {      
      setIsLoading(true);
      console.log("Attempting to sign in with email:", values.email);
      
      if (signIn) {
        // Use the custom signIn function if provided
        const result = await signIn(values.email, values.password);
        
        if (result.error) {
          console.error('Error during sign in:', result.error);
          
          let errorMessage = "Check your email and password and try again";
          if (typeof result.error === 'string') {
            errorMessage = result.error;
          }
          
          toast({
            title: "Login failed",
            description: errorMessage,
            variant: "destructive",
          });
          return;
        }
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        router.push('/dashboard');
      } else {
        // Fall back to NextAuth signIn
        const result = await nextAuthSignIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });
        
        if (result?.error) {
          console.error('Error during sign in:', result.error);
          
          let errorMessage = "Check your email and password and try again";
          if (typeof result.error === 'string') {
            errorMessage = result.error;
          }
          
          toast({
            title: "Login failed",
            description: errorMessage,
            variant: "destructive",
          });
          return;
        }
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login submission error:', error);
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="your.email@example.com" 
                    {...field} 
                  />
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
          
          <Button type="submit" className="w-full bg-irs-blue text-white hover:bg-irs-darkBlue" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" /> 
                Sign In
              </>
            )}
          </Button>
        </form>
      </Form>
      
      <div className="mt-4 text-center text-sm">
        <Link href="/forgot-password" className="text-irs-blue hover:text-irs-darkBlue">
          Forgot your password?
        </Link>
      </div>
      
      <div className="mt-4 flex justify-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onToggleMode} 
          className="text-irs-darkGray hover:text-irs-darkBlue"
        >
          <ShieldCheck className="mr-2 h-4 w-4" />
          Admin Login
        </Button>
      </div>
    </>
  );
};

export default UserLoginForm;
