import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://portfolio-backend-gxhv.onrender.com");

// Axios instance configured for HttpOnly cookie auth.
// withCredentials: true ensures the cookie is sent cross-origin.
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
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

// Request interceptor — no longer attaches a Bearer token from localStorage.
// The JWT is sent automatically via the HttpOnly cookie.
api.interceptors.request.use(
  (config) => {
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

    // On 401, redirect to login (token missing, expired, or invalid).
    // The HttpOnly cookie is managed entirely by the server.
    if (status === 401) {
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