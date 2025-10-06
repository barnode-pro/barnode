import { Router } from 'express';
import { z } from 'zod';
import { ordiniRepo } from '../../db/repositories/ordini.repo.js';
import { righeOrdineRepo } from '../../db/repositories/righeOrdine.repo.js';
import { insertOrdineSchema, updateOrdineSchema, searchOrdiniSchema } from '../../db/schema/ordine.js';
import { insertRigaOrdineSchema, updateQuantitaRicevutaSchema } from '../../db/schema/rigaOrdine.js';
import { validateBody, validateParams, validateQuery, idParamsSchema } from '../../utils/validate.js';
import { logger } from '../../utils/logger.js';

/**
 * Routes REST per gestione Ordini e Righe Ordine
 * CRUD completo con gestione nested righe
 */

const router = Router();

// Schema per creazione ordine con righe
const createOrdineConRigheSchema = z.object({
  ordine: insertOrdineSchema,
  righe: z.array(insertRigaOrdineSchema).optional()
});

// Schema per params con rigaId
const ordineRigaParamsSchema = z.object({
  id: z.string().uuid(),
  rigaId: z.string().uuid()
});

// GET /api/v1/ordini - Lista ordini con filtri
router.get('/', 
  validateQuery(searchOrdiniSchema),
  async (req, res, next) => {
    try {
      const filters = req.query as any;
      const result = await ordiniRepo.getAll(filters);
      
      logger.info('Lista ordini richiesta', { 
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

// GET /api/v1/ordini/:id - Dettaglio ordine con righe
router.get('/:id',
  validateParams(idParamsSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const ordine = await ordiniRepo.getById(id);
      
      logger.info('Dettaglio ordine richiesto', { 
        id, 
        fornitore: ordine.fornitore.nome,
        righe: ordine.righe.length
      });
      
      res.json({
        success: true,
        data: ordine
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/v1/ordini - Crea nuovo ordine (con righe opzionali)
router.post('/',
  validateBody(createOrdineConRigheSchema),
  async (req, res, next) => {
    try {
      const { ordine, righe } = req.body;
      const newOrdine = await ordiniRepo.create(ordine, righe);
      
      logger.info('Nuovo ordine creato', { 
        id: newOrdine.id, 
        fornitore: newOrdine.fornitore.nome,
        righe: newOrdine.righe.length
      });
      
      res.status(201).json({
        success: true,
        data: newOrdine
      });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/v1/ordini/:id - Aggiorna ordine
router.put('/:id',
  validateParams(idParamsSchema),
  validateBody(updateOrdineSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const updatedOrdine = await ordiniRepo.update(id, data);
      
      logger.info('Ordine aggiornato', { 
        id, 
        stato: updatedOrdine.stato 
      });
      
      res.json({
        success: true,
        data: updatedOrdine
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/v1/ordini/:id/righe - Aggiungi riga a ordine
router.post('/:id/righe',
  validateParams(idParamsSchema),
  validateBody(insertRigaOrdineSchema.omit({ ordine_id: true })),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const rigaData = { ...req.body, ordine_id: id };
      const newRiga = await righeOrdineRepo.create(rigaData);
      
      logger.info('Nuova riga aggiunta a ordine', { 
        ordineId: id, 
        rigaId: newRiga.id,
        articoloId: newRiga.articolo_id
      });
      
      res.status(201).json({
        success: true,
        data: newRiga
      });
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /api/v1/ordini/:id/righe/:rigaId - Aggiorna quantità ricevuta
router.patch('/:id/righe/:rigaId',
  validateParams(ordineRigaParamsSchema),
  validateBody(updateQuantitaRicevutaSchema),
  async (req, res, next) => {
    try {
      const { rigaId } = req.params;
      const data = req.body;
      const updatedRiga = await righeOrdineRepo.updateQuantitaRicevuta(rigaId, data);
      
      logger.info('Quantità ricevuta aggiornata', { 
        rigaId, 
        qta_ricevuta: updatedRiga.qta_ricevuta 
      });
      
      res.json({
        success: true,
        data: updatedRiga
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/v1/ordini/:id/righe/:rigaId - Elimina riga ordine
router.delete('/:id/righe/:rigaId',
  validateParams(ordineRigaParamsSchema),
  async (req, res, next) => {
    try {
      const { rigaId } = req.params;
      await righeOrdineRepo.remove(rigaId);
      
      logger.info('Riga ordine eliminata', { rigaId });
      
      res.json({
        success: true,
        message: 'Riga ordine eliminata con successo'
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/v1/ordini/:id/ricezione - Ricevi ordine (aggiorna quantità ricevute e scorte)
const ricezioneSchema = z.object({
  righe: z.array(z.object({
    rigaId: z.string().uuid(),
    quantita_ricevuta: z.number().min(0)
  }))
});

router.post('/:id/ricezione',
  validateParams(idParamsSchema),
  validateBody(ricezioneSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { righe } = req.body;
      const result = await ordiniRepo.riceviOrdine(id, righe);
      
      logger.info('Ordine ricevuto', { 
        ordineId: id,
        righeAggiornate: righe.length,
        statoOrdine: result.stato
      });
      
      res.json({
        success: true,
        data: result,
        message: 'Ricezione completata con successo'
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/v1/ordini/auto - Genera ordini automatici (DISABILITATO)
router.post('/auto',
  async (req, res, next) => {
    try {
      // Feature flag per gestione giacenze
      const featureStock = process.env.FEATURE_STOCK === 'true';
      
      if (!featureStock) {
        return res.status(410).json({
          success: false,
          error: 'feature_disabled',
          message: 'Funzionalità disabilitata (gestione giacenze non attiva)'
        });
      }
      
      // Codice originale mantenuto per eventuale riattivazione
      const ordiniCreati = await ordiniRepo.generaOrdiniAutomatici();
      
      logger.info('Ordini automatici generati', { 
        count: ordiniCreati.length,
        fornitori: ordiniCreati.map(o => o.fornitore.nome)
      });
      
      res.status(201).json({
        success: true,
        data: ordiniCreati,
        message: `${ordiniCreati.length} ordini automatici creati`
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/v1/ordini/:id - Elimina ordine
router.delete('/:id',
  validateParams(idParamsSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await ordiniRepo.remove(id);
      
      logger.info('Ordine eliminato', { id });
      
      res.json({
        success: true,
        message: 'Ordine eliminato con successo'
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as ordiniRoutes };
