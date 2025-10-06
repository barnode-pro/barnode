import { apiClient } from './apiClient';
import type { ApiResponse } from '@/types';
import type { Ordine, InsertOrdine, RigaOrdine, InsertRigaOrdine, StatoOrdine } from '@shared/types/schema';

/**
 * Servizio per gestione Ordini e Righe Ordine
 * Interfaccia CRUD per endpoint /api/v1/ordini
 */

export interface OrdiniFilters {
  stato?: StatoOrdine;
  fornitore_id?: string;
  data_da?: string;
  data_a?: string;
  page?: number;
  pageSize?: number;
}

export interface OrdineCompleto extends Ordine {
  fornitore: {
    id: string;
    nome: string;
    whatsapp: string | null;
  };
  righe: (RigaOrdine & {
    articolo: {
      id: string;
      nome: string;
      unita: string | null;
      confezione: string | null;
    };
  })[];
}

export interface CreateOrdineRequest {
  ordine: InsertOrdine;
  righe?: Omit<InsertRigaOrdine, 'ordine_id'>[];
}

export class OrdiniService {
  
  async getAll(filters: OrdiniFilters = {}): Promise<ApiResponse<OrdineCompleto[]>> {
    const params = new URLSearchParams();
    
    if (filters.stato) params.append('stato', filters.stato);
    if (filters.fornitore_id) params.append('fornitore_id', filters.fornitore_id);
    if (filters.data_da) params.append('data_da', filters.data_da);
    if (filters.data_a) params.append('data_a', filters.data_a);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    
    const query = params.toString();
    const endpoint = query ? `/ordini?${query}` : '/ordini';
    
    return apiClient.get<OrdineCompleto[]>(endpoint);
  }

  async getById(id: string): Promise<ApiResponse<OrdineCompleto>> {
    return apiClient.get<OrdineCompleto>(`/ordini/${id}`);
  }

  async create(data: CreateOrdineRequest): Promise<ApiResponse<OrdineCompleto>> {
    return apiClient.post<OrdineCompleto>('/ordini', data);
  }

  async updateStato(id: string, stato: StatoOrdine): Promise<ApiResponse<OrdineCompleto>> {
    return apiClient.put<OrdineCompleto>(`/ordini/${id}`, { stato });
  }

  async addRiga(ordineId: string, riga: Omit<InsertRigaOrdine, 'ordine_id'>): Promise<ApiResponse<RigaOrdine>> {
    return apiClient.post<RigaOrdine>(`/ordini/${ordineId}/righe`, riga);
  }

  async updateQuantitaRicevuta(ordineId: string, rigaId: string, qta_ricevuta: number, note?: string): Promise<ApiResponse<RigaOrdine>> {
    return apiClient.put<RigaOrdine>(`/ordini/${ordineId}/righe/${rigaId}`, { qta_ricevuta, note });
  }

  async removeRiga(ordineId: string, rigaId: string): Promise<ApiResponse<void>> {
    return apiClient.del<void>(`/ordini/${ordineId}/righe/${rigaId}`);
  }

  async remove(id: string): Promise<ApiResponse<void>> {
    return apiClient.del<void>(`/ordini/${id}`);
  }
}

export const ordiniService = new OrdiniService();
