
import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Home, Clock, AlertCircle, CheckCircle2, Search } from 'lucide-react';

const Refunds = () => {
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
                <BreadcrumbPage>Refunds</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="max-w-4xl mx-auto mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-irs-darkest mb-6">
              Tax Refunds
            </h1>
            <p className="text-lg text-irs-darkGray mb-8">
              Check the status of your tax refund, learn about refund timing, and get answers to frequently asked questions.
            </p>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
              <div className="bg-irs-blue text-white p-4">
                <h2 className="text-xl font-bold">Check Your Refund Status</h2>
              </div>
              <div className="p-6">
                <p className="mb-6">To check your refund status, you will need:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Your Social Security Number or ITIN</li>
                  <li>Your filing status</li>
                  <li>Your exact refund amount</li>
                </ul>
                <a href="/refund-status" className="btn-primary inline-flex items-center">
                  Check Refund Status <Search className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-irs-darkest mb-4">Refund Timeline</h2>
            <div className="bg-white rounded-lg shadow-md p-6 border border-irs-lightGray mb-8">
              <div className="space-y-6">
                <div className="flex items-start">
                  <Clock className="text-irs-blue mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-irs-darkBlue mb-1">E-Filed Returns</h3>
                    <p className="text-irs-darkGray">Most refunds are issued within 21 days of e-filing.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <AlertCircle className="text-irs-blue mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-irs-darkBlue mb-1">Paper Returns</h3>
                    <p className="text-irs-darkGray">Paper returns may take 6-8 weeks to process.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle2 className="text-irs-blue mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-irs-darkBlue mb-1">Direct Deposit</h3>
                    <p className="text-irs-darkGray">The fastest way to receive your refund is through direct deposit to your bank account.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-irs-darkest mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4 mb-12">
              <div className="bg-white rounded-lg shadow-sm p-4 border border-irs-lightGray">
                <h3 className="font-bold text-irs-darkBlue mb-1">Why is my refund taking longer than expected?</h3>
                <p className="text-irs-darkGray">Refunds may be delayed if your return requires additional review, contains errors, or claims certain credits.</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4 border border-irs-lightGray">
                <h3 className="font-bold text-irs-darkBlue mb-1">Can I call to check my refund status?</h3>
                <p className="text-irs-darkGray">Our online "Where's My Refund?" tool is the fastest way to check. Phone representatives have access to the same information.</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4 border border-irs-lightGray">
                <h3 className="font-bold text-irs-darkBlue mb-1">How can I change my direct deposit information?</h3>
                <p className="text-irs-darkGray">After your return is processed, you cannot change your banking information. Contact your bank if there are any issues.</p>
              </div>
            </div>
            
            <div className="bg-irs-gray p-6 rounded-lg">
              <h3 className="text-xl font-bold text-irs-darkest mb-3">Need Assistance?</h3>
              <p className="mb-4">If you have questions about your refund that aren't answered here, contact our refund assistance team.</p>
              <a href="tel:+12526912474" className="text-irs-blue hover:text-irs-darkBlue font-medium">
                Call +1-252-691-2474
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Refunds;
