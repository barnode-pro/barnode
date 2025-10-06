import { pgTable, uuid, varchar, text, date, timestamp, index } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { fornitori } from './fornitore';

/**
 * Schema PostgreSQL per tabella Ordini
 * Gestione ordini con stati e tracking
 */

// Enum per stato ordine
export const statiOrdine = ['nuovo', 'inviato', 'in_ricezione', 'archiviato'] as const;
export type StatoOrdine = typeof statiOrdine[number];

export const ordini = pgTable('ordini', {
  id: uuid('id').primaryKey().defaultRandom(),
  fornitore_id: uuid('fornitore_id').references(() => fornitori.id).notNull(),
  data: date('data').defaultNow().notNull(),
  stato: varchar('stato', { length: 20 }).$type<StatoOrdine>().default('nuovo').notNull(),
  note: text('note'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  fornitoreIdx: index('ordini_fornitore_idx').on(table.fornitore_id),
  statoIdx: index('ordini_stato_idx').on(table.stato),
  dataIdx: index('ordini_data_idx').on(table.data),
  fornitoreStatoIdx: index('ordini_fornitore_stato_idx').on(table.fornitore_id, table.stato)
}));

// Tipi TypeScript inferiti
export type Ordine = typeof ordini.$inferSelect;
export type InsertOrdine = typeof ordini.$inferInsert;

// Schema Zod per validazione
export const insertOrdineSchema = createInsertSchema(ordini, {
  fornitore_id: z.string().uuid('Fornitore ID deve essere un UUID valido'),
  stato: z.enum(statiOrdine).default('nuovo'),
  note: z.string().optional()
}).omit({
  id: true,
  data: true,
  created_at: true,
  updated_at: true
});

export const updateOrdineSchema = insertOrdineSchema.partial();
export const selectOrdineSchema = createSelectSchema(ordini);

// Schema per query di ricerca
export const searchOrdiniSchema = z.object({
  stato: z.enum(statiOrdine).optional(),
  fornitore_id: z.string().uuid().optional(),
  data_da: z.coerce.date().optional(),
  data_a: z.coerce.date().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20)
});

export type InsertOrdineInput = z.infer<typeof insertOrdineSchema>;
export type UpdateOrdineInput = z.infer<typeof updateOrdineSchema>;
export type SearchOrdiniInput = z.infer<typeof searchOrdiniSchema>;
