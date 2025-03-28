
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center gap-1 mr-2">
        <div 
          className={`w-2 h-2 rounded-full ${isSubscribed ? 'bg-green-500' : 'bg-gray-400'}`} 
        />
        <span className="text-xs text-gray-500">
          {isSubscribed ? 'Live updates' : 'Offline mode'}
        </span>
      </div>
      
      <span className="text-xs text-gray-500 hidden sm:inline">
        Last updated: {formatDistanceToNow(lastRefresh, { addSuffix: true })}
      </span>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onRefresh}
        disabled={isRefreshing}
        className="ml-1 p-1 h-8 w-8"
      >
        <RefreshCw 
          className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} 
        />
      </Button>
    </div>
  );
};

export default RefreshStatusIndicator;
