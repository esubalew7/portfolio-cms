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

    // Only redirect to login on 401 if the user had a token
    // (meaning they were authenticated, but their token expired).
    // Public auth endpoints may return 403 for authorization failures;
    // those should NOT trigger a redirect.
    if (status === 401 && getAuthToken()) {
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