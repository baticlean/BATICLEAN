import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';
import SecretAdminTrigger from '../auth/SecretAdminTrigger';
import { getCompanySettingsApi } from '../../services/adminService';
import { socket } from '../../api/socket';

const Footer = ({ onOpenAdminModal }) => {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState({
    officialPhone: '+225 07 68 38 87 79',
    officialEmail: 'contact@baticlean.ci',
    officialAddress: "Abidjan, Côte d'Ivoire - Cocody Angré 8ème Tranche",
    openingHoursWeek: 'Lundi - Samedi : 07h30 - 18h30',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getCompanySettingsApi();
        const data = res?.data || res;
        if (data && data.officialPhone) {
          setSettings(data);
        }
      } catch (err) {
        console.warn('Utilisation des coordonnées par défaut Footer :', err);
      }
    };

    fetchSettings();

    socket.on('company_settings_updated', (updated) => {
      if (updated && updated.officialPhone) {
        setSettings(updated);
      }
    });

    return () => {
      socket.off('company_settings_updated');
    };
  }, []);

  const handleLinkClick = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          <div className="space-y-4">
            <SecretAdminTrigger onTrigger={onOpenAdminModal}>
              <div className="flex items-center gap-3 cursor-pointer group">
                <img src="/logo.png" alt="Baticlean" className="h-10 w-auto object-contain" />
                <span className="font-extrabold text-xl text-white tracking-tight">BATICLEAN</span>
              </div>
            </SecretAdminTrigger>

            <p className="text-sm text-slate-400 leading-relaxed">
              Spécialiste exclusif du nettoyage après construction, de fin de chantier et de la remise en état de bâtiments neufs avant aménagement.
            </p>
          </div>

          <div>
            <h4 className="text-base font-bold text-white mb-4">Nos Prestations</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services" onClick={handleLinkClick} className="hover:text-[#EF9437] transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-[#EF9437]" />
                  Nettoyage de fin de chantier
                </Link>
              </li>
              <li>
                <Link to="/services" onClick={handleLinkClick} className="hover:text-[#EF9437] transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-[#EF9437]" />
                  Remise en état avant aménagement
                </Link>
              </li>
              <li>
                <Link to="/services" onClick={handleLinkClick} className="hover:text-[#EF9437] transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-[#EF9437]" />
                  Dépoussiérage haute efficacité
                </Link>
              </li>
              <li>
                <Link to="/services" onClick={handleLinkClick} className="hover:text-[#EF9437] transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-[#EF9437]" />
                  Nettoyage des vitres & encadrements
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-bold text-white mb-4">Navigation Rapide</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/realisations" onClick={handleLinkClick} className="hover:text-white transition-colors">Réalisations & Portfolio</Link></li>
              <li><Link to="/partenaires" onClick={handleLinkClick} className="hover:text-white transition-colors">Nos Partenaires BTP</Link></li>
              <li><Link to="/services" onClick={handleLinkClick} className="hover:text-white transition-colors">À propos de Baticlean</Link></li>
              <li><Link to="/devis" onClick={handleLinkClick} className="hover:text-white transition-colors">Demander un devis en ligne</Link></li>
              <li><Link to="/rendez-vous" onClick={handleLinkClick} className="hover:text-white transition-colors">Prendre rendez-vous</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-bold text-white mb-4">Contact & Horaires</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#EF9437] flex-shrink-0 mt-0.5" />
                <span>{settings.officialAddress}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#EF9437] flex-shrink-0" />
                <span>{settings.officialPhone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#EF9437] flex-shrink-0" />
                <span>{settings.officialEmail}</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#EF9437] flex-shrink-0" />
                <span>{settings.openingHoursWeek}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} Baticlean. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <span>Spécialiste Nettoyage après Construction</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
