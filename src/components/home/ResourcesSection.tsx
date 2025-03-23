
import React from 'react';
import { DollarSign, Users, PiggyBank, LifeBuoy } from 'lucide-react';
import { ResourceCard } from './ResourceCard';

export const ResourcesSection = () => {
  return (
    <section className="py-12 bg-irs-gray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-irs-darkest mb-4">
            Resources & Tools
          </h2>
          <p className="text-irs-darkGray max-w-2xl mx-auto">
            Take advantage of our comprehensive resources and interactive tools designed to simplify your tax experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <ResourceCard
            icon={<DollarSign size={24} />}
            title="Tax Estimator"
            description="Calculate your potential tax liability or refund with our easy-to-use tax estimation tool."
          />
          
          <ResourceCard
            icon={<Users size={24} />}
            title="Find a Tax Professional"
            description="Connect with certified tax professionals in your area who can help with complex tax situations."
          />
          
          <ResourceCard
            icon={<PiggyBank size={24} />}
            title="Retirement Calculator"
            description="Plan for your future with our retirement calculator and tax-advantaged investment options."
          />
          
          <ResourceCard
            icon={<LifeBuoy size={24} />}
            title="Get Help"
            description="Access our comprehensive support center for answers to your tax questions and filing assistance."
          />
        </div>
      </div>
    </section>
  );
};
