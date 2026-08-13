import apiClient from '../api/apiClient';

export const getAdminDashboardStats = async () => {
  return await apiClient.get('/admin/dashboard');
};

export const getAdminQuoteRequests = async (params = {}) => {
  return await apiClient.get('/admin/quote-requests', { params });
};

export const updateQuoteStatus = async (id, status, internalNotes) => {
  return await apiClient.patch(`/admin/quote-requests/${id}/status`, { status, internalNotes });
};

export const deleteAdminQuoteRequest = async (id) => {
  return await apiClient.delete(`/admin/quote-requests/${id}`);
};

// Fonctions Devis PDF BTP
export const generateQuotePdfApi = async (id) => {
  return await apiClient.post(`/admin/quote-requests/${id}/pdf/generate`);
};

export const uploadCustomQuotePdfApi = async (id, customPdfBase64) => {
  return await apiClient.post(`/admin/quote-requests/${id}/pdf/upload`, { customPdfBase64 });
};

export const sendQuotePdfToClientApi = async (id, customNotes) => {
  return await apiClient.post(`/admin/quote-requests/${id}/pdf/send`, { customNotes });
};

export const getAdminAppointments = async (params = {}) => {
  return await apiClient.get('/admin/appointments', { params });
};

export const updateAppointmentStatus = async (id, status, notes) => {
  return await apiClient.patch(`/admin/appointments/${id}/status`, { status, notes });
};

// Projects admin calls
export const getAdminProjects = async () => {
  return await apiClient.get('/admin/projects');
};

export const createAdminProject = async (projectData) => {
  return await apiClient.post('/admin/projects', projectData);
};

export const toggleAdminProjectPublication = async (id) => {
  return await apiClient.patch(`/admin/projects/${id}/toggle-publish`);
};

export const deleteAdminProject = async (id) => {
  return await apiClient.delete(`/admin/projects/${id}`);
};

// Partners admin calls
export const getAdminPartners = async () => {
  return await apiClient.get('/admin/partners');
};

export const createAdminPartner = async (partnerData) => {
  return await apiClient.post('/admin/partners', partnerData);
};

export const updateAdminPartner = async (id, partnerData) => {
  return await apiClient.put(`/admin/partners/${id}`, partnerData);
};

export const toggleAdminPartnerPublication = async (id) => {
  return await apiClient.patch(`/admin/partners/${id}/toggle-publish`);
};

export const deleteAdminPartner = async (id) => {
  return await apiClient.delete(`/admin/partners/${id}`);
};

// Partner Requests admin calls
export const getAdminPartnerRequests = async () => {
  return await apiClient.get('/admin/partner-requests');
};

export const respondToAdminPartnerRequest = async (id, status, responseNotes) => {
  return await apiClient.patch(`/admin/partner-requests/${id}/respond`, { status, responseNotes });
};

export const deleteAdminPartnerRequest = async (id) => {
  return await apiClient.delete(`/admin/partner-requests/${id}`);
};

// Hero Media admin calls
export const getHeroMediaSetting = async () => {
  return await apiClient.get('/public/hero-media');
};

export const updateHeroMediaSetting = async (heroMediaData) => {
  return await apiClient.put('/admin/hero-media', heroMediaData);
};

// Company Settings admin calls (Contact & Opening Hours)
export const getCompanySettingsApi = async () => {
  return await apiClient.get('/public/company-settings');
};

export const updateCompanySettingsApi = async (settingsData) => {
  return await apiClient.put('/admin/company-settings', settingsData);
};
