import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import AnimatedSectionTitle from '../common/AnimatedSectionTitle';
import HorizontalCarousel from '../common/HorizontalCarousel';
import { ArrowRight, MapPin, CheckCircle, HardHat } from 'lucide-react';
import apiClient from '../../api/apiClient';

const FeaturedProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicProjects = async () => {
      try {
        const response = await apiClient.get('/projects/public');
        if (response.data && Array.isArray(response.data.data)) {
          setProjects(response.data.data);
        }
      } catch (error) {
        console.warn('Impossible de charger les réalisations publiques :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProjects();
  }, []);

  return (
    <section className="py-20 bg-[#FEFEFE] border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <AnimatedSectionTitle className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Découvrez la qualité de <span className="text-[#195D9B]">nos livraisons de chantier</span>.
            </AnimatedSectionTitle>
          </div>
          <Link to="/realisations">
            <Button variant="outline" icon={ArrowRight}>
              Découvrir tout le portfolio
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            Chargement des réalisations...
          </div>
        ) : projects.length === 0 ? (
          <Card className="p-10 text-center space-y-4 border-2 border-slate-100 bg-slate-50/60 max-w-3xl mx-auto rounded-3xl">
            <div className="w-14 h-14 rounded-2xl bg-[#EBF4FC] text-[#195D9B] border border-[#ADD1F3] flex items-center justify-center mx-auto">
              <HardHat className="w-7 h-7 text-[#EF9437]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Premières livraisons de chantier en cours</h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
              Nos équipes d'intervention sont actuellement déployées sur le terrain en Côte d'Ivoire. Les fiches techniques et visuels de nos premières livraisons d'ouvrages seront publiées ici dès leur finalisation.
            </p>
          </Card>
        ) : (
          <HorizontalCarousel cardWidth="w-[300px] sm:w-[380px]">
            {projects.map((project) => (
              <Card key={project._id || project.reference} className="p-8 border-2 border-slate-100 flex flex-col justify-between rounded-3xl h-full hover:border-[#195D9B]/40 hover:shadow-xl transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="primary">{project.buildingType}</Badge>
                    {project.surface && (
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                        {project.surface} m²
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-extrabold text-slate-900">{project.name || project.title}</h3>

                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <MapPin className="w-4 h-4 text-[#EF9437]" />
                    <span>{project.city} {project.commune ? `, ${project.commune}` : ''}</span>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{project.description}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>Chantier livré</span>
                  </div>
                  <Link to="/realisations" className="text-sm font-bold text-[#195D9B] hover:text-[#154E83] flex items-center gap-1">
                    Voir détails <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </Card>
            ))}
          </HorizontalCarousel>
        )}
      </div>
    </section>
  );
};

export default FeaturedProjectsSection;
