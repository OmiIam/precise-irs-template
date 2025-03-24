
import React from 'react';
import { NewsCard } from './NewsCard';

export const NewsSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-irs-darkest mb-4">
            News & Updates
          </h2>
          <p className="text-irs-darkGray max-w-2xl mx-auto">
            Stay informed with the latest tax news, updates, and changes that may affect your filing status and tax situation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NewsCard
            date="March 15, 2025"
            title="New Tax Credits Available for Qualified Families"
            excerpt="The IRS has announced new tax credits for families with children under 17. Find out if you qualify and how to claim these credits on your next tax return."
          />
          
          <NewsCard
            date="March 10, 2025"
            title="Extended Filing Deadline for Natural Disaster Areas"
            excerpt="Taxpayers in federally declared disaster areas now have additional time to file their tax returns. Check if your location qualifies for this extension."
          />
          
          <NewsCard
            date="March 5, 2025"
            title="Important Changes to Retirement Account Contributions"
            excerpt="New legislation has modified contribution limits for 401(k)s and IRAs. Learn about these changes and how they might impact your retirement planning."
          />
        </div>
        
        <div className="text-center mt-8">
          <a href="#" className="btn-secondary">
            View All News
          </a>
        </div>
      </div>
    </section>
  );
};
