import { Router } from 'express';
import { articoliRoutes } from './articoli.routes.js';
import { fornitoriRoutes } from './fornitori.routes.js';
import { ordiniRoutes } from './ordini.routes.js';

/**
 * Router principale per API v1 BarNode
 * Aggregazione di tutte le routes versionate
 */

const router = Router();

// Registrazione routes per entità
router.use('/articoli', articoliRoutes);
router.use('/fornitori', fornitoriRoutes);
router.use('/ordini', ordiniRoutes);

// Route di informazioni API
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'BarNode API v1',
    version: '1.0.0',
    endpoints: {
      articoli: '/api/v1/articoli',
      fornitori: '/api/v1/fornitori', 
      ordini: '/api/v1/ordini'
    },
    documentation: 'https://github.com/barnode-pro/barnode'
  });
});

export { router as v1Routes };
