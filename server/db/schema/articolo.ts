import { pgTable, uuid, text, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { fornitori } from './fornitore.js';

/**
 * Schema Drizzle per tabella Articoli
 * Gestione inventario con scorte e soglie minime
 */

export const articoli = pgTable('articoli', {
  id: uuid('id').primaryKey().defaultRandom(),
  nome: text('nome').notNull(),
  categoria: text('categoria'),
  unita: text('unita'),
  confezione: text('confezione'),
  quantita_attuale: numeric('quantita_attuale', { precision: 10, scale: 2 }).default('0').notNull(),
  soglia_minima: numeric('soglia_minima', { precision: 10, scale: 2 }).default('0').notNull(),
  fornitore_id: uuid('fornitore_id').references(() => fornitori.id).notNull(),
  note: text('note'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  nomeFornitoreIdx: index('articoli_nome_fornitore_idx').on(table.nome, table.fornitore_id),
  categoriaIdx: index('articoli_categoria_idx').on(table.categoria),
  scortaIdx: index('articoli_scorta_idx').on(table.quantita_attuale, table.soglia_minima)
}));

// Tipi TypeScript inferiti
export type Articolo = typeof articoli.$inferSelect;
export type InsertArticolo = typeof articoli.$inferInsert;

// Schema Zod per validazione
export const insertArticoloSchema = createInsertSchema(articoli, {
  nome: z.string().min(1, 'Nome articolo è obbligatorio').max(255),
  categoria: z.string().optional(),
  unita: z.string().optional(),
  confezione: z.string().optional(),
  quantita_attuale: z.coerce.number().min(0, 'Quantità non può essere negativa'),
  soglia_minima: z.coerce.number().min(0, 'Soglia minima non può essere negativa'),
  fornitore_id: z.string().uuid('Fornitore ID deve essere un UUID valido'),
  note: z.string().optional()
}).omit({
  id: true,
  created_at: true,
  updated_at: true
});

export const updateArticoloSchema = insertArticoloSchema.partial();

export const selectArticoloSchema = createSelectSchema(articoli);

// Schema per query di ricerca articoli
export const searchArticoliSchema = z.object({
  search: z.string().optional(),
  categoria: z.string().optional(),
  fornitore_id: z.string().uuid().optional(),
  solo_scarsita: z.coerce.boolean().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20)
});

export type InsertArticoloInput = z.infer<typeof insertArticoloSchema>;
export type UpdateArticoloInput = z.infer<typeof updateArticoloSchema>;
export type SearchArticoliInput = z.infer<typeof searchArticoliSchema>;
