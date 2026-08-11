import React from 'react';
import Card from '../common/Card';
import AnimatedSectionTitle from '../common/AnimatedSectionTitle';
import { Building2 } from 'lucide-react';

const partners = [
  { name: 'Entreprises Générales de BTP', desc: 'Accompagnement des grands constructeurs lors des livraisons de programmes immobiliers.' },
  { name: 'Cabinet d’Architecture & Maîtrise d’Œuvre', desc: 'Valorisation des finitions architecturales avant présentation aux clients.' },
  { name: 'Promoteurs Immobiliers', desc: 'Remise en état impeccable pour une prise en main immédiate par les acquéreurs.' },
  { name: 'Gestionnaires de Patrimoine & Syndics', desc: 'Nettoyage approfondi des parties communes et espaces tertiaires.' },
];

const PartnersSection = () => {
  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <AnimatedSectionTitle className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Partenaire privilégié des <span className="text-[#195D9B]">acteurs du BTP</span>.
          </AnimatedSectionTitle>
          <p className="text-sm text-slate-600">
            Nous travaillons en étroite collaboration avec l'ensemble des corps d'État du bâtiment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {partners.map((partner, idx) => (
            <Card key={idx} className="p-6 space-y-4 hover:border-[#195D9B]/30">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF4FC] text-[#195D9B] flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{partner.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{partner.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
