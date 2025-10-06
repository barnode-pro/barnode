-- Seed data iniziale per BarNode PostgreSQL
-- Popola tabelle con dati demo per test

-- Seed Fornitori
INSERT INTO "fornitori" ("id", "nome", "whatsapp", "email", "note") VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Fornitore Alimentari SRL', '+393331234567', 'ordini@alimentari.it', 'Fornitore principale per prodotti alimentari'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Bevande & Co', '+393339876543', 'vendite@bevande.com', 'Specializzato in bevande e liquidi')
ON CONFLICT ("id") DO NOTHING;

-- Seed Articoli (tutti sotto soglia per testare ordini automatici)
INSERT INTO "articoli" ("id", "nome", "categoria", "unita", "confezione", "quantita_attuale", "soglia_minima", "fornitore_id", "note") VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Pasta Penne 500g', 'Alimentari', 'pz', 'Confezione da 500g', 15, 20, '550e8400-e29b-41d4-a716-446655440001', 'Pasta di grano duro'),
  ('660e8400-e29b-41d4-a716-446655440002', 'Pomodori Pelati 400g', 'Alimentari', 'pz', 'Lattina 400g', 8, 15, '550e8400-e29b-41d4-a716-446655440001', 'Pomodori San Marzano'),
  ('660e8400-e29b-41d4-a716-446655440003', 'Olio Extra Vergine 1L', 'Alimentari', 'pz', 'Bottiglia 1L', 5, 10, '550e8400-e29b-41d4-a716-446655440001', 'Olio di oliva pugliese'),
  ('660e8400-e29b-41d4-a716-446655440004', 'Acqua Naturale 1.5L', 'Bevande', 'pz', 'Bottiglia 1.5L', 25, 30, '550e8400-e29b-41d4-a716-446655440002', 'Acqua oligominerale'),
  ('660e8400-e29b-41d4-a716-446655440005', 'Coca Cola 330ml', 'Bevande', 'pz', 'Lattina 330ml', 12, 24, '550e8400-e29b-41d4-a716-446655440002', 'Bevanda gassata'),
  ('660e8400-e29b-41d4-a716-446655440006', 'Parmigiano Reggiano 200g', 'Latticini', 'pz', 'Pezzo 200g', 3, 8, '550e8400-e29b-41d4-a716-446655440001', 'Stagionato 24 mesi')
ON CONFLICT ("id") DO NOTHING;

-- Seed Ordini demo
INSERT INTO "ordini" ("id", "fornitore_id", "data", "stato", "note") VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE, 'nuovo', 'Ordine demo per test sistema')
ON CONFLICT ("id") DO NOTHING;

-- Seed Righe Ordine demo
INSERT INTO "righe_ordine" ("id", "ordine_id", "articolo_id", "qta_ordinata", "qta_ricevuta", "note") VALUES
  ('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 10, 0, 'Urgente - scorte in esaurimento'),
  ('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', 6, 0, 'Preferire formato famiglia')
ON CONFLICT ("id") DO NOTHING;
