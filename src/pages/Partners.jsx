import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import PartnerRequestModal from '../components/partners/PartnerRequestModal';
import { Building2, ShieldCheck, Globe, Phone, Mail, ExternalLink, Handshake } from 'lucide-react';
import apiClient from '../api/apiClient';

const partnerTypes = [
  {
    title: 'Entreprises Générales de BTP',
    desc: 'Baticlean prend le relais dès la fin des travaux de second œuvre pour assurer la propreté finale avant réception de l’ouvrage.',
    benefits: ['Respect scrupuleux du planning de réception', 'Conformité aux règles de sécurité de chantier', 'Équipes équipées et autonomes'],
  },
  {
    title: 'Promoteurs & Sociétés Immobilières',
    desc: 'Valorisation esthétique des logements et locaux commerciaux neufs pour déclencher le coup de cœur lors des visites d’acquéreurs.',
    benefits: ['Présentation irréprochable des lots', 'Nettoyage des vitres, terrasses et communs', 'Souplesse de réservation de créneaux'],
  },
  {
    title: 'Architectes & Maîtres d’Œuvre',
    desc: 'Sublimation du travail de finition des artisans et mise en valeur des matériaux nobles installés.',
    benefits: ['Traitement adapté aux matériaux délicats', 'Décapage sans risque des salissures tenaces', 'Intervention soignée'],
  },
];

const Partners = () => {
  const [dbPartners, setDbPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await apiClient.get('/partners');
        if (res.data && Array.isArray(res.data.data)) {
          setDbPartners(res.data.data);
        }
      } catch (error) {
        console.warn('Erreur lors du chargement des partenaires :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  return (
    <div className="py-16 bg-[#FEFEFE] space-y-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Partenaires & Acteurs du <span className="text-[#195D9B]">BTP</span>
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Nous établissons des partenariats durables avec les professionnels du bâtiment pour garantir la qualité de livraison de leurs programmes.
          </p>
        </div>

        {/* Section 1: Types de Partenariats BTP */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {partnerTypes.map((pt, idx) => (
            <Card key={idx} className="p-8 border-2 border-slate-100 flex flex-col justify-between hover:border-[#EF9437]/40">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FEF7EE] text-[#EF9437] border border-[#FCDDBA] flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{pt.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{pt.desc}</p>
                <div className="space-y-2 pt-2">
                  {pt.benefits.map((ben, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                      <ShieldCheck className="w-4 h-4 text-[#195D9B] flex-shrink-0" />
                      <span>{ben}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <Button variant="outline" className="w-full justify-center" onClick={() => setIsRequestModalOpen(true)}>
                  Devenir Partenaire
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Section 2: Réseau & Partenaires Officiels enregistrés */}
        <div className="space-y-10 pt-10 border-t border-slate-100">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Nos Partenaires de <span className="text-[#EF9437]">Confiance</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Découvrez les entreprises et professionnels qui s'appuient sur l'expertise Baticlean.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-8 text-slate-500 text-sm">Chargement des partenaires...</div>
          ) : dbPartners.length === 0 ? (
            <Card className="p-10 text-center space-y-3 border-2 border-slate-100 bg-slate-50/60 max-w-xl mx-auto">
              <Handshake className="w-10 h-10 text-[#195D9B] mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">Réseau de Partenariat Baticlean</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Vous êtes un promoteur, un cabinet d'architecture ou une entreprise générale de BTP ? Rejoignez notre réseau de partenaires privilégiés.
              </p>
              <div className="pt-2">
                <Button variant="secondary" size="sm" onClick={() => setIsRequestModalOpen(true)}>
                  Soumettre une demande de partenariat
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {dbPartners.map((partner) => (
                <Card key={partner._id} className="p-6 border-2 border-slate-100 hover:border-[#195D9B]/40 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      {partner.logoUrl ? (
                        <img
                          src={partner.logoUrl}
                          alt={partner.name}
                          className="h-14 max-w-[140px] object-contain rounded-xl p-1 bg-slate-50 border border-slate-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-[#EBF4FC] text-[#195D9B] flex items-center justify-center font-bold text-lg border border-[#ADD1F3]">
                          {partner.name.charAt(0)}
                        </div>
                      )}
                      <Badge variant="secondary">{partner.category || 'BTP & Immobilier'}</Badge>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{partner.name}</h3>
                      {partner.description && (
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{partner.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    {partner.contactPhone && (
                      <div className="flex items-center gap-2 font-medium">
                        <Phone className="w-3.5 h-3.5 text-[#195D9B]" />
                        <span>{partner.contactPhone}</span>
                      </div>
                    )}
                    {partner.contactEmail && (
                      <div className="flex items-center gap-2 font-medium">
                        <Mail className="w-3.5 h-3.5 text-[#EF9437]" />
                        <span>{partner.contactEmail}</span>
                      </div>
                    )}
                    {partner.websiteUrl && (
                      <a
                        href={partner.websiteUrl.startsWith('http') ? partner.websiteUrl : `https://${partner.websiteUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-bold text-[#195D9B] hover:underline pt-1"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Visiter le site officiel</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <PartnerRequestModal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} />
    </div>
  );
};

export default Partners;
