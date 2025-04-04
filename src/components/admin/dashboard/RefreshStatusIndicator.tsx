
import React from 'react';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
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
  return (
    <div className="flex items-center gap-3">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center text-xs text-irs-darkGray">
              <span className="mr-1">Last updated: {formatDistanceToNow(lastRefresh)} ago</span>
              {isSubscribed ? (
                <Wifi className="h-3 w-3 text-green-500" />
              ) : (
                <WifiOff className="h-3 w-3 text-red-500" />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isSubscribed 
              ? "Realtime updates are enabled" 
              : "Realtime updates are disconnected"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefresh}
        disabled={isRefreshing}
        className={isRefreshing ? "opacity-50" : ""}
      >
        <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
        Refresh
      </Button>
    </div>
  );
};

export default RefreshStatusIndicator;
