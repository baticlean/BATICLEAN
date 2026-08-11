import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../common/Button';
import apiClient from '../../api/apiClient';
import { socket } from '../../api/socket';

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

    // Écouteur WebSocket en temps réel Socket.io pour mise à jour sans rechargement
    socket.on('hero_media_updated', (updatedData) => {
      if (updatedData && updatedData.mediaType) {
        setHeroMedia(updatedData);
      }
    });

    return () => {
      socket.off('hero_media_updated');
    };
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

  const renderMediaContent = (heightClass = "h-48 sm:h-64 lg:h-80") => {
    return (
      <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none bg-white p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
        {heroMedia.mediaType === 'VIDEO' && heroMedia.videoUrl ? (
          <div className={`relative w-full ${heightClass} rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900`}>
            {heroMedia.videoUrl.includes('youtube.com') || heroMedia.videoUrl.includes('youtu.be') ? (
              <iframe
                src={heroMedia.videoUrl.replace('watch?v=', 'embed/')}
                title="Vidéo Baticlean"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video src={heroMedia.videoUrl} controls className="w-full h-full object-cover" />
            )}
          </div>
        ) : heroMedia.mediaType === 'CAROUSEL' && Array.isArray(heroMedia.carouselImages) && heroMedia.carouselImages.length > 0 ? (
          <div className={`relative w-full ${heightClass} rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 group`}>
            <img
              src={heroMedia.carouselImages[activeSlide] || '/logo.png'}
              alt={`Chantier Baticlean ${activeSlide + 1}`}
              onError={(e) => { e.currentTarget.src = '/logo.png'; }}
              className="w-full h-full object-cover transition-all duration-700"
            />
            {heroMedia.carouselImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveSlide((prev) => (prev - 1 + heroMedia.carouselImages.length) % heroMedia.carouselImages.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-900/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSlide((prev) => (prev + 1) % heroMedia.carouselImages.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-900/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {heroMedia.carouselImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`h-1.5 rounded-full transition-all ${activeSlide === idx ? 'w-5 bg-[#195D9B]' : 'w-1.5 bg-white/70'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className={`relative w-full ${heightClass} rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-slate-100`}>
            <img
              src={heroMedia.mediaUrl || '/logo.png'}
              alt="Intervention Baticlean"
              onError={(e) => { e.currentTarget.src = '/logo.png'; }}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>
        )}

        <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-slate-500 border-t border-slate-100 pt-2 px-1">
          <span className="flex items-center gap-1 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" /> Matériel certifié & EPI
          </span>
          <span className="text-[#195D9B] font-bold">Baticlean Côte d'Ivoire</span>
        </div>
      </div>
    );
  };

  return (
    <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200/60 pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-14 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-5 sm:space-y-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#EBF4FC] border border-[#ADD1F3] px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-extrabold text-[#195D9B]">
              <span className="w-2 h-2 rounded-full bg-[#EF9437] animate-pulse"></span>
              <span>Spécialiste du Nettoyage après Construction & Remise en État</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.15] tracking-tight animate-hero-title">
              Livrez vos chantiers <span className="text-[#195D9B]">sans réserve</span> et en toute <span className="text-[#EF9437]">sérénité</span>.
            </h1>

            <p className="text-xs sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Baticlean accompagne les promoteurs immobiliers, architectes et entreprises du BTP en Côte d'Ivoire. Nous assurons l'élimination des poussières fines, décapage des sols, nettoyage des vitreries et la remise en état complète avant remise des clés.
            </p>

            <div className="block lg:hidden my-4">
              {renderMediaContent("h-52 sm:h-64")}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <Link to="/devis" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" icon={FileText} className="w-full justify-center text-sm font-extrabold py-3.5 shadow-lg shadow-[#EF9437]/20">
                  Demander un devis (24h)
                </Button>
              </Link>
              <Link to="/rendez-vous" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" icon={Calendar} className="w-full justify-center text-sm font-extrabold py-3.5 border-[#195D9B] text-[#195D9B] hover:bg-[#EBF4FC]">
                  Planifier une visite technique
                </Button>
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-200/80 grid grid-cols-3 gap-2 sm:gap-4 text-center lg:text-left">
              <div>
                <p className="text-lg sm:text-2xl font-black text-slate-900">100%</p>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Conformité HSE</p>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-black text-[#195D9B]">24h</p>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Devis rapide</p>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-black text-[#EF9437]">BTP</p>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Spécialiste dédié</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-5">
            {renderMediaContent("h-[360px]")}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
