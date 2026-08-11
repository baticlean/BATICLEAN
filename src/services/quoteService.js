import apiClient from '../api/apiClient';

export const createQuoteRequest = async (quoteData) => {
  const response = await apiClient.post('/public/quote-requests', quoteData);
  return response.data;
};

export const getQuoteRequestByRef = async (reference) => {
  const response = await apiClient.get(`/public/quote-requests/ref/${reference}`);
  return response.data?.quoteRequest;
};
