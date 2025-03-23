
import React from 'react';
import { Calendar, AlertCircle, Clock } from 'lucide-react';
import { InfoCard } from '@/components/InfoCard';

export const FeaturedSection = () => {
  return (
    <section className="py-12 bg-irs-gray">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            title="Tax Filing Made Easy"
            description="File your taxes with confidence using our step-by-step guidance and smart tools designed to maximize your refund."
            ctaText="Learn More"
            icon={<Calendar size={24} />}
          />
          
          <InfoCard
            title="Tax Deadline Approaching"
            description="Don't miss important tax deadlines. Stay on track with our tax calendar and timely reminders for filing and payments."
            ctaText="View Details"
            variant="featured"
            icon={<AlertCircle size={24} />}
          />
          
          <InfoCard
            title="Track Your Refund"
            description="Check the status of your tax refund in real-time. Know exactly when your money will arrive with our accurate tracking system."
            ctaText="Get Started"
            icon={<Clock size={24} />}
          />
        </div>
      </div>
    </section>
  );
};
