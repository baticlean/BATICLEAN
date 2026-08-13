import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import AnimatedSectionTitle from '../components/common/AnimatedSectionTitle';
import FaqSection from '../components/common/FaqSection';
import { CheckCircle, FileText, ShieldCheck } from 'lucide-react';
import { getPublicServicesApi } from '../services/serviceService';
import { socket } from '../api/socket';

const Services = () => {
  const [dbServices, setDbServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const res = await getPublicServicesApi();
      const data = res?.data || res;
      if (Array.isArray(data)) {
        setDbServices(data);
      }
    } catch (error) {
      console.warn('Erreur lors du chargement des prestations :', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();

    socket.on('service_created', () => fetchServices());
    socket.on('service_updated', () => fetchServices());
    socket.on('service_deleted', () => fetchServices());
    socket.on('data_updated', (evt) => {
      if (evt?.type === 'SERVICE') fetchServices();
    });

    return () => {
      socket.off('service_created');
      socket.off('service_updated');
      socket.off('service_deleted');
      socket.off('data_updated');
    };
  }, []);

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

        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm font-semibold">
            Chargement des prestations Baticlean...
          </div>
        ) : dbServices.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            Aucune prestation publiée pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dbServices.map((service) => (
              <Card key={service._id || service.slug} className="p-8 flex flex-col justify-between border-2 border-slate-100 hover:border-[#195D9B]/40 hover:shadow-xl transition-all duration-300 rounded-3xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="primary">{service.category || 'Prestation BTP'}</Badge>
                    <ShieldCheck className="w-5 h-5 text-[#EF9437]" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900">{service.name}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {service.shortDescription || service.description}
                  </p>

                  {Array.isArray(service.features) && service.features.length > 0 && (
                    <div className="space-y-2.5 pt-2">
                      {service.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-3 text-xs font-semibold text-slate-800">
                          <CheckCircle className="w-4 h-4 text-[#EF9437] flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {service.highlight && (
                    <div className="pt-2">
                      <span className="inline-block text-[11px] font-extrabold text-[#EF9437] bg-[#FEF7EE] px-3 py-1 rounded-full border border-[#FDE6D2]">
                        {service.highlight}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <Link to="/devis">
                    <Button variant="secondary" className="w-full justify-center font-extrabold" icon={FileText}>
                      Demander une estimation
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}

        <FaqSection className="rounded-3xl border border-slate-200" />
      </div>
    </div>
  );
};

export default Services;
