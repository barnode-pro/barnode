import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import { healthRoutes } from '../routes/health.routes.js';

/**
 * Test API per endpoint health check
 * Verifica risposta e struttura dati
 */

// Setup app Express per test
const app = express();
app.use(express.json());
app.use('/api', healthRoutes);

describe('Health API', () => {
  it('dovrebbe rispondere 200 con dati health', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    expect(response.body).toHaveProperty('ok', true);
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('service', 'BarNode API');
    expect(response.body).toHaveProperty('version', '1.0.0');
    expect(response.body).toHaveProperty('database');
    expect(response.body).toHaveProperty('uptime');
  });

  it('dovrebbe avere timestamp valido', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    const timestamp = new Date(response.body.timestamp);
    expect(timestamp).toBeInstanceOf(Date);
    expect(timestamp.getTime()).not.toBeNaN();
  });

  it('dovrebbe avere uptime numerico', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    expect(typeof response.body.uptime).toBe('number');
    expect(response.body.uptime).toBeGreaterThanOrEqual(0);
  });
});
