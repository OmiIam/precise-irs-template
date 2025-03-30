
'use client';

import React from 'react';
import { Header } from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturedSection from '@/components/home/FeaturedSection';
import CTASection from '@/components/home/CTASection';
import NewsSection from '@/components/home/NewsSection';
import ResourcesSection from '@/components/home/ResourcesSection';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-irs-gray">
      <Header />
      <main>
        <HeroSection />
        <FeaturedSection />
        <CTASection />
        <NewsSection />
        <ResourcesSection />
      </main>
      <Footer />
    </div>
  );
}
