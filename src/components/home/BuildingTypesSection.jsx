import React from 'react';
import Card from '../common/Card';
import AnimatedSectionTitle from '../common/AnimatedSectionTitle';
import HorizontalCarousel from '../common/HorizontalCarousel';
import { Building2, Home, Hotel, School, Stethoscope, Store, Warehouse, Landmark, Building, Layers } from 'lucide-react';

const buildingTypes = [
  { icon: Home, title: 'Appartements & Résidences', desc: 'Nettoyage minutieux des logements neufs avant livraison aux acquéreurs.' },
  { icon: Building, title: 'Maisons Individuelles', desc: 'Dépoussiérage et décapage complet des surfaces intérieures et extérieures.' },
  { icon: Building2, title: 'Immeubles Résidentiels', desc: 'Parties communes, escaliers, halls d’entrée et monte-charges.' },
  { icon: Layers, title: 'Bureaux & Sièges Sociaux', desc: 'Espaces de travail professionnels prêts à accueillir les collaborateurs.' },
  { icon: School, title: 'Écoles & Établissements', desc: 'Nettoyage et désinfection complète des salles de classe et réfectoires.' },
  { icon: Stethoscope, title: 'Hôpitaux & Cliniques', desc: 'Protocoles de propreté et désinfection stricts pour le secteur de la santé.' },
  { icon: Hotel, title: 'Hôtels & Résidences', desc: 'Chambres, lobbys et espaces de restauration remis à neuf.' },
  { icon: Store, title: 'Commerces & Boutiques', desc: 'Vitrines, espaces de vente et réserves nettoyés avant ouverture.' },
  { icon: Warehouse, title: 'Entrepôts & Logistique', desc: 'Nettoyage industriel des sols en béton et dépoussiérage de structures.' },
  { icon: Landmark, title: 'Bâtiments Institutionnels', desc: 'Nettoyage de chantiers publics et espaces administratifs.' },
];

const BuildingTypesSection = () => {
  return (
    <section className="py-12 sm:py-20 bg-slate-50 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <AnimatedSectionTitle className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Une expertise adaptée à <span className="text-[#195D9B]">chaque type de bâtiment</span>.
          </AnimatedSectionTitle>
          <p className="text-xs sm:text-base text-slate-600">
            Nos équipes qualifiées maîtrisent les contraintes spécifiques de chaque infrastructure pour garantir un résultat impeccable.
          </p>
        </div>

        <HorizontalCarousel cardWidth="w-[260px] sm:w-[300px]">
          {buildingTypes.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} className="flex flex-col items-start p-6 hover:border-[#195D9B]/40 hover:shadow-lg group h-full rounded-3xl transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#EBF4FC] text-[#195D9B] flex items-center justify-center mb-4 group-hover:bg-[#195D9B] group-hover:text-white transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-[#195D9B] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </Card>
            );
          })}
        </HorizontalCarousel>
      </div>
    </section>
  );
};

export default BuildingTypesSection;
