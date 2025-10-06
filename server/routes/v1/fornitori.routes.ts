import { Router } from 'express';
import { fornitoriRepo } from '../../db/repositories/fornitori.repo.js';
import { insertFornitoreSchema, updateFornitoreSchema, searchFornitoriSchema } from '../../db/schema/fornitore.js';
import { validateBody, validateParams, validateQuery, idParamsSchema } from '../../utils/validate.js';
import { logger } from '../../utils/logger.js';

/**
 * Routes REST per gestione Fornitori
 * CRUD completo con validazione Zod
 */

const router = Router();

// GET /api/v1/fornitori - Lista fornitori con filtri
router.get('/', 
  validateQuery(searchFornitoriSchema),
  async (req, res, next) => {
    try {
      const filters = req.query as any;
      const result = await fornitoriRepo.getAll(filters);
      
      logger.info('Lista fornitori richiesta', { 
        filters, 
        count: result.data.length,
        total: result.pagination.total 
      });
      
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/v1/fornitori/:id - Dettaglio fornitore
router.get('/:id',
  validateParams(idParamsSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const fornitore = await fornitoriRepo.getById(id);
      
      logger.info('Dettaglio fornitore richiesto', { id, nome: fornitore.nome });
      
      res.json({
        success: true,
        data: fornitore
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/v1/fornitori - Crea nuovo fornitore
router.post('/',
  validateBody(insertFornitoreSchema),
  async (req, res, next) => {
    try {
      const data = req.body;
      const newFornitore = await fornitoriRepo.create(data);
      
      logger.info('Nuovo fornitore creato', { 
        id: newFornitore.id, 
        nome: newFornitore.nome 
      });
      
      res.status(201).json({
        success: true,
        data: newFornitore
      });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/v1/fornitori/:id - Aggiorna fornitore
router.put('/:id',
  validateParams(idParamsSchema),
  validateBody(updateFornitoreSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const updatedFornitore = await fornitoriRepo.update(id, data);
      
      logger.info('Fornitore aggiornato', { 
        id, 
        nome: updatedFornitore.nome 
      });
      
      res.json({
        success: true,
        data: updatedFornitore
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/v1/fornitori/:id - Elimina fornitore
router.delete('/:id',
  validateParams(idParamsSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await fornitoriRepo.remove(id);
      
      logger.info('Fornitore eliminato', { id });
      
      res.json({
        success: true,
        message: 'Fornitore eliminato con successo'
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as fornitoriRoutes };
