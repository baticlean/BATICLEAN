import React from 'react';
import TestimonialsSection from '../components/common/TestimonialsSection';
import FinalCtaSection from '../components/home/FinalCtaSection';
import { Star } from 'lucide-react';

const AvisPage = () => {
  return (
    <div className="py-12 bg-[#FEFEFE] min-h-screen space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#FEF7EE] border border-[#FDE6D2] px-3.5 py-1.5 rounded-full text-xs font-extrabold text-[#EF9437] shadow-sm">
          <Star className="w-3.5 h-3.5 fill-[#EF9437]" />
          <span>Avis Certifiés & Retours d'Expérience</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
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
