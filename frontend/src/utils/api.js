import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://portfolio-backend-gxhv.onrender.com");

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

const normalizeError = (error) => {
  const message = error.response?.data?.message || error.message || 'An unexpected API error occurred';
  return {
    ...error,
    message,
    status: error.response?.status,
    data: error.response?.data,
  };
};

api.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(normalizeError(error))
);

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeError(error))
);

const apiClient = {
  get: (url, config) => api.get(url, config).then((res) => res.data),
  post: (url, data, config) => api.post(url, data, config).then((res) => res.data),
  put: (url, data, config) => api.put(url, data, config).then((res) => res.data),
  delete: (url, config) => api.delete(url, config).then((res) => res.data),
  request: (config) => api.request(config).then((res) => res.data),
};

export default apiClient;