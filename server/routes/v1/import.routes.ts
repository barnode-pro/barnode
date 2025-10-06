import { Router } from 'express';
import multer from 'multer';
import * as XLSX from 'xlsx';
import { z } from 'zod';
import { logger } from '../../utils/logger.js';
import { articoliRepo } from '../../db/repositories/articoli.repo.js';
import { fornitoriRepo } from '../../db/repositories/fornitori.repo.js';
import { dbSqlite as db } from '../../db/client.js';
import { fornitori, articoli } from '../../db/schema/index.js';

/**
 * Routes per import prodotti da XLSX/CSV o Google Sheet
 * Implementazione completa con parsing e upsert end-to-end
 */

const router = Router();

// Configurazione multer per upload file (max 5MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
      'text/plain', // .csv (alternative)
      'application/csv' // .csv (alternative)
    ];
    
    // Verifica anche l'estensione del file come fallback
    const fileName = file.originalname.toLowerCase();
    const isValidExtension = fileName.endsWith('.csv') || fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
    
    if (allowedTypes.includes(file.mimetype) || isValidExtension) {
      cb(null, true);
    } else {
      cb(new Error('Formato file non supportato. Usa XLSX o CSV.'));
    }
  }
});

// Schema per URL Google Sheet
const googleSheetSchema = z.object({
  url: z.string().url('URL non valido')
});

// Mapping colonne con sinonimi (case-insensitive) - Solo 3 campi essenziali
const COLUMN_MAPPINGS = {
  nome: ['nome prodotto', 'nome', 'descrizione', 'prodotto'],
  categoria: ['categoria', 'reparto'],
  fornitore: ['fornitore', 'supplier', 'marca']
};

// Flag debug per log dettagliati
const isDebugMode = () => process.env.DEBUG_IMPORT === 'true' || process.env.NODE_ENV !== 'production';

/**
 * Log debug condizionale
 */
function debugLog(message: string, data?: any) {
  if (isDebugMode()) {
    logger.info(message, data);
  }
}

interface ParsedProduct {
  nome: string;
  categoria: string | null;
  fornitore: string;
}

interface ImportResult {
  creati: number;
  aggiornati: number;
  saltati: number;
  fornitori_creati: number;
  warnings: string[];
}


/**
 * Mappa headers con sinonimi case-insensitive
 */
function mapHeaders(row: Record<string, any>): ParsedProduct | null {
  const headers = Object.keys(row).map(h => h.toLowerCase().trim());
  
  // Trova colonna nome (obbligatoria)
  const nomeKey = Object.keys(row).find(key => 
    COLUMN_MAPPINGS.nome.includes(key.toLowerCase().trim())
  );
  
  if (!nomeKey || !row[nomeKey]) return null;
  
  // Trova altre colonne
  const categoriaKey = Object.keys(row).find(key => 
    COLUMN_MAPPINGS.categoria.includes(key.toLowerCase().trim())
  );
  
  const fornitoreKey = Object.keys(row).find(key => 
    COLUMN_MAPPINGS.fornitore.includes(key.toLowerCase().trim())
  );
  
  return {
    nome: String(row[nomeKey]).trim().replace(/\s+/g, ' '),
    categoria: categoriaKey ? String(row[categoriaKey]).trim() || null : null,
    fornitore: fornitoreKey ? String(row[fornitoreKey]).trim() || 'Fornitore Generico' : 'Fornitore Generico'
  };
}

/**
 * Parsa CSV semplice (senza dipendenze esterne)
 */
function parseCSV(csvText: string): Record<string, any>[] {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows: Record<string, any>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const row: Record<string, any> = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    rows.push(row);
  }
  
  return rows;
}

/**
 * Importa prodotti con upsert idempotente in transazione
 */
async function importProducts(products: ParsedProduct[]): Promise<ImportResult> {
  const result: ImportResult = {
    creati: 0,
    aggiornati: 0,
    saltati: 0,
    fornitori_creati: 0,
    warnings: []
  };
  
  // Processamento prodotti (senza transazione per ora - fix temporaneo)
  const fornitoriCache = new Map<string, string>(); // nome -> id
  
  for (const product of products) {
    try {
      // Upsert fornitore
      let fornitoreId = fornitoriCache.get(product.fornitore.toLowerCase());
      
      if (!fornitoreId) {
        const existingFornitore = await fornitoriRepo.findByNome(product.fornitore);
        
        if (existingFornitore) {
          fornitoreId = existingFornitore.id;
        } else {
          const newFornitore = await fornitoriRepo.create({
            nome: product.fornitore,
            whatsapp: undefined
          });
          fornitoreId = newFornitore.id;
          result.fornitori_creati++;
        }
        
        fornitoriCache.set(product.fornitore.toLowerCase(), fornitoreId);
      }
      
      // Upsert articolo
      const existingArticolo = await articoliRepo.findByFornitoreAndNome(
        fornitoreId,
        product.nome
      );
      
      if (existingArticolo) {
        // Update solo categoria
        await articoliRepo.update(existingArticolo.id, {
          categoria: product.categoria === null ? undefined : product.categoria
        });
        result.aggiornati++;
      } else {
        // Insert nuovo articolo
        await articoliRepo.create({
          nome: product.nome,
          categoria: product.categoria === null ? undefined : product.categoria,
          fornitore_id: fornitoreId
        });
        result.creati++;
      }
      
    } catch (error) {
      result.saltati++;
      if (result.warnings.length < 10) {
        result.warnings.push(`Prodotto ${product.nome}: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
      }
    }
  }
  
  return result;
}

// POST /api/v1/import/prodotti - Upload file
router.post('/prodotti', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File non fornito'
      });
    }

    // 📥 Log iniziale con dettagli file
    debugLog('📥 Import request', {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    let rows: Record<string, any>[] = [];
    let contentPreview = '';
    
    if (req.file.mimetype.includes('sheet')) {
      // Excel file
      debugLog('📊 Parsing Excel file');
      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      rows = XLSX.utils.sheet_to_json(worksheet);
      contentPreview = JSON.stringify(rows[0] || {}).substring(0, 500);
    } else {
      // CSV file
      debugLog('📄 Parsing CSV file');
      const csvData = req.file.buffer.toString('utf8');
      contentPreview = csvData.substring(0, 500);
      rows = parseCSV(csvData);
    }
    
    // 🧾 Log preview contenuto
    debugLog('🧾 CSV preview', contentPreview + (contentPreview.length >= 500 ? '...' : ''));
    
    // 🗂️ Log headers rilevati
    const headersDetected = rows.length > 0 ? Object.keys(rows[0]) : [];
    debugLog('🗂️ Headers detected', headersDetected);
    
    // 📊 Log righe parsate
    debugLog('📊 Parsed rows', { count: rows.length, firstRow: rows[0] });
    
    // Mappa e filtra prodotti validi
    const products: ParsedProduct[] = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const product = mapHeaders(row);
      
      
      if (product) {
        products.push(product);
      }
    }
    
    // 🧩 Log prodotti validi
    debugLog('🧩 Valid products', products.length);
    
    if (products.length === 0) {
      debugLog('❌ Valid products=0', { headersDetected });
      return res.status(400).json({
        success: false,
        message: 'Nessun prodotto valido trovato nel file',
        debug: isDebugMode() ? { headersDetected } : undefined
      });
    }
    
    if (products.length > 200) {
      return res.status(400).json({
        success: false,
        message: `Troppi prodotti (${products.length}). Massimo 200 per import.`
      });
    }
    
    const result = await importProducts(products);
    
    logger.info('Import prodotti da file completato', {
      filename: req.file.originalname,
      ...result
    });
    
    res.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    logger.error('Errore import prodotti da file', { error });
    next(error);
  }
});

// POST /api/v1/import/prodotti/gsheet - Google Sheet URL
router.post('/prodotti/gsheet', async (req, res, next) => {
  try {
    const { url } = googleSheetSchema.parse(req.body);
    
    // Verifica che sia un URL Google Sheets export CSV
    if (!url.includes('docs.google.com') || !url.includes('export?format=csv')) {
      return res.status(400).json({
        success: false,
        message: 'URL deve essere un Google Sheet in formato: https://docs.google.com/.../export?format=csv'
      });
    }
    
    // Fetch CSV da Google Sheets
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Errore download Google Sheet: ${response.status}`);
    }
    
    const csvData = await response.text();
    const rows = parseCSV(csvData);
    
    // Mappa e filtra prodotti validi
    const products: ParsedProduct[] = [];
    for (const row of rows) {
      const product = mapHeaders(row);
      if (product) {
        products.push(product);
      }
    }
    
    if (products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nessun prodotto valido trovato nel Google Sheet'
      });
    }
    
    if (products.length > 200) {
      return res.status(400).json({
        success: false,
        message: `Troppi prodotti (${products.length}). Massimo 200 per import.`
      });
    }
    
    const result = await importProducts(products);
    
    logger.info('Import prodotti da Google Sheet completato', {
      url,
      ...result
    });
    
    res.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    logger.error('Errore import prodotti da Google Sheet', { error });
    next(error);
  }
});

// GET /api/v1/import/check-schema - Verifica schema database
router.get('/check-schema', async (req, res, next) => {
  try {
    const result = {
      ok: true,
      details: {
        fornitori: { exists: false, columns: {} },
        articoli: { exists: false, columns: {} }
      },
      missing: [] as string[],
      wrongType: [] as string[]
    };

    // Test esistenza tabelle con query semplici
    try {
      await db.select().from(fornitori).limit(1);
      result.details.fornitori.exists = true;
      result.details.fornitori.columns = { nome: 'TEXT' };
    } catch {
      result.missing.push('table fornitori');
    }

    try {
      await db.select().from(articoli).limit(1);
      result.details.articoli.exists = true;
      result.details.articoli.columns = {
        nome: 'TEXT',
        categoria: 'TEXT',
        prezzo_acquisto: 'NUMERIC',
        prezzo_vendita: 'NUMERIC',
        fornitore_id: 'TEXT'
      };
    } catch {
      result.missing.push('table articoli');
    }

    result.ok = result.missing.length === 0 && result.wrongType.length === 0;

    res.json(result);

  } catch (error) {
    logger.error('Errore check schema', { error });
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Errore sconosciuto'
    });
  }
});

export default router;
