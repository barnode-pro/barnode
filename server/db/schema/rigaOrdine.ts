import { sqliteTable, text, real, integer, index } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { sql } from 'drizzle-orm';
import { ordini } from './ordine';
import { articoli } from './articolo';

/**
 * Schema Drizzle per tabella Righe Ordine
 * Dettaglio articoli ordinati con quantità e stato ricezione
 */

export const righeOrdine = sqliteTable('righe_ordine', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  ordine_id: text('ordine_id').references(() => ordini.id, { onDelete: 'cascade' }).notNull(),
  articolo_id: text('articolo_id').references(() => articoli.id).notNull(),
  qta_ordinata: real('qta_ordinata').notNull(),
  qta_ricevuta: real('qta_ricevuta').default(0).notNull(),
  note: text('note'),
  created_at: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updated_at: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull()
}, (table) => ({
  ordineIdx: index('righe_ordine_ordine_idx').on(table.ordine_id),
  articoloIdx: index('righe_ordine_articolo_idx').on(table.articolo_id),
  ordineArticoloIdx: index('righe_ordine_ordine_articolo_idx').on(table.ordine_id, table.articolo_id)
}));

// Tipi TypeScript inferiti
export type RigaOrdine = typeof righeOrdine.$inferSelect;
export type InsertRigaOrdine = typeof righeOrdine.$inferInsert;

// Schema Zod per validazione
export const insertRigaOrdineSchema = createInsertSchema(righeOrdine, {
  ordine_id: z.string().uuid('Ordine ID deve essere un UUID valido'),
  articolo_id: z.string().uuid('Articolo ID deve essere un UUID valido'),
  qta_ordinata: z.coerce.number().min(0.01, 'Quantità ordinata deve essere maggiore di 0'),
  qta_ricevuta: z.coerce.number().min(0, 'Quantità ricevuta non può essere negativa').optional(),
  note: z.string().optional()
}).omit({
  id: true,
  created_at: true,
  updated_at: true
});

export const updateRigaOrdineSchema = insertRigaOrdineSchema.partial();

export const selectRigaOrdineSchema = createSelectSchema(righeOrdine);

// Schema per aggiornamento quantità ricevuta
export const updateQuantitaRicevutaSchema = z.object({
  qta_ricevuta: z.coerce.number().min(0, 'Quantità ricevuta non può essere negativa'),
  note: z.string().optional()
});

export type InsertRigaOrdineInput = z.infer<typeof insertRigaOrdineSchema>;
export type UpdateRigaOrdineInput = z.infer<typeof updateRigaOrdineSchema>;
export type UpdateQuantitaRicevutaInput = z.infer<typeof updateQuantitaRicevutaSchema>;
