
import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Home, FileText, ArrowRight } from 'lucide-react';

const File = () => {
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
                <BreadcrumbPage>File</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="max-w-4xl mx-auto mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-irs-darkest mb-6">
              File Your Taxes
            </h1>
            <p className="text-lg text-irs-darkGray mb-8">
              Choose the filing option that works best for you. Whether you're filing for the first time or a seasoned taxpayer, we have solutions designed to make filing as simple as possible.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white rounded-lg shadow-md p-6 border border-irs-lightGray">
                <h2 className="text-xl font-bold text-irs-darkBlue mb-4">Individual Filing</h2>
                <p className="mb-4">File your personal income tax return securely online with step-by-step guidance.</p>
                <a href="/login" className="btn-primary inline-flex items-center">
                  Start Filing <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 border border-irs-lightGray">
                <h2 className="text-xl font-bold text-irs-darkBlue mb-4">Business Filing</h2>
                <p className="mb-4">Specialized filing options for corporations, partnerships, and small businesses.</p>
                <a href="/login" className="btn-primary inline-flex items-center">
                  Start Filing <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-irs-darkest mb-4">Filing Options</h2>
            <div className="bg-white rounded-lg shadow-md p-6 border border-irs-lightGray mb-8">
              <div className="space-y-4">
                <div className="flex items-start">
                  <FileText className="text-irs-blue mt-1 mr-4" />
                  <div>
                    <h3 className="font-bold text-irs-darkBlue">E-File</h3>
                    <p className="text-irs-darkGray">Fast, secure electronic filing with direct deposit for quicker refunds.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FileText className="text-irs-blue mt-1 mr-4" />
                  <div>
                    <h3 className="font-bold text-irs-darkBlue">Free File</h3>
                    <p className="text-irs-darkGray">Free guided tax preparation for eligible taxpayers.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FileText className="text-irs-blue mt-1 mr-4" />
                  <div>
                    <h3 className="font-bold text-irs-darkBlue">Tax Professional</h3>
                    <p className="text-irs-darkGray">Find an authorized tax professional to prepare and file your taxes.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-irs-gray p-6 rounded-lg">
              <h3 className="text-xl font-bold text-irs-darkest mb-3">Need Help?</h3>
              <p className="mb-4">Contact our filing assistance team for support with your tax filing.</p>
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

export default File;
