import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { logger } from '../utils/logger.js';

/**
 * Client database PostgreSQL per BarNode
 * Configurazione Drizzle ORM con connection pooling
 */

// Configurazione connessione PostgreSQL
const connectionString = process.env.DATABASE_URL || 
  'postgresql://postgres:password@localhost:5432/barnode';

// Client postgres con configurazione ottimizzata
const sql = postgres(connectionString, {
  max: 10,                    // Pool size massimo
  idle_timeout: 20,           // Timeout connessioni idle (secondi)
  connect_timeout: 10,        // Timeout connessione (secondi)
  prepare: false,             // Disabilita prepared statements per compatibilità
  onnotice: () => {},         // Silenzia notice PostgreSQL
});

// Istanza Drizzle ORM
export const db = drizzle(sql, {
  logger: process.env.NODE_ENV === 'development' ? {
    logQuery: (query, params) => {
      logger.debug('SQL Query:', { query, params });
    }
  } : false
});

// Funzione per testare connessione database
export async function testConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1 as test`;
    logger.info('Connessione database PostgreSQL: OK');
    return true;
  } catch (error) {
    logger.error('Errore connessione database:', error);
    return false;
  }
}

// Funzione per chiudere connessioni (cleanup)
export async function closeConnection(): Promise<void> {
  try {
    await sql.end();
    logger.info('Connessioni database chiuse');
  } catch (error) {
    logger.error('Errore chiusura database:', error);
  }
}

// Export del client SQL per query dirette se necessarie
export { sql };
