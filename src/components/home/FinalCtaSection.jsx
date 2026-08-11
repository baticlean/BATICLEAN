import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, CheckCircle2 } from 'lucide-react';
import Button from '../common/Button';

const FinalCtaSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#195D9B] via-[#154E83] to-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#EF9437]/15 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#EF9437] text-white text-sm sm:text-base font-extrabold shadow-xl shadow-[#EF9437]/30 border-2 border-white/30 tracking-wide transform hover:scale-105 transition-all">
          <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
          <span>Votre Chantier touche à sa fin ?</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
          Assurez une livraison sans réserve grâce à l'expertise <span className="text-[#EF9437]">Baticlean</span>.
        </h2>

        <p className="text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
          Demandez une estimation personnalisée en 7 étapes simples ou prenez rendez-vous pour une visite technique sur site.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/devis">
            <Button variant="secondary" size="lg" icon={FileText} className="w-full sm:w-auto">
              Demander mon devis gratuit
            </Button>
          </Link>
          <Link to="/rendez-vous">
            <Button variant="outline" size="lg" icon={Calendar} className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-[#195D9B]">
              Planifier une visite technique
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FinalCtaSection;
