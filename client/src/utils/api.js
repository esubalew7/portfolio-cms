import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL;
const API_BASE_URL = rawApiUrl?.trim().replace(/\/+$/, '') || 'http://localhost:5000';

console.log("API BASE URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  // NOTE: Do NOT set Content-Type here.
  // Axios auto-sets 'application/json' for objects and
  // 'multipart/form-data' (with boundary) for FormData.
  // Overriding it breaks file uploads.
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

// Add request interceptor to include auth token and handle FormData correctly
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If sending FormData, let axios set the correct Content-Type with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(normalizeError(error))
);

// Global response error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    if (status === 401) {
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