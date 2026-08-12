import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import PartnerRequestModal from '../components/partners/PartnerRequestModal';
import { Building2, ShieldCheck, Globe, Phone, Mail, ExternalLink, Handshake, PlusCircle } from 'lucide-react';
import apiClient from '../api/apiClient';
import { socket } from '../api/socket';

const Partners = () => {
  const [dbPartners, setDbPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const fetchPartners = async () => {
    try {
      const res = await apiClient.get('/public/partners');
      const data = res?.data || res;
      if (Array.isArray(data)) {
        setDbPartners(data);
      }
    } catch (error) {
      console.warn('Erreur lors du chargement des partenaires :', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();

    socket.on('partner_created', () => {
      fetchPartners();
    });

    socket.on('partner_updated', () => {
      fetchPartners();
    });

    socket.on('partner_deleted', () => {
      fetchPartners();
    });

    socket.on('data_updated', (evt) => {
      if (evt?.type === 'PARTNER') fetchPartners();
    });

    return () => {
      socket.off('partner_created');
      socket.off('partner_updated');
      socket.off('partner_deleted');
      socket.off('data_updated');
    };
  }, []);

  return (
    <div className="py-16 bg-[#FEFEFE] min-h-screen space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* En-tête de la Page */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#EBF4FC] border border-[#ADD1F3] px-3.5 py-1 rounded-full text-xs font-extrabold text-[#195D9B]">
            <Handshake className="w-3.5 h-3.5" />
            <span>Réseau Professionnel Baticlean</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Nos Partenaires & Acteurs du <span className="text-[#195D9B]">BTP</span>
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Découvrez les promoteurs immobiliers, cabinets d'architecture et entreprises générales BTP qui font confiance à l'expertise Baticlean pour la livraison de leurs ouvrages.
          </p>
        </div>

        {/* Grille Principale des Partenaires Réels */}
        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm font-semibold">
            Chargement des partenaires du réseau Baticlean...
          </div>
        ) : dbPartners.length === 0 ? (
          <Card className="p-10 text-center space-y-4 border-2 border-dashed border-slate-200 bg-slate-50/60 max-w-xl mx-auto rounded-3xl">
            <div className="w-14 h-14 rounded-2xl bg-[#EBF4FC] text-[#195D9B] flex items-center justify-center mx-auto border border-[#ADD1F3]">
              <Handshake className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">Réseau Officiel Baticlean</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aucun partenaire n'est affiché pour le moment. Vous êtes un promoteur, architecte ou entrepreneur du BTP ? Rejoignez notre réseau de partenaires privilégiés !
              </p>
            </div>
            <div className="pt-2">
              <Button variant="secondary" icon={PlusCircle} onClick={() => setIsRequestModalOpen(true)} className="mx-auto">
                Soumettre une demande de partenariat
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {dbPartners.map((partner) => (
              <Card
                key={partner._id}
                className="p-7 border-2 border-slate-100 hover:border-[#195D9B]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 rounded-3xl group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    {partner.logoUrl ? (
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="h-14 max-w-[150px] object-contain rounded-xl p-1.5 bg-slate-50 border border-slate-200 group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-[#EBF4FC] text-[#195D9B] flex items-center justify-center font-extrabold text-xl border border-[#ADD1F3] shadow-sm">
                        {partner.name.charAt(0)}
                      </div>
                    )}
                    <Badge variant="primary">{partner.category || 'BTP & Immobilier'}</Badge>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-[#195D9B] transition-colors">
                      {partner.name}
                    </h3>
                    {partner.description && (
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                        {partner.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                  {partner.contactPhone && (
                    <div className="flex items-center gap-2 font-semibold">
                      <Phone className="w-4 h-4 text-[#195D9B] flex-shrink-0" />
                      <span>{partner.contactPhone}</span>
                    </div>
                  )}
                  {partner.contactEmail && (
                    <div className="flex items-center gap-2 font-semibold">
                      <Mail className="w-4 h-4 text-[#EF9437] flex-shrink-0" />
                      <span>{partner.contactEmail}</span>
                    </div>
                  )}
                  {partner.websiteUrl && (
                    <a
                      href={partner.websiteUrl.startsWith('http') ? partner.websiteUrl : `https://${partner.websiteUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold text-[#195D9B] hover:text-[#EF9437] hover:underline pt-1"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Visiter le site web officiel</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Section Bas de Page : Appel aux nouveaux partenaires */}
        <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold">Vous êtes un professionnel du BTP ou de l'Immobilier ?</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Devenez partenaire Baticlean et bénéficiez de créneaux prioritaires et de tarifs préférentiels pour la livraison de vos chantiers.
            </p>
          </div>
          <Button
            variant="secondary"
            icon={Handshake}
            onClick={() => setIsRequestModalOpen(true)}
            className="font-extrabold text-sm px-6 py-3 flex-shrink-0"
          >
            Devenir Partenaire Baticlean
          </Button>
        </div>

      </div>

      <PartnerRequestModal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} />
    </div>
  );
};

export default Partners;
