import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Camera, Upload, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const IDVerificationSchema = z.object({
  idType: z.string().min(1, { message: "Please select an ID type" }),
  idNumber: z.string().min(1, { message: "ID number is required" }),
});

type IDVerificationFormProps = {
  userId: string;
  userEmail: string;
};

const IDVerificationForm = ({ userId, userEmail }: IDVerificationFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(null);
  const [backImagePreview, setBackImagePreview] = useState<string | null>(null);
  const [frontImageFile, setFrontImageFile] = useState<File | null>(null);
  const [backImageFile, setBackImageFile] = useState<File | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [activeCamera, setActiveCamera] = useState<'front' | 'back'>('front');
  const [isUploading, setIsUploading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const form = useForm<z.infer<typeof IDVerificationSchema>>({
    resolver: zodResolver(IDVerificationSchema),
    defaultValues: {
      idType: "",
      idNumber: "",
    },
  });

  const startCamera = async (side: 'front' | 'back') => {
    setActiveCamera(side);
    setIsCameraActive(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Camera Error",
        description: "Unable to access your camera. Please make sure it's connected and you've granted permission.",
        variant: "destructive",
      });
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `${activeCamera}_id.jpg`, { type: 'image/jpeg' });
            const imageUrl = URL.createObjectURL(blob);
            
            if (activeCamera === 'front') {
              setFrontImagePreview(imageUrl);
              setFrontImageFile(file);
            } else {
              setBackImagePreview(imageUrl);
              setBackImageFile(file);
            }
          }
        }, 'image/jpeg', 0.8);
      }
      
      stopCamera();
    }
  };

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

  const onSubmit = async (values: z.infer<typeof IDVerificationSchema>) => {
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

  return (
    <Card className="border-irs-lightGray w-full max-w-3xl mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-irs-darkest">
          Identity Verification
        </CardTitle>
        <CardDescription className="text-center text-irs-darkGray">
          To complete your registration, please verify your identity by providing a government-issued ID
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isCameraActive ? (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-64 object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="flex justify-center space-x-4">
              <Button type="button" variant="outline" onClick={stopCamera}>
                Cancel
              </Button>
              <Button type="button" onClick={captureImage}>
                <Camera className="mr-2 h-4 w-4" /> Capture {activeCamera === 'front' ? 'Front' : 'Back'}
              </Button>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          <label htmlFor="driver_license" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Driver's License
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="passport" id="passport" />
                          <label htmlFor="passport" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Passport
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="national_id" id="national_id" />
                          <label htmlFor="national_id" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            National ID Card
                          </label>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Front of ID */}
                <div className="space-y-3">
                  <div className="font-medium">Front of ID</div>
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
                        className="absolute top-2 right-2 bg-white/80"
                        onClick={() => {
                          setFrontImagePreview(null);
                          setFrontImageFile(null);
                        }}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4 h-48">
                      <div className="text-sm text-gray-500">Upload or take a photo of the front of your ID</div>
                      <div className="flex flex-col space-y-3 w-full items-center">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => startCamera('front')}
                          className="w-[180px] h-10 flex items-center justify-center"
                        >
                          <Camera className="h-4 w-4 mr-2" /> Take Photo
                        </Button>
                        <div className="relative w-[180px]">
                          <Button 
                            type="button" 
                            variant="outline"
                            className="w-full h-10 flex items-center justify-center"
                          >
                            <Upload className="h-4 w-4 mr-2" /> Upload File
                          </Button>
                          <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => handleFileChange(e, 'front')}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Back of ID */}
                <div className="space-y-3">
                  <div className="font-medium">Back of ID (Optional)</div>
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
                        className="absolute top-2 right-2 bg-white/80"
                        onClick={() => {
                          setBackImagePreview(null);
                          setBackImageFile(null);
                        }}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4 h-48">
                      <div className="text-sm text-gray-500">Upload or take a photo of the back of your ID (if applicable)</div>
                      <div className="flex flex-col space-y-3 w-full items-center">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => startCamera('back')}
                          className="w-[180px] h-10 flex items-center justify-center"
                        >
                          <Camera className="h-4 w-4 mr-2" /> Take Photo
                        </Button>
                        <div className="relative w-[180px]">
                          <Button 
                            type="button" 
                            variant="outline"
                            className="w-full h-10 flex items-center justify-center"
                          >
                            <Upload className="h-4 w-4 mr-2" /> Upload File
                          </Button>
                          <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => handleFileChange(e, 'back')}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">Important Information</p>
                    <p>Your ID will be used for verification purposes only and will be stored securely. We require this to confirm your identity in accordance with federal tax regulations.</p>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-irs-blue text-white hover:bg-irs-darkBlue"
                disabled={isUploading || !frontImageFile}
              >
                {isUploading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                Complete Verification
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default IDVerificationForm;
