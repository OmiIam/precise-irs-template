
import React, { useEffect } from 'react';
import { Header } from '@/components/Header';
import SignupForm from '@/components/auth/signup/SignupForm';
import { useSignup } from '@/hooks/useSignup';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Signup = () => {
  const { isLoading, handleSignup } = useSignup();
  const { toast } = useToast();

  useEffect(() => {
    // Create the user-documents bucket if it doesn't exist
    const createBucketIfNeeded = async () => {
      try {
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        
        if (bucketsError) {
          console.error("Error listing buckets:", bucketsError);
          return;
        }
        
        const bucketExists = buckets?.some(bucket => bucket.name === 'user-documents');
        if (!bucketExists) {
          console.log("Creating user-documents bucket");
          const { error } = await supabase.storage.createBucket('user-documents', { 
            public: false 
          });
          
          if (error) {
            console.error("Error creating bucket:", error);
          } else {
            console.log("user-documents bucket created successfully");
          }
        }
      } catch (error) {
        console.error("Error checking/creating bucket:", error);
      }
    };

    createBucketIfNeeded();
  }, []);

  return (
    <div className="min-h-screen bg-irs-gray">
      <Header />
      <div className="container mx-auto pt-32 pb-20 px-4">
        <div className="max-w-md mx-auto">
          <SignupForm onSubmit={handleSignup} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Signup;
