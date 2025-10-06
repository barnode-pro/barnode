import { Router } from 'express';
import { articoliRoutes } from './articoli.routes.js';
import { fornitoriRoutes } from './fornitori.routes.js';
import ordiniRoutes from './ordini.routes.js';
import importRoutes from './import.routes.js';
import { dbSqlite as db, sqlite, driver } from '../../db/client.js';
import { fornitori, articoli } from '../../db/schema/index.js';
import { sql } from 'drizzle-orm';

/**
 * Router principale per API v1 BarNode
 * Aggregazione di tutte le routes versionate
 */

const router = Router();

// Registrazione routes per entità
router.use('/articoli', articoliRoutes);
router.use('/fornitori', fornitoriRoutes);
router.use('/ordini', ordiniRoutes);
router.use('/import', importRoutes);

// Endpoint di diagnosi database (NON pubblico)
router.get('/_healthz', async (req, res) => {
  const result: {
    ok: boolean;
    driver: string;
    db_url_hint: string;
    counts: { fornitori: number | null; articoli: number | null };
    error: { name: string; code: string; message: string } | null;
  } = {
    ok: false,
    driver,
    db_url_hint: '',
    counts: { fornitori: null, articoli: null },
    error: null
  };

  try {
    // Maschera DATABASE_URL per sicurezza
    const dbUrl = process.env.DATABASE_URL || './barnode.db';
    result.db_url_hint = dbUrl.replace(/\/\/.*@/, '//***@').replace(/file:/, 'file:');

    // Test connessione base (adattato al driver)
    if (driver === 'sqlite' && sqlite) {
      const testQuery = sqlite.prepare('SELECT 1 as ok').get() as { ok: number } | undefined;
      if (!testQuery || testQuery.ok !== 1) {
        throw new Error('Test query SQLite fallita');
      }
    } else {
      // Per PostgreSQL, il test viene fatto nelle query successive
    }

    // Conta fornitori
    try {
      const [fornitoriCount] = await db.select({ count: sql<number>`count(*)` }).from(fornitori);
      result.counts.fornitori = Number(fornitoriCount.count);
    } catch (err) {
      result.counts.fornitori = null;
      console.warn('Errore conteggio fornitori:', err);
    }

    // Conta articoli
    try {
      const [articoliCount] = await db.select({ count: sql<number>`count(*)` }).from(articoli);
      result.counts.articoli = Number(articoliCount.count);
    } catch (err) {
      result.counts.articoli = null;
      console.warn('Errore conteggio articoli:', err);
    }

    result.ok = true;
  } catch (error) {
    const err = error as Error;
    result.error = {
      name: err.name || 'UnknownError',
      code: (err as any).code || 'UNKNOWN',
      message: err.message || 'Errore sconosciuto'
    };
  }

  res.json(result);
});

// Route di informazioni API
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'BarNode API v1',
    version: '1.0.0',
    endpoints: {
      articoli: '/api/v1/articoli',
      fornitori: '/api/v1/fornitori', 
      ordini: '/api/v1/ordini'
    },
    documentation: 'https://github.com/barnode-pro/barnode'
  });
});

export { router as v1Routes };
