import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HorizontalCarousel = ({
  children,
  autoPlay = true,
  interval = 3500,
  className = '',
  cardWidth = 'w-[280px] sm:w-[340px]',
}) => {
  const scrollContainerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 20) {
        // En fin de liste, retour au début
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
      }
      setTimeout(checkScrollability, 350);
    }
  };

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth } = scrollContainerRef.current;
      if (scrollLeft <= 10) {
        scrollContainerRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
      } else {
        scrollContainerRef.current.scrollBy({ left: -340, behavior: 'smooth' });
      }
      setTimeout(checkScrollability, 350);
    }
  };

  // Défilement automatique droite vers gauche (pause au survol ou au survol tactile)
  useEffect(() => {
    if (!autoPlay || isPaused) return;

    const timer = setInterval(() => {
      handleScrollRight();
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, isPaused, interval]);

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, []);

  return (
    <div
      className={`relative group/carousel ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Bouton Flèche Gauche */}
      <button
        type="button"
        onClick={handleScrollLeft}
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 z-20 w-11 h-11 rounded-full bg-white/95 text-[#195D9B] shadow-xl border border-slate-200 flex items-center justify-center transition-all hover:bg-[#195D9B] hover:text-white ${
          canScrollLeft ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
        title="Défiler vers la gauche"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Container Défilant Horizontalement */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScrollability}
        className="flex items-stretch gap-5 sm:gap-6 overflow-x-auto scroll-smooth py-4 px-2 no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {React.Children.map(children, (child, idx) => (
          <div key={idx} className={`${cardWidth} flex-shrink-0 flex flex-col`}>
            {child}
          </div>
        ))}
      </div>

      {/* Bouton Flèche Droite */}
      <button
        type="button"
        onClick={handleScrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-5 z-20 w-11 h-11 rounded-full bg-[#195D9B] text-white shadow-xl border border-white/30 flex items-center justify-center transition-all hover:bg-[#EF9437] animate-pulse hover:animate-none"
        title="Défiler vers la droite"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default HorizontalCarousel;
