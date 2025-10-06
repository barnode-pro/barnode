import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { logger } from '../utils/logger.js';
import { schema } from './schema/index';

/**
 * Client database SQLite per BarNode
 * Configurazione Drizzle ORM per sviluppo locale
 */

// Configurazione connessione SQLite
const databasePath = process.env.DATABASE_URL?.replace('file:', '') || './barnode.db';

// Client SQLite con configurazione ottimizzata
const sqlite = new Database(databasePath);

// Configurazioni SQLite per performance
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('synchronous = NORMAL');
sqlite.pragma('cache_size = 1000');
sqlite.pragma('foreign_keys = ON');

// Istanza Drizzle ORM
export const db = drizzle(sqlite, {
  schema,
  logger: process.env.NODE_ENV === 'development' ? {
    logQuery: (query, params) => {
      logger.debug('SQL Query:', { query, params });
    }
  } : false
});

// Funzione per testare connessione database
export async function testConnection(): Promise<boolean> {
  try {
    const result = sqlite.prepare('SELECT 1 as test').get();
    logger.info('Connessione database SQLite: OK', { result });
    return true;
  } catch (error) {
    logger.error('Errore connessione database:', error);
    return false;
  }
}

// Funzione per chiudere connessioni (cleanup)
export async function closeConnection(): Promise<void> {
  try {
    sqlite.close();
    logger.info('Connessioni database chiuse');
  } catch (error) {
    logger.error('Errore chiusura database:', error);
  }
}

// Export del client SQLite per query dirette se necessarie
export { sqlite };
