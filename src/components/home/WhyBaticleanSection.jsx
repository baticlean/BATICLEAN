import React from 'react';
import Card from '../common/Card';
import AnimatedSectionTitle from '../common/AnimatedSectionTitle';
import { ShieldCheck, Zap, Award, Clock } from 'lucide-react';

const reasons = [
  {
    icon: Award,
    title: '100% Spécialisé BTP',
    desc: 'Contrairement aux entreprises de nettoyage classique, nous maîtrisons le traitement des poussières fines et la chimie des finitions de chantier.',
  },
  {
    icon: Zap,
    title: 'Matériel & Produits Haute Efficacité',
    desc: 'Aspirateurs industriels HEPA, monobrosses professionnelles et produits décapants respectueux des surfaces.',
  },
  {
    icon: ShieldCheck,
    title: 'Normes Sécurité & HSE',
    desc: 'Nos techniciens interviennent munis d’EPI complets (casques, chaussures de sécurité, masques) dans le respect de vos règles de chantier.',
  },
  {
    icon: Clock,
    title: 'Engagements Délais Respectés',
    desc: 'Nous nous synchronisons précisément avec votre planning d’inauguration ou de remise des clés.',
  },
];

const WhyBaticleanSection = () => {
  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <AnimatedSectionTitle className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pourquoi faire confiance à <span className="text-[#195D9B]">Baticlean</span> ?
          </AnimatedSectionTitle>
          <p className="text-sm text-slate-600">
            Une rigueur professionnelle absolue au service des promoteurs, architectes et maîtres d'ouvrage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, idx) => {
            const Icon = reason.icon;
            return (
              <Card key={idx} className="p-6 flex flex-col justify-between hover:border-[#EF9437]/40">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FEF7EE] text-[#EF9437] border border-[#FCDDBA] flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{reason.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{reason.desc}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyBaticleanSection;
