
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useCameraCapture = () => {
  const { toast } = useToast();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [activeCamera, setActiveCamera] = useState<'front' | 'back'>('front');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Clean up camera resources when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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

  const captureImage = (
    onImageCaptured: (file: File, imageUrl: string) => void
  ) => {
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
            onImageCaptured(file, imageUrl);
          }
        }, 'image/jpeg', 0.8);
      }
      
      stopCamera();
    }
  };

  return {
    isCameraActive,
    activeCamera,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    captureImage
  };
};
