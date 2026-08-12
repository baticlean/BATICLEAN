import React, { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { getPublicFaqsApi } from '../../services/faqService';
import { socket } from '../../api/socket';

const FaqSection = ({ className = '' }) => {
  const [faqs, setFaqs] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Toutes');
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const categories = ['Toutes', 'Prestations BTP', 'Devis & Tarifs', 'Délais & Visites', 'Conformité HSE'];

  const fetchFaqs = async () => {
    try {
      const res = await getPublicFaqsApi();
      const data = res?.data || res;
      if (Array.isArray(data)) {
        setFaqs(data);
      }
    } catch (error) {
      console.warn('Erreur lors du chargement des FAQ :', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();

    socket.on('faq_updated', () => {
      fetchFaqs();
    });

    socket.on('faq_deleted', () => {
      fetchFaqs();
    });

    socket.on('data_updated', (evt) => {
      if (evt?.type === 'FAQ') fetchFaqs();
    });

    return () => {
      socket.off('faq_updated');
      socket.off('faq_deleted');
      socket.off('data_updated');
    };
  }, []);

  const filteredFaqs = activeCategory === 'Toutes'
    ? faqs
    : faqs.filter((f) => f.category === activeCategory);

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className={`py-14 sm:py-20 bg-slate-50 border-t border-b border-slate-200/70 ${className}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* En-tête */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#EBF4FC] border border-[#ADD1F3] px-3 py-1 rounded-full text-xs font-extrabold text-[#195D9B]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Foire Aux Questions BTP</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tout savoir sur nos interventions de <span className="text-[#195D9B]">nettoyage après chantier</span>.
          </h2>

          <p className="text-sm text-slate-600">
            Retrouvez les réponses officielles de Baticlean aux questions fréquemment posées par les promoteurs immobiliers et architectes en Côte d'Ivoire.
          </p>
        </div>

        {/* Onglets Filtres par Catégorie */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-[#195D9B] text-white shadow-md shadow-[#195D9B]/20 scale-105'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-100/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Liste Accordéon */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-8 text-slate-500 text-xs font-semibold">
              Chargement des questions fréquentes...
            </div>
          ) : filteredFaqs.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
              Aucune question disponible dans cette catégorie pour le moment.
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq._id || idx}
                  className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen ? 'border-[#195D9B] shadow-md ring-1 ring-[#195D9B]/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base focus:outline-none"
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-xl bg-[#EBF4FC] text-[#195D9B] font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                        Q{idx + 1}
                      </span>
                      <span>{faq.question}</span>
                    </span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#195D9B]' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50 space-y-2 animate-fade-in">
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#EF9437]">
                        <span>Catégorie : {faq.category}</span>
                        <span className="flex items-center gap-1 text-emerald-700">
                          <Sparkles className="w-3 h-3" /> Réponse officielle Baticlean
                        </span>
                      </div>
                      <p className="text-slate-700 font-medium">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
};

export default FaqSection;
