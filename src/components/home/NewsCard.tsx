
import React from 'react';

interface NewsCardProps {
  date: string;
  title: string;
  excerpt: string;
}

export const NewsCard = ({ date, title, excerpt }: NewsCardProps) => (
  <div className="bg-white border border-irs-lightGray rounded-lg overflow-hidden card-hover">
    <div className="p-6">
      <div className="text-sm text-irs-blue font-medium mb-2">{date}</div>
      <h3 className="font-bold text-lg text-irs-darkest mb-3">{title}</h3>
      <p className="text-irs-darkGray text-sm mb-4">{excerpt}</p>
      <a href="#" className="text-irs-blue hover:text-irs-darkBlue transition-colors duration-200 inline-flex items-center text-sm font-medium">
        Read More <span className="ml-1">→</span>
      </a>
    </div>
  </div>
);
