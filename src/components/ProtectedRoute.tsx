
'use client';

import { useNextAuth } from "@/hooks/useNextAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    // Only run this effect if loading is complete
    if (!isLoading) {
      setIsChecking(false);
      
      if (!isAuthenticated) {
        console.log("User not authenticated, redirecting to login");
        router.push("/login");
      } else if (requireAdmin && !isAdmin) {
        console.log("User not admin, redirecting to dashboard");
        router.push("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, requireAdmin, router]);

  // Show loading while we're checking auth status
  if (isLoading || isChecking) {
    return <AuthLoading />;
  }

  // Don't render anything during redirect
  if (!isAuthenticated || (requireAdmin && !isAdmin)) {
    return null;
  }

  // If we got here, the user is authenticated and has the right permissions
  return <>{children}</>;
};

export default ProtectedRoute;
