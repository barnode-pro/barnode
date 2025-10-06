import { Router } from 'express';
import multer from 'multer';
import * as XLSX from 'xlsx';
import { z } from 'zod';
import { logger } from '../../utils/logger.js';

/**
 * Routes per import prodotti da XLSX/CSV o Google Sheet
 * Versione semplificata per compilazione rapida
 */

const router = Router();

// Configurazione multer per upload file (max 5MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Schema per URL Google Sheet
const googleSheetSchema = z.object({
  url: z.string().url('URL non valido')
});

// POST /api/v1/import/prodotti - Upload file (placeholder)
router.post('/prodotti', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File non fornito'
      });
    }

    // TODO: Implementare parsing e import
    logger.info('Import prodotti da file richiesto', {
      filename: req.file.originalname,
      size: req.file.size
    });

    res.json({
      success: true,
      data: {
        creati: 0,
        aggiornati: 0,
        saltati: 0,
        fornitori_creati: 0,
        warnings: ['Import non ancora implementato - placeholder attivo']
      }
    });

  } catch (error) {
    logger.error('Errore import prodotti da file', { error });
    next(error);
  }
});

// POST /api/v1/import/prodotti/gsheet - Google Sheet URL (placeholder)
router.post('/prodotti/gsheet', async (req, res, next) => {
  try {
    const { url } = googleSheetSchema.parse(req.body);

    logger.info('Import prodotti da Google Sheet richiesto', { url });

    res.json({
      success: true,
      data: {
        creati: 0,
        aggiornati: 0,
        saltati: 0,
        fornitori_creati: 0,
        warnings: ['Import Google Sheet non ancora implementato - placeholder attivo']
      }
    });

  } catch (error) {
    logger.error('Errore import prodotti da Google Sheet', { error });
    next(error);
  }
});

export default router;
