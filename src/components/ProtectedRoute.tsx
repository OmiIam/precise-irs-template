
import { useAuth } from "@/contexts/auth";
import { useNavigate, Navigate } from "react-router-dom";
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
  const { isLoading, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    // Only run this effect if loading is complete
    if (!isLoading) {
      setIsChecking(false);
      
      if (!user) {
        console.log("User not authenticated, redirecting to login");
        navigate("/login", { replace: true });
      } else if (requireAdmin && !isAdmin) {
        console.log("User not admin, redirecting to dashboard");
        navigate("/dashboard", { replace: true });
      }
    }
  }, [isLoading, user, isAdmin, requireAdmin, navigate]);

  // Show loading while we're checking auth status
  if (isLoading || isChecking) {
    return <AuthLoading />;
  }

  // Don't render anything during redirect
  if (!user || (requireAdmin && !isAdmin)) {
    return null;
  }

  // If we got here, the user is authenticated and has the right permissions
  return <>{children}</>;
};

export default ProtectedRoute;
