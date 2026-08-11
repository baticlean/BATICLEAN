import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Users, Wrench, CheckCircle2, FileText, Calendar } from 'lucide-react';
import Button from '../components/common/Button';
import AnimatedCounter from '../components/common/AnimatedCounter';
import apiClient from '../api/apiClient';

const About = () => {
  const [statsData, setStatsData] = useState({
    deliveredProjects: 0,
    conformityRate: 100,
    avgQuoteTimeHours: 24,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/stats');
        if (response.data && response.data.data) {
          setStatsData(response.data.data);
        }
      } catch (error) {
        console.warn('Utilisation des statistiques par défaut (erreur serveur):', error);
      }
    };

    fetchStats();
  }, []);

  const values = [
    {
      icon: ShieldCheck,
      title: 'Excellence & Normes BTP',
      description: 'Nous appliquons les protocoles de nettoyage les plus stricts pour garantir des chantiers 100% conformes et prêts pour la livraison sans réserve.',
    },
    {
      icon: Wrench,
      title: 'Équipements de Pointe',
      description: 'Aspirateurs industriels HEPA, monobrosses haute vitesse et nettoyants écologiques professionnels pour traiter toutes les surfaces.',
    },
    {
      icon: Users,
      title: 'Équipe Qualifiée & Formée',
      description: 'Nos agents sont formés aux risques de chantier, au port des EPI obligatoires et aux techniques spécialisées de remise en état.',
    },
    {
      icon: Award,
      title: 'Engagement & Réactivité',
      description: 'Une étude gratuite et un devis précis transmis sous 24h, avec une flexibilité d’intervention adaptée à vos délais de livraison.',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Banner Header */}
      <section className="bg-gradient-to-br from-[#195D9B] via-[#154E83] to-slate-900 text-white py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#EF9437]/15 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            À Propos de <span className="text-[#EF9437]">Baticlean</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Découvrez l’expert incontournable de la remise en état et du nettoyage de fin de chantier pour bâtiments neufs et rénovés.
          </p>
        </div>
      </section>

      {/* Story & Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              Notre Mission : Valoriser et sécuriser la livraison de vos ouvrages
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Baticlean a été créée pour répondre à un besoin critique des promoteurs immobiliers, architectes, entreprises de BTP et particuliers : transformer un chantier brut de construction en un espace étincelant, sain et directement exploitable.
            </p>
            <p className="text-slate-600 leading-relaxed">
              De l’élimination des voiles de ciment et résidus de peinture au dépoussiérage minutieux des structures et au lavage des surfaces vitrées, nous prenons en charge l’intégralité de la propreté pré-livraison.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-slate-800 font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5 text-[#EF9437]" />
                <span>Interventions sur résidences, bureaux, centres commerciaux & industries</span>
              </div>
              <div className="flex items-center gap-3 text-slate-800 font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5 text-[#EF9437]" />
                <span>Respect strict des règles de sécurité et port des EPI</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative bg-white p-4 rounded-3xl shadow-xl border border-slate-200">
              <img
                src="/logo.png"
                alt="À propos de Baticlean"
                className="w-full h-80 object-contain p-8 bg-[#FEFEFE] rounded-2xl border border-slate-100"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar Dynamique */}
      <section className="bg-[#195D9B] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#EF9437]">
                <AnimatedCounter value={statsData.deliveredProjects} prefix="+" />
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-200">Chantiers Livrés</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#EF9437]">
                <AnimatedCounter value={statsData.conformityRate} suffix="%" />
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-200">Conformité Propreté</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#EF9437]">
                <AnimatedCounter value={statsData.avgQuoteTimeHours} suffix="h" />
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-200">Délai Moyen Devis</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#EF9437]">7/7</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-200">Disponibilité Équipe</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Nos Engagements & Valeurs</h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm">
            Ce qui fait de Baticlean le partenaire de confiance privilégié des professionnels du bâtiment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#EBF4FC] text-[#195D9B] flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{val.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{val.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call To Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 to-[#195D9B] text-white p-8 sm:p-12 rounded-3xl shadow-xl text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold max-w-2xl mx-auto">
            Prêt à confier la propreté de vos chantiers à des experts ?
          </h2>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            Demandez un devis détaillé sous 24h ou prenez rendez-vous pour une visite technique gratuite.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/devis">
              <Button variant="secondary" size="lg" icon={FileText} className="w-full sm:w-auto">
                Demander mon devis
              </Button>
            </Link>
            <Link to="/rendez-vous">
              <Button
                variant="ghost"
                size="lg"
                icon={Calendar}
                className="w-full sm:w-auto text-white border-2 border-white bg-transparent hover:bg-white hover:text-[#195D9B] transition-all font-bold"
              >
                Prendre rendez-vous
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
