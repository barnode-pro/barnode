import { sqliteTable, text, real, integer, index } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { sql } from 'drizzle-orm';
import { fornitori } from './fornitore';

/**
 * Schema Drizzle per tabella Articoli
 * Solo 3 campi essenziali: nome, categoria, fornitore_id
 */

export const articoli = sqliteTable('articoli', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  nome: text('nome').notNull(),
  categoria: text('categoria'),
  fornitore_id: text('fornitore_id').references(() => fornitori.id),
  created_at: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updated_at: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull()
}, (table) => ({
  nomeFornitoreIdx: index('articoli_nome_fornitore_idx').on(table.nome, table.fornitore_id),
  categoriaIdx: index('articoli_categoria_idx').on(table.categoria)
}));

// Tipi TypeScript inferiti
export type Articolo = typeof articoli.$inferSelect;
export type InsertArticolo = typeof articoli.$inferInsert;

// Schema Zod per validazione - Solo 3 campi essenziali
export const insertArticoloSchema = createInsertSchema(articoli, {
  nome: z.string().min(1, 'Nome articolo è obbligatorio').max(255),
  categoria: z.string().optional(),
  fornitore_id: z.string().uuid('Fornitore ID deve essere un UUID valido').optional()
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
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20)
});

export type InsertArticoloInput = z.infer<typeof insertArticoloSchema>;
export type UpdateArticoloInput = z.infer<typeof updateArticoloSchema>;
export type SearchArticoliInput = z.infer<typeof searchArticoliSchema>;

// Schema per bulk edit (solo categoria e fornitore)
export const bulkEditArticoliSchema = z.object({
  ids: z.array(z.string().uuid('ID deve essere un UUID valido')).min(1, 'Almeno un ID richiesto'),
  patch: z.object({
    categoria: z.string().optional(),
    fornitore_id: z.string().uuid('Fornitore ID deve essere un UUID valido').optional()
  }).refine(data => Object.keys(data).length > 0, 'Almeno un campo da aggiornare richiesto')
});

export type BulkEditArticoliInput = z.infer<typeof bulkEditArticoliSchema>;
