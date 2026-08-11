import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, FileText } from 'lucide-react';
import Button from '../common/Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Réalisations', path: '/realisations' },
    { name: 'Partenaires', path: '/partenaires' },
    { name: 'À propos', path: '/a-propos' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#FEFEFE]/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
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

          <nav className="hidden md:flex items-center gap-1 bg-slate-100/60 p-1.5 rounded-full border border-slate-200/60">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                  isActive(link.path)
                    ? 'bg-[#195D9B] text-white shadow-sm font-semibold'
                    : 'text-slate-700 hover:text-[#195D9B] hover:bg-white/80'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
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

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Menu principal"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

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
