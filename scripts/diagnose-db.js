#!/usr/bin/env node

/**
 * Script di diagnosi database BarNode
 * Testa connessione e conteggi senza server HTTP
 */

import { db, sqlite } from '../server/db/client.ts';
import { fornitori, articoli } from '../server/db/schema/index.ts';
import { sql } from 'drizzle-orm';

async function diagnoseDatabase() {
  const result = {
    ok: false,
    driver: 'sqlite',
    db_url_hint: '',
    counts: { fornitori: null, articoli: null },
    error: null
  };

  try {
    // Maschera DATABASE_URL per sicurezza
    const dbUrl = process.env.DATABASE_URL || './barnode.db';
    result.db_url_hint = dbUrl.replace(/\/\/.*@/, '//***@').replace(/file:/, 'file:');

    console.log('🔍 Testando connessione database...');
    
    // Test connessione base
    const testQuery = sqlite.prepare('SELECT 1 as ok').get();
    if (!testQuery || testQuery.ok !== 1) {
      throw new Error('Test query fallita');
    }
    console.log('✅ Connessione SQLite OK');

    // Conta fornitori
    try {
      const [fornitoriCount] = await db.select({ count: sql`count(*)` }).from(fornitori);
      result.counts.fornitori = Number(fornitoriCount.count);
      console.log(`✅ Fornitori: ${result.counts.fornitori}`);
    } catch (err) {
      result.counts.fornitori = null;
      console.warn('⚠️ Errore conteggio fornitori:', err.message);
    }

    // Conta articoli
    try {
      const [articoliCount] = await db.select({ count: sql`count(*)` }).from(articoli);
      result.counts.articoli = Number(articoliCount.count);
      console.log(`✅ Articoli: ${result.counts.articoli}`);
    } catch (err) {
      result.counts.articoli = null;
      console.warn('⚠️ Errore conteggio articoli:', err.message);
    }

    result.ok = true;
    console.log('✅ Diagnosi completata con successo');
  } catch (error) {
    result.error = {
      name: error.name || 'UnknownError',
      code: error.code || 'UNKNOWN',
      message: error.message || 'Errore sconosciuto'
    };
    console.error('❌ Errore diagnosi:', error.message);
  }

  console.log('\n📊 RISULTATO DIAGNOSI:');
  console.log(JSON.stringify(result, null, 2));
  
  return result;
}

// Esegui diagnosi
diagnoseDatabase().catch(console.error);
