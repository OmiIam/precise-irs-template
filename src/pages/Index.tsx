
import React, { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { QuickLinks } from '@/components/QuickLinks';
import { InfoCard } from '@/components/InfoCard';
import { Calendar, AlertCircle, Clock, DollarSign, Users, PiggyBank, LifeBuoy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useActivityTimer } from '@/hooks/user-management/useActivityTimer';

const Index = () => {
  const { user } = useAuth();
  const { resetActivityTimer } = useActivityTimer();
  
  // If user is logged in, monitor their activity
  useEffect(() => {
    if (user) {
      const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart'];
      
      const handleUserActivity = () => {
        resetActivityTimer();
      };
      
      activityEvents.forEach(event => {
        window.addEventListener(event, handleUserActivity);
      });
      
      return () => {
        activityEvents.forEach(event => {
          window.removeEventListener(event, handleUserActivity);
        });
      };
    }
  }, [user, resetActivityTimer]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        
        {/* Featured blocks */}
        <section className="py-12 bg-irs-gray">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InfoCard
                title="Lorem Ipsum Dolor"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis."
                ctaText="Learn More"
                icon={<Calendar size={24} />}
              />
              
              <InfoCard
                title="Consectetur Adipiscing"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis."
                ctaText="View Details"
                variant="featured"
                icon={<AlertCircle size={24} />}
              />
              
              <InfoCard
                title="Ut Elit Tellus"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis."
                ctaText="Get Started"
                icon={<Clock size={24} />}
              />
            </div>
          </div>
        </section>
        
        <QuickLinks />
        
        {/* News & Updates */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-irs-darkest mb-4">
                News & Updates
              </h2>
              <p className="text-irs-darkGray max-w-2xl mx-auto">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <NewsCard
                date="March 15, 2023"
                title="Lorem ipsum dolor sit amet, consectetur adipiscing"
                excerpt="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo."
              />
              
              <NewsCard
                date="March 10, 2023"
                title="Ut elit tellus, luctus nec ullamcorper mattis"
                excerpt="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo."
              />
              
              <NewsCard
                date="March 5, 2023"
                title="Pulvinar dapibus leo, consectetur adipiscing elit"
                excerpt="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo."
              />
            </div>
            
            <div className="text-center mt-8">
              <a href="#" className="btn-secondary">
                View All News
              </a>
            </div>
          </div>
        </section>
        
        {/* Resources Section */}
        <section className="py-12 bg-irs-gray">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-irs-darkest mb-4">
                Resources & Tools
              </h2>
              <p className="text-irs-darkGray max-w-2xl mx-auto">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <ResourceCard
                icon={<DollarSign size={24} />}
                title="Tax Estimator"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              />
              
              <ResourceCard
                icon={<Users size={24} />}
                title="Find a Tax Professional"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              />
              
              <ResourceCard
                icon={<PiggyBank size={24} />}
                title="Retirement Calculator"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              />
              
              <ResourceCard
                icon={<LifeBuoy size={24} />}
                title="Get Help"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              />
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-irs-blue text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </h2>
            <p className="max-w-2xl mx-auto mb-8 opacity-90">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#" className="bg-white text-irs-blue hover:bg-irs-gray transition-colors duration-200 font-semibold px-6 py-3 rounded">
                Get Started
              </a>
              <a href="#" className="border border-white text-white hover:bg-irs-blue/80 transition-colors duration-200 font-semibold px-6 py-3 rounded">
                Learn More
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

interface NewsCardProps {
  date: string;
  title: string;
  excerpt: string;
}

const NewsCard = ({ date, title, excerpt }: NewsCardProps) => (
  <div className="bg-white border border-irs-lightGray rounded-lg overflow-hidden card-hover">
    <div className="p-6">
      <div className="text-sm text-irs-blue font-medium mb-2">{date}</div>
      <h3 className="font-bold text-lg text-irs-darkest mb-3">{title}</h3>
      <p className="text-irs-darkGray text-sm mb-4">{excerpt}</p>
      <a href="#" className="text-irs-blue hover:text-irs-darkBlue transition-colors duration-200 inline-flex items-center text-sm font-medium">
        Read More <span className="ml-1">→</span>
      </a>
    </div>
  </div>
);

interface ResourceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ResourceCard = ({ icon, title, description }: ResourceCardProps) => (
  <div className="bg-white rounded-lg p-6 text-center card-hover">
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-irs-blue/10 text-irs-blue mb-4">
      {icon}
    </div>
    <h3 className="font-bold text-lg text-irs-darkest mb-2">{title}</h3>
    <p className="text-irs-darkGray text-sm mb-4">{description}</p>
    <a href="#" className="text-irs-blue hover:text-irs-darkBlue transition-colors duration-200 inline-flex items-center text-sm font-medium">
      Explore <span className="ml-1">→</span>
    </a>
  </div>
);

export default Index;
