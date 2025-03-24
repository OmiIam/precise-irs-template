
import React from 'react';
import { Phone, Mail, FileCheck, Shield, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface DocumentUploadStepProps {
  userId: string;
  onUploadComplete: (info: { path: string; name: string }) => void;
}

export const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({ 
  userId
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleContinueToDashboard = () => {
    toast({
      title: "Account creation successful",
      description: "Our team will contact you shortly for verification.",
    });
    navigate('/dashboard');
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-irs-darkBlue mb-4">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <Shield className="mr-2 h-5 w-5 text-irs-blue" />
          Document Verification Required
        </h3>
        <p className="text-sm mb-3">
          Please contact our team to review your documents and verify your account. Our verification specialists will guide you through the secure submission process.
        </p>
        <p className="text-sm">
          For your security and to comply with federal regulations, verification is required before your account can be fully activated.
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
            <span>Our verification team will contact you within 1-2 business days</span>
          </li>
          <li className="flex">
            <span className="bg-irs-lightBlue/20 text-irs-blue font-medium rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">2</span>
            <span>You may be asked to submit identification documents via our secure channel</span>
          </li>
          <li className="flex">
            <span className="bg-irs-lightBlue/20 text-irs-blue font-medium rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">3</span>
            <span>Once verified, your account will be fully activated for all services</span>
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
            <span className="text-xs text-gray-500 ml-2">(Call or Text)</span>
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
        onClick={handleContinueToDashboard}
        className="w-full bg-irs-blue text-white hover:bg-irs-darkBlue mt-2"
      >
        Continue to Dashboard
      </Button>
    </div>
  );
};
