import { apiClient } from './apiClient';
import type { ApiResponse } from '@/types';
import type { Fornitore, InsertFornitore } from '@shared/types/schema';

/**
 * Servizio per gestione Fornitori
 * Interfaccia CRUD per endpoint /api/v1/fornitori
 */

export interface FornitoriFilters {
  search?: string;
  page?: number;
  pageSize?: number;
}

export class FornitoriService {
  
  async getAll(filters: FornitoriFilters = {}): Promise<ApiResponse<Fornitore[]>> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    
    const query = params.toString();
    const endpoint = query ? `/fornitori?${query}` : '/fornitori';
    
    return apiClient.get<Fornitore[]>(endpoint);
  }

  async getById(id: string): Promise<ApiResponse<Fornitore>> {
    return apiClient.get<Fornitore>(`/fornitori/${id}`);
  }

  async create(data: InsertFornitore): Promise<ApiResponse<Fornitore>> {
    return apiClient.post<Fornitore>('/fornitori', data);
  }

  async update(id: string, data: Partial<InsertFornitore>): Promise<ApiResponse<Fornitore>> {
    return apiClient.put<Fornitore>(`/fornitori/${id}`, data);
  }

  async remove(id: string): Promise<ApiResponse<void>> {
    return apiClient.del<void>(`/fornitori/${id}`);
  }
}

export const fornitoriService = new FornitoriService();
