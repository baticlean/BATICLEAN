import apiClient from '../api/apiClient';

export const getPublicFaqsApi = async () => {
  return await apiClient.get('/public/faqs/public');
};

export const getAdminFaqsApi = async () => {
  return await apiClient.get('/admin/faqs');
};

export const createFaqApi = async (faqData) => {
  return await apiClient.post('/admin/faqs', faqData);
};

export const updateFaqApi = async (id, faqData) => {
  return await apiClient.put(`/admin/faqs/${id}`, faqData);
};

export const toggleFaqPublicationApi = async (id) => {
  return await apiClient.patch(`/admin/faqs/${id}/toggle-publish`);
};

export const deleteFaqApi = async (id) => {
  return await apiClient.delete(`/admin/faqs/${id}`);
};
