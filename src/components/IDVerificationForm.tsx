
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// Define verification schema
const verificationSchema = z.object({
  idType: z.string().min(1, "Please select an ID type"),
  idNumber: z.string().min(1, "Please enter your ID number"),
});

type VerificationFormValues = z.infer<typeof verificationSchema>;

interface IDVerificationFormProps {
  userId: string;
  userEmail: string;
}

const IDVerificationForm: React.FC<IDVerificationFormProps> = ({ userId, userEmail }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [frontImageFile, setFrontImageFile] = useState<File | null>(null);
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(null);
  const [backImageFile, setBackImageFile] = useState<File | null>(null);
  const [backImagePreview, setBackImagePreview] = useState<string | null>(null);

  const form = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      idType: "",
      idNumber: "",
    },
  });

  const handleFrontFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFrontImageFile(file);
      setFrontImagePreview(URL.createObjectURL(file));
    }
  };

  const handleBackFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackImageFile(file);
      setBackImagePreview(URL.createObjectURL(file));
    }
  };

  const resetFrontImage = () => {
    if (frontImagePreview) URL.revokeObjectURL(frontImagePreview);
    setFrontImageFile(null);
    setFrontImagePreview(null);
  };

  const resetBackImage = () => {
    if (backImagePreview) URL.revokeObjectURL(backImagePreview);
    setBackImageFile(null);
    setBackImagePreview(null);
  };

  const handleVerification = async (values: VerificationFormValues) => {
    if (!frontImageFile) {
      toast({
        title: "Front ID required",
        description: "Please upload the front of your ID document",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Upload front image
      const frontFileName = `${userId}/${Date.now()}-front-${frontImageFile.name}`;
      const { error: frontUploadError } = await supabase.storage
        .from('user-documents')
        .upload(frontFileName, frontImageFile);

      if (frontUploadError) throw frontUploadError;

      // Upload back image if provided
      let backFileName = null;
      if (backImageFile) {
        backFileName = `${userId}/${Date.now()}-back-${backImageFile.name}`;
        const { error: backUploadError } = await supabase.storage
          .from('user-documents')
          .upload(backFileName, backImageFile);

        if (backUploadError) throw backUploadError;
      }

      // Update profile with verification data
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          id_type: values.idType,
          id_number: values.idNumber,
          id_front_url: frontFileName,
          id_back_url: backFileName,
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      toast({
        title: "Verification Complete",
        description: "Your documents have been uploaded successfully.",
      });

      // Redirect to dashboard or home
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Verification error:', error);
      toast({
        title: "Verification failed",
        description: error.message || "There was an error uploading your documents.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ID Verification</CardTitle>
        <CardDescription>
          Please upload your identification documents to complete your registration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleVerification)} className="space-y-6">
            <FormField
              control={form.control}
              name="idType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>ID Document Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="driver_license" id="driver_license" />
                        <label htmlFor="driver_license">Driver's License</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="passport" id="passport" />
                        <label htmlFor="passport">Passport</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="national_id" id="national_id" />
                        <label htmlFor="national_id">National ID Card</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the number on your ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="text-sm font-medium">Front of ID</div>
                {frontImagePreview ? (
                  <div className="relative border rounded-lg overflow-hidden">
                    <img 
                      src={frontImagePreview} 
                      alt="Front of ID" 
                      className="w-full h-48 object-contain"
                    />
                    <Button 
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={resetFrontImage}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full h-48"
                    >
                      <Upload className="h-6 w-6 mb-2" />
                      <span>Upload Front</span>
                    </Button>
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFrontFileChange}
                      accept="image/*,.pdf"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="text-sm font-medium">Back of ID (Optional)</div>
                {backImagePreview ? (
                  <div className="relative border rounded-lg overflow-hidden">
                    <img 
                      src={backImagePreview} 
                      alt="Back of ID" 
                      className="w-full h-48 object-contain"
                    />
                    <Button 
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={resetBackImage}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full h-48"
                    >
                      <Upload className="h-6 w-6 mb-2" />
                      <span>Upload Back</span>
                    </Button>
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleBackFileChange}
                      accept="image/*,.pdf"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Important Information</h3>
                  <p className="mt-2 text-sm text-blue-700">
                    Your ID will be used for verification purposes only and will be stored securely. 
                    We require this to confirm your identity in accordance with federal tax regulations.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || !frontImageFile}
            >
              {isLoading ? (
                "Processing..."
              ) : (
                "Complete Verification"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default IDVerificationForm;
