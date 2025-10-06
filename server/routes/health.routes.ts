import { Router } from 'express';
import { testConnection } from '../db/client.js';
import { logger } from '../utils/logger.js';

/**
 * Route per health check BarNode API
 * Verifica stato server e connessione database
 */

const router = Router();

router.get('/health', async (req, res) => {
  try {
    const timestamp = new Date().toISOString();
    const dbStatus = await testConnection();
    
    const healthData = {
      ok: true,
      timestamp,
      service: 'BarNode API',
      version: '1.0.0',
      database: dbStatus ? 'connected' : 'disconnected',
      uptime: process.uptime()
    };

    logger.info('Health check richiesto', { 
      ip: req.ip, 
      userAgent: req.get('User-Agent'),
      dbStatus 
    });

    res.status(200).json(healthData);
  } catch (error) {
    logger.error('Errore health check:', error);
    
    res.status(503).json({
      ok: false,
      timestamp: new Date().toISOString(),
      service: 'BarNode API',
      error: 'Service unavailable'
    });
  }
});

export { router as healthRoutes };
