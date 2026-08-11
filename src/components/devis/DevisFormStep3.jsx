import React from 'react';
import { Building2, Maximize, Layers, CheckCircle } from 'lucide-react';
import Button from '../common/Button';

const buildingOptions = [
  { id: 'APARTMENT', label: 'Appartement / Résidence' },
  { id: 'HOUSE', label: 'Maison Individuelle' },
  { id: 'BUILDING', label: 'Immeuble Résidentiel' },
  { id: 'OFFICE', label: 'Bureaux & Siège social' },
  { id: 'SCHOOL', label: 'École / Établissement scolaire' },
  { id: 'HOSPITAL', label: 'Hôpital / Établissement médical' },
  { id: 'HOTEL', label: 'Hôtel / Résidence hôtelière' },
  { id: 'STORE', label: 'Commerce / Boutique' },
  { id: 'WAREHOUSE', label: 'Entrepôt / Local industriel' },
  { id: 'INSTITUTIONAL', label: 'Bâtiment public / Institutionnel' },
];

const DevisFormStep3 = ({ formData, setFormData, onNext, onPrev }) => {
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
        <h3 className="text-xl font-extrabold text-slate-900 mb-1">Caractéristiques du Bâtiment</h3>
        <p className="text-xs text-slate-600">Sélectionnez le type d’ouvrage et les dimensions estimées.</p>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Catégorie de Bâtiment *</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
          {buildingOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleChange('buildingType', opt.id)}
              className={`p-3 text-left rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                formData.buildingType === opt.id
                  ? 'border-[#195D9B] bg-[#EBF4FC] text-[#195D9B] ring-2 ring-[#195D9B]/20'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <span>{opt.label}</span>
              {formData.buildingType === opt.id && <CheckCircle className="w-4 h-4 text-[#195D9B]" />}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Surface totale estimée (m²) *</label>
          <div className="relative">
            <Maximize className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="number"
              required
              min={10}
              value={formData.estimatedSurface}
              onChange={(e) => handleChange('estimatedSurface', e.target.value)}
              placeholder="Ex: 250"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre d'étages / Niveaux *</label>
          <div className="relative">
            <Layers className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="number"
              required
              min={0}
              value={formData.numberOfFloors}
              onChange={(e) => handleChange('numberOfFloors', e.target.value)}
              placeholder="Ex: 2 (Rez-de-chaussée + 2)"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          Étape précédente
        </Button>
        <Button type="submit" variant="secondary">
          Continuer vers l'Étape 4
        </Button>
      </div>
    </form>
  );
};

export default DevisFormStep3;
