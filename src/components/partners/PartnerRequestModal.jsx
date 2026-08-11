import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Toast from '../common/Toast';
import { Building2, Handshake, Mail, Phone, Globe, MapPin, Send, CheckCircle2 } from 'lucide-react';
import apiClient from '../../api/apiClient';

const PartnerRequestModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [submittedRef, setSubmittedRef] = useState(null);

  const [form, setForm] = useState({
    companyName: '',
    activitySector: 'Promoteur Immobilier',
    contactName: '',
    email: '',
    phone: '',
    city: 'Abidjan',
    website: '',
    message: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post('/public/partner-requests', form);
      const ref = res.data?.data?.reference || res.data?.reference || 'PAR-2026-OK';
      setSubmittedRef(ref);
      setToast({ type: 'success', message: 'Demande de partenariat transmise avec succès !' });
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Échec de transmission de la demande.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedRef(null);
    setForm({
      companyName: '',
      activitySector: 'Promoteur Immobilier',
      contactName: '',
      email: '',
      phone: '',
      city: 'Abidjan',
      website: '',
      message: '',
    });
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleResetAndClose} title="Demande Officielle de Partenariat BTP" maxWidth="max-w-xl">
        {submittedRef ? (
          <div className="py-8 text-center space-y-5 animate-scale-up">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900">Demande Transmise !</h2>
              <p className="text-xs text-slate-600">Numéro de référence de votre dossier de partenariat :</p>
              <div className="inline-block bg-[#EBF4FC] border-2 border-[#195D9B] text-[#195D9B] text-xl font-extrabold px-6 py-3 rounded-2xl tracking-wider">
                {submittedRef}
              </div>
            </div>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Un email récapitulatif a été envoyé à l'équipe de direction Baticlean. Notre responsable des partenariats examinera votre dossier et vous répondra directement par email et téléphone sous 48h.
            </p>
            <div className="pt-2">
              <Button variant="primary" onClick={handleResetAndClose}>
                Fermer la fenêtre
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 bg-[#EBF4FC] rounded-2xl border border-[#ADD1F3] flex items-center gap-3">
              <Handshake className="w-6 h-6 text-[#195D9B] flex-shrink-0" />
              <p className="text-xs text-slate-700 leading-relaxed">
                Rejoignez le réseau Baticlean pour bénéficier d'une synergie opérationnelle pré-livraison sur l'ensemble de vos programmes immobiliers et chantiers BTP.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nom de la Société / Entreprise *</label>
                <input
                  type="text"
                  required
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  placeholder="Ex: PFO Construction / SCI Les Lagunes"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Secteur d'Activité *</label>
                <select
                  value={form.activitySector}
                  onChange={(e) => setForm({ ...form, activitySector: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
                >
                  <option value="Promoteur Immobilier">Promoteur Immobilier</option>
                  <option value="Entreprise Générale BTP">Entreprise Générale BTP</option>
                  <option value="Cabinet d'Architecture">Cabinet d'Architecture</option>
                  <option value="Maîtrise d'Œuvre">Maîtrise d'Œuvre</option>
                  <option value="Autre Spécialité du Bâtiment">Autre Spécialité BTP</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nom & Prénom du Responsable *</label>
                <input
                  type="text"
                  required
                  value={form.contactName}
                  onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                  placeholder="Jean Kouassi"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Téléphone Professionnel *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+225 0700000000"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Professionnel *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="direction@entreprise.com"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ville / Commune principal *</label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Abidjan, Cocody"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Site Web / Lien (optionnel)</label>
              <input
                type="text"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://www.societe.com"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Présentation de la Demande & Synergies *</label>
              <textarea
                rows={3}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Décrivez vos programmes immobiliers actuels et les prestations souhaitées..."
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
              />
            </div>

            <Button type="submit" variant="secondary" className="w-full justify-center mt-2" icon={Send} isLoading={loading}>
              Soumettre la Demande de Partenariat
            </Button>
          </form>
        )}
      </Modal>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </>
  );
};

export default PartnerRequestModal;
