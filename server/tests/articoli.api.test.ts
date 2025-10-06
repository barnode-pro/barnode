import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { v1Routes } from '../routes/v1/index.js';
import { errorHandler } from '../utils/errorHandler.js';

/**
 * Test API per endpoint Articoli
 * Test CRUD base con mock data
 */

// Setup app Express per test
const app = express();
app.use(express.json());
app.use('/api/v1', v1Routes);
app.use(errorHandler);

// Mock data per test
const mockFornitore = {
  nome: 'Fornitore Test',
  whatsapp: '+39123456789',
  email: 'test@fornitore.com'
};

const mockArticolo = {
  nome: 'Articolo Test',
  categoria: 'Test Category',
  unita: 'pz',
  confezione: 'scatola',
  quantita_attuale: 10,
  soglia_minima: 5,
  fornitore_id: '', // Sarà popolato nel test
  note: 'Articolo per test API'
};

let createdFornitoreId: string;
let createdArticoloId: string;

describe('Articoli API', () => {
  beforeAll(async () => {
    // Crea fornitore per test articoli
    const fornitoreResponse = await request(app)
      .post('/api/v1/fornitori')
      .send(mockFornitore);
    
    if (fornitoreResponse.status === 201) {
      createdFornitoreId = fornitoreResponse.body.data.id;
      mockArticolo.fornitore_id = createdFornitoreId;
    }
  });

  afterAll(async () => {
    // Cleanup: elimina articolo e fornitore creati
    if (createdArticoloId) {
      await request(app).delete(`/api/v1/articoli/${createdArticoloId}`);
    }
    if (createdFornitoreId) {
      await request(app).delete(`/api/v1/fornitori/${createdFornitoreId}`);
    }
  });

  it('dovrebbe creare nuovo articolo', async () => {
    const response = await request(app)
      .post('/api/v1/articoli')
      .send(mockArticolo)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.nome).toBe(mockArticolo.nome);
    expect(response.body.data.fornitore_id).toBe(mockArticolo.fornitore_id);

    createdArticoloId = response.body.data.id;
  });

  it('dovrebbe recuperare articolo per ID', async () => {
    if (!createdArticoloId) return;

    const response = await request(app)
      .get(`/api/v1/articoli/${createdArticoloId}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(createdArticoloId);
    expect(response.body.data.nome).toBe(mockArticolo.nome);
    expect(response.body.data).toHaveProperty('fornitore');
    expect(response.body.data.fornitore.nome).toBe(mockFornitore.nome);
  });

  it('dovrebbe restituire 404 per articolo inesistente', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    
    const response = await request(app)
      .get(`/api/v1/articoli/${fakeId}`)
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('not_found');
  });

  it('dovrebbe validare dati articolo in POST', async () => {
    const invalidArticolo = {
      nome: '', // Nome vuoto - dovrebbe fallire
      fornitore_id: 'invalid-uuid'
    };

    const response = await request(app)
      .post('/api/v1/articoli')
      .send(invalidArticolo)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('validation_error');
    expect(response.body.details).toBeInstanceOf(Array);
  });
});
