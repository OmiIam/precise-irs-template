
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
    // In a real app, you would implement your sign-up logic here
    // For demonstration, we'll just call signIn after registration
    try {
      // You would typically make an API call to create the user first
      // Then sign them in
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      
      if (!result?.error) {
        return { error: null, userId: session?.user?.id };
      }
      
      return { error: result.error };
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
