import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const adminLoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type AdminLoginFormProps = {
  onToggleMode: () => void;
  setIsRedirecting: (value: boolean) => void;
};

const AdminLoginForm = ({ onToggleMode, setIsRedirecting }: AdminLoginFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof adminLoginSchema>>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof adminLoginSchema>) => {
    try {
      // Check if the credentials match the specific admin credentials
      if (values.email === "admin@admin.com" && values.password === "iXOeNiRqvO2QiN4t") {
        try {
          console.log('Admin credentials accepted. Redirecting to admin dashboard...');
          
          // Store admin status in localStorage
          localStorage.setItem('isAdminAuthenticated', 'true');
          
          // Show success toast
          toast({
            title: "Admin Login successful",
            description: "Welcome to the admin dashboard",
          });
          
          // Redirect to admin dashboard directly with replace to avoid navigation stack issues
          setIsRedirecting(true);
          navigate('/admin-dashboard', { replace: true });
          return;
        } catch (error) {
          console.error('Error during admin login redirect:', error);
          toast({
            title: "Admin Login failed",
            description: "Error during redirect. Please try again.",
            variant: "destructive",
          });
          setIsRedirecting(false);
        }
      } else {
        // Show error for invalid admin credentials
        toast({
          title: "Admin Login failed",
          description: "Invalid admin credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Admin login error:', error);
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
          
          <Button type="submit" className="w-full bg-irs-darkBlue text-white hover:bg-irs-darkBlue">
            <ShieldCheck className="mr-2 h-4 w-4" /> 
            Admin Sign In
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
