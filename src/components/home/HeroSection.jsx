import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../common/Button';
import apiClient from '../../api/apiClient';

const HeroSection = () => {
  const [heroMedia, setHeroMedia] = useState({
    mediaType: 'IMAGE',
    mediaUrl: '/logo.png',
    videoUrl: '',
    carouselImages: ['/logo.png'],
  });

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const fetchHeroMedia = async () => {
      try {
        const res = await apiClient.get('/hero-media');
        const mediaData = res.data?.data || res.data;
        if (mediaData && mediaData.mediaType) {
          setHeroMedia(mediaData);
        }
      } catch (error) {
        console.warn('Utilisation du média Hero par défaut :', error);
      }
    };

    fetchHeroMedia();
  }, []);

  // Auto-slide carrousel
  useEffect(() => {
    if (heroMedia.mediaType === 'CAROUSEL' && Array.isArray(heroMedia.carouselImages) && heroMedia.carouselImages.length > 1) {
      const interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % heroMedia.carouselImages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [heroMedia]);

  const renderMediaContent = (heightClass = "h-52 sm:h-64 lg:h-80") => {
    return (
      <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none bg-white p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
        {heroMedia.mediaType === 'VIDEO' && heroMedia.videoUrl ? (
          <div className={`relative w-full ${heightClass} rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900`}>
            {heroMedia.videoUrl.includes('youtube.com') || heroMedia.videoUrl.includes('youtu.be') ? (
              <iframe
                src={heroMedia.videoUrl.replace('watch?v=', 'embed/')}
                title="Vidéo Baticlean"
                className="w-full h-full border-0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <video
                src={heroMedia.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
              />
            )}
          </div>
        ) : heroMedia.mediaType === 'CAROUSEL' && Array.isArray(heroMedia.carouselImages) && heroMedia.carouselImages.length > 0 ? (
          <div className={`relative w-full ${heightClass} rounded-xl sm:rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center`}>
            <img
              src={heroMedia.carouselImages[activeSlide] || '/logo.png'}
              alt={`Diapositive Baticlean ${activeSlide + 1}`}
              onError={(e) => { e.currentTarget.src = '/logo.png'; }}
              className="w-full h-full object-cover rounded-xl sm:rounded-2xl transition-all duration-500"
            />
            {heroMedia.carouselImages.length > 1 && (
              <>
                <button
                  onClick={() => setActiveSlide((prev) => (prev - 1 + heroMedia.carouselImages.length) % heroMedia.carouselImages.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 text-slate-700 hover:bg-white shadow-md transition-colors"
                  aria-label="Image précédente"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setActiveSlide((prev) => (prev + 1) % heroMedia.carouselImages.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 text-slate-700 hover:bg-white shadow-md transition-colors"
                  aria-label="Image suivante"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-900/40 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
                  {heroMedia.carouselImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${activeSlide === idx ? 'bg-[#EF9437] w-3' : 'bg-white/70'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className={`relative w-full ${heightClass} rounded-xl sm:rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center border border-slate-100`}>
            <img
              key={heroMedia.mediaUrl}
              src={heroMedia.mediaUrl || '/logo.png'}
              alt="Baticlean Expertise Nettoyage après Construction"
              onError={(e) => { e.currentTarget.src = '/logo.png'; }}
              className="w-full h-full object-cover rounded-xl sm:rounded-2xl transition-all duration-300"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EBF4FC]/50 via-white to-[#FEFEFE] py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Colonne Texte & Contenu */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">

            {/* Titre Principal harmonieux, fluide et parfaitement structuré mobile & PC */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight">
              Spécialiste du Nettoyage après{' '}
              <span className="text-[#195D9B]">Construction</span> &amp;{' '}
              <span className="text-[#EF9437]">Remise en État.</span>
            </h1>

            {/* Sur Mobile uniquement (< lg) : Média affiché sous le titre principal */}
            <div className="block lg:hidden my-4">
              {renderMediaContent("h-52 sm:h-64")}
            </div>

            <p className="text-lg sm:text-2xl font-bold text-slate-800 leading-snug">
              Livrez vos chantiers propres, impeccables et prêts à l'emploi.
            </p>

            <p className="text-xs sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              <strong className="text-slate-900 font-semibold">Baticlean</strong> assure le dépoussiérage haute efficacité, le lavage des vitres et la remise en état intégrale de vos bâtiments neufs avant aménagement ou livraison des clés aux propriétaires.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#EF9437] flex-shrink-0" />
                <span>Interventions rapides sur tous types de bâtiments</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#EF9437] flex-shrink-0" />
                <span>Étude gratuite &amp; devis sous 24h</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 sm:pt-3">
              <Link to="/devis">
                <Button variant="secondary" size="lg" icon={FileText} className="w-full sm:w-auto text-sm font-extrabold">
                  Demander un devis gratuit
                </Button>
              </Link>
              <Link to="/rendez-vous">
                <Button variant="outline" size="lg" icon={Calendar} className="w-full sm:w-auto text-sm font-bold">
                  Planifier une visite de chantier
                </Button>
              </Link>
            </div>
          </div>

          {/* Sur Desktop uniquement (>= lg) : Colonne Média classique à droite */}
          <div className="hidden lg:block lg:col-span-5 relative">
            {renderMediaContent("h-80 lg:h-[380px]")}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
