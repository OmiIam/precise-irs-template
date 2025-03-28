
import React from 'react';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Home, FileText, Download, Search, Filter } from 'lucide-react';

const FormsInstructions = () => {
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
                <BreadcrumbPage>Forms & Instructions</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="max-w-4xl mx-auto mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-irs-darkest mb-6">
              Tax Forms & Instructions
            </h1>
            <p className="text-lg text-irs-darkGray mb-8">
              Find and download the tax forms and instructions you need for filing your federal tax return.
            </p>
            
            <div className="bg-white rounded-lg shadow-md p-6 border border-irs-lightGray mb-10">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-irs-darkGray" />
                    <input 
                      type="text" 
                      placeholder="Search forms by number or name..." 
                      className="w-full pl-10 pr-4 py-2 border border-irs-lightGray rounded-md focus:outline-none focus:ring-2 focus:ring-irs-blue"
                    />
                  </div>
                </div>
                <div>
                  <button className="btn-secondary flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter Forms
                  </button>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-irs-darkest mb-4">Popular Forms</h2>
            <div className="space-y-4 mb-10">
              <FormItem 
                number="1040" 
                title="U.S. Individual Income Tax Return" 
                description="The main form used by individuals to file their annual income tax returns."
              />
              
              <FormItem 
                number="W-4" 
                title="Employee's Withholding Certificate" 
                description="Used to determine the correct amount of federal income tax to withhold from your paycheck."
              />
              
              <FormItem 
                number="W-2" 
                title="Wage and Tax Statement" 
                description="Form received from employers showing wages earned and taxes withheld."
              />
              
              <FormItem 
                number="4868" 
                title="Application for Automatic Extension of Time" 
                description="Extends the time to file your return by six months."
              />
              
              <FormItem 
                number="1099" 
                title="Various Information Returns" 
                description="Series of forms reporting various types of income other than wages, salaries, and tips."
              />
            </div>
            
            <h2 className="text-2xl font-bold text-irs-darkest mb-4">Form Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-white rounded-lg shadow-md p-5 border border-irs-lightGray hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-irs-darkBlue mb-2">Individual Tax Forms</h3>
                <p className="text-irs-darkGray mb-3">Forms used by individuals for filing federal income tax returns.</p>
                <a href="#" className="text-irs-blue hover:text-irs-darkBlue font-medium">View Forms</a>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-5 border border-irs-lightGray hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-irs-darkBlue mb-2">Business Tax Forms</h3>
                <p className="text-irs-darkGray mb-3">Forms for corporations, partnerships, and small businesses.</p>
                <a href="#" className="text-irs-blue hover:text-irs-darkBlue font-medium">View Forms</a>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-5 border border-irs-lightGray hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-irs-darkBlue mb-2">Information Returns</h3>
                <p className="text-irs-darkGray mb-3">Forms used to report various types of income other than wages.</p>
                <a href="#" className="text-irs-blue hover:text-irs-darkBlue font-medium">View Forms</a>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-5 border border-irs-lightGray hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-irs-darkBlue mb-2">Employment Tax Forms</h3>
                <p className="text-irs-darkGray mb-3">Forms for employers regarding payroll taxes and employment taxes.</p>
                <a href="#" className="text-irs-blue hover:text-irs-darkBlue font-medium">View Forms</a>
              </div>
            </div>
            
            <div className="bg-irs-gray p-6 rounded-lg">
              <h3 className="text-xl font-bold text-irs-darkest mb-3">Need Specific Form Assistance?</h3>
              <p className="text-irs-darkGray mb-4">
                If you need help finding or understanding a specific tax form, our tax professionals are available to assist you.
              </p>
              <a href="tel:+12526912474" className="btn-primary inline-flex items-center">
                Get Help With Forms
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const FormItem = ({ number, title, description }: { number: string; title: string; description: string }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-irs-lightGray hover:shadow-md transition-shadow">
      <div className="flex items-start">
        <div className="bg-irs-blue/10 p-3 rounded-lg mr-4">
          <FileText className="text-irs-blue" />
        </div>
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
            <h3 className="font-bold text-irs-darkBlue">Form {number}: {title}</h3>
            <a 
              href="#" 
              className="text-irs-blue hover:text-irs-darkBlue flex items-center mt-1 sm:mt-0 text-sm"
            >
              <Download className="h-4 w-4 mr-1" /> Download PDF
            </a>
          </div>
          <p className="text-irs-darkGray text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default FormsInstructions;
