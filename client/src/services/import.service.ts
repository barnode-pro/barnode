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
      console.log('🔍 Import file:', file.name, file.size, file.type);
      
      const formData = new FormData();
      formData.append('file', file);

      console.log('📤 Sending request to /api/v1/import/prodotti');
      
      const response = await fetch('/api/v1/import/prodotti', {
        method: 'POST',
        body: formData
      });

      console.log('📥 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Import error:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Import success:', result);
      return result;
    } catch (error) {
      console.error('💥 Import exception:', error);
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
