
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Upload, RefreshCw } from 'lucide-react';

type IDDocumentCaptureProps = {
  side: 'front' | 'back';
  isOptional?: boolean;
  imagePreview: string | null;
  onStartCamera: (side: 'front' | 'back') => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => void;
  onRemoveImage: () => void;
};

const IDDocumentCapture: React.FC<IDDocumentCaptureProps> = ({
  side,
  isOptional = false,
  imagePreview,
  onStartCamera,
  onFileChange,
  onRemoveImage,
}) => {
  return (
    <div className="space-y-3">
      <div className="font-medium">
        {side === 'front' ? 'Front of ID' : 'Back of ID'}{isOptional ? ' (Optional)' : ''}
      </div>
      
      {imagePreview ? (
        <div className="relative border rounded-lg overflow-hidden">
          <img 
            src={imagePreview} 
            alt={`${side === 'front' ? 'Front' : 'Back'} of ID`} 
            className="w-full h-48 object-contain"
          />
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="absolute top-2 right-2 bg-white/80"
            onClick={onRemoveImage}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4 h-48">
          <div className="text-sm text-gray-500">
            Upload or take a photo of the {side === 'front' ? 'front' : 'back'} of your ID
            {isOptional ? ' (if applicable)' : ''}
          </div>
          <div className="flex flex-col space-y-3 w-full items-center">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onStartCamera(side)}
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
                onChange={(e) => onFileChange(e, side)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IDDocumentCapture;
