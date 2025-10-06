import { useState, useEffect } from 'react';
import { fornitoriService, type FornitoriFilters } from '@/services/fornitori.service';
import type { Fornitore } from '@shared/types/schema';

/**
 * Hook per gestione stato Fornitori
 * Principalmente per select e dropdown
 */

export function useFornitori(autoLoad: boolean = true) {
  const [fornitori, setFornitori] = useState<Fornitore[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFornitori = async (filters: FornitoriFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fornitoriService.getAll(filters);
      
      if (response.success && response.data) {
        setFornitori(response.data);
      } else {
        setError(response.message || 'Errore caricamento fornitori');
        setFornitori([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore di rete');
      setFornitori([]);
    } finally {
      setLoading(false);
    }
  };

  const retry = () => {
    fetchFornitori();
  };

  // Carica fornitori al mount se autoLoad è true
  useEffect(() => {
    if (autoLoad) {
      fetchFornitori();
    }
  }, [autoLoad]);

  return {
    fornitori,
    loading,
    error,
    fetchFornitori,
    retry
  };
}
