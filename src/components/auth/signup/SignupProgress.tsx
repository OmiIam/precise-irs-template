
import React from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface SignupProgressProps {
  currentStep: number;
  totalSteps: number;
}

const SignupProgress: React.FC<SignupProgressProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center mb-6 mt-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <div className={`h-1 w-10 mx-1 ${index < currentStep ? 'bg-irs-blue' : 'bg-gray-200'}`} />
          )}
          <div className="flex flex-col items-center">
            <div className="relative">
              {index < currentStep ? (
                <CheckCircle2 className="w-6 h-6 text-irs-blue" />
              ) : index === currentStep ? (
                <div className="w-6 h-6 rounded-full bg-irs-blue flex items-center justify-center text-white text-xs">
                  {currentStep === totalSteps - 1 && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {currentStep !== totalSteps - 1 && (index + 1)}
                </div>
              ) : (
                <Circle className="w-6 h-6 text-gray-300" />
              )}
            </div>
            <span className="text-xs mt-1 text-gray-500">
              {index === 0 ? 'Account' : index === 1 ? 'Verify' : 'Complete'}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default SignupProgress;
