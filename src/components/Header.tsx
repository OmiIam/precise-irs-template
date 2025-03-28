
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Main navigation items
  const navigationItems = [
    { to: "/", label: "Home" },
    { to: "/file", label: "File" },
    { to: "/pay", label: "Pay" },
    { to: "/refunds", label: "Refunds" },
    { to: "/dashboard", label: "Dashboard" }
  ];

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full transition-all duration-200",
      isScrolled ? "bg-white shadow-md" : "bg-irs-darkest"
    )}>
      {/* USA Gov Banner */}
      <div className="w-full bg-irs-darkest border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <p className="text-sm text-white">An official website of the United States Government</p>
        </div>
      </div>
      
      {/* Main Header */}
      <div className={cn(
        "transition-all duration-300",
        isScrolled ? "bg-white" : "bg-irs-darkest"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo and Navigation */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to="/" className="flex items-center">
                  <span className={cn(
                    "text-2xl font-bold mr-2 transition-colors duration-200",
                    isScrolled ? "text-irs-darkest" : "text-white"
                  )}>RSF</span>
                  <span className={cn(
                    "hidden sm:inline text-sm transition-colors duration-200",
                    isScrolled ? "text-irs-darkGray" : "text-white"
                  )}>Revenue Service Finance</span>
                </Link>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:ml-6 md:flex md:space-x-1 ml-10">
                {navigationItems.map(item => (
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
            
            {/* Right side: Search & User */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {/* Search */}
              <Button variant="ghost" 
                className={cn(
                  "transition-colors duration-200",
                  isScrolled ? "text-irs-darkGray hover:text-irs-blue" : "text-white hover:text-irs-lightBlue"
                )}
              >
                <Search size={20} />
              </Button>
              
              {/* User Account */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" 
                      className={cn(
                        "transition-colors duration-200 flex items-center gap-2",
                        isScrolled ? "text-irs-darkGray hover:text-irs-blue" : "text-white hover:text-irs-lightBlue"
                      )}
                    >
                      <User size={20} />
                      <span className="hidden lg:inline">{user.email?.split('@')[0]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/dashboard')}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-red-600 hover:text-red-700" onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  to="/login"
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 border",
                    isScrolled 
                      ? "border-irs-blue text-irs-blue hover:bg-irs-blue hover:text-white" 
                      : "border-white text-white hover:bg-white hover:text-irs-darkest"
                  )}
                >
                  Sign In
                </Link>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              {user && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "mr-2 transition-colors duration-200",
                    isScrolled ? "text-irs-darkGray hover:text-irs-blue" : "text-white hover:text-irs-lightBlue"
                  )}
                  onClick={() => navigate('/dashboard')}
                >
                  <User size={20} />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                aria-expanded={isMenuOpen}
                className={cn(
                  "transition-colors duration-200",
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map(item => (
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
            
            {/* Mobile Search */}
            <div className="px-3 py-2">
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-irs-blue focus:border-irs-blue sm:text-sm"
                  placeholder="Search"
                />
              </div>
            </div>
            
            {/* Mobile Sign In/Out */}
            {user ? (
              <button
                onClick={handleSignOut}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-irs-gray"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-irs-blue hover:text-irs-darkBlue hover:bg-irs-gray"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
