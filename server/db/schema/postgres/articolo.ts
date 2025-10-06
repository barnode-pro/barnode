import { pgTable, uuid, varchar, text, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { fornitori } from './fornitore';

/**
 * Schema PostgreSQL per tabella Articoli
 * Gestione inventario con scorte e soglie minime
 */

export const articoli = pgTable('articoli', {
  id: uuid('id').primaryKey().defaultRandom(),
  nome: varchar('nome', { length: 255 }).notNull(),
  categoria: varchar('categoria', { length: 100 }),
  unita: varchar('unita', { length: 20 }),
  confezione: varchar('confezione', { length: 255 }),
  quantita_attuale: numeric('quantita_attuale', { precision: 10, scale: 2 }).default('0').notNull(),
  soglia_minima: numeric('soglia_minima', { precision: 10, scale: 2 }).default('0').notNull(),
  prezzo_acquisto: numeric('prezzo_acquisto', { precision: 12, scale: 2 }), // Nuovo campo per import Excel
  prezzo_vendita: numeric('prezzo_vendita', { precision: 12, scale: 2 }),   // Nuovo campo per import Excel
  fornitore_id: uuid('fornitore_id').references(() => fornitori.id).notNull(),
  note: text('note'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  fornitoreIdx: index('articoli_fornitore_idx').on(table.fornitore_id),
  nomeIdx: index('articoli_nome_idx').on(table.nome),
  categoriaIdx: index('articoli_categoria_idx').on(table.categoria),
  scortaIdx: index('articoli_scorta_idx').on(table.quantita_attuale, table.soglia_minima)
}));

// Tipi TypeScript inferiti
export type Articolo = typeof articoli.$inferSelect;
export type InsertArticolo = typeof articoli.$inferInsert;

// Schema Zod per validazione
export const insertArticoloSchema = createInsertSchema(articoli, {
  nome: z.string().min(1, 'Nome articolo è obbligatorio').max(255),
  categoria: z.string().max(100).optional(),
  unita: z.string().max(20).optional(),
  confezione: z.string().max(255).optional(),
  quantita_attuale: z.coerce.number().min(0, 'Quantità non può essere negativa').optional(),
  soglia_minima: z.coerce.number().min(0, 'Soglia minima non può essere negativa').optional(),
  prezzo_acquisto: z.coerce.number().min(0, 'Prezzo acquisto non può essere negativo').optional(),
  prezzo_vendita: z.coerce.number().min(0, 'Prezzo vendita non può essere negativo').optional(),
  fornitore_id: z.string().uuid('Fornitore ID deve essere un UUID valido'),
  note: z.string().optional()
}).omit({
  id: true,
  created_at: true,
  updated_at: true
});

export const updateArticoloSchema = insertArticoloSchema.partial();
export const selectArticoloSchema = createSelectSchema(articoli);

// Schema per query di ricerca
export const searchArticoliSchema = z.object({
  search: z.string().optional(),
  categoria: z.string().optional(),
  fornitore_id: z.string().uuid().optional(),
  solo_scarsi: z.coerce.boolean().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20)
});

export type InsertArticoloInput = z.infer<typeof insertArticoloSchema>;
export type UpdateArticoloInput = z.infer<typeof updateArticoloSchema>;
export type SearchArticoliInput = z.infer<typeof searchArticoliSchema>;
