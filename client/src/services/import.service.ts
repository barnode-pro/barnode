import { apiClient } from './apiClient';
import type { ApiResponse } from '@/types';

/**
 * Servizio per import prodotti da file Excel/CSV o Google Sheet
 * Interfaccia per endpoint /api/v1/import
 */

export interface ImportResult {
  creati: number;
  aggiornati: number;
  saltati: number;
  fornitori_creati: number;
  warnings: string[];
}

export class ImportService {
  
  /**
   * Import da file Excel/CSV
   */
  async importFromFile(file: File): Promise<ApiResponse<ImportResult>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/v1/import/prodotti', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Errore import file'
      };
    }
  }

  /**
   * Import da Google Sheet URL
   */
  async importFromGSheet(url: string): Promise<ApiResponse<ImportResult>> {
    try {
      const response = await apiClient.post('/import/prodotti/gsheet', { url });
      return response as ApiResponse<ImportResult>;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Errore import Google Sheet'
      };
    }
  }
}

export const importService = new ImportService();
