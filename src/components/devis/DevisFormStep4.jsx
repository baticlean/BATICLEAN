import React, { useState, useRef } from 'react';
import { Calendar, ShieldCheck, CheckSquare, Square, FileText, UploadCloud, Image as ImageIcon, Trash2, Plus } from 'lucide-react';
import Button from '../common/Button';

const serviceOptions = [
  { id: 'NETTOYAGE_FIN_CHANTIER', label: 'Nettoyage complet de fin de chantier (dépoussiérage + décapage)' },
  { id: 'REMISE_EN_ETAT', label: 'Remise en état avant aménagement' },
  { id: 'LAVAGE_VITRES', label: 'Nettoyage approfondi des vitres et façades vitrées' },
  { id: 'DESINFECTION', label: 'Désinfection intégrale des sanitaires et conduits' },
];

const DevisFormStep4 = ({ currentStep, formData, setFormData, onNext, onPrev, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const toggleService = (id) => {
    const current = formData.servicesRequested || [];
    if (current.includes(id)) {
      setFormData((prev) => ({ ...prev, servicesRequested: current.filter((s) => s !== id) }));
    } else {
      setFormData((prev) => ({ ...prev, servicesRequested: [...current, id] }));
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFilesAdded = (newFiles) => {
    const validFiles = Array.from(newFiles).filter((file) => {
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return (isImage || isPdf) && isValidSize;
    });

    const currentFiles = formData.attachedFiles || [];
    setFormData((prev) => ({
      ...prev,
      attachedFiles: [...currentFiles, ...validFiles],
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer?.files?.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveFile = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      attachedFiles: (prev.attachedFiles || []).filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const attachedFiles = formData.attachedFiles || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      {currentStep === 4 && (
        <>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-1">Prestations & Besoins Spécifiques</h3>
            <p className="text-xs text-slate-600">Cochez les interventions requises pour votre chantier.</p>
          </div>

          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Services souhaités *</label>
            {serviceOptions.map((opt) => {
              const isSelected = (formData.servicesRequested || []).includes(opt.id);
              return (
                <div
                  key={opt.id}
                  onClick={() => toggleService(opt.id)}
                  className={`p-4 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-[#195D9B] bg-[#EBF4FC] text-[#195D9B]'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected ? <CheckSquare className="w-5 h-5 text-[#195D9B]" /> : <Square className="w-5 h-5 text-slate-300" />}
                </div>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Précisions ou contraintes particulières</label>
            <textarea
              rows={3}
              value={formData.specificNeeds}
              onChange={(e) => handleChange('specificNeeds', e.target.value)}
              placeholder="Ex: Présence de résidus de peinture tenaces sur parquet, hauteur sous plafond importante..."
              className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
            />
          </div>
        </>
      )}

      {currentStep === 5 && (
        <>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-1">Photos & Documents du Chantier</h3>
            <p className="text-xs text-slate-600">Joindre des visuels permet à nos experts d’affiner le devis.</p>
          </div>

          {/* Input fichier caché pour déclencher la galerie/explorateur de fichiers */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.length && handleFilesAdded(e.target.files)}
            multiple
            accept="image/*,.pdf"
            className="hidden"
          />

          {/* Zone de Glisser-Déposer & Clic */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center space-y-4 cursor-pointer transition-all ${
              isDragging
                ? 'border-[#195D9B] bg-[#EBF4FC]/80 scale-[1.01]'
                : 'border-slate-300 bg-slate-50/80 hover:border-[#195D9B] hover:bg-slate-50'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-[#EBF4FC] text-[#195D9B] border border-[#ADD1F3] flex items-center justify-center mx-auto shadow-sm">
              <UploadCloud className="w-7 h-7 text-[#195D9B]" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-extrabold text-slate-900">
                Glissez-déposez vos photos ou vos plans ici
              </p>
              <p className="text-xs text-slate-500">
                ou <span className="text-[#195D9B] underline font-bold">parcourez vos fichiers / ouvrez la galerie</span>
              </p>
              <p className="text-[11px] text-slate-400 pt-1">Formats acceptés : JPG, PNG, PDF (Max 10 Mo par fichier)</p>
            </div>

            <div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-5 py-2.5 bg-[#195D9B] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#154E83] transition-colors inline-flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Ouvrir la Galerie / Choisir des Fichiers</span>
              </button>
            </div>
          </div>

          {/* Liste des fichiers joints avec aperçu */}
          {attachedFiles.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Fichiers & Photos Jointes ({attachedFiles.length})
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-[#195D9B] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Ajouter d'autres photos
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {attachedFiles.map((file, idx) => {
                  const isImage = file.type.startsWith('image/');
                  const previewUrl = isImage ? URL.createObjectURL(file) : null;

                  return (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
                      {isImage ? (
                        <img
                          src={previewUrl}
                          alt={file.name}
                          className="w-12 h-12 object-cover rounded-xl border border-slate-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-100 text-[#195D9B] flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                      )}

                      <div className="flex-grow min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{file.name}</p>
                        <p className="text-[10px] text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} Mo</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Supprimer la photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {currentStep === 6 && (
        <>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-1">Planification & Validation</h3>
            <p className="text-xs text-slate-600">Indiquez la date souhaitée d'intervention.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Date d'intervention souhaitée *</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="date"
                required
                value={formData.desiredInterventionDate}
                onChange={(e) => handleChange('desiredInterventionDate', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
              />
            </div>
          </div>

          <div
            onClick={() => handleChange('requestSiteVisit', !formData.requestSiteVisit)}
            className={`p-4 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
              formData.requestSiteVisit
                ? 'border-[#EF9437] bg-[#FEF7EE] text-[#EF9437]'
                : 'border-slate-200 bg-white text-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#EF9437]" />
              <span>Souhaitez-vous planifier une visite d'évaluation technique sur site avant devis final ?</span>
            </div>
            {formData.requestSiteVisit ? <CheckSquare className="w-5 h-5 text-[#EF9437]" /> : <Square className="w-5 h-5 text-slate-300" />}
          </div>
        </>
      )}

      <div className="pt-4 flex items-center justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          Étape précédente
        </Button>
        <Button type="submit" variant="secondary" isLoading={isLoading}>
          {currentStep === 6 ? 'Valider et envoyer la demande' : 'Étape suivante'}
        </Button>
      </div>
    </form>
  );
};

export default DevisFormStep4;
