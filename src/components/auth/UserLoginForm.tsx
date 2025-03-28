
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  rememberMe: z.boolean().default(false),
});

type LoginValues = z.infer<typeof loginSchema>;

interface UserLoginFormProps {
  onToggleMode: () => void;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
}

const UserLoginForm: React.FC<UserLoginFormProps> = ({ onToggleMode, signIn }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginValues) => {
    setIsLoading(true);
    try {
      const { error } = await signIn(values.email, values.password);
      
      if (error) {
        console.error("Login error:", error);
        
        // Handle specific error messages
        if (error.message?.includes("Invalid login")) {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login Failed",
            description: error.message || "An error occurred during login.",
            variant: "destructive",
          });
        }
        return;
      }
      
      // If rememberMe is true, save email to localStorage
      if (values.rememberMe) {
        localStorage.setItem('rememberedEmail', values.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      sonnerToast.success('Login successful', {
        description: 'Redirecting to your dashboard...'
      });
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error: any) {
      console.error("Unexpected login error:", error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Populate email field if remembered
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      form.setValue('email', rememberedEmail);
      form.setValue('rememberMe', true);
    }
  }, [form]);

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your credentials to access your account
        </p>
      </div>
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
                    autoComplete="email"
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
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} 
                    autoComplete="current-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                      id="remember-me"
                    />
                  </FormControl>
                  <label 
                    htmlFor="remember-me" 
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Remember me
                  </label>
                </FormItem>
              )}
            />
            <Button variant="link" size="sm" className="px-0 font-normal" type="button">
              Forgot password?
            </Button>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-center text-sm">
        Don't have an account?{' '}
        <a 
          href="/signup" 
          className="underline text-primary hover:text-primary/90"
        >
          Sign up
        </a>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">
            Or continue with
          </span>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <Button 
          variant="outline" 
          type="button" 
          className="bg-white flex items-center justify-center"
          onClick={onToggleMode}
        >
          Admin Login
        </Button>
      </div>
    </div>
  );
};

export default UserLoginForm;
