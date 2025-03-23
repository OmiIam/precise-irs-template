
import React from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogIn, ShieldCheck } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type UserLoginFormProps = {
  onToggleMode: () => void;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
};

const UserLoginForm = ({ onToggleMode, signIn }: UserLoginFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {      
      // Regular user login
      const { error } = await signIn(values.email, values.password);
      
      if (error) {
        toast({
          title: "Login failed",
          description: error.message || "Check your email and password and try again",
          variant: "destructive",
        });
        return;
      }
      
      // Auth state change will handle redirection for regular users
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error) {
      console.error('Login submission error:', error);
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
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
          
          <Button type="submit" className="w-full bg-irs-blue text-white hover:bg-irs-darkBlue">
            <LogIn className="mr-2 h-4 w-4" /> 
            Sign In
          </Button>
        </form>
      </Form>
      
      <div className="mt-4 text-center text-sm">
        <Link to="/forgot-password" className="text-irs-blue hover:text-irs-darkBlue">
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
