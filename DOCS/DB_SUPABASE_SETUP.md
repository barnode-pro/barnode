# 🐘 SETUP DATABASE SUPABASE (PostgreSQL)

**Guida completa per migrazione da SQLite a Supabase PostgreSQL**

## 🎯 PREREQUISITI

1. **Account Supabase** attivo su [supabase.com](https://supabase.com)
2. **Progetto Supabase** creato
3. **DATABASE_URL** PostgreSQL disponibile

## 📋 STEP 1: CONFIGURAZIONE AMBIENTE

### 1.1 Variabili Ambiente
Crea/aggiorna `.env` con:

```bash
# Database PostgreSQL Supabase
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"

# Backup SQLite (opzionale)
DATABASE_URL_SQLITE="file:./barnode.db"
```

### 1.2 Verifica Configurazione
```bash
# Test connessione
npm run check
```

## 📋 STEP 2: APPLICAZIONE MIGRAZIONI

### 2.1 Schema Iniziale
Esegui nel **SQL Editor** di Supabase:

```sql
-- File: migrations/postgres/0001_initial_schema.sql
-- Copia e incolla tutto il contenuto
```

**Contenuto principale:**
- ✅ Estensione UUID (`uuid-ossp`)
- ✅ Tabelle: `fornitori`, `articoli`, `ordini`, `righe_ordine`
- ✅ Vincoli FK e CHECK
- ✅ Indici per performance
- ✅ Trigger `updated_at` automatici

### 2.2 Seed Dati Demo
Esegui nel **SQL Editor** di Supabase:

```sql
-- File: migrations/postgres/0002_seed_data.sql
-- Copia e incolla tutto il contenuto
```

**Dati inseriti:**
- 2 fornitori (Alimentari SRL, Bevande & Co)
- 6 articoli (tutti sotto soglia per test)
- 1 ordine demo con 2 righe

### 2.3 Verifica Applicazione
```sql
-- Controlla tabelle create
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('fornitori', 'articoli', 'ordini', 'righe_ordine');

-- Controlla dati inseriti
SELECT COUNT(*) as fornitori FROM fornitori;
SELECT COUNT(*) as articoli FROM articoli;
SELECT COUNT(*) as ordini FROM ordini;
SELECT COUNT(*) as righe FROM righe_ordine;
```

## 📋 STEP 3: CONFIGURAZIONE SERVER

### 3.1 Dipendenze
```bash
# Installa driver PostgreSQL
npm install pg @types/pg
```

### 3.2 Test Connessione
```bash
# Avvia server con Supabase
DATABASE_URL="postgresql://..." npm run dev
```

**Log atteso:**
```
[INFO] Connessione database PostgreSQL: OK
[INFO] Server running on port 3001
```

## 📋 STEP 4: SEED PROGRAMMATICO

### 4.1 Script Seed PostgreSQL
```bash
# Adatta script per PostgreSQL
DATABASE_URL="postgresql://..." npm run db:seed
```

### 4.2 Verifica Seed
```bash
# Test API con dati Supabase
curl http://localhost:3001/api/v1/fornitori
curl http://localhost:3001/api/v1/articoli
```

## 🧪 STEP 5: SMOKE TEST

### 5.1 Test CRUD Base
```bash
# Fornitori
curl http://localhost:3001/api/v1/fornitori

# Articoli
curl http://localhost:3001/api/v1/articoli

# Ordini
curl http://localhost:3001/api/v1/ordini
```

### 5.2 Test Funzionalità Avanzate
```bash
# Ordini automatici
curl -X POST http://localhost:3001/api/v1/ordini/auto

# Ricezione (usa ID reali da GET /ordini)
curl -X POST http://localhost:3001/api/v1/ordini/[ID]/ricezione \
  -H "Content-Type: application/json" \
  -d '{"righe": [{"rigaId": "[RIGA_ID]", "quantita_ricevuta": 5}]}'
```

## 🔧 TROUBLESHOOTING

### Errore Connessione
```bash
# Verifica URL
echo $DATABASE_URL

# Test connessione diretta
psql $DATABASE_URL -c "SELECT version();"
```

### Errore Migrazioni
```sql
-- Controlla errori
SELECT * FROM information_schema.tables WHERE table_schema = 'public';

-- Reset completo (ATTENZIONE!)
DROP TABLE IF EXISTS righe_ordine CASCADE;
DROP TABLE IF EXISTS ordini CASCADE;
DROP TABLE IF EXISTS articoli CASCADE;
DROP TABLE IF EXISTS fornitori CASCADE;
```

### Errore Permessi
- Verifica **RLS** disabilitato per tabelle
- Controlla **API Keys** Supabase
- Usa **service_role** key per operazioni admin

## ✅ CHECKLIST FINALE

- [ ] DATABASE_URL configurato
- [ ] Migrazioni applicate (4 tabelle)
- [ ] Seed dati inseriti (2+6+1+2 record)
- [ ] Server connesso a Supabase
- [ ] API CRUD funzionanti
- [ ] Ordini automatici OK
- [ ] Ricezione merce OK

## 🚀 PRODUZIONE

### Variabili Ambiente
```bash
# .env.production
DATABASE_URL="postgresql://postgres:[PROD_PASSWORD]@db.[PROD_REF].supabase.co:5432/postgres"
NODE_ENV="production"
```

### Backup & Recovery
```bash
# Backup Supabase
pg_dump $DATABASE_URL > backup_supabase.sql

# Restore
psql $DATABASE_URL < backup_supabase.sql
```

---

**🎉 MIGRAZIONE COMPLETATA**

Il sistema BarNode è ora configurato con **Supabase PostgreSQL** mantenendo tutte le funzionalità dello STEP 4.
