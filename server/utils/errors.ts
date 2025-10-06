/**
 * Classi di errore personalizzate per BarNode API
 * Gestione centralizzata degli errori HTTP
 */

export class HttpError extends Error {
  public readonly status: number;
  public readonly meta?: Record<string, any>;

  constructor(status: number, message: string, meta?: Record<string, any>) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.meta = meta;
    
    // Mantiene stack trace corretto
    Error.captureStackTrace(this, HttpError);
  }
}

export class ValidationError extends HttpError {
  constructor(message: string, details?: Record<string, any>) {
    super(400, message, { type: 'validation_error', details });
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends HttpError {
  constructor(resource: string, id?: string) {
    const message = id 
      ? `${resource} con ID ${id} non trovato`
      : `${resource} non trovato`;
    super(404, message, { type: 'not_found', resource, id });
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends HttpError {
  constructor(message: string, details?: Record<string, any>) {
    super(409, message, { type: 'conflict', details });
    this.name = 'ConflictError';
  }
}

export class DatabaseError extends HttpError {
  constructor(message: string, originalError?: Error) {
    super(500, 'Errore interno del database', { 
      type: 'database_error', 
      originalMessage: message,
      stack: originalError?.stack 
    });
    this.name = 'DatabaseError';
  }
}
