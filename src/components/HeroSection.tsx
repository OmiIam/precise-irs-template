
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth';

interface HeroSectionProps {
  onGetStarted?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    // Route to dashboard if signed in, else login
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="w-full bg-irs-darkest pt-32 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-irs-darkest to-irs-darkBlue opacity-90"></div>
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-irs-blue/20 text-irs-lightBlue text-sm font-medium mb-4 animate-fade-in">
            2025 Tax Filing Season
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 animate-slide-in">
            Revenue Service Finance - Your Tax Solution
          </h1>
          <p className="text-irs-lightGray text-lg mb-8 animate-slide-in" style={{ animationDelay: '0.1s' }}>
            Secure and simplified tax filing for individuals and businesses. Get your maximum refund with our advanced tax preparation tools and expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <button 
              onClick={handleGetStarted} 
              className="btn-primary flex items-center justify-center gap-2 py-3 px-6"
            >
              Get Started <ArrowRight size={16} />
            </button>
            <Link to="/refund-status" className="btn-secondary flex items-center justify-center gap-2 py-3 px-6">
              Check Refund Status
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
