
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploadProps {
  userId: string;
  onUploadComplete: (documentInfo: { path: string; name: string }) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ userId, onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      console.log("Initial session in DocumentUpload:", session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed in DocumentUpload:", session);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    try {
      setIsUploading(true);
      
      // First check if the user-documents bucket exists
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      console.log("Available buckets:", buckets);
      
      if (bucketsError) {
        console.error("Error checking buckets:", bucketsError);
        throw bucketsError;
      }
      
      const bucketExists = buckets?.some(bucket => bucket.name === 'user-documents');
      if (!bucketExists) {
        console.log("Bucket 'user-documents' doesn't exist, creating it");
        // Create the bucket if it doesn't exist
        const { error: createBucketError } = await supabase.storage.createBucket('user-documents', {
          public: false
        });
        
        if (createBucketError) {
          console.error("Error creating bucket:", createBucketError);
          throw createBucketError;
        }
        console.log("Bucket 'user-documents' created successfully");
      }
      
      // Ensure the file path contains userId as the first folder segment
      const fileName = `${userId}/${Date.now()}-${file.name}`;
      
      console.log('Uploading file to:', fileName);
      console.log('User ID:', userId);
      console.log('Active session:', session);
      
      const { error: uploadError, data } = await supabase.storage
        .from('user-documents')
        .upload(fileName, file, {
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', data);
      
      // Now update the user's profile to record that they've uploaded a document
      if (userId) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            submitted_documents: supabase.sql`submitted_documents || ${JSON.stringify([{
              name: file.name,
              path: data.path,
              uploaded_at: new Date().toISOString()
            }])}::jsonb`
          })
          .eq('id', userId);
          
        if (updateError) {
          console.error('Error updating profile with document info:', updateError);
          // Continue anyway since the upload was successful
        }
      }
      
      onUploadComplete({ 
        path: data.path,
        name: file.name 
      });

      toast({
        title: "Document uploaded",
        description: "Your document has been successfully uploaded.",
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Please upload your identification document
      </div>
      
      <div className="relative">
        <Button 
          variant="outline" 
          className="w-full"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Select Document
            </>
          )}
        </Button>
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileUpload}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          disabled={isUploading}
        />
      </div>
    </div>
  );
};
