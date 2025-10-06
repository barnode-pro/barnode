/**
 * Export unificato di tutti gli schemi database BarNode
 * Configurazione Drizzle ORM per PostgreSQL
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

// Export oggetto con tutte le tabelle per Drizzle
export const schema = {
  fornitori,
  articoli,
  ordini,
  righeOrdine,
};

// Export tipi unificati
export type {
  Fornitore,
  InsertFornitore,
  InsertFornitoreInput,
  UpdateFornitoreInput
} from './fornitore.js';

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
