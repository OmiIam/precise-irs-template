
import React from 'react';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Home, DollarSign, Users, Briefcase, GraduationCap, Heart } from 'lucide-react';

const CreditsDeductions = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32">
        <div className="container mx-auto px-4">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Credits & Deductions</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="max-w-4xl mx-auto mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-irs-darkest mb-6">
              Tax Credits & Deductions
            </h1>
            <p className="text-lg text-irs-darkGray mb-8">
              Discover tax credits and deductions you may qualify for to reduce your tax liability and potentially increase your refund.
            </p>
            
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-irs-darkest mb-6">Popular Tax Credits</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 border border-irs-lightGray">
                  <div className="flex items-start">
                    <Users className="text-irs-blue mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-irs-darkBlue mb-2">Child Tax Credit</h3>
                      <p className="text-irs-darkGray mb-3">Up to $2,000 per qualifying child under age 17.</p>
                      <a href="#" className="text-irs-blue hover:text-irs-darkBlue font-medium">Learn More</a>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 border border-irs-lightGray">
                  <div className="flex items-start">
                    <GraduationCap className="text-irs-blue mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-irs-darkBlue mb-2">Education Credits</h3>
                      <p className="text-irs-darkGray mb-3">American Opportunity and Lifetime Learning credits for education expenses.</p>
                      <a href="#" className="text-irs-blue hover:text-irs-darkBlue font-medium">Learn More</a>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 border border-irs-lightGray">
                  <div className="flex items-start">
                    <DollarSign className="text-irs-blue mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-irs-darkBlue mb-2">Earned Income Tax Credit</h3>
                      <p className="text-irs-darkGray mb-3">A benefit for working people with low to moderate income.</p>
                      <a href="#" className="text-irs-blue hover:text-irs-darkBlue font-medium">Learn More</a>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 border border-irs-lightGray">
                  <div className="flex items-start">
                    <Briefcase className="text-irs-blue mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-irs-darkBlue mb-2">Retirement Savings Contributions Credit</h3>
                      <p className="text-irs-darkGray mb-3">Credit for eligible contributions to retirement accounts.</p>
                      <a href="#" className="text-irs-blue hover:text-irs-darkBlue font-medium">Learn More</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-irs-darkest mb-6">Common Tax Deductions</h2>
              
              <div className="bg-white rounded-lg shadow-md p-6 border border-irs-lightGray space-y-6">
                <div>
                  <h3 className="font-bold text-irs-darkBlue mb-2">Standard Deduction</h3>
                  <p className="text-irs-darkGray">For 2025, the standard deduction amounts are:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Single: $13,850</li>
                    <li>Married Filing Jointly: $27,700</li>
                    <li>Head of Household: $20,800</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-irs-darkBlue mb-2">Itemized Deductions</h3>
                  <p className="text-irs-darkGray">Common itemized deductions include:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Mortgage interest</li>
                    <li>State and local taxes (up to $10,000)</li>
                    <li>Medical expenses (exceeding 7.5% of AGI)</li>
                    <li>Charitable contributions</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-irs-darkBlue mb-2">Business Deductions</h3>
                  <p className="text-irs-darkGray">If you're self-employed or own a business, you may be eligible for various business expense deductions.</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-irs-darkBlue mb-2">Health Savings Account (HSA)</h3>
                  <p className="text-irs-darkGray">Contributions to an HSA are tax-deductible and withdrawals for qualified medical expenses are tax-free.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-irs-gray p-6 rounded-lg">
              <div className="flex items-start">
                <Heart className="text-irs-red mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-irs-darkest mb-3">Maximize Your Benefits</h3>
                  <p className="text-irs-darkGray mb-4">
                    Not sure which credits and deductions you qualify for? Let our tax professionals help you maximize your tax benefits.
                  </p>
                  <a href="/login" className="btn-primary inline-block">Get Started</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreditsDeductions;
