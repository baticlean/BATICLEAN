import apiClient from '../api/apiClient';

export const getAdminDashboardStats = async () => {
  const response = await apiClient.get('/admin/dashboard');
  return response.data;
};

export const getAdminQuoteRequests = async (params = {}) => {
  const response = await apiClient.get('/admin/quote-requests', { params });
  return response.data;
};

export const updateQuoteStatus = async (id, status, internalNotes) => {
  const response = await apiClient.patch(`/admin/quote-requests/${id}/status`, { status, internalNotes });
  return response.data;
};

export const getAdminAppointments = async (params = {}) => {
  const response = await apiClient.get('/admin/appointments', { params });
  return response.data;
};

export const updateAppointmentStatus = async (id, status, notes) => {
  const response = await apiClient.patch(`/admin/appointments/${id}/status`, { status, notes });
  return response.data;
};

// Projects admin calls
export const getAdminProjects = async () => {
  const response = await apiClient.get('/admin/projects');
  return response.data;
};

export const createAdminProject = async (projectData) => {
  const response = await apiClient.post('/admin/projects', projectData);
  return response.data;
};

export const toggleAdminProjectPublication = async (id) => {
  const response = await apiClient.patch(`/admin/projects/${id}/toggle-publish`);
  return response.data;
};

export const deleteAdminProject = async (id) => {
  const response = await apiClient.delete(`/admin/projects/${id}`);
  return response.data;
};

// Partners admin calls
export const getAdminPartners = async () => {
  const response = await apiClient.get('/admin/partners');
  return response.data;
};

export const createAdminPartner = async (partnerData) => {
  const response = await apiClient.post('/admin/partners', partnerData);
  return response.data;
};

export const toggleAdminPartnerPublication = async (id) => {
  const response = await apiClient.patch(`/admin/partners/${id}/toggle-publish`);
  return response.data;
};

export const deleteAdminPartner = async (id) => {
  const response = await apiClient.delete(`/admin/partners/${id}`);
  return response.data;
};

// Partner Requests admin calls
export const getAdminPartnerRequests = async () => {
  const response = await apiClient.get('/admin/partner-requests');
  return response.data;
};

export const respondToAdminPartnerRequest = async (id, status, responseNotes) => {
  const response = await apiClient.patch(`/admin/partner-requests/${id}/respond`, { status, responseNotes });
  return response.data;
};

// Hero Media admin calls
export const getHeroMediaSetting = async () => {
  const response = await apiClient.get('/hero-media');
  return response.data;
};

export const updateHeroMediaSetting = async (heroMediaData) => {
  const response = await apiClient.put('/admin/hero-media', heroMediaData);
  return response.data;
};
