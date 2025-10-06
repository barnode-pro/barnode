#!/usr/bin/env tsx

/**
 * Script per importare prodotti da file Excel (.xlsx)
 * Uso: npm run import:prodotti -- --file=data/PRODOTTI_CASSA.xlsx --sheet=prodotti
 */

import { drizzle } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import Database from 'better-sqlite3';
import { eq, and, sql } from 'drizzle-orm';
import { logger } from '../server/utils/logger';
import { leggiExcelProdotti, normalizzaStringa, type ProdottoExcel } from './lib/xlsx';

// Import schemi (dinamico basato su DATABASE_URL)
const databaseUrl = process.env.DATABASE_URL || 'file:./barnode.db';
const isPostgres = databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://');

let fornitori: any, articoli: any, db: any;

if (isPostgres) {
  const pgSchemas = await import('../server/db/schema/postgres/index');
  fornitori = pgSchemas.fornitori;
  articoli = pgSchemas.articoli;
  
  const pool = new Pool({ connectionString: databaseUrl });
  db = drizzlePg(pool);
} else {
  const sqliteSchemas = await import('../server/db/schema/index');
  fornitori = sqliteSchemas.fornitori;
  articoli = sqliteSchemas.articoli;
  
  const sqlite = new Database(databaseUrl.replace('file:', ''));
  db = drizzle(sqlite);
}

interface ImportResult {
  creati: number;
  aggiornati: number;
  saltati: number;
  fornitori_creati: number;
  anomalie: string[];
}

/**
 * Trova o crea fornitore
 */
async function trovaOCreaFornitore(nomeFornitore: string): Promise<string> {
  const nome = normalizzaStringa(nomeFornitore) || 'Fornitore Generico';
  
  // Cerca fornitore esistente (case-insensitive)
  const fornitoreEsistente = await db
    .select()
    .from(fornitori)
    .where(sql`lower(trim(${fornitori.nome})) = ${nome.toLowerCase()}`)
    .limit(1);

  if (fornitoreEsistente.length > 0) {
    return fornitoreEsistente[0].id;
  }

  // Crea nuovo fornitore
  const nuovoFornitore = await db
    .insert(fornitori)
    .values({
      nome,
      note: 'Creato automaticamente da import Excel'
    })
    .returning({ id: fornitori.id });

  return nuovoFornitore[0].id;
}

/**
 * Upsert articolo (crea o aggiorna)
 */
async function upsertArticolo(prodotto: ProdottoExcel, fornitoreId: string): Promise<'creato' | 'aggiornato' | 'saltato'> {
  const nomeNormalizzato = normalizzaStringa(prodotto.descrizione);
  
  if (!nomeNormalizzato) {
    return 'saltato';
  }

  // Cerca articolo esistente per fornitore + nome (case-insensitive)
  const articoloEsistente = await db
    .select()
    .from(articoli)
    .where(
      and(
        eq(articoli.fornitore_id, fornitoreId),
        sql`lower(trim(${articoli.nome})) = ${nomeNormalizzato.toLowerCase()}`
      )
    )
    .limit(1);

  const datiArticolo = {
    categoria: normalizzaStringa(prodotto.categoria) || null,
    prezzo_acquisto: prodotto.prezzo_acquisto,
    prezzo_vendita: prodotto.prezzo_vendita
  };

  if (articoloEsistente.length > 0) {
    // Aggiorna articolo esistente (solo i campi dell'import)
    await db
      .update(articoli)
      .set({
        ...datiArticolo,
        updated_at: isPostgres ? sql`NOW()` : sql`(unixepoch())`
      })
      .where(eq(articoli.id, articoloEsistente[0].id));
    
    return 'aggiornato';
  } else {
    // Crea nuovo articolo
    await db
      .insert(articoli)
      .values({
        nome: nomeNormalizzato,
        fornitore_id: fornitoreId,
        ...datiArticolo,
        // Mantieni valori default per campi non importati
        quantita_attuale: 0,
        soglia_minima: 0
      });
    
    return 'creato';
  }
}

/**
 * Importa prodotti da Excel
 */
async function importaProdotti(filePath: string, sheetName: string): Promise<ImportResult> {
  console.log(`📊 Lettura file Excel: ${filePath}`);
  console.log(`📋 Foglio: ${sheetName}`);
  
  const { prodotti, stats } = leggiExcelProdotti(filePath, sheetName);
  
  console.log(`\n📈 Statistiche lettura:`);
  console.log(`   - Righe totali: ${stats.righe_totali}`);
  console.log(`   - Righe valide: ${stats.righe_valide}`);
  console.log(`   - Righe saltate: ${stats.righe_saltate}`);
  
  if (stats.anomalie.length > 0) {
    console.log(`\n⚠️  Prime anomalie rilevate:`);
    stats.anomalie.forEach(anomalia => console.log(`   - ${anomalia}`));
  }

  const result: ImportResult = {
    creati: 0,
    aggiornati: 0,
    saltati: 0,
    fornitori_creati: 0,
    anomalie: []
  };

  const fornitoriCache = new Map<string, string>();
  let fornitoriCreatiCount = 0;

  console.log(`\n🔄 Inizio import ${prodotti.length} prodotti...`);

  for (let i = 0; i < prodotti.length; i++) {
    const prodotto = prodotti[i];
    
    try {
      // Gestione fornitore
      const nomeFornitore = prodotto.fornitore || 'Fornitore Generico';
      let fornitoreId = fornitoriCache.get(nomeFornitore);
      
      if (!fornitoreId) {
        const fornitoriPrima = await db.select({ count: sql`count(*)` }).from(fornitori);
        fornitoreId = await trovaOCreaFornitore(nomeFornitore);
        const fornitoriDopo = await db.select({ count: sql`count(*)` }).from(fornitori);
        
        if (fornitoriDopo[0].count > fornitoriPrima[0].count) {
          fornitoriCreatiCount++;
        }
        
        fornitoriCache.set(nomeFornitore, fornitoreId);
      }

      // Upsert articolo
      const operazione = await upsertArticolo(prodotto, fornitoreId);
      
      switch (operazione) {
        case 'creato':
          result.creati++;
          break;
        case 'aggiornato':
          result.aggiornati++;
          break;
        case 'saltato':
          result.saltati++;
          break;
      }

      // Progress ogni 50 righe
      if ((i + 1) % 50 === 0) {
        console.log(`   Processate ${i + 1}/${prodotti.length} righe...`);
      }

    } catch (error) {
      result.saltati++;
      const messaggio = `Errore prodotto "${prodotto.descrizione}": ${error instanceof Error ? error.message : 'Errore sconosciuto'}`;
      
      if (result.anomalie.length < 10) {
        result.anomalie.push(messaggio);
      }
      
      console.error(`❌ ${messaggio}`);
    }
  }

  result.fornitori_creati = fornitoriCreatiCount;
  return result;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const fileArg = args.find(arg => arg.startsWith('--file='));
  const sheetArg = args.find(arg => arg.startsWith('--sheet='));
  
  if (!fileArg) {
    console.error('❌ Parametro --file richiesto');
    console.log('Uso: npm run import:prodotti -- --file=data/PRODOTTI_CASSA.xlsx --sheet=prodotti');
    process.exit(1);
  }

  const filePath = fileArg.split('=')[1];
  const sheetName = sheetArg ? sheetArg.split('=')[1] : 'prodotti';

  console.log('🚀 Avvio import prodotti Excel');
  console.log(`📁 File: ${filePath}`);
  console.log(`🗄️  Database: ${isPostgres ? 'PostgreSQL' : 'SQLite'}`);

  try {
    const result = await importaProdotti(filePath, sheetName);
    
    console.log('\n🎉 Import completato con successo!');
    console.log('\n📊 Risultati finali:');
    console.log(`   - Articoli creati: ${result.creati}`);
    console.log(`   - Articoli aggiornati: ${result.aggiornati}`);
    console.log(`   - Righe saltate: ${result.saltati}`);
    console.log(`   - Fornitori creati: ${result.fornitori_creati}`);
    
    if (result.anomalie.length > 0) {
      console.log('\n⚠️  Anomalie rilevate:');
      result.anomalie.forEach(anomalia => console.log(`   - ${anomalia}`));
    }

  } catch (error) {
    console.error('💥 Errore durante import:', error);
    process.exit(1);
  }
}

// Esecuzione script
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('💥 Import fallito:', error);
      process.exit(1);
    });
}
