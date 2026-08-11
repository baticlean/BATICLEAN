import React from 'react';
import { MapPin, Navigation, Compass } from 'lucide-react';
import Button from '../common/Button';

const DevisFormStep2 = ({ formData, setFormData, onNext, onPrev }) => {
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-xl font-extrabold text-slate-900 mb-1">Localisation du Bâtiment / Chantier</h3>
        <p className="text-xs text-slate-600">Précisez le lieu d’intervention pour l’évaluation des déplacements d'équipe.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Ville *</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Ex: Abidjan"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Commune / Secteur *</label>
          <div className="relative">
            <Navigation className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              required
              value={formData.district}
              onChange={(e) => handleChange('district', e.target.value)}
              placeholder="Ex: Cocody, Le Plateau, Marcory"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse exacte du chantier *</label>
        <div className="relative">
          <Compass className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            required
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Rue, Boulevard, Numéro de lot..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Repère géographique complémentaire (Optionnel)</label>
        <input
          type="text"
          value={formData.locationLandmark}
          onChange={(e) => handleChange('locationLandmark', e.target.value)}
          placeholder="Ex: En face de la station, derrière la pharmacie..."
          className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
        />
      </div>

      <div className="pt-4 flex items-center justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          Étape précédente
        </Button>
        <Button type="submit" variant="secondary">
          Continuer vers l'Étape 3
        </Button>
      </div>
    </form>
  );
};

export default DevisFormStep2;
