
'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export const useNextAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hasCheckedSession, setHasCheckedSession] = useState(false);
  
  useEffect(() => {
    if (status !== "loading") {
      setHasCheckedSession(true);
    }
  }, [status]);
  
  const isLoading = status === "loading" && !hasCheckedSession;
  const isAuthenticated = status === "authenticated";
  const isAdmin = session?.user?.role === "Admin";
  
  const handleSignIn = async (email: string, password: string) => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      
      if (!result?.error) {
        console.log("Sign in successful");
        return { error: null };
      }
      
      console.error("Sign in error:", result?.error);
      return { error: result?.error };
    } catch (error) {
      console.error("Error during sign in:", error);
      return { error };
    }
  };
  
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };
  
  // A function to check if user has access to protected routes
  const checkAccess = (requireAdmin: boolean = false) => {
    if (!isAuthenticated) {
      return false;
    }
    
    if (requireAdmin && !isAdmin) {
      return false;
    }
    
    return true;
  };
  
  return {
    session,
    user: session?.user,
    isAdmin,
    isLoading,
    isAuthenticated,
    signIn: handleSignIn,
    signOut: handleSignOut,
    checkAccess
  };
};
