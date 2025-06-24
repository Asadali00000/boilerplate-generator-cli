import axios from 'axios';
import { getToken } from '../utils/tokenUtils';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const authClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
authClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  async login(credentials) {
    const response = await authClient.post('/auth/login', credentials);
    return response.data;
  },

  async register(userData) {
    const response = await authClient.post('/auth/register', userData);
    return response.data;
  },

  async logout() {
    const response = await authClient.post('/auth/logout');
    return response.data;
  },

  async getProfile() {
    const response = await authClient.get('/auth/profile');
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await authClient.put('/auth/profile', profileData);
    return response.data;
  },

  async refreshToken() {
    const response = await authClient.post('/auth/refresh');
    return response.data;
  },

  async forgotPassword(email) {
    const response = await authClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token, password) {
    const response = await authClient.post('/auth/reset-password', { token, password });
    return response.data;
  }
};