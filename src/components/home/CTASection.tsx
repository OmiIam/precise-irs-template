
import React from 'react';

export const CTASection = () => {
  return (
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
  );
};
