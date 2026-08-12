import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';
import { Mail, MapPin, Clock, Send, Phone } from 'lucide-react';
import apiClient from '../api/apiClient';
import { getCompanySettingsApi } from '../services/adminService';
import { socket } from '../api/socket';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [settings, setSettings] = useState({
    officialPhone: '+225 07 68 38 87 79',
    phoneSecondary: '+225 01 02 03 04 05',
    officialEmail: 'contact@baticlean.ci',
    emailDevis: 'devis@baticlean.ci',
    officialAddress: "Abidjan, Côte d'Ivoire - Cocody Angré 8ème Tranche",
    openingHoursWeek: 'Lundi - Samedi : 07h30 - 18h30',
    openingHoursWeekend: 'Dimanche : Sur rendez-vous uniquement',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getCompanySettingsApi();
        const data = res?.data || res;
        if (data && data.officialPhone) {
          setSettings(data);
        }
      } catch (err) {
        console.warn('Utilisation des coordonnées par défaut Contact :', err);
      }
    };

    fetchSettings();

    socket.on('company_settings_updated', (updated) => {
      if (updated && updated.officialPhone) {
        setSettings(updated);
      }
    });

    return () => {
      socket.off('company_settings_updated');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/public/contact', form);
      setToast({ type: 'success', message: 'Votre message a été transmis avec succès. Notre équipe vous répondra sous 24h.' });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Échec de l\'envoi du message.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 bg-[#FEFEFE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Contactez l'Équipe <span className="text-[#195D9B]">Baticlean</span>
          </h1>
          <p className="text-sm text-slate-600">
            Une question sur nos prestations ou besoin d’une étude d’intervention sur site ? Écrivez-nous directement.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-8 space-y-6 border-2 border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Coordonnées Officielles</h3>

              <div className="space-y-5 text-sm text-slate-700">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF4FC] text-[#195D9B] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Zone & Siège</p>
                    <p className="text-xs text-slate-600">{settings.officialAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF4FC] text-[#195D9B] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Téléphone Commercial</p>
                    <p className="text-xs text-slate-600 font-semibold">{settings.officialPhone}</p>
                    {settings.phoneSecondary && <p className="text-xs text-slate-500">{settings.phoneSecondary}</p>}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FEF7EE] text-[#EF9437] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Email Officiel</p>
                    <p className="text-xs text-slate-600 font-semibold">{settings.officialEmail}</p>
                    {settings.emailDevis && <p className="text-xs text-[#195D9B] font-medium">Devis : {settings.emailDevis}</p>}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF4FC] text-[#195D9B] flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Horaires d'Ouverture</p>
                    <p className="text-xs text-slate-600">{settings.openingHoursWeek}</p>
                    {settings.openingHoursWeekend && <p className="text-xs text-slate-500 mt-0.5">{settings.openingHoursWeekend}</p>}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-7">
            <Card className="p-8 border-2 border-slate-100">
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Formulaire de Message Direct</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nom complet *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Jean Kouassi"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
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
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sujet de votre message *</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Demande d'information complémentaire..."
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Votre Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Précisez votre demande..."
                    className="w-full p-4 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
                  />
                </div>

                <Button type="submit" variant="secondary" className="w-full justify-center" icon={Send} isLoading={loading}>
                  Envoyer le message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Contact;
