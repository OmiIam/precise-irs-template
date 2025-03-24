
import React from 'react';
import { format } from 'date-fns';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface RefreshStatusIndicatorProps {
  isSubscribed: boolean;
  lastRefresh: Date;
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
}

const RefreshStatusIndicator: React.FC<RefreshStatusIndicatorProps> = ({
  isSubscribed,
  lastRefresh,
  onRefresh,
  isRefreshing
}) => {
  const { toast } = useToast();

  const handleManualRefresh = async () => {
    try {
      await onRefresh();
      toast({
        title: "Data Refreshed",
        description: "User data has been refreshed successfully."
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh user data. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="text-sm text-gray-500">
        {isSubscribed ? (
          <span className="text-green-500 flex items-center">
            <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span> Realtime updates active
          </span>
        ) : (
          <span className="text-amber-500 flex items-center">
            <span className="h-2 w-2 bg-amber-500 rounded-full mr-1"></span> Realtime updates inactive
          </span>
        )}
        <div className="text-xs mt-1">
          Last updated: {format(lastRefresh, 'HH:mm:ss')}
        </div>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleManualRefresh}
        disabled={isRefreshing}
      >
        {isRefreshing ? (
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="mr-2 h-4 w-4" />
        )}
        Refresh
      </Button>
    </div>
  );
};

export default RefreshStatusIndicator;
