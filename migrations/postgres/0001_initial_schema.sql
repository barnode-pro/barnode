-- Migrazione PostgreSQL iniziale per BarNode
-- Creazione tabelle: fornitori, articoli, ordini, righe_ordine

-- Abilita estensione UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabella Fornitori
CREATE TABLE IF NOT EXISTS "fornitori" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "nome" VARCHAR(255) NOT NULL,
  "whatsapp" VARCHAR(20),
  "email" VARCHAR(255),
  "note" TEXT,
  "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tabella Articoli
CREATE TABLE IF NOT EXISTS "articoli" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "nome" VARCHAR(255) NOT NULL,
  "categoria" VARCHAR(100),
  "unita" VARCHAR(20),
  "confezione" VARCHAR(255),
  "quantita_attuale" NUMERIC(10,2) DEFAULT 0 NOT NULL,
  "soglia_minima" NUMERIC(10,2) DEFAULT 0 NOT NULL,
  "fornitore_id" UUID NOT NULL REFERENCES "fornitori"("id"),
  "note" TEXT,
  "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tabella Ordini
CREATE TABLE IF NOT EXISTS "ordini" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "fornitore_id" UUID NOT NULL REFERENCES "fornitori"("id"),
  "data" DATE DEFAULT CURRENT_DATE NOT NULL,
  "stato" VARCHAR(20) DEFAULT 'nuovo' NOT NULL CHECK ("stato" IN ('nuovo', 'inviato', 'in_ricezione', 'archiviato')),
  "note" TEXT,
  "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tabella Righe Ordine
CREATE TABLE IF NOT EXISTS "righe_ordine" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "ordine_id" UUID NOT NULL REFERENCES "ordini"("id") ON DELETE CASCADE,
  "articolo_id" UUID NOT NULL REFERENCES "articoli"("id"),
  "qta_ordinata" NUMERIC(10,2) NOT NULL,
  "qta_ricevuta" NUMERIC(10,2) DEFAULT 0 NOT NULL,
  "note" TEXT,
  "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS "articoli_fornitore_idx" ON "articoli" ("fornitore_id");
CREATE INDEX IF NOT EXISTS "articoli_nome_idx" ON "articoli" ("nome");
CREATE INDEX IF NOT EXISTS "articoli_categoria_idx" ON "articoli" ("categoria");
CREATE INDEX IF NOT EXISTS "articoli_scorta_idx" ON "articoli" ("quantita_attuale", "soglia_minima");

CREATE INDEX IF NOT EXISTS "ordini_fornitore_idx" ON "ordini" ("fornitore_id");
CREATE INDEX IF NOT EXISTS "ordini_stato_idx" ON "ordini" ("stato");
CREATE INDEX IF NOT EXISTS "ordini_data_idx" ON "ordini" ("data");
CREATE INDEX IF NOT EXISTS "ordini_fornitore_stato_idx" ON "ordini" ("fornitore_id", "stato");

CREATE INDEX IF NOT EXISTS "righe_ordine_ordine_idx" ON "righe_ordine" ("ordine_id");
CREATE INDEX IF NOT EXISTS "righe_ordine_articolo_idx" ON "righe_ordine" ("articolo_id");
CREATE INDEX IF NOT EXISTS "righe_ordine_ordine_articolo_idx" ON "righe_ordine" ("ordine_id", "articolo_id");

-- Trigger per aggiornamento automatico updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_fornitori_updated_at BEFORE UPDATE ON "fornitori" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articoli_updated_at BEFORE UPDATE ON "articoli" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ordini_updated_at BEFORE UPDATE ON "ordini" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_righe_ordine_updated_at BEFORE UPDATE ON "righe_ordine" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
