import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import Toast from './Toast';
import { Star, Send } from 'lucide-react';
import { submitPublicTestimonialApi } from '../../services/testimonialService';

const SubmitTestimonialModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    authorName: '',
    company: '',
    role: 'Client Baticlean',
    rating: 5,
    title: '',
    comment: '',
    buildingType: 'Résidentiel',
    city: 'Abidjan',
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitPublicTestimonialApi(form);
      setToast({
        type: 'success',
        message: 'Merci ! Votre avis a été transmis à l\'équipe Baticlean et sera publié après validation par la direction.',
      });
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Échec de l\'envoi de votre avis.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Laisser un Avis / Témoignage Baticlean" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Votre Note Globale *</label>
          <div className="flex items-center gap-1 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating || form.rating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setForm({ ...form, rating: star })}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110"
                >
                  <Star className={`w-7 h-7 ${active ? 'text-[#EF9437] fill-[#EF9437]' : 'text-slate-300'}`} />
                </button>
              );
            })}
            <span className="ml-3 text-xs font-extrabold text-[#EF9437]">
              {form.rating} / 5 Étoiles
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Votre Nom & Prénom *</label>
            <input
              type="text"
              required
              value={form.authorName}
              onChange={(e) => setForm({ ...form, authorName: e.target.value })}
              placeholder="Ex: Jean-Marc Kouadio"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Société / Structure (Optionnel)</label>
            <input
              type="text"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="Ex: PFO Africa / Cabinet Architecture"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Votre Qualité / Rôle</label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="Ex: Promoteur Immobilier, Architecte, Propriétaire"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Type de Bâtiment nettoyé</label>
            <input
              type="text"
              value={form.buildingType}
              onChange={(e) => setForm({ ...form, buildingType: e.target.value })}
              placeholder="Ex: Immeuble R+4, Villa, Bureaux"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Titre de votre expérience (Optionnel)</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Ex: Remise en état impeccable de notre immeuble avant livraison !"
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Votre Avis & Retour d'Expérience *</label>
          <textarea
            rows={4}
            required
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            placeholder="Partagez votre expérience sur la qualité du dépoussiérage, la ponctualité des équipes et le soin des finitions..."
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
          />
        </div>

        <Button type="submit" variant="secondary" className="w-full justify-center" icon={Send} isLoading={loading}>
          Soumettre mon Avis pour Publication
        </Button>
      </form>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </Modal>
  );
};

export default SubmitTestimonialModal;
