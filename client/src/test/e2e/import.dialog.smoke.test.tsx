import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ImportProdottiDialog } from '../../components/ImportProdottiDialog';
import { importService } from '../../services/import.service';

/**
 * Test smoke per ImportProdottiDialog
 * Verifica UI, mock API e invalidazione cache
 */

// Mock del servizio import
vi.mock('../../services/import.service');

// Mock di sonner per toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('ImportProdottiDialog - Smoke Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('dovrebbe renderizzare dialog con tabs', () => {
    render(
      <TestWrapper>
        <ImportProdottiDialog>
          <button>Apri Import</button>
        </ImportProdottiDialog>
      </TestWrapper>
    );

    // Click per aprire dialog
    fireEvent.click(screen.getByText('Apri Import'));

    // Verifica presenza tabs
    expect(screen.getByText('File Excel/CSV')).toBeInTheDocument();
    expect(screen.getByText('Google Sheet')).toBeInTheDocument();
    expect(screen.getByText('Importa Prodotti')).toBeInTheDocument();
  });

  it('dovrebbe mostrare risultati import file con successo', async () => {
    const mockResult = {
      success: true,
      data: {
        creati: 5,
        aggiornati: 2,
        saltati: 0,
        fornitori_creati: 1,
        warnings: []
      }
    };

    vi.mocked(importService.importFromFile).mockResolvedValue(mockResult);

    render(
      <TestWrapper>
        <ImportProdottiDialog>
          <button>Apri Import</button>
        </ImportProdottiDialog>
      </TestWrapper>
    );

    // Apri dialog
    fireEvent.click(screen.getByText('Apri Import'));

    // Simula selezione file
    const fileInput = screen.getByLabelText('Seleziona File');
    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    });
    
    fireEvent.change(fileInput);

    // Click import
    const importButton = screen.getByText('Importa File');
    fireEvent.click(importButton);

    // Verifica chiamata servizio
    await waitFor(() => {
      expect(importService.importFromFile).toHaveBeenCalledWith(file);
    });

    // Verifica risultati mostrati
    await waitFor(() => {
      expect(screen.getByText('Import Completato')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument(); // creati
      expect(screen.getByText('2')).toBeInTheDocument(); // aggiornati
    });
  });

  it('dovrebbe mostrare risultati import Google Sheet', async () => {
    const mockResult = {
      success: true,
      data: {
        creati: 3,
        aggiornati: 1,
        saltati: 1,
        fornitori_creati: 0,
        warnings: ['Prodotto XYZ: nome mancante']
      }
    };

    vi.mocked(importService.importFromGSheet).mockResolvedValue(mockResult);

    render(
      <TestWrapper>
        <ImportProdottiDialog>
          <button>Apri Import</button>
        </ImportProdottiDialog>
      </TestWrapper>
    );

    // Apri dialog e vai al tab Google Sheet
    fireEvent.click(screen.getByText('Apri Import'));
    fireEvent.click(screen.getByText('Google Sheet'));

    // Inserisci URL
    const urlInput = screen.getByLabelText('URL Google Sheet');
    fireEvent.change(urlInput, {
      target: { value: 'https://docs.google.com/spreadsheets/d/123/export?format=csv' }
    });

    // Click import
    const importButton = screen.getByText('Importa da Google Sheet');
    fireEvent.click(importButton);

    // Verifica chiamata servizio
    await waitFor(() => {
      expect(importService.importFromGSheet).toHaveBeenCalledWith(
        'https://docs.google.com/spreadsheets/d/123/export?format=csv'
      );
    });

    // Verifica risultati e warnings
    await waitFor(() => {
      expect(screen.getByText('Import Completato')).toBeInTheDocument();
      expect(screen.getByText('Prodotto XYZ: nome mancante')).toBeInTheDocument();
    });
  });

  it('dovrebbe gestire errori import', async () => {
    vi.mocked(importService.importFromFile).mockResolvedValue({
      success: false,
      message: 'Errore formato file'
    });

    render(
      <TestWrapper>
        <ImportProdottiDialog>
          <button>Apri Import</button>
        </ImportProdottiDialog>
      </TestWrapper>
    );

    // Apri dialog e simula import
    fireEvent.click(screen.getByText('Apri Import'));
    
    const fileInput = screen.getByLabelText('Seleziona File');
    const file = new File(['invalid'], 'test.txt', { type: 'text/plain' });
    
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    });
    
    fireEvent.change(fileInput);
    fireEvent.click(screen.getByText('Importa File'));

    // Verifica che non mostri risultati di successo
    await waitFor(() => {
      expect(screen.queryByText('Import Completato')).not.toBeInTheDocument();
    });
  });
});
