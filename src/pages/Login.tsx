
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    console.log(values);
    // In a real application, you would authenticate with a backend
    
    if (isAdmin) {
      toast({
        title: "Admin login successful",
        description: "Welcome to the Revenue Dividends Admin Panel",
      });
      navigate('/admin-dashboard');
    } else {
      toast({
        title: "Login successful",
        description: "Welcome back to Revenue Dividends",
      });
      navigate('/dashboard');
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
