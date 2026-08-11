import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import BeforeAfterSlider from '../components/projects/BeforeAfterSlider';
import { MapPin, Maximize, Calendar, HardHat } from 'lucide-react';
import apiClient from '../api/apiClient';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await apiClient.get('/projects/public');
        if (res.data && Array.isArray(res.data.data)) {
          setProjects(res.data.data);
        }
      } catch (error) {
        console.warn('Erreur de chargement des réalisations :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="py-16 bg-[#FEFEFE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Nos <span className="text-[#195D9B]">Réalisations</span> & Chantiers Livrés
          </h1>
          <p className="text-sm text-slate-600">
            Découvrez nos interventions de nettoyage de fin de chantier et de remise en état en Côte d'Ivoire.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            Chargement du portfolio de réalisations...
          </div>
        ) : projects.length === 0 ? (
          <Card className="p-12 text-center space-y-4 border-2 border-slate-100 bg-slate-50/60 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#EBF4FC] text-[#195D9B] border border-[#ADD1F3] flex items-center justify-center mx-auto">
              <HardHat className="w-8 h-8 text-[#EF9437]" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Aucun chantier publié pour l'instant</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Nos équipes effectuent actuellement plusieurs interventions de nettoyage pré-livraison. Les premières fiches de réalisations seront visibles ici dès la réception des ouvrages par nos clients.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {projects.map((project) => (
              <Card key={project._id || project.reference} className="p-6 space-y-6 border-2 border-slate-100">
                {(project.beforeImage || project.afterImage) && (
                  <BeforeAfterSlider
                    title={project.name}
                    beforeImage={project.beforeImage || '/logo.png'}
                    afterImage={project.afterImage || '/logo.png'}
                  />
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="primary">{project.buildingType}</Badge>
                    <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                      {project.surface && (
                        <span className="flex items-center gap-1">
                          <Maximize className="w-3.5 h-3.5 text-[#195D9B]" /> {project.surface} m²
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{project.name}</h3>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <MapPin className="w-4 h-4 text-[#EF9437]" />
                    <span>{project.city} {project.commune ? `, ${project.commune}` : ''}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{project.description}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
