
import React from 'react';
import { DocumentUpload } from './DocumentUpload';

interface DocumentUploadStepProps {
  userId: string;
  onUploadComplete: (info: { path: string; name: string }) => void;
}

export const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({ 
  userId, 
  onUploadComplete 
}) => {
  return (
    <DocumentUpload 
      userId={userId} 
      onUploadComplete={onUploadComplete} 
    />
  );
};
