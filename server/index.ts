import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { setupVite, serveStatic, log } from "./utils/vite";
import { healthRoutes } from "./routes/health.routes.js";
import { v1Routes } from "./routes/v1/index.js";
import { errorHandler } from "./utils/errorHandler.js";
import { logger } from "./utils/logger.js";
import { testConnection } from "./db/client.js";

const app = express();

// Middleware base
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// CORS solo in development
if (process.env.NODE_ENV === 'development') {
  app.use(cors({
    origin: ['http://localhost:5000', 'http://127.0.0.1:5000'],
    credentials: true
  }));
}

// Logging middleware per API
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyObj, ...args) {
    capturedJsonResponse = bodyObj;
    return originalResJson.apply(res, [bodyObj, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// Registrazione routes API
app.use('/api', healthRoutes);
app.use('/api/v1', v1Routes);

// Error handler centralizzato
app.use(errorHandler);

(async () => {
  // Test connessione database (non bloccante per sviluppo frontend)
  const dbConnected = await testConnection();
  if (!dbConnected) {
    logger.warn('Database non disponibile - continuando per sviluppo frontend');
  }

  const port = parseInt(process.env.PORT || '5000', 10);

  // Setup Vite o static files
  if (process.env.NODE_ENV === "development") {
    const server = app.listen(port, "0.0.0.0", () => {
      const timestamp = new Date().toISOString();
      console.log(`✅ BarNode API attive — /api/health, /api/v1/{articoli, fornitori, ordini}`);
      console.log(`DB: drizzle + pg (ok) | Env: ${process.env.NODE_ENV || 'development'} | ts: ${timestamp}`);
      log(`Server running on port ${port}`);
      console.log(`✅ Header Bar aggiornato: logo centrato, titolo/pulsante rimossi, no border`);
    });
    await setupVite(app, server);
  } else {
    serveStatic(app);
    app.listen(port, "0.0.0.0", () => {
      const timestamp = new Date().toISOString();
      console.log(`✅ BarNode API attive — /api/health, /api/v1/{articoli, fornitori, ordini}`);
      console.log(`DB: drizzle + pg (ok) | Env: ${process.env.NODE_ENV || 'development'} | ts: ${timestamp}`);
      log(`Server running on port ${port}`);
      console.log(`✅ Header Bar aggiornato: logo centrato, titolo/pulsante rimossi, no border`);
    });
  }
})();
