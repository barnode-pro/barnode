import { defineConfig } from "drizzle-kit";

// Configurazione database per sviluppo locale
const databaseUrl = process.env.DATABASE_URL || 'file:./barnode.db';

export default defineConfig({
  out: "./migrations",
  schema: "./server/db/schema/index.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: databaseUrl,
  },
});
