import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzlePostgres } from 'drizzle-orm/node-postgres';
import Database from 'better-sqlite3';
import { Pool } from 'pg';
import { logger } from '../utils/logger.js';
import { schema } from './schema/index.js';

/**
 * Factory database unificata per BarNode
 * Supporta SQLite (default locale) e PostgreSQL (produzione opt-in)
 */

// Configurazione database basata su environment
const USE_PG = process.env.USE_PG === 'true';
const DATABASE_URL = process.env.DATABASE_URL || 'file:./barnode.db';
const isPostgresUrl = DATABASE_URL.startsWith('postgres://') || DATABASE_URL.startsWith('postgresql://');

// Determina driver da usare
const shouldUsePostgres = USE_PG && isPostgresUrl;
export const driver: 'postgres' | 'sqlite' = shouldUsePostgres ? 'postgres' : 'sqlite';

// Factory per client database
function createDatabaseClient() {
  if (shouldUsePostgres) {
    // Configurazione PostgreSQL
    const pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: DATABASE_URL.includes('sslmode=require') ? { rejectUnauthorized: false } : false
    });

    const db = drizzlePostgres(pool, {
      schema,
      logger: process.env.NODE_ENV === 'development' ? {
        logQuery: (query, params) => {
          logger.debug('SQL Query (PostgreSQL):', { query, params });
        }
      } : false
    });

    logger.info(`DB driver=postgres source=${DATABASE_URL.split('@')[1]?.split('/')[0] || 'remote'}`);
    return { db, pool, sqlite: null };
  } else {
    // Configurazione SQLite (default)
    const databasePath = DATABASE_URL.replace('file:', '') || './barnode.db';
    const sqlite = new Database(databasePath);

    // Configurazioni SQLite per performance
    sqlite.pragma('journal_mode = WAL');
    sqlite.pragma('synchronous = NORMAL');
    sqlite.pragma('cache_size = 1000');
    sqlite.pragma('foreign_keys = ON');

    const db = drizzleSqlite(sqlite, {
      schema,
      logger: process.env.NODE_ENV === 'development' ? {
        logQuery: (query, params) => {
          logger.debug('SQL Query (SQLite):', { query, params });
        }
      } : false
    });

    logger.info(`DB driver=sqlite source=${databasePath}`);
    return { db, pool: null, sqlite };
  }
}

// Inizializza client database
const { db, pool, sqlite } = createDatabaseClient();

// Export principale
export { db };

// Export tipizzato per compatibilità (sempre SQLite in locale)
export const dbSqlite = db as ReturnType<typeof drizzleSqlite>;

// Export client specifici per compatibilità
export { sqlite, pool };

// Funzione per testare connessione database
export async function testConnection(): Promise<boolean> {
  try {
    if (driver === 'postgres' && pool) {
      const client = await pool.connect();
      await client.query('SELECT 1 as test');
      client.release();
      logger.info('Connessione database PostgreSQL: OK');
    } else if (driver === 'sqlite' && sqlite) {
      const result = sqlite.prepare('SELECT 1 as test').get();
      logger.info('Connessione database SQLite: OK', { result });
    }
    return true;
  } catch (error) {
    logger.error(`Errore connessione database ${driver}:`, error);
    return false;
  }
}

// Funzione per chiudere connessioni (cleanup)
export async function closeConnection(): Promise<void> {
  try {
    if (driver === 'postgres' && pool) {
      await pool.end();
      logger.info('Pool PostgreSQL chiuso');
    } else if (driver === 'sqlite' && sqlite) {
      sqlite.close();
      logger.info('Connessione SQLite chiusa');
    }
  } catch (error) {
    logger.error(`Errore chiusura database ${driver}:`, error);
  }
}
