-- Migrazione PostgreSQL: Aggiunta colonne prezzi alla tabella articoli
-- Per supportare import prodotti da Excel

-- Aggiunta colonne prezzi (nullable)
ALTER TABLE "articoli" 
ADD COLUMN IF NOT EXISTS "prezzo_acquisto" NUMERIC(12,2) CHECK (prezzo_acquisto IS NULL OR prezzo_acquisto >= 0);

ALTER TABLE "articoli" 
ADD COLUMN IF NOT EXISTS "prezzo_vendita" NUMERIC(12,2) CHECK (prezzo_vendita IS NULL OR prezzo_vendita >= 0);

-- Indice per categoria (se non esiste già)
CREATE INDEX IF NOT EXISTS "idx_articoli_categoria" ON "articoli"("categoria");

-- Commenti per documentazione
COMMENT ON COLUMN "articoli"."prezzo_acquisto" IS 'Prezzo di acquisto dal fornitore (importato da Excel)';
COMMENT ON COLUMN "articoli"."prezzo_vendita" IS 'Prezzo di vendita al cliente (importato da Excel)';
