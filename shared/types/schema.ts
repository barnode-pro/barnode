import { z } from "zod";

// Enum per stati ordine
export const StatoOrdineEnum = z.enum(["nuovo", "inviato", "in_ricezione", "archiviato"]);
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

// Schema Articolo
export const articoloSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1, "Nome articolo è obbligatorio"),
  categoria: z.string().optional(),
  unita: z.string().optional(),
  confezione: z.string().optional(),
  /** @deprecated Gestione giacenze disabilitata */
  quantita_attuale: z.number().min(0, "Quantità non può essere negativa").optional(),
  /** @deprecated Gestione giacenze disabilitata */
  soglia_minima: z.number().min(0, "Soglia minima non può essere negativa").optional(),
  fornitore_id: z.string().uuid(),
  note: z.string().optional(),
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
