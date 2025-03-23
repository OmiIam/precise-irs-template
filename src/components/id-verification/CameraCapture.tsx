
import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

type CameraCaptureProps = {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onCancel: () => void;
  onCapture: () => void;
  activeSide: 'front' | 'back';
};

const CameraCapture: React.FC<CameraCaptureProps> = ({
  videoRef,
  canvasRef,
  onCancel,
  onCapture,
  activeSide,
}) => {
  return (
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
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={onCapture}>
          Capture {activeSide === 'front' ? 'Front' : 'Back'}
        </Button>
      </div>
    </div>
  );
};

export default CameraCapture;
