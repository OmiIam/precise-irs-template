
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Youtube, Instagram, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Footer = () => {
  return (
    <footer className="bg-irs-darkest text-white">
      <div className="container mx-auto px-4">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Tax Services</h3>
            <ul className="space-y-2">
              <FooterLink href="#">Individual Tax Filing</FooterLink>
              <FooterLink href="#">Business Tax Services</FooterLink>
              <FooterLink href="#">Tax Preparation</FooterLink>
              <FooterLink href="#">Tax Planning</FooterLink>
              <FooterLink href="#">Audit Assistance</FooterLink>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold">About Us</h3>
            <ul className="space-y-2">
              <FooterLink href="#">Our Mission</FooterLink>
              <FooterLink href="#">Leadership Team</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Press Releases</FooterLink>
              <FooterLink href="#">Contact Us</FooterLink>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Resources</h3>
            <ul className="space-y-2">
              <FooterLink href="#">Tax Calculators</FooterLink>
              <FooterLink href="#">Tax Forms</FooterLink>
              <FooterLink href="#">Filing Deadlines</FooterLink>
              <FooterLink href="#">Tax Guides</FooterLink>
              <FooterLink href="#">FAQ</FooterLink>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Connect With Us</h3>
            <div className="flex space-x-4">
              <SocialLink href="#" icon={<Facebook size={20} />} label="Facebook" />
              <SocialLink href="#" icon={<Twitter size={20} />} label="Twitter" />
              <SocialLink href="#" icon={<Youtube size={20} />} label="YouTube" />
              <SocialLink href="#" icon={<Instagram size={20} />} label="Instagram" />
              <SocialLink href="#" icon={<Linkedin size={20} />} label="LinkedIn" />
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Sign up for updates</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email address"
                  className="px-3 py-2 rounded-l-md text-irs-darkGray focus:outline-none focus:ring-2 focus:ring-irs-blue w-full"
                />
                <button className="bg-irs-blue hover:bg-irs-darkBlue transition-colors duration-200 px-4 py-2 rounded-r-md">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom footer */}
        <div className="border-t border-irs-darkBlue py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-sm text-irs-lightGray">
                © 2025 Revenue Service Finance Internal Revenue Service. All Rights Reserved.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#" className="text-sm text-irs-lightGray hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <span className="text-irs-darkBlue">|</span>
              <a href="#" className="text-sm text-irs-lightGray hover:text-white transition-colors duration-200">
                Terms of Service
              </a>
              <span className="text-irs-darkBlue">|</span>
              <a href="#" className="text-sm text-irs-lightGray hover:text-white transition-colors duration-200">
                Accessibility
              </a>
              <span className="text-irs-darkBlue">|</span>
              <a href="#" className="text-sm text-irs-lightGray hover:text-white transition-colors duration-200">
                Site Map
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <a 
      href={href} 
      className="text-irs-lightGray hover:text-white transition-colors duration-200 text-sm"
    >
      {children}
    </a>
  </li>
);

const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <a 
    href={href}
    aria-label={label}
    className="text-white hover:text-irs-lightBlue transition-colors duration-200 bg-irs-darkBlue/40 hover:bg-irs-darkBlue/60 p-2 rounded-full"
  >
    {icon}
  </a>
);
