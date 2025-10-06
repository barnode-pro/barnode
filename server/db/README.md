# Database BarNode - PostgreSQL + Drizzle

Configurazione database e schemi per API BarNode.

## Struttura

### `client.ts`
- Connessione PostgreSQL con pooling
- Istanza Drizzle ORM configurata
- Utilities per test connessione

### `schema/`
- **fornitore.ts** - Anagrafica fornitori con contatti
- **articolo.ts** - Inventario con scorte e soglie
- **ordine.ts** - Ordini con stati workflow
- **rigaOrdine.ts** - Dettaglio articoli ordinati

### `repositories/`
- Pattern repository per CRUD operations
- Astrazione accesso dati tipizzata
- Gestione errori database centralizzata

## Convenzioni

- **UUID** per primary key
- **snake_case** per colonne database  
- **Timestamps** created_at, updated_at automatici
- **Indici** per performance query frequenti
- **Foreign key** con cascade per integrità
- **Validazione** Zod per input/outputzioni complesse
- Gestione connessioni e pool
- Logging delle query in development
- Separazione schema da logica business
