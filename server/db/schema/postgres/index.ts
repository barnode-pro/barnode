/**
 * Schema PostgreSQL unificato per BarNode
 * Esporta tutti gli schemi e tipi per Supabase
 */

// Export schemi tabelle
export * from './fornitore';
export * from './articolo';
export * from './ordine';
export * from './rigaOrdine';

// Import per relazioni
import { fornitori } from './fornitore';
import { articoli } from './articolo';
import { ordini } from './ordine';
import { righeOrdine } from './rigaOrdine';

// Export schema completo per Drizzle client
export const schema = {
  fornitori,
  articoli,
  ordini,
  righeOrdine
};
