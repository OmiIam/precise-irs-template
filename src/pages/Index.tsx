
import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { QuickLinks } from '@/components/QuickLinks';
import { ActivityMonitor } from '@/components/home/ActivityMonitor';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { NewsSection } from '@/components/home/NewsSection';
import { ResourcesSection } from '@/components/home/ResourcesSection';
import { CTASection } from '@/components/home/CTASection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ActivityMonitor />
      
      <main className="flex-grow">
        <HeroSection />
        <FeaturedSection />
        <QuickLinks />
        <NewsSection />
        <ResourcesSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
