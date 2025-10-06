import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import { v1Routes } from '../../routes/v1/index.js';

// Setup app per test
const app = express();
app.use(express.json());
app.use('/api/v1', v1Routes);

/**
 * Test E2E per API import prodotti
 * Verifica upload file, Google Sheet e idempotenza
 */

describe('API Import Prodotti E2E', () => {
  
  it('dovrebbe verificare schema database', async () => {
    const response = await request(app)
      .get('/api/v1/import/check-schema')
      .expect(200);

    expect(response.body.ok).toBe(true);
    expect(response.body.details.fornitori.exists).toBe(true);
    expect(response.body.details.articoli.exists).toBe(true);
  });

  it('dovrebbe importare prodotti da CSV inline', async () => {
    const csvContent = `Nome Prodotto,Categoria,Fornitore,Prezzo acquisto,Prezzo vendita
Prodotto Test 1,Alimentari,Fornitore Test,"2,50","5,00"
Prodotto Test 2,Bevande,,"1,20","3,50"`;

    const response = await request(app)
      .post('/api/v1/import/prodotti')
      .attach('file', Buffer.from(csvContent), {
        filename: 'test.csv',
        contentType: 'text/csv'
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('creati');
    expect(response.body.data).toHaveProperty('aggiornati');
    expect(response.body.data).toHaveProperty('fornitori_creati');
    expect(response.body.data.creati).toBeGreaterThan(0);
  });

  it('dovrebbe essere idempotente (secondo import stesso risultato)', async () => {
    const csvContent = `Nome Prodotto,Categoria,Fornitore,Prezzo acquisto,Prezzo vendita
Prodotto Idempotente,Test,Fornitore Idempotente,"1,00","2,00"`;

    // Primo import
    const firstResponse = await request(app)
      .post('/api/v1/import/prodotti')
      .attach('file', Buffer.from(csvContent), {
        filename: 'test-idempotente.csv',
        contentType: 'text/csv'
      })
      .expect(200);

    expect(firstResponse.body.data.creati).toBe(1);

    // Secondo import (dovrebbe aggiornare, non creare)
    const secondResponse = await request(app)
      .post('/api/v1/import/prodotti')
      .attach('file', Buffer.from(csvContent), {
        filename: 'test-idempotente-2.csv',
        contentType: 'text/csv'
      })
      .expect(200);

    expect(secondResponse.body.data.creati).toBe(0);
    expect(secondResponse.body.data.aggiornati).toBe(1);
  });

  it('dovrebbe gestire errori per file mancante', async () => {
    const response = await request(app)
      .post('/api/v1/import/prodotti')
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('File non fornito');
  });

  it('dovrebbe gestire errori per Google Sheet URL invalido', async () => {
    const response = await request(app)
      .post('/api/v1/import/prodotti/gsheet')
      .send({ url: 'invalid-url' })
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  it('dovrebbe gestire Google Sheet URL non Google Docs', async () => {
    const response = await request(app)
      .post('/api/v1/import/prodotti/gsheet')
      .send({ url: 'https://example.com/sheet.csv' })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Google Sheet');
  });
});
