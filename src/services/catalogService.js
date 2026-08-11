import apiClient from '../api/apiClient';

export const getBuildingTypes = async () => {
  try {
    const response = await apiClient.get('/public/building-types');
    return response.data?.buildingTypes || [];
  } catch (error) {
    console.error('Failed to fetch building types:', error);
    return [];
  }
};

export const getServices = async () => {
  try {
    const response = await apiClient.get('/public/services');
    return response.data?.services || [];
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return [];
  }
};

export const getProjects = async (params = {}) => {
  try {
    const response = await apiClient.get('/public/projects', { params });
    return response.data?.projects || [];
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
};

export const getPartners = async () => {
  try {
    const response = await apiClient.get('/public/partners');
    return response.data?.partners || [];
  } catch (error) {
    console.error('Failed to fetch partners:', error);
    return [];
  }
};
