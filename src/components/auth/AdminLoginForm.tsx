
import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogIn, User, Loader2 } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from 'react-router-dom';

const adminLoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type AdminLoginFormProps = {
  onToggleMode: () => void;
};

const AdminLoginForm = ({ onToggleMode }: AdminLoginFormProps) => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof adminLoginSchema>>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof adminLoginSchema>) => {
    try {
      setIsLoading(true);
      console.log("Attempting admin login with email:", values.email);
      
      // Use the same signIn function but handle role check after auth
      const { error } = await signIn(values.email, values.password);
      
      if (error) {
        console.error('Error during admin sign in:', error);
        toast({
          title: "Login failed",
          description: "Invalid email or password for admin account.",
          variant: "destructive",
        });
        return;
      }
      
      // Auth state change will handle redirect and role verification
      toast({
        title: "Admin login successful",
        description: "Welcome to the admin dashboard!",
      });
    } catch (error) {
      console.error('Admin login submission error:', error);
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
      <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-800 font-medium text-center">
          Admin Access Only
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admin Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="admin@example.com" 
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
          <User className="mr-2 h-4 w-4" />
          Regular User Login
        </Button>
      </div>
    </>
  );
};

export default AdminLoginForm;
