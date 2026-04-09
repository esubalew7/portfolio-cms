import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL;
const API_BASE_URL = rawApiUrl?.trim().replace(/\/+$/, '') || 'http://localhost:5000';

console.log("API BASE URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

const getAuthToken = () => localStorage.getItem('token');

const normalizeError = (error) => {
  const message = error.response?.data?.message || error.message || 'An unexpected API error occurred';
  return {
    ...error,
    message,
    status: error.response?.status,
    data: error.response?.data,
  };
};

// Add request interceptor to include auth token if available
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(normalizeError(error))
);

// Global response error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(normalizeError(error));
  }
);


const apiClient = {
  get: (url, config) => api.get(url, config).then((res) => res.data),
  post: (url, data, config) => api.post(url, data, config).then((res) => res.data),
  put: (url, data, config) => api.put(url, data, config).then((res) => res.data),
  delete: (url, config) => api.delete(url, config).then((res) => res.data),
  request: (config) => api.request(config).then((res) => res.data),
};

export default apiClient;