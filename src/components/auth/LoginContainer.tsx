
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

type LoginContainerProps = {
  isAdmin: boolean;
  children: React.ReactNode;
};

const LoginContainer = ({ isAdmin, children }: LoginContainerProps) => {
  return (
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
        {children}
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="text-center text-sm text-irs-darkGray mt-2">
          Don't have an account?{" "}
          <Link href="/signup" className="text-irs-blue hover:text-irs-darkBlue font-medium">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginContainer;
