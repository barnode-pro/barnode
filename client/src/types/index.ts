// Re-export dei tipi condivisi
export * from "@shared/types/schema";

// Tipi specifici del client
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: number;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

// Tipi per lo stato dell'applicazione
export interface AppState {
  isLoading: boolean;
  error: string | null;
}

// Tipi per la navigazione
export type NavRoute = "/" | "/articoli" | "/fornitori" | "/ordini" | "/ricezione";

// Tipi per i filtri e ricerca
export interface FiltroArticoli {
  categoria?: string;
  fornitore_id?: string;
  ricerca?: string;
}

export interface FiltroOrdini {
  stato?: import("@shared/types/schema").StatoOrdine;
  fornitore_id?: string;
  data_da?: Date;
  data_a?: Date;
}
