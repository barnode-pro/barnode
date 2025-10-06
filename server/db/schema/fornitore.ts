import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

/**
 * Schema Drizzle per tabella Fornitori
 * Gestione anagrafica fornitori con contatti WhatsApp
 */

export const fornitori = pgTable('fornitori', {
  id: uuid('id').primaryKey().defaultRandom(),
  nome: text('nome').notNull(),
  whatsapp: text('whatsapp'),
  email: text('email'),
  note: text('note'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// Tipi TypeScript inferiti
export type Fornitore = typeof fornitori.$inferSelect;
export type InsertFornitore = typeof fornitori.$inferInsert;

// Schema Zod per validazione
export const insertFornitoreSchema = createInsertSchema(fornitori, {
  nome: z.string().min(1, 'Nome fornitore è obbligatorio').max(255),
  whatsapp: z.string().optional(),
  email: z.string().email('Email non valida').optional().or(z.literal('')),
  note: z.string().optional()
}).omit({
  id: true,
  created_at: true,
  updated_at: true
});

export const updateFornitoreSchema = insertFornitoreSchema.partial();

export const selectFornitoreSchema = createSelectSchema(fornitori);

// Schema per query di ricerca
export const searchFornitoriSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20)
});

export type InsertFornitoreInput = z.infer<typeof insertFornitoreSchema>;
export type UpdateFornitoreInput = z.infer<typeof updateFornitoreSchema>;
export type SearchFornitoriInput = z.infer<typeof searchFornitoriSchema>;
