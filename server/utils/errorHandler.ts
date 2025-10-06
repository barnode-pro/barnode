import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { HttpError, ValidationError, DatabaseError } from './errors.js';
import { logger } from './logger.js';

/**
 * Middleware centralizzato per gestione errori BarNode API
 * Converte tutti gli errori in risposte JSON consistenti
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log dell'errore per debugging
  logger.error('API Error:', {
    method: req.method,
    url: req.url,
    error: error.message,
    stack: error.stack
  });

  // Gestione errori Zod (validazione)
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: 'validation_error',
      message: 'Dati di input non validi',
      details: error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
      }))
    });
  }

  // Gestione HttpError personalizzati
  if (error instanceof HttpError) {
    return res.status(error.status).json({
      success: false,
      error: error.meta?.type || 'http_error',
      message: error.message,
      ...(error.meta && { meta: error.meta })
    });
  }

  // Errori database generici
  if (error.message.includes('database') || error.message.includes('SQL')) {
    const dbError = new DatabaseError(error.message, error);
    return res.status(500).json({
      success: false,
      error: 'database_error',
      message: 'Errore interno del database'
    });
  }

  // Errore generico non gestito
  logger.error('Errore non gestito:', error);
  return res.status(500).json({
    success: false,
    error: 'internal_error',
    message: 'Errore interno del server'
  });
}
