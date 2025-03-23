
import React, { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { QuickLinks } from '@/components/QuickLinks';
import { InfoCard } from '@/components/InfoCard';
import { Calendar, AlertCircle, Clock, DollarSign, Users, PiggyBank, LifeBuoy } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
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
                title="Tax Filing Made Easy"
                description="File your taxes with confidence using our step-by-step guidance and smart tools designed to maximize your refund."
                ctaText="Learn More"
                icon={<Calendar size={24} />}
              />
              
              <InfoCard
                title="Tax Deadline Approaching"
                description="Don't miss important tax deadlines. Stay on track with our tax calendar and timely reminders for filing and payments."
                ctaText="View Details"
                variant="featured"
                icon={<AlertCircle size={24} />}
              />
              
              <InfoCard
                title="Track Your Refund"
                description="Check the status of your tax refund in real-time. Know exactly when your money will arrive with our accurate tracking system."
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
                Stay informed with the latest tax news, updates, and changes that may affect your filing status and tax situation.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <NewsCard
                date="March 15, 2023"
                title="New Tax Credits Available for Qualified Families"
                excerpt="The IRS has announced new tax credits for families with children under 17. Find out if you qualify and how to claim these credits on your next tax return."
              />
              
              <NewsCard
                date="March 10, 2023"
                title="Extended Filing Deadline for Natural Disaster Areas"
                excerpt="Taxpayers in federally declared disaster areas now have additional time to file their tax returns. Check if your location qualifies for this extension."
              />
              
              <NewsCard
                date="March 5, 2023"
                title="Important Changes to Retirement Account Contributions"
                excerpt="New legislation has modified contribution limits for 401(k)s and IRAs. Learn about these changes and how they might impact your retirement planning."
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
                Take advantage of our comprehensive resources and interactive tools designed to simplify your tax experience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <ResourceCard
                icon={<DollarSign size={24} />}
                title="Tax Estimator"
                description="Calculate your potential tax liability or refund with our easy-to-use tax estimation tool."
              />
              
              <ResourceCard
                icon={<Users size={24} />}
                title="Find a Tax Professional"
                description="Connect with certified tax professionals in your area who can help with complex tax situations."
              />
              
              <ResourceCard
                icon={<PiggyBank size={24} />}
                title="Retirement Calculator"
                description="Plan for your future with our retirement calculator and tax-advantaged investment options."
              />
              
              <ResourceCard
                icon={<LifeBuoy size={24} />}
                title="Get Help"
                description="Access our comprehensive support center for answers to your tax questions and filing assistance."
              />
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-irs-blue text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Take the stress out of tax season with expert guidance
            </h2>
            <p className="max-w-2xl mx-auto mb-8 opacity-90">
              Our tax professionals are ready to help you navigate complexities, maximize deductions, and ensure accurate filing. Don't face tax season alone.
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
