import apiClient from '../api/apiClient';

export const loginAdmin = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  if (response?.data?.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
  }
  return response.data;
};

export const registerAdmin = async ({ firstName, lastName, email, password, adminRegistrationKey }) => {
  const response = await apiClient.post('/auth/register-admin', {
    firstName,
    lastName,
    email,
    password,
    adminRegistrationKey,
  });
  if (response?.data?.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
  }
  return response.data;
};

export const logoutUser = async () => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('accessToken');
  }
};

export const getCurrentUser = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data?.user;
};
