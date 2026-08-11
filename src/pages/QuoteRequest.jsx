import React, { useState, useEffect } from 'react';
import DevisStepIndicator from '../components/devis/DevisStepIndicator';
import DevisFormStep1 from '../components/devis/DevisFormStep1';
import DevisFormStep2 from '../components/devis/DevisFormStep2';
import DevisFormStep3 from '../components/devis/DevisFormStep3';
import DevisFormStep4 from '../components/devis/DevisFormStep4';
import Toast from '../components/common/Toast';
import { createQuoteRequest } from '../services/quoteService';
import { CheckCircle2 } from 'lucide-react';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';

const QuoteRequest = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [submittedRef, setSubmittedRef] = useState(null);

  const [formData, setFormData] = useState({
    clientType: 'PARTICULIER',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: 'Abidjan',
    district: '',
    address: '',
    locationLandmark: '',
    buildingType: 'APARTMENT',
    estimatedSurface: '',
    numberOfFloors: 1,
    servicesRequested: ['NETTOYAGE_FIN_CHANTIER'],
    specificNeeds: '',
    desiredInterventionDate: '',
    requestSiteVisit: false,
    attachedFiles: [],
  });

  // Remonter automatiquement tout en haut de la page à chaque changement d'étape et à la soumission
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep, submittedRef]);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 7));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitFinal = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const result = await createQuoteRequest(formData);
      const ref = result.reference || 'DEV-2026-PENDING';
      setSubmittedRef(ref);
      setCurrentStep(7);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setToast({ type: 'success', message: 'Demande de devis transmise avec succès !' });
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Échec d\'envoi de la demande de devis.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-[#FEFEFE] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Demande de Devis <span className="text-[#195D9B]">Baticlean</span>
          </h1>
          <p className="text-sm text-slate-600">
            Remplissez notre formulaire en 7 étapes simples pour recevoir une estimation précise sous 24h.
          </p>
        </div>

        <DevisStepIndicator currentStep={currentStep} />

        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-card">
          {currentStep === 1 && (
            <DevisFormStep1 formData={formData} setFormData={setFormData} onNext={handleNext} />
          )}
          {currentStep === 2 && (
            <DevisFormStep2 formData={formData} setFormData={setFormData} onNext={handleNext} onPrev={handlePrev} />
          )}
          {currentStep === 3 && (
            <DevisFormStep3 formData={formData} setFormData={setFormData} onNext={handleNext} onPrev={handlePrev} />
          )}
          {(currentStep === 4 || currentStep === 5 || currentStep === 6) && (
            <DevisFormStep4
              currentStep={currentStep}
              formData={formData}
              setFormData={setFormData}
              onNext={currentStep === 6 ? handleSubmitFinal : handleNext}
              onPrev={handlePrev}
              isLoading={loading}
            />
          )}
          {currentStep === 7 && (
            <div className="text-center py-8 space-y-6 animate-scale-up">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-slate-900">Demande Enregistrée avec Succès !</h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Votre référence de dossier officielle est :
                </p>
                <div className="inline-block bg-[#EBF4FC] border-2 border-[#195D9B] text-[#195D9B] text-xl font-extrabold px-6 py-3 rounded-2xl tracking-wider shadow-sm">
                  {submittedRef}
                </div>
              </div>

              <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
                Un email de confirmation récapitulant vos informations vient de vous être envoyé. Notre équipe commerciale étudie votre dossier et prendra contact avec vous dans les plus brefs délais.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link to="/">
                  <Button variant="primary">Retourner à l'Accueil</Button>
                </Link>
                <Link to="/rendez-vous">
                  <Button variant="outline">Planifier une Visite de Chantier</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default QuoteRequest;
