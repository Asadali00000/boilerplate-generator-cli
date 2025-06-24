// Token utilities for managing authentication tokens

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
};