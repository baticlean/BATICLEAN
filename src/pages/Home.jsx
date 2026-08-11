import React from 'react';
import HeroSection from '../components/home/HeroSection';
import BuildingTypesSection from '../components/home/BuildingTypesSection';
import ServicesOverviewSection from '../components/home/ServicesOverviewSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import WhyBaticleanSection from '../components/home/WhyBaticleanSection';
import FeaturedProjectsSection from '../components/home/FeaturedProjectsSection';
import PartnersSection from '../components/home/PartnersSection';
import FinalCtaSection from '../components/home/FinalCtaSection';

const Home = () => {
  return (
    <div className="space-y-0">
      <HeroSection />
      <BuildingTypesSection />
      <ServicesOverviewSection />
      <HowItWorksSection />
      <WhyBaticleanSection />
      <FeaturedProjectsSection />
      <PartnersSection />
      <FinalCtaSection />
    </div>
  );
};

export default Home;
