# Routes

Questa cartella contiene le route API modulari del backend Express.

## Struttura

- `routes.ts` - Configurazione principale delle route
- Route specifiche per dominio (ordini, articoli, fornitori)
- Middleware di validazione e autenticazione

## Convenzioni

- Prefisso `/api` per tutte le route
- Validazione input con Zod schemas
- Gestione errori centralizzata
- Documentazione JSDoc per ogni endpoint
- Separazione logica per entità business
