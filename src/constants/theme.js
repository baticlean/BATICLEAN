export const THEME_COLORS = {
  background: '#FEFEFE',
  primary: '#195D9B',
  primaryHover: '#154E83',
  primaryLight: '#EBF4FC',
  secondary: '#EF9437',
  secondaryHover: '#D67E25',
  secondaryLight: '#FEF7EE',
  surface: '#FFFFFF',
  surfaceMuted: '#F8FAFC',
  border: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  status: {
    success: '#16A34A',
    warning: '#D97706',
    error: '#DC2626',
    info: '#2563EB',
    new: '#8B5CF6',
  },
};

export const BUILDING_TYPE_LABELS = {
  APARTMENT: 'Appartement',
  HOUSE: 'Maison',
  BUILDING: 'Immeuble résidentiel',
  OFFICE: 'Bureaux',
  SCHOOL: 'École',
  HOSPITAL: 'Hôpital / Santé',
  HOTEL: 'Hôtel',
  STORE: 'Commerce',
  WAREHOUSE: 'Entrepôt',
  INSTITUTIONAL: 'Bâtiment institutionnel',
  OTHER: 'Autre bâtiment',
};

export const QUOTE_STATUS_LABELS = {
  NEW: { label: 'Nouvelle', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  UNDER_REVIEW: { label: 'En étude', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  SITE_VISIT: { label: 'Visite programmée', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  QUOTE_SENT: { label: 'Devis envoyé', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  ACCEPTED: { label: 'Acceptée', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  SCHEDULED: { label: 'Planifiée', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
  IN_PROGRESS: { label: 'En cours', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  COMPLETED: { label: 'Terminée', color: 'bg-green-100 text-green-800 border-green-200' },
  CLOSED: { label: 'Clôturée', color: 'bg-slate-100 text-slate-800 border-slate-200' },
  CANCELLED: { label: 'Annulée', color: 'bg-rose-100 text-rose-800 border-rose-200' },
};
