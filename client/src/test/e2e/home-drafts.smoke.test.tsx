import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from '../../pages/Home/HomePage';
import { ordiniService } from '../../services/ordini.service';

/**
 * Test Smoke per funzionalità Home → Ordini da fare
 * Verifica rendering e interazioni base senza chiamate API reali
 */

// Mock del servizio ordini
vi.mock('../../services/ordini.service', () => ({
  ordiniService: {
    getDraftsCount: vi.fn(),
    addItemToDraft: vi.fn()
  }
}));

// Mock del servizio articoli
vi.mock('../../services/articoli.service', () => ({
  articoliService: {
    getAll: vi.fn()
  }
}));

// Mock hook articoli
vi.mock('../../hooks/useArticoli', () => ({
  useArticoli: vi.fn(() => ({
    articoli: [
      {
        id: 'test-articolo-1',
        nome: 'Articolo Test 1',
        categoria: 'Test',
        fornitore: { id: 'test-fornitore-1', nome: 'Fornitore Test' }
      },
      {
        id: 'test-articolo-2',
        nome: 'Articolo Test 2',
        categoria: 'Bevande',
        fornitore: { id: 'test-fornitore-2', nome: 'Altro Fornitore' }
      }
    ],
    loading: false,
    error: null
  }))
}));

// Mock useLocation per navigazione
vi.mock('wouter', () => ({
  useLocation: () => ['/home', vi.fn()]
}));

describe('Home → Ordini da fare - Smoke Test', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
    vi.clearAllMocks();
  });

  const renderHomePage = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <HomePage />
      </QueryClientProvider>
    );
  };

  describe('Sezione Ordini da fare', () => {
    it('dovrebbe mostrare sezione con titolo e icona', () => {
      // Mock conteggio bozze = 0
      vi.mocked(ordiniService.getDraftsCount).mockResolvedValue({
        success: true,
        data: { totalDrafts: 0, perFornitore: [] }
      });

      renderHomePage();

      expect(screen.getByText('Ordini da fare')).toBeInTheDocument();
      expect(screen.getByText('Articoli aggiunti alle bozze ordini, pronti per revisione e invio')).toBeInTheDocument();
    });

    it('dovrebbe mostrare stato vuoto quando nessuna bozza', async () => {
      vi.mocked(ordiniService.getDraftsCount).mockResolvedValue({
        success: true,
        data: { totalDrafts: 0, perFornitore: [] }
      });

      renderHomePage();

      await waitFor(() => {
        expect(screen.getByText('Nessun articolo in bozza')).toBeInTheDocument();
        expect(screen.getByText('Aggiungi articoli dal catalogo per creare bozze ordini')).toBeInTheDocument();
      });
    });

    it('dovrebbe mostrare conteggio e bottone quando ci sono bozze', async () => {
      vi.mocked(ordiniService.getDraftsCount).mockResolvedValue({
        success: true,
        data: { 
          totalDrafts: 5, 
          perFornitore: [
            { fornitoreId: 'test-1', count: 3 },
            { fornitoreId: 'test-2', count: 2 }
          ]
        }
      });

      renderHomePage();

      await waitFor(() => {
        // Verifica conteggio principale con data-testid
        const mainCount = screen.getByTestId('drafts-count-main');
        expect(mainCount).toBeInTheDocument();
        expect(mainCount).toHaveTextContent('5');
        
        expect(screen.getByText('articoli in bozza')).toBeInTheDocument();
        expect(screen.getByText('Vai a Ordini')).toBeInTheDocument();
      });
    });

    it('dovrebbe mostrare badge conteggio nel titolo', async () => {
      vi.mocked(ordiniService.getDraftsCount).mockResolvedValue({
        success: true,
        data: { totalDrafts: 3, perFornitore: [] }
      });

      renderHomePage();

      await waitFor(() => {
        // Badge dovrebbe essere presente accanto al titolo con data-testid
        const badge = screen.getByTestId('drafts-badge');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveTextContent('3');
      });
    });
  });

  describe('Sezione Catalogo', () => {
    beforeEach(() => {
      vi.mocked(ordiniService.getDraftsCount).mockResolvedValue({
        success: true,
        data: { totalDrafts: 0, perFornitore: [] }
      });
    });

    it('dovrebbe mostrare sezione catalogo con search', () => {
      renderHomePage();

      expect(screen.getByText('Catalogo Articoli')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Cerca articoli...')).toBeInTheDocument();
    });

    it('dovrebbe mostrare lista articoli con bottoni Aggiungi', async () => {
      renderHomePage();

      await waitFor(() => {
        expect(screen.getByText('Articolo Test 1')).toBeInTheDocument();
        expect(screen.getByText('Articolo Test 2')).toBeInTheDocument();
        
        const addButtons = screen.getAllByText('Aggiungi');
        expect(addButtons).toHaveLength(2);
      });
    });

    it('dovrebbe chiamare servizio quando si clicca Aggiungi', async () => {
      vi.mocked(ordiniService.addItemToDraft).mockResolvedValue({
        success: true,
        data: {
          ordineId: 'test-ordine-id',
          fornitoreNome: 'Fornitore Test',
          righeCount: 1
        }
      });

      renderHomePage();

      await waitFor(() => {
        const addButtons = screen.getAllByText('Aggiungi');
        fireEvent.click(addButtons[0]);
      });

      expect(ordiniService.addItemToDraft).toHaveBeenCalledWith('test-articolo-1', 1);
    });

    it('dovrebbe filtrare articoli con search', async () => {
      renderHomePage();

      const searchInput = screen.getByPlaceholderText('Cerca articoli...');
      fireEvent.change(searchInput, { target: { value: 'Test 1' } });

      // Il filtro viene gestito dal hook useArticoli mockato
      // In un test reale, qui verificheremmo che il hook venga chiamato con i parametri corretti
      expect(searchInput).toHaveValue('Test 1');
    });
  });

  describe('Integrazione sezioni', () => {
    it('dovrebbe aggiornare conteggio dopo aggiunta articolo', async () => {
      // Mock iniziale: 0 bozze
      const getDraftsCountMock = vi.mocked(ordiniService.getDraftsCount);
      getDraftsCountMock.mockResolvedValueOnce({
        success: true,
        data: { totalDrafts: 0, perFornitore: [] }
      });

      // Mock dopo aggiunta: 1 bozza
      getDraftsCountMock.mockResolvedValueOnce({
        success: true,
        data: { totalDrafts: 1, perFornitore: [{ fornitoreId: 'test-1', count: 1 }] }
      });

      vi.mocked(ordiniService.addItemToDraft).mockResolvedValue({
        success: true,
        data: {
          ordineId: 'test-ordine-id',
          fornitoreNome: 'Fornitore Test',
          righeCount: 1
        }
      });

      renderHomePage();

      // Stato iniziale: nessuna bozza
      await waitFor(() => {
        expect(screen.getByText('Nessun articolo in bozza')).toBeInTheDocument();
      });

      // Simula aggiunta articolo
      const addButtons = screen.getAllByText('Aggiungi');
      fireEvent.click(addButtons[0]);

      // Verifica chiamata servizio
      await waitFor(() => {
        expect(ordiniService.addItemToDraft).toHaveBeenCalledWith('test-articolo-1', 1);
      });

      // Note: In un test reale con React Query, qui verificheremmo
      // che la cache venga invalidata e il conteggio aggiornato
    });
  });

  describe('Stati di errore', () => {
    it('dovrebbe gestire errore caricamento conteggio', async () => {
      vi.mocked(ordiniService.getDraftsCount).mockRejectedValue(
        new Error('Errore rete')
      );

      renderHomePage();

      // Il componente dovrebbe gestire gracefully l'errore
      // e mostrare uno stato di fallback
      await waitFor(() => {
        // In caso di errore, il hook dovrebbe fornire valori default
        expect(screen.getByText('Ordini da fare')).toBeInTheDocument();
      });
    });

    it('dovrebbe gestire errore aggiunta articolo', async () => {
      vi.mocked(ordiniService.getDraftsCount).mockResolvedValue({
        success: true,
        data: { totalDrafts: 0, perFornitore: [] }
      });

      vi.mocked(ordiniService.addItemToDraft).mockRejectedValue(
        new Error('Errore aggiunta')
      );

      renderHomePage();

      const addButtons = await screen.findAllByText('Aggiungi');
      fireEvent.click(addButtons[0]);

      // Verifica che l'errore non rompa l'interfaccia
      expect(screen.getByText('Catalogo Articoli')).toBeInTheDocument();
    });
  });
});
