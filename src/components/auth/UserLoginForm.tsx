
'use client';

import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LockKeyhole, Loader2, ShieldCheck } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const userLoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type UserLoginFormValues = z.infer<typeof userLoginSchema>;

type UserLoginFormProps = {
  onToggleMode: () => void;
  signIn?: (email: string, password: string) => Promise<{ error: any }>;
};

const UserLoginForm = ({ onToggleMode, signIn: customSignIn }: UserLoginFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const form = useForm<UserLoginFormValues>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: UserLoginFormValues) => {
    try {
      setIsLoading(true);
      
      if (customSignIn) {
        // Use custom signIn function if provided
        const result = await customSignIn(values.email, values.password);
        
        if (result.error) {
          toast({
            title: "Login failed",
            description: "Invalid email or password",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login successful",
            description: "Welcome back!",
          });
          router.push('/dashboard');
        }
      } else {
        // Fall back to NextAuth signIn
        const result = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });
        
        if (result?.ok) {
          toast({
            title: "Login successful",
            description: "Welcome back!",
          });
          router.push('/dashboard');
        } else {
          toast({
            title: "Login failed",
            description: "Invalid email or password",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
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
                <LockKeyhole className="mr-2 h-4 w-4" /> 
                Sign In
              </>
            )}
          </Button>
          
          <div className="text-center">
            <Button variant="link" className="text-irs-darkBlue">
              Forgot password?
            </Button>
          </div>
        </form>
      </Form>
      
      <div className="mt-4 flex justify-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onToggleMode} 
          className="text-irs-darkGray hover:text-irs-darkBlue"
        >
          <ShieldCheck className="mr-2 h-4 w-4" />
          Switch to Admin Login
        </Button>
      </div>
    </>
  );
};

export default UserLoginForm;
