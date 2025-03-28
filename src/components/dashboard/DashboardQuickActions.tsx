
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, DollarSign, CreditCard, HelpCircle } from 'lucide-react';

interface DashboardQuickActionsProps {
  onFileNow: () => void;
  onPayNow: () => void;
  onCheckRefund: () => void;
  onContactSupport: () => void;
}

const DashboardQuickActions: React.FC<DashboardQuickActionsProps> = ({
  onFileNow,
  onPayNow,
  onCheckRefund,
  onContactSupport
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button 
          variant="outline" 
          className="h-auto py-6 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
          onClick={onFileNow}
        >
          <FileText className="h-6 w-6 text-blue-600" />
          <span>File Taxes</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto py-6 flex flex-col items-center justify-center gap-2 hover:bg-green-50 hover:border-green-300 transition-colors"
          onClick={onPayNow}
        >
          <DollarSign className="h-6 w-6 text-green-600" />
          <span>Make Payment</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto py-6 flex flex-col items-center justify-center gap-2 hover:bg-purple-50 hover:border-purple-300 transition-colors"
          onClick={onCheckRefund}
        >
          <CreditCard className="h-6 w-6 text-purple-600" />
          <span>Check Refund</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto py-6 flex flex-col items-center justify-center gap-2 hover:bg-orange-50 hover:border-orange-300 transition-colors"
          onClick={onContactSupport}
        >
          <HelpCircle className="h-6 w-6 text-orange-600" />
          <span>Contact Support</span>
        </Button>
      </div>
    </div>
  );
};

export default DashboardQuickActions;
