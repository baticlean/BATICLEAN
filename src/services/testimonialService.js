import apiClient from '../api/apiClient';

export const getPublicTestimonialsApi = async () => {
  return await apiClient.get('/public/testimonials/public');
};

export const submitPublicTestimonialApi = async (data) => {
  return await apiClient.post('/public/testimonials/submit', data);
};

export const getAdminTestimonialsApi = async () => {
  return await apiClient.get('/admin/testimonials');
};

export const createAdminTestimonialApi = async (data) => {
  return await apiClient.post('/admin/testimonials', data);
};

export const updateTestimonialStatusApi = async (id, status) => {
  return await apiClient.patch(`/admin/testimonials/${id}/status`, { status });
};

export const deleteTestimonialApi = async (id) => {
  return await apiClient.delete(`/admin/testimonials/${id}`);
};
