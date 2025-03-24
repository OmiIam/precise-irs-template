
import React, { useState } from 'react';
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Ensure the file path contains userId as the first folder segment
      const fileName = `${userId}/${Date.now()}-${file.name}`;
      
      console.log('Uploading file to:', fileName);
      console.log('User ID:', userId);
      console.log('Bucket:', 'user-documents');
      
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
