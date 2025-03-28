
import React from 'react';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Home, CreditCard, DollarSign, Calendar } from 'lucide-react';

const Pay = () => {
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
                <BreadcrumbPage>Pay</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="max-w-4xl mx-auto mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-irs-darkest mb-6">
              Payment Options
            </h1>
            <p className="text-lg text-irs-darkGray mb-8">
              Choose from multiple secure payment methods to pay your taxes. Make a payment online, by phone, or by mail.
            </p>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
              <div className="bg-irs-darkBlue text-white p-4">
                <h2 className="text-xl font-bold">Make a Payment</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-start">
                  <CreditCard className="text-irs-blue mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-irs-darkBlue mb-2">Pay Online</h3>
                    <p className="text-irs-darkGray mb-3">Pay directly from your bank account or by debit/credit card.</p>
                    <a href="/login" className="btn-primary inline-block">Pay Now</a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <DollarSign className="text-irs-blue mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-irs-darkBlue mb-2">Pay by Mail</h3>
                    <p className="text-irs-darkGray mb-3">Send a check or money order to the appropriate mailing address.</p>
                    <a href="#" className="text-irs-blue hover:text-irs-darkBlue font-medium">View Mailing Addresses</a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="text-irs-blue mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-irs-darkBlue mb-2">Payment Plans</h3>
                    <p className="text-irs-darkGray mb-3">Apply for a payment plan if you can't pay your tax debt immediately.</p>
                    <a href="/login" className="text-irs-blue hover:text-irs-darkBlue font-medium">Apply for a Payment Plan</a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white rounded-lg shadow-md p-6 border border-irs-lightGray">
                <h2 className="text-xl font-bold text-irs-darkBlue mb-4">Payment Deadlines</h2>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-irs-blue rounded-full mr-2"></span>
                    <span>Individual Tax Return: April 15, 2025</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-irs-blue rounded-full mr-2"></span>
                    <span>Estimated Tax Payments: Quarterly</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-irs-blue rounded-full mr-2"></span>
                    <span>Business Taxes: Varies by type</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 border border-irs-lightGray">
                <h2 className="text-xl font-bold text-irs-darkBlue mb-4">Payment Assistance</h2>
                <p className="mb-4">Need help with your tax payment options? Contact our payment support team.</p>
                <a href="tel:+12526912474" className="btn-primary inline-flex items-center">
                  Contact Support
                </a>
              </div>
            </div>
            
            <div className="bg-irs-gray p-6 rounded-lg">
              <h3 className="text-xl font-bold text-irs-darkest mb-3">Important Notice</h3>
              <p className="text-irs-darkGray">
                Late payments may be subject to penalties and interest. If you're unable to pay your tax liability in full, 
                please consider applying for a payment plan or contacting us to discuss your options.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pay;
