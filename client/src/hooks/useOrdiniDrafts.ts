import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordiniService } from '@/services/ordini.service';

/**
 * Hook per gestione bozze ordini
 * Conteggio, aggiunta articoli, invalidazione cache
 */

export function useOrdiniDrafts() {
  const queryClient = useQueryClient();

  // Query per conteggio bozze
  const {
    data: draftsCount,
    isLoading: isLoadingCount,
    error: countError
  } = useQuery({
    queryKey: ['ordini', 'drafts', 'count'],
    queryFn: async () => {
      const response = await ordiniService.getDraftsCount();
      if (!response.success) {
        throw new Error(response.message || 'Errore caricamento conteggio bozze');
      }
      return response.data;
    },
    staleTime: 30 * 1000, // 30 secondi
    refetchOnWindowFocus: false
  });

  // Mutation per aggiungere articolo a bozza
  const addItemMutation = useMutation({
    mutationFn: async ({ articoloId, qty = 1 }: { articoloId: string; qty?: number }) => {
      const response = await ordiniService.addItemToDraft(articoloId, qty);
      if (!response.success) {
        throw new Error(response.message || 'Errore aggiunta articolo a bozza');
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Invalida cache conteggio e ordini
      queryClient.invalidateQueries({ queryKey: ['ordini', 'drafts', 'count'] });
      queryClient.invalidateQueries({ queryKey: ['ordini'] });
      
      // Log successo (sostituirà toast in futuro)
      console.log(`Aggiunto alla bozza di ${data?.fornitoreNome}`, {
        righeCount: data?.righeCount
      });
    },
    onError: (error: Error) => {
      console.error('Errore aggiunta articolo:', error.message);
    }
  });

  // Funzione helper per aggiungere articolo
  const addItemToDraft = (articoloId: string, qty: number = 1) => {
    addItemMutation.mutate({ articoloId, qty });
  };

  // Funzione per invalidare cache
  const invalidateDrafts = () => {
    queryClient.invalidateQueries({ queryKey: ['ordini', 'drafts', 'count'] });
    queryClient.invalidateQueries({ queryKey: ['ordini'] });
  };

  return {
    // Dati
    draftsCount: draftsCount || { totalDrafts: 0, perFornitore: [] },
    totalDrafts: draftsCount?.totalDrafts || 0,
    
    // Stati
    isLoadingCount,
    isAddingItem: addItemMutation.isPending,
    countError,
    
    // Azioni
    addItemToDraft,
    invalidateDrafts
  };
}
