import { apiClient } from './apiClient';
import type { ApiResponse } from '@/types';

/**
 * Servizio per operazioni bulk edit
 * Gestisce aggiornamenti massivi di articoli
 */

export interface BulkEditArticoliRequest {
  ids: string[];
  patch: {
    categoria?: string;
    prezzo_acquisto?: number;
    prezzo_vendita?: number;
  };
}

export interface BulkEditResult {
  updated: number;
}

export class BulkEditService {
  
  async bulkEditArticoli(data: BulkEditArticoliRequest): Promise<ApiResponse<BulkEditResult>> {
    return await apiClient.patch('/api/v1/articoli/bulk', data);
  }
}

export const bulkEditService = new BulkEditService();
