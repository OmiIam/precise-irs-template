
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export const useNextAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const isLoading = status === "loading";
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
        return { error: null };
      }
      
      return { error: result.error };
    } catch (error) {
      console.error("Error during sign in:", error);
      return { error };
    }
  };
  
  const handleSignUp = async (email: string, password: string, firstName: string, lastName: string) => {
    // For demonstration, we'll simulate a successful signup and then sign in
    // In a real app, you would make an API call to create the user
    try {
      // In a real app, you would create the user first
      // For now, just try to sign in with the credentials
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      
      if (!result?.error) {
        return { error: null, userId: session?.user?.id };
      }
      
      // Since we're using fixed users for testing, most signups will fail
      // In a real app, you would check the specific error
      return { error: "User registration failed. Try using one of the test accounts." };
    } catch (error) {
      console.error("Error during sign up:", error);
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
    signUp: handleSignUp,
    signOut: handleSignOut,
    checkAccess
  };
};
