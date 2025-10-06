import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { v1Routes } from '../routes/v1/index.js';
import { errorHandler } from '../utils/errorHandler.js';

/**
 * Test API per endpoint Ordini
 * Test creazione ordine con righe
 */

// Setup app Express per test
const app = express();
app.use(express.json());
app.use('/api/v1', v1Routes);
app.use(errorHandler);

// Mock data per test
const mockFornitore = {
  nome: 'Fornitore Ordini Test',
  whatsapp: '+39987654321'
};

const mockArticolo = {
  nome: 'Articolo Ordine Test',
  categoria: 'Test',
  unita: 'kg',
  confezione: 'sacco',
  quantita_attuale: 20,
  soglia_minima: 10,
  fornitore_id: '' // Popolato nel test
};

let createdFornitoreId: string;
let createdArticoloId: string;
let createdOrdineId: string;

describe('Ordini API', () => {
  beforeAll(async () => {
    // Crea fornitore per test
    const fornitoreResponse = await request(app)
      .post('/api/v1/fornitori')
      .send(mockFornitore);
    
    if (fornitoreResponse.status === 201) {
      createdFornitoreId = fornitoreResponse.body.data.id;
      mockArticolo.fornitore_id = createdFornitoreId;
    }

    // Crea articolo per test
    const articoloResponse = await request(app)
      .post('/api/v1/articoli')
      .send(mockArticolo);
    
    if (articoloResponse.status === 201) {
      createdArticoloId = articoloResponse.body.data.id;
    }
  });

  afterAll(async () => {
    // Cleanup
    if (createdOrdineId) {
      await request(app).delete(`/api/v1/ordini/${createdOrdineId}`);
    }
    if (createdArticoloId) {
      await request(app).delete(`/api/v1/articoli/${createdArticoloId}`);
    }
    if (createdFornitoreId) {
      await request(app).delete(`/api/v1/fornitori/${createdFornitoreId}`);
    }
  });

  it('dovrebbe creare ordine con righe', async () => {
    const ordineConRighe = {
      ordine: {
        fornitore_id: createdFornitoreId,
        stato: 'nuovo' as const,
        note: 'Ordine test con righe'
      },
      righe: [
        {
          articolo_id: createdArticoloId,
          qta_ordinata: 5,
          note: 'Prima riga test'
        }
      ]
    };

    const response = await request(app)
      .post('/api/v1/ordini')
      .send(ordineConRighe)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.fornitore_id).toBe(createdFornitoreId);
    expect(response.body.data.stato).toBe('nuovo');
    expect(response.body.data).toHaveProperty('fornitore');
    expect(response.body.data).toHaveProperty('righe');
    expect(response.body.data.righe).toHaveLength(1);
    expect(response.body.data.righe[0].articolo_id).toBe(createdArticoloId);

    createdOrdineId = response.body.data.id;
  });

  it('dovrebbe recuperare ordine per ID con righe', async () => {
    if (!createdOrdineId) return;

    const response = await request(app)
      .get(`/api/v1/ordini/${createdOrdineId}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(createdOrdineId);
    expect(response.body.data).toHaveProperty('fornitore');
    expect(response.body.data.fornitore.nome).toBe(mockFornitore.nome);
    expect(response.body.data).toHaveProperty('righe');
    expect(response.body.data.righe).toHaveLength(1);
    expect(response.body.data.righe[0]).toHaveProperty('articolo');
    expect(response.body.data.righe[0].articolo.nome).toBe(mockArticolo.nome);
  });

  it('dovrebbe validare dati ordine in POST', async () => {
    const invalidOrdine = {
      ordine: {
        fornitore_id: 'invalid-uuid',
        stato: 'stato-inesistente'
      }
    };

    const response = await request(app)
      .post('/api/v1/ordini')
      .send(invalidOrdine)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('validation_error');
  });

  it('dovrebbe restituire 404 per ordine inesistente', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    
    const response = await request(app)
      .get(`/api/v1/ordini/${fakeId}`)
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('not_found');
  });
});
