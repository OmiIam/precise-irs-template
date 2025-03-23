
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the schema
export const IDVerificationSchema = z.object({
  idType: z.string().min(1, { message: "Please select an ID type" }),
  idNumber: z.string().min(1, { message: "ID number is required" }),
});

export type IDVerificationFormValues = z.infer<typeof IDVerificationSchema>;

export const useIDVerification = (userId: string, userEmail: string) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(null);
  const [backImagePreview, setBackImagePreview] = useState<string | null>(null);
  const [frontImageFile, setFrontImageFile] = useState<File | null>(null);
  const [backImageFile, setBackImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<IDVerificationFormValues>({
    resolver: zodResolver(IDVerificationSchema),
    defaultValues: {
      idType: "",
      idNumber: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      
      if (side === 'front') {
        setFrontImagePreview(imageUrl);
        setFrontImageFile(file);
      } else {
        setBackImagePreview(imageUrl);
        setBackImageFile(file);
      }
    }
  };

  const handleCapturedImage = (side: 'front' | 'back', file: File, imageUrl: string) => {
    if (side === 'front') {
      setFrontImagePreview(imageUrl);
      setFrontImageFile(file);
    } else {
      setBackImagePreview(imageUrl);
      setBackImageFile(file);
    }
  };

  const resetImage = (side: 'front' | 'back') => {
    if (side === 'front') {
      setFrontImagePreview(null);
      setFrontImageFile(null);
    } else {
      setBackImagePreview(null);
      setBackImageFile(null);
    }
  };

  const onSubmit = async (values: IDVerificationFormValues) => {
    if (!frontImageFile) {
      toast({
        title: "Missing Document",
        description: "Please upload or capture the front of your ID document.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload front image
      let frontImagePath = `${userId}/id_front.jpg`;
      const { error: frontUploadError } = await supabase
        .storage
        .from('id_documents')
        .upload(frontImagePath, frontImageFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (frontUploadError) throw frontUploadError;

      // Upload back image if provided
      let backImagePath;
      if (backImageFile) {
        backImagePath = `${userId}/id_back.jpg`;
        const { error: backUploadError } = await supabase
          .storage
          .from('id_documents')
          .upload(backImagePath, backImageFile, {
            cacheControl: '3600',
            upsert: true
          });

        if (backUploadError) throw backUploadError;
      }

      // Get URLs for the uploaded images
      const { data: frontUrlData } = await supabase
        .storage
        .from('id_documents')
        .createSignedUrl(frontImagePath, 60 * 60 * 24 * 365); // 1 year expiry

      let backImageUrl = null;
      if (backImagePath) {
        const { data: backUrlData } = await supabase
          .storage
          .from('id_documents')
          .createSignedUrl(backImagePath, 60 * 60 * 24 * 365); // 1 year expiry
          
        if (backUrlData) {
          backImageUrl = backUrlData.signedUrl;
        }
      }

      // Update user profile
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
          id_type: values.idType,
          id_number: values.idNumber,
          id_front_url: frontUrlData?.signedUrl || null,
          id_back_url: backImageUrl
        })
        .eq('id', userId);

      if (profileUpdateError) throw profileUpdateError;

      // Log activity
      await supabase
        .from('activity_logs')
        .insert({
          user_id: userId,
          action: 'ID_VERIFICATION_COMPLETED',
          details: {
            id_type: values.idType,
            timestamp: new Date().toISOString()
          }
        });

      toast({
        title: "Verification Successful",
        description: "Your identity verification has been submitted successfully.",
      });

      // Redirect to dashboard
      navigate('/dashboard');

    } catch (error) {
      console.error("Error during verification process:", error);
      toast({
        title: "Verification Error",
        description: "An error occurred during the verification process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    form,
    frontImagePreview,
    backImagePreview,
    frontImageFile,
    backImageFile,
    isUploading,
    handleFileChange,
    handleCapturedImage,
    resetImage,
    onSubmit,
    IDVerificationSchema
  };
};
