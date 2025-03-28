
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { cn } from "@/lib/utils";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Monitor scroll position to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Add event listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Preconnect to necessary domains for performance
  useEffect(() => {
    // Add preconnect link for better font loading
    const preconnectLink = document.createElement('link');
    preconnectLink.rel = 'preconnect';
    preconnectLink.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnectLink);

    return () => {
      document.head.removeChild(preconnectLink);
    };
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full transition-all duration-200",
      isScrolled ? "bg-white shadow-md" : "bg-irs-darkest"
    )}>
      <div className="w-full bg-irs-darkest border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <p className="text-sm text-white">An official website of the United States Government</p>
        </div>
      </div>
      <div className={cn(
        "transition-all duration-300",
        isScrolled ? "bg-white" : "bg-irs-darkest"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to="/" className="flex items-center">
                  <span className={cn(
                    "text-2xl font-bold mr-2 transition-colors duration-200",
                    isScrolled ? "text-irs-darkest" : "text-white"
                  )}>RSF</span>
                  <span className={cn(
                    "text-sm transition-colors duration-200",
                    isScrolled ? "text-irs-darkGray" : "text-white"
                  )}>Revenue Service Finance</span>
                </Link>
              </div>
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-4 ml-10">
                {[
                  { to: "/", label: "Home" },
                  { to: "/file", label: "File" },
                  { to: "/pay", label: "Pay" },
                  { to: "/refunds", label: "Refunds" },
                  { to: "/credits-deductions", label: "Credits & Deductions" },
                  { to: "/forms-instructions", label: "Forms & Instructions" },
                  { to: "/dashboard", label: "Get Started" }
                ].map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                      location.pathname === item.to 
                        ? (isScrolled ? "text-irs-blue font-bold" : "text-irs-lightBlue font-bold") 
                        : (isScrolled ? "text-irs-darkGray hover:text-irs-blue" : "text-white hover:text-irs-lightBlue")
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="hidden sm:flex sm:items-center">
              <Button variant="ghost" 
                className={cn(
                  "transition-colors duration-200",
                  isScrolled ? "text-irs-darkGray hover:text-irs-blue" : "text-white hover:text-irs-lightBlue"
                )}
              >
                <Search size={20} />
              </Button>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <Button
                variant="ghost"
                onClick={toggleMenu}
                aria-expanded={isMenuOpen}
                className={cn(
                  "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-irs-blue transition-colors duration-200",
                  isScrolled ? "text-irs-darkGray hover:text-irs-blue" : "text-white hover:text-irs-lightBlue"
                )}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden bg-white shadow-lg animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {[
              { to: "/", label: "Home" },
              { to: "/file", label: "File" },
              { to: "/pay", label: "Pay" },
              { to: "/refunds", label: "Refunds" },
              { to: "/credits-deductions", label: "Credits & Deductions" },
              { to: "/forms-instructions", label: "Forms & Instructions" },
              { to: "/dashboard", label: "Get Started" }
            ].map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  location.pathname === item.to 
                    ? "text-irs-blue bg-irs-gray font-bold" 
                    : "text-irs-darkGray hover:text-irs-blue hover:bg-irs-gray"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
