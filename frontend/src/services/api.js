import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE_URL = `${BACKEND_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('chicboutique_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('chicboutique_token');
      localStorage.removeItem('chicboutique_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (updates) => api.put('/auth/profile', updates),
};

// Products API
export const productsAPI = {
  getAll: (params = {}) => api.get('/products/', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (product) => api.post('/products/', product),
  update: (id, updates) => api.put(`/products/${id}`, updates),
  delete: (id) => api.delete(`/products/${id}`),
  getCategories: () => api.get('/products/categories/list'),
};

// Orders API
export const ordersAPI = {
  create: (orderData) => api.post('/orders/', orderData),
  getAll: () => api.get('/orders/'),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
};

// Payments API
export const paymentsAPI = {
  createCheckoutSession: (checkoutData) => api.post('/payments/checkout/session', checkoutData),
  getCheckoutStatus: (sessionId) => api.get(`/payments/checkout/status/${sessionId}`),
  getTransactions: () => api.get('/payments/transactions'),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  // Users
  getUsers: (params = {}) => api.get('/admin/users', { params }),
  createUser: (userData) => api.post('/admin/users', userData),
  updateUser: (id, updates) => api.put(`/admin/users/${id}`, updates),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  // Orders
  getOrders: (params = {}) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
  deleteOrder: (id) => api.delete(`/admin/orders/${id}`),
};

export default api;