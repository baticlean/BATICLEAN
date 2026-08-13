import React from 'react';
import SEO from '../components/common/SEO';
import HeroSection from '../components/home/HeroSection';
import BuildingTypesSection from '../components/home/BuildingTypesSection';
import ServicesOverviewSection from '../components/home/ServicesOverviewSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import WhyBaticleanSection from '../components/home/WhyBaticleanSection';
import FeaturedProjectsSection from '../components/home/FeaturedProjectsSection';
import PartnersSection from '../components/home/PartnersSection';
import TestimonialsSection from '../components/common/TestimonialsSection';
import FaqSection from '../components/common/FaqSection';
import FinalCtaSection from '../components/home/FinalCtaSection';

const Home = () => {
  return (
    <div className="space-y-0">
      <SEO
        title="Spécialiste du Nettoyage après Construction & Remise en État à Abidjan"
        description="Baticlean assure le dépoussiérage haute efficacité, le nettoyage des vitres et la remise en état intégrale de bâtiments neufs avant aménagement ou livraison des clés à Abidjan, Côte d'Ivoire."
      />
      <HeroSection />
      <BuildingTypesSection />
      <ServicesOverviewSection />
      <HowItWorksSection />
      <WhyBaticleanSection />
      <FeaturedProjectsSection />
      <PartnersSection />
      <TestimonialsSection />
      <FaqSection />
      <FinalCtaSection />
    </div>
  );
};

export default Home;
