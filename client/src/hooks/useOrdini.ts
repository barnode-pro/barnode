import { useState, useEffect } from 'react';
import { ordiniService, type OrdiniFilters, type OrdineCompleto, type CreateOrdineRequest } from '@/services/ordini.service';
import type { StatoOrdine } from '@shared/types/schema';

/**
 * Hook per gestione stato Ordini
 * Gestisce loading, errori, CRUD operations
 */

export function useOrdini(initialFilters: OrdiniFilters = {}) {
  const [ordini, setOrdini] = useState<OrdineCompleto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<OrdiniFilters>(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  });

  const fetchOrdini = async (newFilters?: OrdiniFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const currentFilters = newFilters || filters;
      const response = await ordiniService.getAll(currentFilters);
      
      if (response.success && response.data) {
        setOrdini(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        setError(response.message || 'Errore caricamento ordini');
        setOrdini([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore di rete');
      setOrdini([]);
    } finally {
      setLoading(false);
    }
  };

  const createOrdine = async (data: CreateOrdineRequest): Promise<boolean> => {
    try {
      const response = await ordiniService.create(data);
      if (response.success) {
        await fetchOrdini(); // Refresh lista
        return true;
      } else {
        setError(response.message || 'Errore creazione ordine');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore di rete');
      return false;
    }
  };

  const updateStato = async (id: string, stato: StatoOrdine): Promise<boolean> => {
    try {
      const response = await ordiniService.updateStato(id, stato);
      if (response.success) {
        await fetchOrdini(); // Refresh lista
        return true;
      } else {
        setError(response.message || 'Errore aggiornamento stato');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore di rete');
      return false;
    }
  };

  const deleteOrdine = async (id: string): Promise<boolean> => {
    try {
      const response = await ordiniService.remove(id);
      if (response.success) {
        await fetchOrdini(); // Refresh lista
        return true;
      } else {
        setError(response.message || 'Errore eliminazione ordine');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore di rete');
      return false;
    }
  };

  const updateFilters = (newFilters: Partial<OrdiniFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchOrdini(updatedFilters);
  };

  const retry = () => {
    fetchOrdini();
  };

  // Carica ordini al mount
  useEffect(() => {
    fetchOrdini();
  }, []);

  return {
    ordini,
    loading,
    error,
    filters,
    pagination,
    createOrdine,
    updateStato,
    deleteOrdine,
    updateFilters,
    retry,
    refetch: fetchOrdini
  };
}
