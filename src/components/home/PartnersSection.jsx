import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import AnimatedSectionTitle from '../common/AnimatedSectionTitle';
import HorizontalCarousel from '../common/HorizontalCarousel';
import { Building2, Handshake } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { socket } from '../../api/socket';

const PartnersSection = () => {
  const [dbPartners, setDbPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPartners = async () => {
    try {
      const res = await apiClient.get('/public/partners');
      const data = res?.data || res;
      if (Array.isArray(data)) {
        setDbPartners(data);
      }
    } catch (error) {
      console.warn('Erreur chargement partenaires section :', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();

    socket.on('partner_created', () => fetchPartners());
    socket.on('partner_updated', () => fetchPartners());
    socket.on('partner_deleted', () => fetchPartners());
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
    <section className="py-20 bg-slate-50 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <AnimatedSectionTitle className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Partenaire privilégié des <span className="text-[#195D9B]">acteurs du BTP</span>.
          </AnimatedSectionTitle>
          <p className="text-sm text-slate-600">
            Nous travaillons en étroite collaboration avec l'ensemble des corps d'État du bâtiment.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-10 text-slate-500 text-xs font-semibold">
            Chargement du réseau de partenaires...
          </div>
        ) : dbPartners.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs font-semibold">
            Rejoignez le réseau de partenaires Baticlean.
          </div>
        ) : (
          <HorizontalCarousel cardWidth="w-[280px] sm:w-[320px]">
            {dbPartners.map((partner) => (
              <Card key={partner._id} className="p-6 space-y-4 hover:border-[#195D9B]/40 hover:shadow-lg transition-all rounded-3xl h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    {partner.logoUrl ? (
                      <img src={partner.logoUrl} alt={partner.name} className="h-12 max-w-[130px] object-contain rounded-xl p-1 bg-white border border-slate-200" />
                    ) : (
                      <div className="w-11 h-11 rounded-2xl bg-[#EBF4FC] text-[#195D9B] font-extrabold flex items-center justify-center border border-[#ADD1F3]">
                        {partner.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-[10px] font-extrabold text-[#195D9B] bg-[#EBF4FC] px-2.5 py-0.5 rounded-full border border-[#ADD1F3]">
                      {partner.category || 'BTP'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{partner.name}</h3>
                    {partner.description && (
                      <p className="text-xs text-slate-600 mt-1 line-clamp-3 leading-relaxed">{partner.description}</p>
                    )}
                  </div>
                </div>

                {partner.contactPhone && (
                  <p className="text-[11px] font-semibold text-slate-500 pt-2 border-t border-slate-100">
                    Tél : {partner.contactPhone}
                  </p>
                )}
              </Card>
            ))}
          </HorizontalCarousel>
        )}
      </div>
    </section>
  );
};

export default PartnersSection;
