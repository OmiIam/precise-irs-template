
'use client';

import { useNextAuth } from "@/hooks/useNextAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AuthLoading from "@/components/auth/AuthLoading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requireAdmin = false 
}: ProtectedRouteProps) => {
  const { isLoading, isAuthenticated, isAdmin } = useNextAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (requireAdmin && !isAdmin) {
        router.push("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, requireAdmin, router]);

  if (isLoading) {
    return <AuthLoading />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (requireAdmin && !isAdmin) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};

export default ProtectedRoute;
