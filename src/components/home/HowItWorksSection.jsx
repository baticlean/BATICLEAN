import React from 'react';
import AnimatedSectionTitle from '../common/AnimatedSectionTitle';
import { ClipboardCheck, MapPin, FileCheck, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: ClipboardCheck,
    title: 'Demande & Estimation',
    desc: 'Vous remplissez notre formulaire en ligne avec les caractéristiques de votre bâtiment.',
  },
  {
    num: '02',
    icon: MapPin,
    title: 'Visite Technique sur Site',
    desc: 'Nos experts évaluent les contraintes d’accès, les matériaux et la surface exacte.',
  },
  {
    num: '03',
    icon: FileCheck,
    title: 'Devis Détaillé sous 24h',
    desc: 'Réception d’un chiffrage transparent et conforme aux exigences du cahier des charges.',
  },
  {
    num: '04',
    icon: CheckCircle2,
    title: 'Intervention & Livraison',
    desc: 'Nos équipes qualifiées nettoient et remettent en état l’ouvrage prêt pour la réception.',
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <AnimatedSectionTitle className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Comment se déroule <span className="text-[#EF9437]">votre intervention</span> ?
          </AnimatedSectionTitle>
          <p className="text-sm text-slate-400">
            Un processus structuré et transparent pour vous garantir une sérénité totale jusqu'à la remise des clés.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-extrabold text-[#EF9437]/80">{step.num}</span>
                  <div className="w-10 h-10 rounded-xl bg-[#195D9B] text-white flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
