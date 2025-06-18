const { createFileStructure } = require('../utils/fileUtils');

class APIBoilerplate {
  // API boilerplate generator
  generateAPIBoilerplate(projectPath, options) {
    const entityName = options[0] || 'user';
    const capitalizedEntity = entityName.charAt(0).toUpperCase() + entityName.slice(1);

    const structure = {
      [`api/${entityName}Api.js`]: this.getAPIService(entityName, capitalizedEntity),
      [`api/client.js`]: this.getAPIClient(),
      [`api/endpoints.js`]: this.getAPIEndpoints(entityName),
      [`hooks/use${capitalizedEntity}Api.js`]: this.getAPIHook(entityName, capitalizedEntity),
      // [`types/${entityName}Types.js`]: this.getAPITypes(entityName),
      [`utils/apiUtils.js`]: this.getAPIUtils()
    };

    createFileStructure(projectPath, structure);

    return {
      dependencies: ['axios'],
      instructions: [
        'Configure your API base URL in api/client.js',
        'Update the endpoints in api/endpoints.js',
        // 'Modify types based on your API response structure',
        `Use the use${capitalizedEntity}Api hook in your components or modify it`
      ],
      files: Object.keys(structure)
    };
  }

  // API template methods
  getAPIService(entityName, capitalizedEntity) {
    return `import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

class ${capitalizedEntity}Service {
  async getAll() {
    const response = await apiClient.get(API_ENDPOINTS.${entityName.toUpperCase()}.GET_ALL);
    return response.data;
  }

  async getById(id) {
    const response = await apiClient.get(API_ENDPOINTS.${entityName.toUpperCase()}.GET_BY_ID(id));
    return response.data;
  }

  async create(data) {
    const response = await apiClient.post(API_ENDPOINTS.${entityName.toUpperCase()}.CREATE, data);
    return response.data;
  }

  async update(id, data) {
    const response = await apiClient.put(API_ENDPOINTS.${entityName.toUpperCase()}.UPDATE(id), data);
    return response.data;
  }

  async delete(id) {
    const response = await apiClient.delete(API_ENDPOINTS.${entityName.toUpperCase()}.DELETE(id));
    return response.data;
  }

  async search(query) {
    const response = await apiClient.get(API_ENDPOINTS.${entityName.toUpperCase()}.SEARCH, {
      params: { q: query }
    });
    return response.data;
  }

  async getPaginated(page = 1, limit = 10) {
    const response = await apiClient.get(API_ENDPOINTS.${entityName.toUpperCase()}.GET_ALL, {
      params: { page, limit }
    });
    return response.data;
  }
}

export const ${entityName}Service = new ${capitalizedEntity}Service();`;
  }

  getAPIClient() {
    return `import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api'; // <- replace with your actual backend URL

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }

    if (error.response?.status === 403) {
      console.error('Access forbidden');
    }

    if (error.response?.status >= 500) {
      console.error('Server error');
    }

    return Promise.reject(error);
  }
);

export default apiClient;`;
  }

  getAPIEndpoints(entityName) {
    return `export const API_ENDPOINTS = {
  ${entityName.toUpperCase()}: {
    GET_ALL: '/${entityName}',
    GET_BY_ID: (id) => \`/${entityName}/\${id}\`,
    CREATE: '/${entityName}',
    UPDATE: (id) => \`/${entityName}/\${id}\`,
    DELETE: (id) => \`/${entityName}/\${id}\`,
    SEARCH: '/${entityName}/search',
  },

  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },

  // Add more endpoints as needed
};`;
  }

  getAPIHook(entityName, capitalizedEntity) {
    return `import { useState, useEffect, useCallback } from 'react';
import { ${entityName}Service } from '../api/${entityName}Api';

export const use${capitalizedEntity}Api = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await ${entityName}Service.getAll();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const result = await ${entityName}Service.getById(id);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (itemData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await ${entityName}Service.create(itemData);
      setData(prevData => [...prevData, result]);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id, itemData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await ${entityName}Service.update(id, itemData);
      setData(prevData =>
        prevData.map(item => item.id === id ? result : item)
      );
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await ${entityName}Service.delete(id);
      setData(prevData => prevData.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback(async (query) => {
    try {
      setLoading(true);
      setError(null);
      const result = await ${entityName}Service.search(query);
      setData(result);
      return result;
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

  return {
    data,
    loading,
    error,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    search,
    clearError
  };
};`;
  }

  getAPITypes(entityName) {
    return `// ${entityName} types
export interface ${entityName.charAt(0).toUpperCase() + entityName.slice(1)} {
  id: string | number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Create${entityName.charAt(0).toUpperCase() + entityName.slice(1)}Request {
  name: string;
  description?: string;
}

export interface Update${entityName.charAt(0).toUpperCase() + entityName.slice(1)}Request {
  name?: string;
  description?: string;
}

export interface ${entityName.charAt(0).toUpperCase() + entityName.slice(1)}Response {
  data: ${entityName.charAt(0).toUpperCase() + entityName.slice(1)}[];
  total: number;
  page: number;
  limit: number;
}

export interface API_Response<T> {
  data: T;
  message: string;
  success: boolean;
}`;
  }

  getAPIUtils() {
    return `export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.message || 'Server error occurred',
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // Request made but no response received
    return {
      message: 'Network error - no response from server',
      status: 0,
      data: null
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: 0,
      data: null
    };
  }
};

export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value.toString());
    }
  });

  return searchParams.toString();
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export const retry = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
};`;
  }
}

module.exports = APIBoilerplate;
