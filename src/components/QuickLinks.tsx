
import React from 'react';
import { ArrowRight, FileText, CreditCard, AlertTriangle, FileSearch, Calendar, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const QuickLinks = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-irs-darkest mb-4">
            Quick Links
          </h2>
          <p className="text-irs-darkGray max-w-2xl mx-auto">
            Access the resources and tools you need to file your taxes, check refund status, and manage your tax account.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickLinkCard 
            icon={<FileText />}
            title="Forms & Instructions" 
            description="Access tax forms, instructions, and publications for all filing needs." 
            links={[
              {label: "Form 1040", url: "#"},
              {label: "Form W-2", url: "#"},
              {label: "Form 1099", url: "#"},
              {label: "View all forms", url: "#"},
            ]}
          />
          
          <QuickLinkCard 
            icon={<CreditCard />}
            title="Payments" 
            description="Make tax payments securely and easily with multiple payment options." 
            links={[
              {label: "Direct Pay", url: "#"},
              {label: "Payment Plans", url: "#"},
              {label: "Pay by Card", url: "#"},
              {label: "View all payment options", url: "#"},
            ]}
          />
          
          <QuickLinkCard 
            icon={<FileSearch />}
            title="Refunds" 
            description="Check the status of your refund and explore refund options." 
            links={[
              {label: "Check Refund Status", url: "#"},
              {label: "Direct Deposit", url: "#"},
              {label: "Refund Timing", url: "#"},
              {label: "Refund FAQs", url: "#"},
            ]}
          />
          
          <QuickLinkCard 
            icon={<Calendar />}
            title="Filing Information" 
            description="Get important dates, deadlines, and filing options for tax season." 
            links={[
              {label: "Filing Deadlines", url: "#"},
              {label: "Extensions", url: "#"},
              {label: "Free File Options", url: "#"},
              {label: "E-file", url: "#"},
            ]}
          />
          
          <QuickLinkCard 
            icon={<AlertTriangle />}
            title="Tax Scam Alerts" 
            description="Protect yourself from tax scams and identity theft with official guidance." 
            links={[
              {label: "Report Phishing", url: "#"},
              {label: "Identity Theft", url: "#"},
              {label: "Recent Scams", url: "#"},
              {label: "Security Tips", url: "#"},
            ]}
          />
          
          <QuickLinkCard 
            icon={<HelpCircle />}
            title="Help & Resources" 
            description="Find assistance, answers, and resources for all your tax questions." 
            links={[
              {label: "Contact Us", url: "#"},
              {label: "Taxpayer Advocate", url: "#"},
              {label: "FAQs", url: "#"},
              {label: "Find Local Office", url: "#"},
            ]}
          />
        </div>
      </div>
    </section>
  );
};

interface QuickLinkCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  links: {label: string; url: string}[];
}

const QuickLinkCard = ({ icon, title, description, links }: QuickLinkCardProps) => {
  return (
    <div className="info-card card-hover">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-irs-blue p-2 bg-irs-gray rounded-full">
          {icon}
        </div>
        <h3 className="font-bold text-lg text-irs-darkest">{title}</h3>
      </div>
      <p className="text-irs-darkGray mb-4 text-sm">{description}</p>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <a href={link.url} className="quick-link text-sm">
              <ArrowRight size={14} />
              <span>{link.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
