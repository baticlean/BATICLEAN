import axios from 'axios';

const getBaseURL = () => {
  let envUrl = import.meta.env.VITE_API_URL || 'https://baticlean-backend-om5g.onrender.com/api/v1';
  envUrl = envUrl.trim().replace(/\/+$/, '');
  if (!envUrl.includes('/api/v1') && !envUrl.includes('/api')) {
    envUrl = `${envUrl}/api/v1`;
  }
  return envUrl;
};

const baseURL = getBaseURL();

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/login')) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const { accessToken } = refreshResponse.data.data;
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        return Promise.reject(refreshError);
      }
    }

    const formattedError = {
      message: error.response?.data?.error?.message || "Une erreur est survenue lors de la communication avec le serveur.",
      code: error.response?.data?.error?.code || 'NETWORK_ERROR',
      details: error.response?.data?.error?.details || [],
    };

    return Promise.reject(formattedError);
  }
);

export default apiClient;
