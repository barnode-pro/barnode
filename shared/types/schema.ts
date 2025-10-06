import { z } from "zod";

// Enum per stati ordine
export const StatoOrdineEnum = z.enum(["bozza", "nuovo", "inviato", "in_ricezione", "archiviato"]);
export type StatoOrdine = z.infer<typeof StatoOrdineEnum>;

// Schema Fornitore
export const fornitoreSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1, "Nome fornitore è obbligatorio"),
  whatsapp: z.string().min(1, "Numero WhatsApp è obbligatorio"),
  email: z.string().email().optional(),
  note: z.string().optional(),
});

export type Fornitore = z.infer<typeof fornitoreSchema>;

// Schema Articolo - Solo 3 campi essenziali
export const articoloSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1, "Nome articolo è obbligatorio"),
  categoria: z.string().optional(),
  fornitore_id: z.string().uuid().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type Articolo = z.infer<typeof articoloSchema>;

// Schema Ordine
export const ordineSchema = z.object({
  id: z.string().uuid(),
  fornitore_id: z.string().uuid(),
  data: z.date(),
  stato: StatoOrdineEnum,
  note: z.string().optional(),
});

export type Ordine = z.infer<typeof ordineSchema>;

// Schema Riga Ordine
export const rigaOrdineSchema = z.object({
  id: z.string().uuid(),
  ordine_id: z.string().uuid(),
  articolo_id: z.string().uuid(),
  qta_ordinata: z.number().min(1, "Quantità ordinata deve essere maggiore di 0"),
  qta_ricevuta: z.number().min(0).optional(),
  note: z.string().optional(),
});

export type RigaOrdine = z.infer<typeof rigaOrdineSchema>;

// Schema per inserimento (senza ID)
export const insertFornitoreSchema = fornitoreSchema.omit({ id: true });
export const insertArticoloSchema = articoloSchema.omit({ id: true });
export const insertOrdineSchema = ordineSchema.omit({ id: true });
export const insertRigaOrdineSchema = rigaOrdineSchema.omit({ id: true });

export type InsertFornitore = z.infer<typeof insertFornitoreSchema>;
export type InsertArticolo = z.infer<typeof insertArticoloSchema>;
export type InsertOrdine = z.infer<typeof insertOrdineSchema>;
export type InsertRigaOrdine = z.infer<typeof insertRigaOrdineSchema>;
