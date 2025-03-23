
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const { signIn, user, isAdmin: userIsAdmin } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Prevent redirect loops
  useEffect(() => {
    try {
      if (isRedirecting) return;
      
      // Check for special admin authentication first
      const adminAuth = localStorage.getItem('isAdminAuthenticated');
      if (adminAuth === 'true') {
        setIsRedirecting(true);
        navigate('/admin-dashboard', { replace: true });
        return;
      }
      
      // Then check for regular user authentication
      if (user) {
        setIsRedirecting(true);
        if (userIsAdmin) {
          navigate('/admin-dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // Reset redirecting state if there was an error
      setIsRedirecting(false);
    }
  }, [user, userIsAdmin, navigate, isRedirecting]);
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      // Special handling for admin login
      if (isAdmin) {
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
        return;
      }
      
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

  const toggleAdminMode = () => {
    setIsAdmin(!isAdmin);
    toast({
      title: isAdmin ? "User Mode" : "Admin Mode",
      description: isAdmin ? "Switched to user login" : "Switched to admin login",
    });
  };

  return (
    <div className="min-h-screen bg-irs-gray">
      <Header />
      <div className="container mx-auto pt-32 pb-20 px-4">
        <div className="max-w-md mx-auto">
          <Card className={`border-irs-lightGray ${isAdmin ? 'border-t-4 border-t-irs-blue' : ''}`}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-irs-darkest">
                {isAdmin ? 'Admin Login' : 'Log in to your account'}
              </CardTitle>
              <CardDescription className="text-center text-irs-darkGray">
                {isAdmin 
                  ? 'Enter your admin credentials to access the dashboard' 
                  : 'Enter your email and password to access your account'}
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                            placeholder={isAdmin ? "admin@admin.com" : "your.email@example.com"} 
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
                  
                  <Button type="submit" className={`w-full ${isAdmin ? 'bg-irs-darkBlue' : 'bg-irs-blue'} text-white hover:bg-irs-darkBlue`}>
                    {isAdmin ? <ShieldCheck className="mr-2 h-4 w-4" /> : <LogIn className="mr-2 h-4 w-4" />} 
                    {isAdmin ? 'Admin Sign In' : 'Sign In'}
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
                  onClick={toggleAdminMode} 
                  className="text-irs-darkGray hover:text-irs-darkBlue"
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  {isAdmin ? 'Switch to User Login' : 'Admin Login'}
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="text-center text-sm text-irs-darkGray mt-2">
                Don't have an account?{" "}
                <Link to="/signup" className="text-irs-blue hover:text-irs-darkBlue font-medium">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
