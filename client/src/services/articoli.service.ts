import { apiClient } from './apiClient';
import type { ApiResponse } from '@/types';
import type { Articolo, InsertArticolo } from '@shared/types/schema';

/**
 * Servizio per gestione Articoli
 * Interfaccia CRUD per endpoint /api/v1/articoli
 */

export interface ArticoliFilters {
  search?: string;
  categoria?: string;
  fornitore_id?: string;
  page?: number;
  pageSize?: number;
}

export interface ArticoloConFornitore extends Omit<Articolo, 'fornitore_id'> {
  fornitore: {
    id: string;
    nome: string;
  } | null;
}

export class ArticoliService {
  
  async getAll(filters: ArticoliFilters = {}): Promise<ApiResponse<ArticoloConFornitore[]>> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.categoria) params.append('categoria', filters.categoria);
    if (filters.fornitore_id) params.append('fornitore_id', filters.fornitore_id);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    
    const query = params.toString();
    const endpoint = query ? `/articoli?${query}` : '/articoli';
    
    return apiClient.get<ArticoloConFornitore[]>(endpoint);
  }

  async getById(id: string): Promise<ApiResponse<ArticoloConFornitore>> {
    return apiClient.get<ArticoloConFornitore>(`/articoli/${id}`);
  }

  async create(data: InsertArticolo): Promise<ApiResponse<Articolo>> {
    return apiClient.post<Articolo>('/articoli', data);
  }

  async update(id: string, data: Partial<InsertArticolo>): Promise<ApiResponse<Articolo>> {
    return apiClient.put<Articolo>(`/articoli/${id}`, data);
  }

  async remove(id: string): Promise<ApiResponse<void>> {
    return apiClient.del<void>(`/articoli/${id}`);
  }
}

export const articoliService = new ArticoliService();
