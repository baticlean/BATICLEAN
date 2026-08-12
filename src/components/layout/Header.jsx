import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
import Button from '../common/Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Réalisations', path: '/realisations' },
    { name: 'Partenaires', path: '/partenaires' },
    { name: 'Avis Clients', path: '/avis' },
    { name: 'À propos', path: '/a-propos' },
    { name: 'Contact', path: '/contact' },
  ];

  const checkScrollability = () => {
    if (navContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navContainerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, []);

  const handleScrollRight = () => {
    if (navContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navContainerRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        // Si on est à la fin, revenir au début !
        navContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        navContainerRef.current.scrollBy({ left: 140, behavior: 'smooth' });
      }
      setTimeout(checkScrollability, 350);
    }
  };

  const handleScrollLeft = () => {
    if (navContainerRef.current) {
      navContainerRef.current.scrollBy({ left: -140, behavior: 'smooth' });
      setTimeout(checkScrollability, 350);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#FEFEFE]/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Marque (Gauche) */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="Baticlean Logo"
                className="h-12 w-12 rounded-full object-cover border-2 border-[#195D9B]/30 shadow-sm p-0.5 bg-white transition-transform group-hover:scale-105"
              />
              <div className="hidden sm:flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-[#195D9B]">
                  BATICLEAN
                </span>
                <span className="text-[10px] font-semibold text-[#EF9437] uppercase tracking-widest">
                  Nettoyage & Remise en état
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Pill Compacte avec Défilement & Flèche Clignotante (Centre) */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80 max-w-[420px] lg:max-w-[500px] relative shadow-inner">
            
            {/* Flèche Gauche si défilé */}
            {canScrollLeft && (
              <button
                type="button"
                onClick={handleScrollLeft}
                className="p-1 rounded-full bg-white text-[#195D9B] border border-slate-200 shadow-sm hover:bg-[#195D9B] hover:text-white transition-all flex-shrink-0 z-10"
                title="Défiler vers la gauche"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {/* Container défilant sans scrollbar */}
            <nav
              ref={navContainerRef}
              onScroll={checkScrollability}
              className="flex items-center gap-1 overflow-x-auto scroll-smooth no-scrollbar py-0.5 px-1 w-full"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all whitespace-nowrap flex-shrink-0 ${
                    isActive(link.path)
                      ? 'bg-[#195D9B] text-white shadow-sm font-bold'
                      : 'text-slate-700 hover:text-[#195D9B] hover:bg-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Flèche Droit Clignotante */}
            <button
              type="button"
              onClick={handleScrollRight}
              className="p-1.5 rounded-full bg-[#195D9B] text-white shadow-md hover:bg-[#EF9437] transition-all flex-shrink-0 z-10 animate-pulse hover:animate-none flex items-center justify-center border border-white/20"
              title="Défiler pour voir la suite des rubriques"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Boutons d'Action (Droite) */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <Link to="/rendez-vous">
              <Button variant="outline" size="sm" icon={Calendar}>
                Prendre RDV
              </Button>
            </Link>
            <Link to="/devis">
              <Button variant="secondary" size="sm" icon={FileText}>
                Demander un devis
              </Button>
            </Link>
          </div>

          {/* Bouton Hamburger Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Menu principal"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-fade-in">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                  isActive(link.path)
                    ? 'bg-[#195D9B] text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link to="/rendez-vous" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center" icon={Calendar}>
                Prendre RDV
              </Button>
            </Link>
            <Link to="/devis" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="secondary" className="w-full justify-center" icon={FileText}>
                Demander un devis
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
