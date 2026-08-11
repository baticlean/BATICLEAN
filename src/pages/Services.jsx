import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import AnimatedSectionTitle from '../components/common/AnimatedSectionTitle';
import { CheckCircle, FileText, ShieldCheck } from 'lucide-react';

const allServices = [
  {
    id: 1,
    title: 'Nettoyage de Fin de Chantier',
    category: 'Gros Œuvre & Second Œuvre',
    description: 'Élimination complète des poussières de ciment, résidus de mortier, traces de peinture, colle et plâtre sur toutes les surfaces neuves.',
    features: [
      'Brossage et décapage mécanique des sols',
      'Nettoyage approfondi des vitres et encadrements',
      'Dépoussiérage des conduits, plinthes et luminaires',
      'Désinfection des sanitaires et pièces d’eau',
    ],
    highlight: 'Idéal avant remise des clés',
  },
  {
    id: 2,
    title: 'Remise en État avant Aménagement',
    category: 'Finition & Livraison',
    description: 'Nettoyage de haute précision pour préparer l’arrivée du mobilier, du matériel informatique ou l’emménagement des résidents.',
    features: [
      'Lavage et lustrage des sols délicats',
      'Nettoyage hygiénique des cuisines et sanitaires',
      'Nettoyage des baies vitrées et verrières',
      'Élimination des micro-poussières en suspension',
    ],
    highlight: 'Prêt à l\'emploi immédiat',
  },
  {
    id: 3,
    title: 'Nettoyage de Façades & Vitrerie Spécialisée',
    category: 'Extérieurs & Façades',
    description: 'Lavage haute pression et nettoyage à la perche télescopique des vitres, baies et bardages extérieurs.',
    features: [
      'Nettoyage des vitres en hauteur',
      'Dépoussiérage des grilles de ventilation',
      'Nettoyage des coursives et balcons',
    ],
    highlight: 'Sécurité et matériel adapté',
  },
];

const Services = () => {
  return (
    <div className="py-16 bg-[#FEFEFE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <AnimatedSectionTitle tag="h1" className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Services & Prestations de <span className="text-[#195D9B]">Nettoyage BTP</span>
          </AnimatedSectionTitle>
          <p className="text-base text-slate-600 leading-relaxed">
            Découvrez nos protocoles spécialisés de nettoyage après construction pour livrer vos bâtiments sans réserve.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {allServices.map((service) => (
            <Card key={service.id} className="p-8 flex flex-col justify-between border-2 border-slate-100 hover:border-[#195D9B]/40">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="primary">{service.category}</Badge>
                  <ShieldCheck className="w-5 h-5 text-[#EF9437]" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">{service.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{service.description}</p>
                <div className="space-y-2.5 pt-2">
                  {service.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-3 text-xs font-semibold text-slate-800">
                      <CheckCircle className="w-4 h-4 text-[#EF9437] flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link to="/devis">
                  <Button variant="secondary" className="w-full justify-center" icon={FileText}>
                    Demander une estimation
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
