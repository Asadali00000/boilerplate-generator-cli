export const API_ENDPOINTS = {
  USER: {
    GET_ALL: '/user',
    GET_BY_ID: (id) => `/user/${id}`,
    CREATE: '/user',
    UPDATE: (id) => `/user/${id}`,
    DELETE: (id) => `/user/${id}`,
    SEARCH: '/user/search',
  },

  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },

  // Add more endpoints as needed
};