
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const LanguageSelector = ({ isScrolled }: { isScrolled: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = ['English', 'Español', 'Français', '中文', 'Tiếng Việt', 'Русский', 'العربية'];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectLanguage = (language: string) => {
    setSelectedLanguage(language);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className={cn(
          "flex items-center gap-1 py-1 px-2 rounded-md transition-colors duration-200 text-sm",
          isScrolled 
            ? "text-irs-darkGray hover:text-irs-blue hover:bg-irs-gray" 
            : "text-white hover:text-irs-lightBlue hover:bg-irs-darkBlue/40"
        )}
        aria-label="Select language"
      >
        <span>{selectedLanguage}</span>
        <ChevronDown size={14} className={cn(
          "transition-transform duration-200",
          isOpen ? "rotate-180" : ""
        )} />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-md shadow-lg overflow-hidden z-50 animate-fade-in">
          <ul className="py-1">
            {languages.map((language) => (
              <li key={language}>
                <button
                  onClick={() => selectLanguage(language)}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm hover:bg-irs-gray transition-colors",
                    selectedLanguage === language ? "font-bold text-irs-blue" : "text-irs-darkGray"
                  )}
                >
                  {language}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
