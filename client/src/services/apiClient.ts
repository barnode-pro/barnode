import type { ApiResponse, ApiError } from "@/types";

/**
 * Client API per comunicazione con il backend BarNode
 * Interfaccia unificata per tutte le chiamate HTTP
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "/api/v1") {
    this.baseUrl = baseUrl;
  }

  /**
   * Metodo GET generico
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    // TODO: Implementare chiamata HTTP reale
    console.log(`[API] GET ${this.baseUrl}${endpoint}`);
    
    // Placeholder response
    return {
      data: {} as T,
      success: true,
      message: "Placeholder response - implementazione in STEP 2"
    };
  }

  /**
   * Metodo POST generico
   */
  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    // TODO: Implementare chiamata HTTP reale
    console.log(`[API] POST ${this.baseUrl}${endpoint}`, data);
    
    // Placeholder response
    return {
      data: {} as T,
      success: true,
      message: "Placeholder response - implementazione in STEP 2"
    };
  }

  /**
   * Metodo PUT generico
   */
  async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    // TODO: Implementare chiamata HTTP reale
    console.log(`[API] PUT ${this.baseUrl}${endpoint}`, data);
    
    // Placeholder response
    return {
      data: {} as T,
      success: true,
      message: "Placeholder response - implementazione in STEP 2"
    };
  }

  /**
   * Metodo DELETE generico
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    // TODO: Implementare chiamata HTTP reale
    console.log(`[API] DELETE ${this.baseUrl}${endpoint}`);
    
    // Placeholder response
    return {
      data: {} as T,
      success: true,
      message: "Placeholder response - implementazione in STEP 2"
    };
  }
}

// Istanza singleton del client API
export const apiClient = new ApiClient();

// Export del tipo per uso nei servizi specifici
export type { ApiClient };
