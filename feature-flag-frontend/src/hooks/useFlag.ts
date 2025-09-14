import { useState, useEffect } from 'react';
import { FeatureFlag } from '../types';
import { flagsApi } from '../services/api';
import { toast } from '../utils/toast';

export const useFlag = (id: number | undefined) => {
  const [flag, setFlag] = useState<FeatureFlag | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchFlag = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await flagsApi.getById(id);
        setFlag(data);
      } catch (err: any) {
        const message = err.response?.data?.message || 'Failed to fetch flag';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlag();
  }, [id]);

  return { flag, loading, error };
};
