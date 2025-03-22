
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const HeroSection = () => {
  return (
    <section className="w-full bg-irs-darkest pt-32 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-irs-darkest to-irs-darkBlue opacity-90"></div>
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-irs-blue/20 text-irs-lightBlue text-sm font-medium mb-4 animate-fade-in">
            2023 Tax Filing Season
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 animate-slide-in">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </h1>
          <p className="text-irs-lightGray text-lg mb-8 animate-slide-in" style={{ animationDelay: '0.1s' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <a href="#" className="btn-primary flex items-center justify-center gap-2 py-3 px-6">
              File Your Taxes <ArrowRight size={16} />
            </a>
            <a href="#" className="btn-secondary flex items-center justify-center gap-2 py-3 px-6">
              Check Refund Status
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
