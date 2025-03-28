
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search } from "lucide-react";
import { useAuth } from "@/contexts/auth";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-irs-darkest text-white">
      <div className="w-full bg-irs-darkest border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <p className="text-sm">An official website of the United States Government</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold mr-2">RSF</span>
                <span className="text-sm">Revenue Service Finance</span>
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8 ml-10">
              <Link
                to="/"
                className="text-white hover:text-irs-lightBlue transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/file"
                className="text-white hover:text-irs-lightBlue transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                File
              </Link>
              <Link
                to="/pay"
                className="text-white hover:text-irs-lightBlue transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                Pay
              </Link>
              <Link
                to="/refunds"
                className="text-white hover:text-irs-lightBlue transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                Refunds
              </Link>
              <Link
                to="/credits-deductions"
                className="text-white hover:text-irs-lightBlue transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                Credits & Deductions
              </Link>
              <Link
                to="/forms-instructions"
                className="text-white hover:text-irs-lightBlue transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                Forms & Instructions
              </Link>
              <Link
                to="/dashboard"
                className="text-white hover:text-irs-lightBlue transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                Get Started
              </Link>
              {isAdmin && user && (
                <Link
                  to="/admin"
                  className="text-white hover:text-irs-lightBlue transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Admin Dashboard
                </Link>
              )}
            </nav>
          </div>
          <div className="hidden sm:flex sm:items-center">
            <Button variant="ghost" className="text-white">
              <Search size={20} />
            </Button>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              className="text-white hover:text-irs-lightBlue focus:outline-none focus:ring-2 focus:ring-inset focus:ring-irs-blue"
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

      {isMenuOpen && (
        <div className="sm:hidden bg-irs-darkest">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-irs-lightBlue hover:bg-irs-darkBlue"
            >
              Home
            </Link>
            <Link
              to="/file"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-irs-lightBlue hover:bg-irs-darkBlue"
            >
              File
            </Link>
            <Link
              to="/pay"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-irs-lightBlue hover:bg-irs-darkBlue"
            >
              Pay
            </Link>
            <Link
              to="/refunds"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-irs-lightBlue hover:bg-irs-darkBlue"
            >
              Refunds
            </Link>
            <Link
              to="/credits-deductions"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-irs-lightBlue hover:bg-irs-darkBlue"
            >
              Credits & Deductions
            </Link>
            <Link
              to="/forms-instructions"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-irs-lightBlue hover:bg-irs-darkBlue"
            >
              Forms & Instructions
            </Link>
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-irs-lightBlue hover:bg-irs-darkBlue"
            >
              Get Started
            </Link>
            {isAdmin && user && (
              <Link
                to="/admin"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-irs-lightBlue hover:bg-irs-darkBlue"
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
