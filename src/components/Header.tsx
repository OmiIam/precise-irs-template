
import React, { useState, useEffect } from 'react';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SearchBar } from './SearchBar';
import { LanguageSelector } from './LanguageSelector';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      setSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300", 
        isScrolled ? "bg-white shadow-md py-2" : "bg-irs-darkest text-white py-4"
      )}
    >
      <div className="container mx-auto">
        {/* Top header - USA Gov bar */}
        <div className={cn(
          "flex justify-between items-center py-2 text-sm border-b transition-all duration-300",
          isScrolled ? "border-irs-lightGray" : "border-irs-darkBlue"
        )}>
          <div className="flex items-center gap-4">
            <span className={cn(
              "font-semibold",
              isScrolled ? "text-irs-darkBlue" : "text-white"
            )}>
              An official website of the United States Government
            </span>
          </div>
          <LanguageSelector isScrolled={isScrolled} />
        </div>

        {/* Main navigation */}
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center gap-2">
            <button 
              className="lg:hidden p-2 rounded-full hover:bg-irs-blue/10 transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/" className="flex items-center gap-3">
              <span className={cn(
                "text-2xl font-bold transition-colors",
                isScrolled ? "text-irs-darkBlue" : "text-white"
              )}>
                IRS
              </span>
              <span className={cn(
                "hidden md:inline text-sm max-w-[150px] transition-colors",
                isScrolled ? "text-irs-darkGray" : "text-irs-lightGray"
              )}>
                Internal Revenue Service
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <NavLink href="/" isScrolled={isScrolled}>Home</NavLink>
            <NavLink href="/file" isScrolled={isScrolled}>File</NavLink>
            <NavLink href="/pay" isScrolled={isScrolled}>Pay</NavLink>
            <NavLink href="/refunds" isScrolled={isScrolled}>Refunds</NavLink>
            <NavLink href="/credits-deductions" isScrolled={isScrolled}>Credits & Deductions</NavLink>
            <NavLink href="/forms-instructions" isScrolled={isScrolled}>Forms & Instructions</NavLink>
          </nav>

          {/* Search button */}
          <div className="flex items-center gap-2">
            <button 
              className={cn(
                "p-2 rounded-full transition-colors",
                isScrolled 
                  ? "hover:bg-irs-gray text-irs-darkBlue" 
                  : "hover:bg-irs-darkBlue/30 text-white"
              )}
              onClick={toggleSearch}
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Search dropdown */}
        <div className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          searchOpen ? "max-h-24 opacity-100 py-3" : "max-h-0 opacity-0 py-0"
        )}>
          <SearchBar />
        </div>

        {/* Mobile menu */}
        <div className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <nav className="flex flex-col py-4 space-y-1">
            <MobileNavLink href="/" isScrolled={isScrolled}>Home</MobileNavLink>
            <MobileNavLink href="/file" isScrolled={isScrolled}>File</MobileNavLink>
            <MobileNavLink href="/pay" isScrolled={isScrolled}>Pay</MobileNavLink>
            <MobileNavLink href="/refunds" isScrolled={isScrolled}>Refunds</MobileNavLink>
            <MobileNavLink href="/credits-deductions" isScrolled={isScrolled}>Credits & Deductions</MobileNavLink>
            <MobileNavLink href="/forms-instructions" isScrolled={isScrolled}>Forms & Instructions</MobileNavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ href, children, isScrolled }: { href: string; children: React.ReactNode; isScrolled: boolean }) => (
  <Link 
    to={href} 
    className={cn(
      "relative nav-link font-medium flex items-center transition-all hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:transition-all after:duration-300",
      isScrolled 
        ? "text-irs-darkGray hover:text-irs-blue after:bg-irs-blue" 
        : "text-white hover:text-irs-lightBlue after:bg-irs-lightBlue"
    )}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ href, children, isScrolled }: { href: string; children: React.ReactNode; isScrolled: boolean }) => (
  <Link 
    to={href} 
    className={cn(
      "px-4 py-3 font-medium border-b transition-colors",
      isScrolled 
        ? "text-irs-darkGray hover:text-irs-blue border-irs-lightGray" 
        : "text-white hover:text-irs-lightBlue border-irs-darkBlue"
    )}
  >
    {children}
  </Link>
);
