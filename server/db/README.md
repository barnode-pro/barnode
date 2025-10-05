# Database

Questa cartella contiene le configurazioni e logiche di accesso al database.

## Contenuto

- `storage.ts` - Interface e implementazione storage
- Configurazioni Drizzle ORM
- Migrazioni e seed del database
- Query e operazioni CRUD

## Convenzioni

- Uso di Drizzle ORM per type safety
- Transazioni per operazioni complesse
- Gestione connessioni e pool
- Logging delle query in development
- Separazione schema da logica business
