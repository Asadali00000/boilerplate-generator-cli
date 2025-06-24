import { useState, useEffect, useCallback } from 'react';
import { userService } from '../api/userApi';

export const useUserApi = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await userService.getAll();
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
      const result = await userService.getById(id);
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
      const result = await userService.create(itemData);
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
      const result = await userService.update(id, itemData);
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
      await userService.delete(id);
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
      const result = await userService.search(query);
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
};
