import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

class UserService {
  async getAll() {
    const response = await apiClient.get(API_ENDPOINTS.USER.GET_ALL);
    return response.data;
  }

  async getById(id) {
    const response = await apiClient.get(API_ENDPOINTS.USER.GET_BY_ID(id));
    return response.data;
  }

  async create(data) {
    const response = await apiClient.post(API_ENDPOINTS.USER.CREATE, data);
    return response.data;
  }

  async update(id, data) {
    const response = await apiClient.put(API_ENDPOINTS.USER.UPDATE(id), data);
    return response.data;
  }

  async delete(id) {
    const response = await apiClient.delete(API_ENDPOINTS.USER.DELETE(id));
    return response.data;
  }

  async search(query) {
    const response = await apiClient.get(API_ENDPOINTS.USER.SEARCH, {
      params: { q: query }
    });
    return response.data;
  }

  async getPaginated(page = 1, limit = 10) {
    const response = await apiClient.get(API_ENDPOINTS.USER.GET_ALL, {
      params: { page, limit }
    });
    return response.data;
  }
}

export const userService = new UserService();