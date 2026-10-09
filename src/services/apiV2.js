import axios from 'axios';

const API_BASE_URL = 'https://millancefurniture.com/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Configure axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
axiosInstance.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/v2/login';
    }
    return Promise.reject(error);
  }
);

// ============== AUTH APIs ==============

export const login = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await axiosInstance.post('/auth/register', userData);
  return response.data;
};

// ============== USER DASHBOARD APIs ==============

export const getUserDashboard = async () => {
  const response = await axiosInstance.get('/users/dashboard');
  return response.data;
};

export const getUserProfile = async () => {
  const response = await axiosInstance.get('/users/me');
  return response.data;
};

export const getWallet = async () => {
  const response = await axiosInstance.get('/users/wallet');
  return response.data;
};

export const getTransactions = async (filter = 'all') => {
  const response = await axiosInstance.get('/users/transactions', {
    params: { transaction_type: filter }
  });
  return response.data;
};

// ============== DEFAULT EXPORT ==============

const apiV2 = {
  login,
  register,
  getUserDashboard,
  getUserProfile,
  getWallet,
  getTransactions
};

export default apiV2;
