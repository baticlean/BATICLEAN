import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import AnimatedSectionTitle from '../common/AnimatedSectionTitle';
import { CheckCircle2, Check, ArrowRight } from 'lucide-react';

const services = [
  {
    id: 1,
    title: 'Nettoyage de Fin de Chantier',
    desc: 'Dépoussiérage méthodique, élimination des résidus de ciment, peinture, colle et plâtre sur toutes les surfaces neuves.',
    features: ['Sols & Plinthes', 'Baies Vitrées', 'Sanitaires & Conduits'],
  },
  {
    id: 2,
    title: 'Remise en État avant Aménagement',
    desc: 'Nettoyage approfondi de livraison pour bureaux, appartements neufs, commerces et bâtiments institutionnels.',
    features: ['Brossage Mécanique', 'Lavage des Vitres', 'Lustrage Sols'],
  },
  {
    id: 3,
    title: 'Nettoyage Vitrerie & Façades',
    desc: 'Lavage professionnel à la perche télescopique des verrières, façades vitrées et fenêtres de hauteur.',
    features: ['Vitres de Hauteur', 'Encadrements Alum', 'Abris & Verrières'],
  },
];

const ServicesOverviewSection = () => {
  return (
    <section className="py-20 bg-[#FEFEFE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <AnimatedSectionTitle className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Des services de nettoyage adaptés à <span className="text-[#195D9B]">vos exigences</span>
          </AnimatedSectionTitle>
          <p className="text-sm text-slate-600">
            Chaque intervention est exécutée selon des règles d'hygiène et de sécurité strictes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((srv) => (
            <Card key={srv.id} className="p-8 border-2 border-slate-100 flex flex-col justify-between hover:border-[#195D9B]/40">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EBF4FC] text-[#195D9B] flex items-center justify-center border border-[#ADD1F3]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{srv.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{srv.desc}</p>
                <div className="space-y-2 pt-2">
                  {srv.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <Check className="w-4 h-4 text-[#EF9437]" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link to="/devis">
                  <Button variant="outline" size="sm" className="w-full justify-center" icon={ArrowRight}>
                    Obtenir une estimation
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesOverviewSection;
