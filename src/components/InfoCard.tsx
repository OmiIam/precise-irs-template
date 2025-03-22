
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InfoCardProps {
  title: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  className?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'featured' | 'secondary';
}

export const InfoCard = ({ 
  title, 
  description, 
  ctaText, 
  ctaLink = "#", 
  className,
  icon,
  variant = 'default'
}: InfoCardProps) => {
  return (
    <div className={cn(
      "relative p-6 rounded-lg transition-all duration-300 overflow-hidden card-hover",
      variant === 'featured' && "bg-irs-blue text-white border-none",
      variant === 'secondary' && "bg-irs-gray border border-irs-lightGray",
      variant === 'default' && "bg-white border border-irs-lightGray",
      className
    )}>
      {icon && (
        <div className={cn(
          "mb-4 p-2 rounded-full inline-block",
          variant === 'featured' ? "bg-white/20 text-white" : "bg-irs-blue/10 text-irs-blue"
        )}>
          {icon}
        </div>
      )}
      
      <h3 className={cn(
        "text-xl font-bold mb-3",
        variant === 'featured' ? "text-white" : "text-irs-darkest"
      )}>
        {title}
      </h3>
      
      <p className={cn(
        "mb-4 text-sm",
        variant === 'featured' ? "text-white/90" : "text-irs-darkGray"
      )}>
        {description}
      </p>
      
      {ctaText && (
        <a 
          href={ctaLink} 
          className={cn(
            "inline-flex items-center gap-2 font-medium text-sm",
            variant === 'featured' 
              ? "text-white hover:text-irs-lightBlue" 
              : "text-irs-blue hover:text-irs-darkBlue",
            "transition-colors duration-200"
          )}
        >
          {ctaText} <ArrowRight size={16} />
        </a>
      )}
    </div>
  );
};
