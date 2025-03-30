
'use client';

import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from 'react';

const adminLoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

type AdminLoginFormProps = {
  onToggleMode: () => void;
  onAdminLogin?: (values: { email: string; password: string }) => Promise<boolean>;
  setIsRedirecting: Dispatch<SetStateAction<boolean>>;
};

const AdminLoginForm = ({ onToggleMode, onAdminLogin, setIsRedirecting }: AdminLoginFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: AdminLoginFormValues) => {
    try {
      setIsLoading(true);
      
      if (onAdminLogin) {
        // Use the provided onAdminLogin function if available
        const result = await onAdminLogin(values);
        if (!result) {
          toast({
            title: "Admin Login failed",
            description: "Invalid admin credentials",
            variant: "destructive",
          });
        }
      } else {
        // Fall back to standard NextAuth signIn
        const result = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });
        
        if (result?.ok) {
          toast({
            title: "Admin Login successful",
            description: "Welcome to the admin dashboard",
          });
          setIsRedirecting(true);
          router.push('/admin-dashboard');
        } else {
          toast({
            title: "Admin Login failed",
            description: "Invalid admin credentials",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsRedirecting(false);
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
          
          <Button type="submit" className="w-full bg-irs-darkBlue text-white hover:bg-irs-darkBlue" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Signing In...
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" /> 
                Admin Sign In
              </>
            )}
          </Button>
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
          Switch to User Login
        </Button>
      </div>
    </>
  );
};

export default AdminLoginForm;
