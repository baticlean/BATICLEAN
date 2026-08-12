import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, PlusCircle, Quote, Building2 } from 'lucide-react';
import Button from './Button';
import SubmitTestimonialModal from './SubmitTestimonialModal';
import { getPublicTestimonialsApi } from '../../services/testimonialService';
import { socket } from '../../api/socket';

const TestimonialsSection = ({ className = '', hideHeader = false }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const res = await getPublicTestimonialsApi();
      const data = res?.data || res;
      if (Array.isArray(data)) {
        setTestimonials(data);
      }
    } catch (error) {
      console.warn('Erreur lors du chargement des avis clients :', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();

    socket.on('testimonial_updated', () => {
      fetchTestimonials();
    });

    socket.on('testimonial_deleted', () => {
      fetchTestimonials();
    });

    socket.on('data_updated', (evt) => {
      if (evt?.type === 'TESTIMONIAL') fetchTestimonials();
    });

    return () => {
      socket.off('testimonial_updated');
      socket.off('testimonial_deleted');
      socket.off('data_updated');
    };
  }, []);

  // Calcul de la moyenne des notes (sur les avis réellement approuvés)
  const averageRating = testimonials.length > 0
    ? (testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / testimonials.length).toFixed(1)
    : '5.0';

  return (
    <section className={`py-10 sm:py-16 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* En-tête (Affiché seulement si hideHeader === false) */}
        {!hideHeader && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-2 max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Avis & Témoignages <span className="text-[#195D9B]">Clients</span>
              </h2>
              <p className="text-sm text-slate-600">
                Découvrez les retours réels des professionnels du bâtiment et particuliers ayant confié leurs chantiers à Baticlean.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-shrink-0">
              {testimonials.length > 0 && (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
                  <div className="flex items-center text-[#EF9437]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#EF9437]" />
                    ))}
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm">{averageRating} / 5</span>
                    <span className="text-xs text-slate-500 block">({testimonials.length} avis certifiés)</span>
                  </div>
                </div>
              )}

              <Button
                variant="secondary"
                icon={PlusCircle}
                onClick={() => setIsSubmitModalOpen(true)}
                className="font-extrabold shadow-md shadow-[#EF9437]/20"
              >
                Laisser un Avis
              </Button>
            </div>
          </div>
        )}

        {/* Barre d'action supérieure si hideHeader est actif (sur la page /avis) */}
        {hideHeader && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="flex items-center text-[#EF9437]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#EF9437]" />
                ))}
              </div>
              <div>
                <span className="font-extrabold text-slate-900 text-base">{averageRating} / 5</span>
                <span className="text-xs text-slate-500 block">Basé sur {testimonials.length} avis vérifiés</span>
              </div>
            </div>

            <Button
              variant="secondary"
              icon={PlusCircle}
              onClick={() => setIsSubmitModalOpen(true)}
              className="font-extrabold shadow-md shadow-[#EF9437]/20"
            >
              Laisser un Avis
            </Button>
          </div>
        )}

        {/* Grille des Avis Réels (Pas de Faux Avis) */}
        {loading ? (
          <div className="text-center py-12 text-slate-500 text-xs font-semibold">
            Chargement des retours d'expérience...
          </div>
        ) : testimonials.length === 0 ? (
          <div className="bg-slate-50 p-10 rounded-3xl border-2 border-dashed border-slate-200 text-center space-y-4 max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF4FC] text-[#195D9B] flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Soyez le premier client à partager votre avis !</h3>
              <p className="text-xs text-slate-500">
                Aucun avis n'a encore été publié sur le site. Si Baticlean est intervenu sur votre chantier, donnez-nous votre avis en 1 clic.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={PlusCircle}
              onClick={() => setIsSubmitModalOpen(true)}
              className="mx-auto"
            >
              Déposer mon témoignage
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t._id}
                className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 hover:border-[#195D9B]/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#EF9437]">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#EF9437]" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-[#195D9B]/20" />
                  </div>

                  {t.title && <h4 className="font-bold text-slate-900 text-sm">{t.title}</h4>}

                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{t.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-extrabold text-slate-900">{t.authorName}</p>
                    <p className="text-[11px] text-[#195D9B] font-semibold">{t.company || t.role || 'Client Baticlean'}</p>
                  </div>
                  {t.buildingType && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200">
                      <Building2 className="w-3 h-3 text-[#EF9437]" /> {t.buildingType}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Modale de soumission d'avis */}
      <SubmitTestimonialModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSuccess={fetchTestimonials}
      />
    </section>
  );
};

export default TestimonialsSection;
