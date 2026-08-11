import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTopButton = ({ onOpenAdminModal }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const pressTimerRef = useRef(null);
  const pressStartTimeRef = useRef(null);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const handleStartPress = () => {
    setIsPressing(true);
    pressStartTimeRef.current = Date.now();

    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
    }

    pressTimerRef.current = setTimeout(() => {
      setIsPressing(false);
      if (onOpenAdminModal) {
        onOpenAdminModal();
      }
    }, 10000); // Appui long de 10 secondes exactes
  };

  const handleEndPress = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }

    const pressDuration = Date.now() - (pressStartTimeRef.current || Date.now());
    setIsPressing(false);

    // Si maintenu moins de 10 secondes, faire le scroll standard vers le haut
    if (pressDuration < 10000) {
      scrollToTop();
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onMouseDown={handleStartPress}
      onMouseUp={handleEndPress}
      onMouseLeave={handleEndPress}
      onTouchStart={handleStartPress}
      onTouchEnd={handleEndPress}
      aria-label="Retour en haut de page"
      className={`fixed bottom-6 right-6 z-50 p-3.5 rounded-full text-white shadow-xl transition-all duration-300 border-2 border-white/20 flex items-center justify-center group select-none ${
        isPressing
          ? 'bg-[#EF9437] scale-125 ring-4 ring-[#EF9437]/50 animate-pulse'
          : 'bg-[#195D9B] hover:bg-[#154E83] hover:scale-110 active:scale-95'
      }`}
    >
      <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform pointer-events-none" />
    </button>
  );
};

export default ScrollToTopButton;
