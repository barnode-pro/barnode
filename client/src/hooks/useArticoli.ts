import { useState, useEffect } from 'react';
import { articoliService, type ArticoliFilters, type ArticoloConFornitore } from '@/services/articoli.service';
import type { ApiResponse } from '@/types';
import type { InsertArticolo } from '@shared/types/schema';

/**
 * Hook per gestione stato Articoli
 * Gestisce loading, errori, CRUD operations
 */

export function useArticoli(initialFilters: ArticoliFilters = {}) {
  const [articoli, setArticoli] = useState<ArticoloConFornitore[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ArticoliFilters>(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  });

  const fetchArticoli = async (newFilters?: ArticoliFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const currentFilters = newFilters || filters;
      const response = await articoliService.getAll(currentFilters);
      
      if (response.success && response.data) {
        setArticoli(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        setError(response.message || 'Errore caricamento articoli');
        setArticoli([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore di rete');
      setArticoli([]);
    } finally {
      setLoading(false);
    }
  };

  const createArticolo = async (data: InsertArticolo): Promise<boolean> => {
    try {
      const response = await articoliService.create(data);
      if (response.success) {
        await fetchArticoli(); // Refresh lista
        return true;
      } else {
        setError(response.message || 'Errore creazione articolo');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore di rete');
      return false;
    }
  };

  const updateArticolo = async (id: string, data: Partial<InsertArticolo>): Promise<boolean> => {
    try {
      const response = await articoliService.update(id, data);
      if (response.success) {
        await fetchArticoli(); // Refresh lista
        return true;
      } else {
        setError(response.message || 'Errore aggiornamento articolo');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore di rete');
      return false;
    }
  };

  const deleteArticolo = async (id: string): Promise<boolean> => {
    try {
      const response = await articoliService.remove(id);
      if (response.success) {
        await fetchArticoli(); // Refresh lista
        return true;
      } else {
        setError(response.message || 'Errore eliminazione articolo');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore di rete');
      return false;
    }
  };

  const updateFilters = (newFilters: Partial<ArticoliFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchArticoli(updatedFilters);
  };

  const retry = () => {
    fetchArticoli();
  };

  // Carica articoli al mount e quando cambiano i filtri
  useEffect(() => {
    fetchArticoli();
  }, []); // Solo al mount, i filtri vengono gestiti da updateFilters

  return {
    articoli,
    loading,
    error,
    filters,
    pagination,
    createArticolo,
    updateArticolo,
    deleteArticolo,
    updateFilters,
    retry,
    refetch: fetchArticoli
  };
}
