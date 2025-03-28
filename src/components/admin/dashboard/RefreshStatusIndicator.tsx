
import React from 'react';
import { Button } from '@/components/ui/button';
import { format, formatDistanceToNow } from 'date-fns';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RefreshStatusIndicatorProps {
  isSubscribed: boolean;
  lastRefresh: Date;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const RefreshStatusIndicator: React.FC<RefreshStatusIndicatorProps> = ({
  isSubscribed,
  lastRefresh,
  onRefresh,
  isRefreshing
}) => {
  const StatusIcon = isSubscribed ? CheckCircle : AlertCircle;
  const statusColor = isSubscribed ? 'text-green-500' : 'text-amber-500';
  const statusText = isSubscribed ? 'Real-time updates active' : 'Using periodic refresh';
  
  return (
    <div className="flex items-center space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center mr-2">
              <StatusIcon className={`h-4 w-4 ${statusColor} mr-1`} />
              <span className="text-xs text-gray-500">
                {statusText}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">
              {isSubscribed 
                ? 'Real-time updates are working correctly' 
                : 'Falling back to periodic refresh every 30 seconds'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Last updated: {format(lastRefresh, 'h:mm:ss a')} ({formatDistanceToNow(lastRefresh, { addSuffix: true })})
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onRefresh} 
        disabled={isRefreshing} 
        className="h-8 px-2"
      >
        <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );
};

export default RefreshStatusIndicator;
