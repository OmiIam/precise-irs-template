
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/auth";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-irs-darkest">
                TaxEase
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8 ml-10">
              <Link
                to="/file"
                className="text-irs-darkGray hover:text-irs-blue transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                File
              </Link>
              <Link
                to="/pay"
                className="text-irs-darkGray hover:text-irs-blue transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                Pay
              </Link>
              <Link
                to="/refunds"
                className="text-irs-darkGray hover:text-irs-blue transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                Refunds
              </Link>
              <Link
                to="/credits-deductions"
                className="text-irs-darkGray hover:text-irs-blue transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                Credits & Deductions
              </Link>
              <Link
                to="/forms-instructions"
                className="text-irs-darkGray hover:text-irs-blue transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                Forms & Instructions
              </Link>
              {isAdmin && user && (
                <Link
                  to="/admin"
                  className="text-irs-darkGray hover:text-irs-blue transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Admin Dashboard
                </Link>
              )}
            </nav>
          </div>
          <div className="hidden sm:flex sm:items-center">
            <Link to="/dashboard">
              <Button variant="outline" className="border-irs-blue text-irs-blue hover:bg-irs-lightGray">
                Dashboard
              </Button>
            </Link>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              className="text-irs-darkGray hover:text-irs-blue hover:bg-irs-lightGray focus:outline-none focus:ring-2 focus:ring-inset focus:ring-irs-blue"
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
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/file"
              className="block px-3 py-2 rounded-md text-base font-medium text-irs-darkGray hover:text-irs-blue hover:bg-irs-lightGray"
            >
              File
            </Link>
            <Link
              to="/pay"
              className="block px-3 py-2 rounded-md text-base font-medium text-irs-darkGray hover:text-irs-blue hover:bg-irs-lightGray"
            >
              Pay
            </Link>
            <Link
              to="/refunds"
              className="block px-3 py-2 rounded-md text-base font-medium text-irs-darkGray hover:text-irs-blue hover:bg-irs-lightGray"
            >
              Refunds
            </Link>
            <Link
              to="/credits-deductions"
              className="block px-3 py-2 rounded-md text-base font-medium text-irs-darkGray hover:text-irs-blue hover:bg-irs-lightGray"
            >
              Credits & Deductions
            </Link>
            <Link
              to="/forms-instructions"
              className="block px-3 py-2 rounded-md text-base font-medium text-irs-darkGray hover:text-irs-blue hover:bg-irs-lightGray"
            >
              Forms & Instructions
            </Link>
            {isAdmin && user && (
              <Link
                to="/admin"
                className="block px-3 py-2 rounded-md text-base font-medium text-irs-darkGray hover:text-irs-blue hover:bg-irs-lightGray"
              >
                Admin Dashboard
              </Link>
            )}
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-irs-darkGray hover:text-irs-blue hover:bg-irs-lightGray"
            >
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
