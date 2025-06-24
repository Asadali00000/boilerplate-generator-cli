import { createContext } from 'react';

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
});