import apiClient from '../api/apiClient';

export const getPublicServicesApi = async () => {
  return await apiClient.get('/public/services');
};

export const getAdminServicesApi = async () => {
  return await apiClient.get('/admin/services');
};

export const createServiceApi = async (serviceData) => {
  return await apiClient.post('/admin/services', serviceData);
};

export const updateServiceApi = async (id, serviceData) => {
  return await apiClient.put(`/admin/services/${id}`, serviceData);
};

export const toggleServicePublicationApi = async (id) => {
  return await apiClient.patch(`/admin/services/${id}/toggle-publish`);
};

export const deleteServiceApi = async (id) => {
  return await apiClient.delete(`/admin/services/${id}`);
};
