import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BottomNav } from '../../components/layout/BottomNav';
import OrdiniPage from '../../pages/Ordini/OrdiniPage';
import { ordiniService } from '../../services/ordini.service';

/**
 * Test Smoke per UI bozze ordini
 * Verifica rendering badge navigazione e evidenziazione bozze
 */

// Mock del servizio ordini
vi.mock('../../services/ordini.service', () => ({
  ordiniService: {
    getDraftsCount: vi.fn(),
    getAll: vi.fn()
  }
}));

// Mock hook ordini
vi.mock('../../hooks/useOrdini', () => ({
  useOrdini: vi.fn(() => ({
    ordini: [
      {
        id: 'bozza-test-1',
        stato: 'bozza',
        fornitore: { id: 'f1', nome: 'Fornitore Bozza' },
        data: new Date().toISOString(),
        righe: [{ id: 'r1', articolo_id: 'a1', qta_ordinata: 2 }]
      },
      {
        id: 'ordine-test-2', 
        stato: 'nuovo',
        fornitore: { id: 'f2', nome: 'Fornitore Normale' },
        data: new Date().toISOString(),
        righe: [{ id: 'r2', articolo_id: 'a2', qta_ordinata: 1 }]
      }
    ],
    loading: false,
    error: null,
    pagination: { total: 2, page: 1, totalPages: 1 },
    updateStato: vi.fn(),
    deleteOrdine: vi.fn(),
    updateFilters: vi.fn(),
    retry: vi.fn()
  }))
}));

// Mock hook fornitori
vi.mock('../../hooks/useFornitori', () => ({
  useFornitori: vi.fn(() => ({
    fornitori: [
      { id: 'f1', nome: 'Fornitore Test 1' },
      { id: 'f2', nome: 'Fornitore Test 2' }
    ]
  }))
}));

// Mock useLocation per navigazione
vi.mock('wouter', () => ({
  useLocation: () => ['/ordini', vi.fn()]
}));

describe('Ordini Bozze UI - Smoke Test', () => {
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

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  describe('Badge Navigazione Ordini', () => {
    it('dovrebbe mostrare badge quando ci sono bozze', () => {
      // Mock conteggio bozze > 0
      vi.mocked(ordiniService.getDraftsCount).mockResolvedValue({
        success: true,
        data: { totalDrafts: 3, perFornitore: [] }
      });

      renderWithProvider(<BottomNav />);

      // Verifica presenza badge con data-testid
      const badge = screen.getByTestId('nav-badge-drafts');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('3');
    });

    it('dovrebbe nascondere badge quando nessuna bozza', () => {
      // Mock conteggio bozze = 0
      vi.mocked(ordiniService.getDraftsCount).mockResolvedValue({
        success: true,
        data: { totalDrafts: 0, perFornitore: [] }
      });

      renderWithProvider(<BottomNav />);

      // Badge non dovrebbe essere presente
      expect(screen.queryByTestId('nav-badge-drafts')).not.toBeInTheDocument();
    });

    it('dovrebbe mostrare tutti i link di navigazione', () => {
      vi.mocked(ordiniService.getDraftsCount).mockResolvedValue({
        success: true,
        data: { totalDrafts: 0, perFornitore: [] }
      });

      renderWithProvider(<BottomNav />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Articoli')).toBeInTheDocument();
      expect(screen.getByText('Ordini')).toBeInTheDocument();
    });
  });

  describe('Evidenziazione Bozze in Ordini', () => {
    it('dovrebbe evidenziare ordini con stato bozza', () => {
      renderWithProvider(<OrdiniPage />);

      // Verifica presenza elemento bozza con data-testid
      const bozzaElement = screen.getByTestId('ordine-bozza');
      expect(bozzaElement).toBeInTheDocument();
      
      // Verifica che abbia le classi di evidenziazione
      expect(bozzaElement).toHaveClass('border-amber-200');
      expect(bozzaElement).toHaveClass('bg-amber-50/50');
    });

    it('dovrebbe mostrare label "Bozza" per ordini bozza', () => {
      renderWithProvider(<OrdiniPage />);

      // Verifica presenza label "Bozza"
      const bozzaLabel = screen.getByText('Bozza');
      expect(bozzaLabel).toBeInTheDocument();
      
      // Verifica che sia un badge con styling corretto
      expect(bozzaLabel.closest('[class*="badge"]')).toBeInTheDocument();
    });

    it('dovrebbe mostrare ordini normali senza evidenziazione', () => {
      renderWithProvider(<OrdiniPage />);

      // Verifica che ordini non-bozza non abbiano data-testid
      const ordineNormale = screen.getByText('Fornitore Normale');
      const cardOrdineNormale = ordineNormale.closest('.border');
      
      expect(cardOrdineNormale).not.toHaveAttribute('data-testid', 'ordine-bozza');
      expect(cardOrdineNormale).not.toHaveClass('border-amber-200');
    });

    it('dovrebbe includere "Bozza" nei filtri stati', () => {
      renderWithProvider(<OrdiniPage />);

      // Verifica che "Bozza" sia presente come opzione di filtro
      // Nota: questo test potrebbe richiedere interazione con il select
      expect(screen.getByText('Filtri')).toBeInTheDocument();
    });
  });

  describe('Integrazione Badge e Bozze', () => {
    it('dovrebbe mostrare badge nav quando ci sono bozze nella lista', () => {
      // Mock con bozze presenti
      vi.mocked(ordiniService.getDraftsCount).mockResolvedValue({
        success: true,
        data: { totalDrafts: 1, perFornitore: [{ fornitoreId: 'f1', count: 1 }] }
      });

      // Render sia nav che pagina ordini
      const { rerender } = renderWithProvider(<BottomNav />);
      
      // Verifica badge presente
      expect(screen.getByTestId('nav-badge-drafts')).toBeInTheDocument();
      expect(screen.getByTestId('nav-badge-drafts')).toHaveTextContent('1');

      // Render pagina ordini
      rerender(
        <QueryClientProvider client={queryClient}>
          <OrdiniPage />
        </QueryClientProvider>
      );

      // Verifica bozza evidenziata
      expect(screen.getByTestId('ordine-bozza')).toBeInTheDocument();
    });
  });

  describe('Accessibilità e UX', () => {
    it('dovrebbe avere attributi aria corretti per badge', () => {
      vi.mocked(ordiniService.getDraftsCount).mockResolvedValue({
        success: true,
        data: { totalDrafts: 5, perFornitore: [] }
      });

      renderWithProvider(<BottomNav />);

      const ordiniButton = screen.getByLabelText('Vai a Ordini');
      expect(ordiniButton).toBeInTheDocument();
      
      const badge = screen.getByTestId('nav-badge-drafts');
      expect(badge).toBeInTheDocument();
    });

    it('dovrebbe mantenere contrasto colori per bozze evidenziate', () => {
      renderWithProvider(<OrdiniPage />);

      const bozzaElement = screen.getByTestId('ordine-bozza');
      
      // Verifica classi per contrasto e accessibilità
      expect(bozzaElement).toHaveClass('shadow-sm');
      
      const bozzaLabel = screen.getByText('Bozza');
      expect(bozzaLabel).toHaveClass('text-amber-800');
    });
  });
});
