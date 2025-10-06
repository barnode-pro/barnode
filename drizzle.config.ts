import { defineConfig } from "drizzle-kit";

// Configurazione database - supporta sia PostgreSQL (Supabase) che SQLite (locale)
const databaseUrl = process.env.DATABASE_URL || 'file:./barnode.db';
const isPostgres = databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://');

export default defineConfig({
  out: "./migrations",
  schema: "./server/db/schema/index.ts",
  dialect: isPostgres ? "postgresql" : "sqlite",
  dbCredentials: {
    url: databaseUrl,
  },
});
