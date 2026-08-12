import React from 'react';
import TestimonialsSection from '../components/common/TestimonialsSection';
import FinalCtaSection from '../components/home/FinalCtaSection';

const AvisPage = () => {
  return (
    <div className="py-12 bg-[#FEFEFE] min-h-screen space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Avis & Témoignages <span className="text-[#195D9B]">Clients</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Retrouvez les évaluations en direct et retours d'expérience déposés par les promoteurs immobiliers, architectes et gestionnaires d'ouvrages après intervention de nos équipes.
        </p>
      </div>

      <TestimonialsSection hideHeader={true} />
      <FinalCtaSection />
    </div>
  );
};

export default AvisPage;
