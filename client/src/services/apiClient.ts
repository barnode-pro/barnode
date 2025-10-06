import type { ApiResponse } from "@/types";

/**
 * Client API per comunicazione con il backend BarNode
 * Implementazione reale con fetch e gestione errori
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "/api/v1") {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'http_error',
          message: data.message || `HTTP ${response.status}`,
          status: response.status
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
        pagination: data.pagination
      };
    } catch (error) {
      return {
        success: false,
        error: 'network_error',
        message: error instanceof Error ? error.message : 'Errore di rete',
        status: 0
      };
    }
  }

  /**
   * Metodo GET generico
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * Metodo POST generico
   */
  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Metodo PUT generico
   */
  async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Metodo DELETE generico
   */
  async del<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Istanza singleton del client API
export const apiClient = new ApiClient();

// Export del tipo per uso nei servizi specifici
export type { ApiClient };
