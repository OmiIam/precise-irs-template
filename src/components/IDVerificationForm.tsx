
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { useIDVerification, IDVerificationSchema } from './id-verification/useIDVerification';
import { useCameraCapture } from './id-verification/useCameraCapture';
import IDDocumentCapture from './id-verification/IDDocumentCapture';
import CameraCapture from './id-verification/CameraCapture';
import IDTypeSelection from './id-verification/IDTypeSelection';
import IDNumberInput from './id-verification/IDNumberInput';

type IDVerificationFormProps = {
  userId: string;
  userEmail: string;
};

const IDVerificationForm = ({ userId, userEmail }: IDVerificationFormProps) => {
  const {
    form,
    frontImagePreview,
    backImagePreview,
    frontImageFile,
    isUploading,
    handleFileChange,
    handleCapturedImage,
    resetImage,
    onSubmit
  } = useIDVerification(userId, userEmail);

  const {
    isCameraActive,
    activeCamera,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    captureImage
  } = useCameraCapture();

  const handleCapture = () => {
    captureImage((file, imageUrl) => 
      handleCapturedImage(activeCamera, file, imageUrl)
    );
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
          <CameraCapture
            videoRef={videoRef}
            canvasRef={canvasRef}
            onCancel={stopCamera}
            onCapture={handleCapture}
            activeSide={activeCamera}
          />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <IDTypeSelection form={form} />
              <IDNumberInput form={form} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Front of ID */}
                <IDDocumentCapture
                  side="front"
                  imagePreview={frontImagePreview}
                  onStartCamera={startCamera}
                  onFileChange={handleFileChange}
                  onRemoveImage={() => resetImage('front')}
                />

                {/* Back of ID */}
                <IDDocumentCapture
                  side="back"
                  isOptional={true}
                  imagePreview={backImagePreview}
                  onStartCamera={startCamera}
                  onFileChange={handleFileChange}
                  onRemoveImage={() => resetImage('back')}
                />
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
