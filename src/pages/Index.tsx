
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { SearchBar } from '@/components/SearchBar';
import { QuickLinks } from '@/components/QuickLinks';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { NewsSection } from '@/components/home/NewsSection';
import { CTASection } from '@/components/home/CTASection';
import { ResourcesSection } from '@/components/home/ResourcesSection';
import { ActivityMonitor } from '@/components/home/ActivityMonitor';
import { useAuth } from '@/contexts/auth';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection onGetStarted={handleGetStarted} />
        <div className="container mx-auto px-4 py-8">
          <SearchBar />
          <QuickLinks />
          <FeaturedSection />
          <NewsSection />
          <CTASection />
          <ResourcesSection />
          <ActivityMonitor />
        </div>
      </main>
    </div>
  );
};

export default Index;
