import axios from 'axios';

/**
 * Axios instance configured with base URL and interceptors.
 * Automatically attaches JWT token to requests.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('velovault_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('velovault_token');
      localStorage.removeItem('velovault_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Vehicle API calls
export const vehicleAPI = {
  getAll: (page = 1, limit = 12) => api.get(`/vehicles?page=${page}&limit=${limit}`),
  search: (params) => api.get('/vehicles/search', { params }),
  getById: (id) => api.get(`/vehicles/${id}`),
  create: (data) => api.post('/vehicles', data),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  delete: (id) => api.delete(`/vehicles/${id}`),
  purchase: (id, quantity = 1) => api.post(`/vehicles/${id}/purchase`, { quantity }),
  restock: (id, quantity) => api.post(`/vehicles/${id}/restock`, { quantity }),
};

export default api;
