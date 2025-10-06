import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

/**
 * Utilities per validazione Zod nelle route BarNode
 * Middleware per validazione body, params, query
 */

// Schema base comuni
export const uuidSchema = z.string().uuid('ID deve essere un UUID valido');
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20)
});

// Middleware factory per validazione body
export function validateBody<T extends z.ZodSchema>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}

// Middleware factory per validazione params
export function validateParams<T extends z.ZodSchema>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      next(error);
    }
  };
}

// Middleware factory per validazione query
export function validateQuery<T extends z.ZodSchema>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      next(error);
    }
  };
}

// Schema per ID params comuni
export const idParamsSchema = z.object({
  id: uuidSchema
});

// Schema per ricerca testuale
export const searchQuerySchema = z.object({
  search: z.string().optional(),
  ...paginationSchema.shape
});

// Utility per risposta paginata
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
): PaginatedResponse<T> {
  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    }
  };
}
