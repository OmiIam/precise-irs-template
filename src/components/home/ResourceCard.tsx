
import React from 'react';

interface ResourceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const ResourceCard = ({ icon, title, description }: ResourceCardProps) => (
  <div className="bg-white rounded-lg p-6 text-center card-hover">
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-irs-blue/10 text-irs-blue mb-4">
      {icon}
    </div>
    <h3 className="font-bold text-lg text-irs-darkest mb-2">{title}</h3>
    <p className="text-irs-darkGray text-sm mb-4">{description}</p>
    <a href="#" className="text-irs-blue hover:text-irs-darkBlue transition-colors duration-200 inline-flex items-center text-sm font-medium">
      Explore <span className="ml-1">→</span>
    </a>
  </div>
);
