import { useState, useEffect, useCallback } from 'react';
import { FeatureFlag, UpdateFlagRequest } from '../types';
import { flagsApi } from '../services/api';
import { toast } from '../utils/toast';

export const useFlags = () => {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlags = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await flagsApi.getAll();
      setFlags(data);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch flags';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createFlag = async (flag: { name: string; enabled: boolean; description?: string }) => {
    try {
      const newFlag = await flagsApi.create(flag);
      setFlags(prev => [...prev, newFlag]);
      toast.success(`Flag "${flag.name}" created successfully`);
      return newFlag;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to create flag';
      toast.error(message);
      throw err;
    }
  };

  const updateFlag = async (id: number, flag: UpdateFlagRequest) => {
    try {
      const updatedFlag = await flagsApi.update(id, flag);
      setFlags(prev => prev.map(f => f.id === id ? updatedFlag : f));
      toast.success(`Flag "${flag.name}" updated successfully`);
      return updatedFlag;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update flag';
      toast.error(message);
      throw err;
    }
  };

  const toggleFlag = async (id: number) => {
    try {
      const toggledFlag = await flagsApi.toggle(id);
      setFlags(prev => prev.map(f => f.id === id ? toggledFlag : f));
      toast.success(`Flag "${toggledFlag.name}" ${toggledFlag.enabled ? 'enabled' : 'disabled'}`);
      return toggledFlag;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to toggle flag';
      toast.error(message);
      throw err;
    }
  };

  const deleteFlag = async (id: number) => {
    try {
      const flagToDelete = flags.find(f => f.id === id);
      await flagsApi.delete(id);
      setFlags(prev => prev.filter(f => f.id !== id));
      toast.success(`Flag "${flagToDelete?.name}" deleted successfully`);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete flag';
      toast.error(message);
      throw err;
    }
  };

  useEffect(() => {
    fetchFlags();
  }, [fetchFlags]);

  return {
    flags,
    loading,
    error,
    refetch: fetchFlags,
    createFlag,
    updateFlag,
    toggleFlag,
    deleteFlag,
  };
};