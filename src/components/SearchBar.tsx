
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search for:', searchQuery);
    // In a real implementation, this would handle the search functionality
  };

  return (
    <form onSubmit={handleSubmit} className="w-full animate-fade-in">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for tax forms, instructions, and publications"
          className={cn(
            "w-full pl-4 pr-12 py-3 rounded-md border border-irs-lightGray",
            "focus:ring-2 focus:ring-irs-blue focus:border-irs-blue",
            "placeholder:text-gray-400 transition-all duration-200"
          )}
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-irs-darkGray hover:text-irs-blue transition-colors p-1"
          aria-label="Search"
        >
          <Search size={20} />
        </button>
      </div>
    </form>
  );
};
