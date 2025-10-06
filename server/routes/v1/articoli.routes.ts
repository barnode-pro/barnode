import { Router } from 'express';
import { articoliRepo } from '../../db/repositories/articoli.repo.js';
import { insertArticoloSchema, updateArticoloSchema, searchArticoliSchema } from '../../db/schema/articolo.js';
import { validateBody, validateParams, validateQuery, idParamsSchema } from '../../utils/validate.js';
import { logger } from '../../utils/logger.js';

/**
 * Routes REST per gestione Articoli
 * CRUD completo con join fornitori e filtri avanzati
 */

const router = Router();

// GET /api/v1/articoli - Lista articoli con filtri
router.get('/', 
  validateQuery(searchArticoliSchema),
  async (req, res, next) => {
    try {
      const filters = req.query as any;
      const result = await articoliRepo.getAll(filters);
      
      logger.info('Lista articoli richiesta', { 
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

// GET /api/v1/articoli/:id - Dettaglio articolo
router.get('/:id',
  validateParams(idParamsSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const articolo = await articoliRepo.getById(id);
      
      logger.info('Dettaglio articolo richiesto', { 
        id, 
        nome: articolo.nome,
        fornitore: articolo.fornitore.nome 
      });
      
      res.json({
        success: true,
        data: articolo
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/v1/articoli - Crea nuovo articolo
router.post('/',
  validateBody(insertArticoloSchema),
  async (req, res, next) => {
    try {
      const data = req.body;
      const newArticolo = await articoliRepo.create(data);
      
      logger.info('Nuovo articolo creato', { 
        id: newArticolo.id, 
        nome: newArticolo.nome,
        fornitore_id: newArticolo.fornitore_id
      });
      
      res.status(201).json({
        success: true,
        data: newArticolo
      });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/v1/articoli/:id - Aggiorna articolo
router.put('/:id',
  validateParams(idParamsSchema),
  validateBody(updateArticoloSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const updatedArticolo = await articoliRepo.update(id, data);
      
      logger.info('Articolo aggiornato', { 
        id, 
        nome: updatedArticolo.nome 
      });
      
      res.json({
        success: true,
        data: updatedArticolo
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/v1/articoli/:id - Elimina articolo
router.delete('/:id',
  validateParams(idParamsSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await articoliRepo.remove(id);
      
      logger.info('Articolo eliminato', { id });
      
      res.json({
        success: true,
        message: 'Articolo eliminato con successo'
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as articoliRoutes };
