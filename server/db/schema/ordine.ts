import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { sql } from 'drizzle-orm';
import { fornitori } from './fornitore';

/**
 * Schema Drizzle per tabella Ordini
 * Gestione ordini ai fornitori con stati workflow
 */

// Enum per stati ordine
export const StatoOrdineEnum = z.enum(['bozza', 'nuovo', 'inviato', 'in_ricezione', 'archiviato']);
export type StatoOrdine = z.infer<typeof StatoOrdineEnum>;

export const ordini = sqliteTable('ordini', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  fornitore_id: text('fornitore_id').references(() => fornitori.id).notNull(),
  data: integer('data', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  stato: text('stato').$type<StatoOrdine>().default('nuovo').notNull(),
  note: text('note'),
  created_at: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updated_at: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull()
}, (table) => ({
  fornitoreStatoIdx: index('ordini_fornitore_stato_idx').on(table.fornitore_id, table.stato),
  dataIdx: index('ordini_data_idx').on(table.data),
  statoIdx: index('ordini_stato_idx').on(table.stato)
}));

// Tipi TypeScript inferiti
export type Ordine = typeof ordini.$inferSelect;
export type InsertOrdine = typeof ordini.$inferInsert;

// Schema Zod per validazione
export const insertOrdineSchema = createInsertSchema(ordini, {
  fornitore_id: z.string().uuid('Fornitore ID deve essere un UUID valido'),
  data: z.coerce.date().optional(),
  stato: StatoOrdineEnum.default('nuovo'),
  note: z.string().optional()
}).omit({
  id: true,
  created_at: true,
  updated_at: true
});

export const updateOrdineSchema = insertOrdineSchema.partial();

export const selectOrdineSchema = createSelectSchema(ordini);

// Schema per query di ricerca ordini
export const searchOrdiniSchema = z.object({
  stato: StatoOrdineEnum.optional(),
  fornitore_id: z.string().uuid().optional(),
  data_da: z.coerce.date().optional(),
  data_a: z.coerce.date().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20)
});

export type InsertOrdineInput = z.infer<typeof insertOrdineSchema>;
export type UpdateOrdineInput = z.infer<typeof updateOrdineSchema>;
export type SearchOrdiniInput = z.infer<typeof searchOrdiniSchema>;
