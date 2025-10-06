import { useQuery, useQueryClient } from '@tanstack/react-query';
import { articoliService, type ArticoliFilters } from '@/services/articoli.service';
import { fornitoriService, type FornitoriFilters } from '@/services/fornitori.service';
import { ordiniService, type OrdiniFilters } from '@/services/ordini.service';

/**
 * Hook per gestione tabelle database con query params
 * Supporta search, filter, sort, pagination per tutte le entità
 */

export function useArticoliTable(filters: ArticoliFilters = {}) {
  return useQuery({
    queryKey: ['database', 'articoli', filters],
    queryFn: () => articoliService.getAll(filters),
    staleTime: 30000, // 30 secondi
  });
}

export function useFornitoriTable(filters: FornitoriFilters = {}) {
  return useQuery({
    queryKey: ['database', 'fornitori', filters],
    queryFn: () => fornitoriService.getAll(filters),
    staleTime: 30000,
  });
}

export function useOrdiniTable(filters: OrdiniFilters = {}) {
  return useQuery({
    queryKey: ['database', 'ordini', filters],
    queryFn: () => ordiniService.getAll(filters),
    staleTime: 30000,
  });
}

// Hook per invalidare cache tabelle dopo bulk operations
export function useInvalidateTableCache() {
  const queryClient = useQueryClient();
  
  return {
    invalidateArticoli: () => queryClient.invalidateQueries({ queryKey: ['database', 'articoli'] }),
    invalidateFornitori: () => queryClient.invalidateQueries({ queryKey: ['database', 'fornitori'] }),
    invalidateOrdini: () => queryClient.invalidateQueries({ queryKey: ['database', 'ordini'] }),
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: ['database'] })
  };
}
