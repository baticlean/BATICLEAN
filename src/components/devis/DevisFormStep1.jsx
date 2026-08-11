import React from 'react';
import { User, Mail, Phone, Building2 } from 'lucide-react';
import Button from '../common/Button';

const clientTypes = [
  { id: 'PARTICULIER', label: 'Particulier' },
  { id: 'ENTREPRISE_BTP', label: 'Entreprise de BTP / Constructeur' },
  { id: 'PROMOTEUR', label: 'Promoteur Immobilier' },
  { id: 'ARCHITECTE', label: 'Architecte / Maître d’œuvre' },
  { id: 'AUTRE', label: 'Autre professionnel' },
];

const DevisFormStep1 = ({ formData, setFormData, onNext }) => {
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
        <h3 className="text-xl font-extrabold text-slate-900 mb-1">Identité & Profil du Demandeur</h3>
        <p className="text-xs text-slate-600">Renseignez vos coordonnées pour le suivi officiel de votre dossier.</p>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Vous êtes :</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {clientTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => handleChange('clientType', type.id)}
              className={`p-3.5 text-left rounded-xl border text-xs font-bold transition-all flex items-center gap-3 ${
                formData.clientType === type.id
                  ? 'border-[#195D9B] bg-[#EBF4FC] text-[#195D9B] shadow-sm ring-2 ring-[#195D9B]/20'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <Building2 className={`w-4 h-4 ${formData.clientType === type.id ? 'text-[#195D9B]' : 'text-slate-400'}`} />
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Prénom *</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder="Prénom"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Nom *</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder="Nom de famille"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse Email *</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="votre.email@domaine.com"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Téléphone *</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+225 07 00 00 00 00"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button type="submit" variant="secondary" size="md">
          Continuer vers l'Étape 2
        </Button>
      </div>
    </form>
  );
};

export default DevisFormStep1;
