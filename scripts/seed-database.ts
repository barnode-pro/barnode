#!/usr/bin/env tsx

/**
 * Script per popolare il database BarNode con dati iniziali
 * Eseguire con: npm run db:seed
 */

import { db } from '../server/db/client';
import { fornitori, articoli, ordini, righeOrdine } from '../server/db/schema/index';

async function seedDatabase() {
  console.log('🌱 Inizio seed database BarNode...');

  try {
    // Pulisci tabelle esistenti (in ordine per rispettare foreign keys)
    await db.delete(righeOrdine);
    await db.delete(ordini);
    await db.delete(articoli);
    await db.delete(fornitori);
    
    console.log('✅ Tabelle pulite');

    // Seed Fornitori
    const fornitoriData = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        nome: 'Fornitore Alimentari SRL',
        whatsapp: '+393331234567',
        email: 'ordini@alimentari.it',
        note: 'Fornitore principale per prodotti alimentari'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        nome: 'Bevande & Co',
        whatsapp: '+393339876543',
        email: 'vendite@bevande.com',
        note: 'Specializzato in bevande e liquidi'
      }
    ];

    await db.insert(fornitori).values(fornitoriData);
    console.log('✅ Fornitori inseriti:', fornitoriData.length);

    // Seed Articoli
    const articoliData = [
      {
        id: '660e8400-e29b-41d4-a716-446655440001',
        nome: 'Pasta Penne 500g',
        categoria: 'Alimentari',
        unita: 'pz',
        confezione: 'Confezione da 500g',
        quantita_attuale: 15,
        soglia_minima: 20,
        fornitore_id: '550e8400-e29b-41d4-a716-446655440001',
        note: 'Pasta di grano duro'
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440002',
        nome: 'Pomodori Pelati 400g',
        categoria: 'Alimentari',
        unita: 'pz',
        confezione: 'Lattina 400g',
        quantita_attuale: 8,
        soglia_minima: 15,
        fornitore_id: '550e8400-e29b-41d4-a716-446655440001',
        note: 'Pomodori San Marzano'
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440003',
        nome: 'Olio Extra Vergine 1L',
        categoria: 'Alimentari',
        unita: 'pz',
        confezione: 'Bottiglia 1L',
        quantita_attuale: 5,
        soglia_minima: 10,
        fornitore_id: '550e8400-e29b-41d4-a716-446655440001',
        note: 'Olio di oliva pugliese'
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440004',
        nome: 'Acqua Naturale 1.5L',
        categoria: 'Bevande',
        unita: 'pz',
        confezione: 'Bottiglia 1.5L',
        quantita_attuale: 25,
        soglia_minima: 30,
        fornitore_id: '550e8400-e29b-41d4-a716-446655440002',
        note: 'Acqua oligominerale'
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440005',
        nome: 'Coca Cola 330ml',
        categoria: 'Bevande',
        unita: 'pz',
        confezione: 'Lattina 330ml',
        quantita_attuale: 12,
        soglia_minima: 24,
        fornitore_id: '550e8400-e29b-41d4-a716-446655440002',
        note: 'Bevanda gassata'
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440006',
        nome: 'Parmigiano Reggiano 200g',
        categoria: 'Latticini',
        unita: 'pz',
        confezione: 'Pezzo 200g',
        quantita_attuale: 3,
        soglia_minima: 8,
        fornitore_id: '550e8400-e29b-41d4-a716-446655440001',
        note: 'Stagionato 24 mesi'
      }
    ];

    await db.insert(articoli).values(articoliData);
    console.log('✅ Articoli inseriti:', articoliData.length);

    // Seed Ordine demo
    const ordineDemo = {
      id: '770e8400-e29b-41d4-a716-446655440001',
      fornitore_id: '550e8400-e29b-41d4-a716-446655440001',
      stato: 'nuovo' as const,
      note: 'Ordine demo per test sistema'
    };

    await db.insert(ordini).values([ordineDemo]);
    console.log('✅ Ordine demo inserito');

    // Seed Righe Ordine demo
    const righeDemo = [
      {
        id: '880e8400-e29b-41d4-a716-446655440001',
        ordine_id: '770e8400-e29b-41d4-a716-446655440001',
        articolo_id: '660e8400-e29b-41d4-a716-446655440002', // Pomodori
        qta_ordinata: 10,
        qta_ricevuta: 0,
        note: 'Urgente - scorte in esaurimento'
      },
      {
        id: '880e8400-e29b-41d4-a716-446655440002',
        ordine_id: '770e8400-e29b-41d4-a716-446655440001',
        articolo_id: '660e8400-e29b-41d4-a716-446655440003', // Olio
        qta_ordinata: 6,
        qta_ricevuta: 0,
        note: 'Preferire formato famiglia'
      }
    ];

    await db.insert(righeOrdine).values(righeDemo);
    console.log('✅ Righe ordine demo inserite:', righeDemo.length);

    console.log('🎉 Seed database completato con successo!');
    console.log('📊 Riepilogo:');
    console.log(`   - Fornitori: ${fornitoriData.length}`);
    console.log(`   - Articoli: ${articoliData.length} (${articoliData.filter(a => a.quantita_attuale < a.soglia_minima).length} sotto soglia)`);
    console.log(`   - Ordini: 1 demo`);
    console.log(`   - Righe ordine: ${righeDemo.length}`);

  } catch (error) {
    console.error('❌ Errore durante il seed:', error);
    process.exit(1);
  }
}

// Esegui seed se chiamato direttamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => process.exit(0));
}

export { seedDatabase };
