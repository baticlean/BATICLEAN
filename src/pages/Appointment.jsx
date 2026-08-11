import React, { useState, useEffect } from 'react';
import TimeSlotPicker from '../components/appointment/TimeSlotPicker';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';
import { CheckCircle2 } from 'lucide-react';
import apiClient from '../api/apiClient';

const Appointment = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: 'Abidjan',
    district: '',
    siteAddress: '',
    appointmentDate: '',
    timeSlot: '08:30 - 10:00',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [successRef, setSuccessRef] = useState(null);

  // Remonter en haut de page lors de la confirmation réussie
  useEffect(() => {
    if (successRef) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [successRef]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post('/public/appointments', form);
      const ref = res.data?.reference || 'RDV-2026-OK';
      setSuccessRef(ref);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setToast({ type: 'success', message: 'Visite de chantier planifiée avec succès !' });
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Échec de la réservation de rendez-vous.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-[#FEFEFE] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Planifier une Visite de <span className="text-[#195D9B]">Chantier</span>
          </h1>
          <p className="text-sm text-slate-600">
            Choisissez la date et le créneau idéal pour que nos techniciens qualifiés évaluent les besoins sur place.
          </p>
        </div>

        {successRef ? (
          <Card className="p-10 text-center space-y-6 animate-scale-up border-2 border-emerald-100 shadow-xl">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900">Rendez-Vous Confirmé !</h2>
              <p className="text-xs text-slate-600">Votre numéro de suivi de visite :</p>
              <div className="inline-block bg-[#EBF4FC] border-2 border-[#195D9B] text-[#195D9B] text-xl font-extrabold px-6 py-3 rounded-2xl shadow-sm">
                {successRef}
              </div>
            </div>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Un expert Baticlean vous recontactera 24h avant la visite pour confirmer l'accès au site.
            </p>
          </Card>
        ) : (
          <Card className="p-8 sm:p-10 border-2 border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    placeholder="Jean"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#195D9B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    placeholder="Kouassi"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#195D9B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Téléphone portable *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+225 0700000000"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#195D9B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="jean.kouassi@exemple.com"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#195D9B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Quartier / Commune *</label>
                  <input
                    type="text"
                    required
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    placeholder="Ex: Cocody Angré"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#195D9B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date souhaitée *</label>
                  <input
                    type="date"
                    required
                    value={form.appointmentDate}
                    onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#195D9B]"
                  />
                </div>
              </div>

              <TimeSlotPicker
                selectedSlot={form.timeSlot}
                onSelectSlot={(slot) => setForm({ ...form, timeSlot: slot })}
              />

              <Button type="submit" variant="secondary" className="w-full justify-center" isLoading={loading}>
                Confirmer la demande de visite
              </Button>
            </form>
          </Card>
        )}
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Appointment;
