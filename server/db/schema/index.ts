/**
 * Schema Drizzle unificato per BarNode
 * Esporta tutti gli schemi e tipi per SQLite
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

export type {
  Articolo,
  InsertArticolo,
  InsertArticoloInput,
  UpdateArticoloInput,
  SearchArticoliInput
} from './articolo.js';

export type {
  Ordine,
  InsertOrdine,
  InsertOrdineInput,
  UpdateOrdineInput,
  SearchOrdiniInput,
  StatoOrdine
} from './ordine.js';

export type {
  RigaOrdine,
  InsertRigaOrdine,
  InsertRigaOrdineInput,
  UpdateRigaOrdineInput,
  UpdateQuantitaRicevutaInput
} from './rigaOrdine.js';
