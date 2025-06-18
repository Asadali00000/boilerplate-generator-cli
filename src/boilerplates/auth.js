const { createFileStructure } = require('../utils/fileUtils');

class AuthBoilerplate {
  // Auth boilerplate generator
  generateAuthBoilerplate(projectPath, options) {
    const structure = {
      'auth/AuthContext.js': this.getAuthContext(),
      'auth/AuthProvider.jsx': this.getAuthProvider(),
      'auth/authService.js': this.getAuthService(),
      'hooks/useAuth.js': this.getAuthHook(),
      'components/Auth/LoginForm.jsx': this.getLoginForm(),
      'components/Auth/ProtectedRoute.jsx': this.getProtectedRoute(),
      'utils/tokenUtils.js': this.getTokenUtils(),
      'constants/authConstants.js': this.getAuthConstants()
    };

    createFileStructure(projectPath, structure);

    return {
      dependencies: ['axios', 'js-cookie'],
      instructions: [
        'Wrap your app with AuthProvider',
        'Configure your auth endpoints in authService.js',
        'Use ProtectedRoute for protected pages',
        'Use useAuth hook to access auth state and methods'
      ],
      files: Object.keys(structure)
    };
  }

  // Auth template methods
  getAuthContext() {
    return `import { createContext } from 'react';

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: false,
  login: () => {},
  logout: () => {},
  register: () => {},
  updateProfile: () => {},
  clearError: () => {},
  error: null
});`;
  }

  getAuthProvider() {
    return `import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { authService } from './authService';
import { getToken, setToken, removeToken } from '../utils/tokenUtils';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAuthenticated = !!user;

  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      setToken(response.token);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeToken();
      setUser(null);
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(userData);
      setToken(response.token);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.updateProfile(profileData);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const user = await authService.getProfile();
          setUser(user);
        } catch (error) {
          removeToken();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    updateProfile,
    clearError,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};`;
  }

  getAuthService() {
    return `import axios from 'axios';
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
      config.headers.Authorization = \`Bearer \${token}\`;
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
};`;
  }

  getAuthHook() {
    return `import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};`;
  }

  getLoginForm() {
    return `import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const { login, error, clearError } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData);
      // Redirect or handle successful login
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={styles.button}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;`;
  }

  getProtectedRoute() {
    return `import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;`;
  }

  getTokenUtils() {
    return `// Token utilities for managing authentication tokens

export const getToken = () => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

export const setToken = (token, rememberMe = false) => {
  if (rememberMe) {
    localStorage.setItem('authToken', token);
  } else {
    sessionStorage.setItem('authToken', token);
  }
};

export const removeToken = () => {
  localStorage.removeItem('authToken');
  sessionStorage.removeItem('authToken');
};

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

export const getTokenPayload = (token) => {
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    return null;
  }
};`;
  }

  getAuthConstants() {
    return `// Authentication constants

export const AUTH_CONSTANTS = {
  TOKEN_KEY: 'authToken',
  REFRESH_TOKEN_KEY: 'refreshToken',
  USER_KEY: 'user',

  // Token expiration times (in milliseconds)
  ACCESS_TOKEN_EXPIRY: 15 * 60 * 1000, // 15 minutes
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days

  // API endpoints
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // Error messages
  ERROR_MESSAGES: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_NOT_FOUND: 'User not found',
    EMAIL_ALREADY_EXISTS: 'Email already exists',
    WEAK_PASSWORD: 'Password is too weak',
    TOKEN_EXPIRED: 'Token has expired',
    UNAUTHORIZED: 'Unauthorized access',
    NETWORK_ERROR: 'Network error occurred',
  },

  // Validation rules
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 8,
    MAX_PASSWORD_LENGTH: 128,
    EMAIL_REGEX: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
  }
};`;
  }
}

module.exports = AuthBoilerplate;
