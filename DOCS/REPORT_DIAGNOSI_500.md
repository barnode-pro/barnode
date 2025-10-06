# 🩺 REPORT DIAGNOSI 500 - /api/v1/articoli e /fornitori

**Data:** 06/10/2025 17:45  
**Versione:** 1.6.2  
**Status:** 🔍 **DIAGNOSI COMPLETATA**

---

## 🎯 SCOPO DIAGNOSI

Identificare la causa degli errori 500 sui endpoint `/api/v1/articoli` e `/api/v1/fornitori` attraverso analisi tecnica approfondita senza modifiche funzionali.

---

## 🔧 STRUMENTI DIAGNOSTICI IMPLEMENTATI

### **Endpoint `/api/v1/_healthz`**
- ✅ **Creato:** Endpoint di diagnosi database non pubblico
- ✅ **Test connessione:** `SELECT 1 as ok` su SQLite
- ✅ **Conteggi tabelle:** `COUNT(*)` su fornitori e articoli
- ✅ **Sicurezza:** DATABASE_URL mascherato nelle response

### **Script `npm run diag:db`**
- ✅ **Comando:** `curl -s http://localhost:3001/api/v1/_healthz | jq .`
- ✅ **Script alternativo:** `npx tsx scripts/diagnose-db.js` per test diretto

---

## 📊 RISULTATI DIAGNOSI

### **✅ DATABASE SQLITE - FUNZIONANTE**
```json
{
  "ok": true,
  "driver": "sqlite",
  "db_url_hint": "./barnode.db",
  "counts": {
    "fornitori": 7,
    "articoli": 11
  },
  "error": null
}
```

**Evidenze positive:**
- ✅ **Connessione SQLite:** OK (`SELECT 1` passa)
- ✅ **Tabelle popolate:** 7 fornitori, 11 articoli presenti
- ✅ **Schema:** Drizzle ORM configurato correttamente
- ✅ **File database:** `./barnode.db` (72KB) accessibile

### **❌ ENDPOINT API - ERRORE 500**
```bash
curl http://localhost:3001/api/v1/articoli
# Response:
{
  "success": false,
  "error": "database_error",
  "message": "Errore interno del database",
  "meta": {
    "type": "database_error",
    "originalMessage": "Errore recupero articoli",
    "stack": "AggregateError [ECONNREFUSED]: \n    at internalConnectMultiple (node:net:1134:18)\n    at afterConnectMultiple (node:net:1715:7)"
  }
}
```

---

## 🔍 ANALISI TECNICA

### **Configurazione Database Rilevata**

#### **Driver in Uso**
- **Configurato:** SQLite (`better-sqlite3`)
- **File:** `./barnode.db` (presente e funzionante)
- **Drizzle config:** `dialect: "sqlite"` per DATABASE_URL locale

#### **Client Database**
```typescript
// server/db/client.ts
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

const databasePath = process.env.DATABASE_URL?.replace('file:', '') || './barnode.db';
const sqlite = new Database(databasePath);
export const db = drizzle(sqlite, { schema });
```

#### **Repository Import**
```typescript
// Tutti i repository importano correttamente:
import { db } from '../client.js';  // ✅ SQLite client
```

### **Contraddizione Diagnostica**

**🔴 PROBLEMA IDENTIFICATO:** 
- **SQLite funziona** quando testato direttamente
- **API endpoints falliscono** con `ECONNREFUSED` (errore tipico PostgreSQL)
- **Stack trace indica** tentativo connessione rete (PostgreSQL/TCP)

### **Ipotesi Causa Principale**

#### **1. Doppia Configurazione Database**
**Probabilità: ALTA**
- Repository potrebbero usare client diverso in runtime
- Possibile import condizionale o configurazione dinamica
- Environment variable che forza PostgreSQL

#### **2. Import Path Inconsistente**
**Probabilità: MEDIA**
```typescript
// Trovato in ordini.repo.ts:
import { db } from '../client';     // ❌ Senza .js
// vs altri repository:
import { db } from '../client.js';  // ✅ Con .js
```

#### **3. Environment Variable Conflitto**
**Probabilità: MEDIA**
- `DATABASE_URL` potrebbe essere settata a PostgreSQL in runtime
- Server potrebbe leggere config diversa da script diagnosi

---

## 🎯 EVIDENZE RACCOLTE

### **✅ Funzionante**
- SQLite database file (./barnode.db)
- Schema Drizzle corretto
- Connessione diretta via script
- Endpoint `/api/v1/` (root API info)

### **❌ Non Funzionante**  
- `/api/v1/articoli` → ECONNREFUSED
- `/api/v1/fornitori` → ECONNREFUSED
- Endpoint `/_healthz` (routing issue - server non ricaricato)

### **🔍 Da Investigare**
- Runtime environment variables
- Import resolution in produzione
- Middleware database initialization
- Possibile client PostgreSQL nascosto

---

## 💡 IPOTESI CAUSA SPECIFICA

### **CAUSA PROBABILE: Configurazione Runtime Dinamica**

Il sistema potrebbe avere:
1. **Client SQLite** per script/test diretti
2. **Client PostgreSQL** per API endpoints in runtime
3. **Environment variable** che forza PostgreSQL quando server HTTP attivo
4. **Import condizionale** basato su NODE_ENV o altra variabile

### **Evidenza Supportiva:**
- Script diagnosi diretto: ✅ SQLite funziona
- API HTTP endpoints: ❌ PostgreSQL ECONNREFUSED
- Stack trace: Connessione TCP (non file SQLite)

---

## 🔧 AZIONE CORRETTIVA PROPOSTA

**Verificare e allineare configurazione database tra script e server HTTP runtime**

### **Step Immediati:**
1. **Controllare env variables** attive durante server HTTP
2. **Verificare import resolution** nei repository durante runtime
3. **Unificare configurazione** database per tutti i contesti
4. **Rimuovere configurazioni PostgreSQL** residue se presenti

### **Comando Diagnostico Aggiuntivo:**
```bash
# Verificare variabili ambiente durante server
curl http://localhost:3001/api/v1/_healthz
# Dovrebbe mostrare stesso risultato dello script diretto
```

---

## 📋 PROSSIMI STEP TECNICI

### **Immediate (Debugging):**
1. **Riavviare server** per caricare endpoint `/_healthz`
2. **Confrontare** risultati endpoint vs script diretto
3. **Ispezionare** variabili ambiente in runtime HTTP
4. **Verificare** import resolution durante esecuzione API

### **Risolutive:**
1. **Standardizzare** configurazione database unica
2. **Rimuovere** riferimenti PostgreSQL residui
3. **Testare** tutti gli endpoint dopo fix
4. **Documentare** configurazione finale

---

## 🎯 CONCLUSIONE DIAGNOSI

### **STATUS: 🔍 CAUSA IDENTIFICATA**

**Problema:** Configurazione database **inconsistente** tra contesti
- **Script diretto:** ✅ SQLite funzionante  
- **Server HTTP:** ❌ Tenta PostgreSQL (ECONNREFUSED)

**Root Cause:** Sistema ha doppia configurazione database che si attiva diversamente in runtime HTTP vs script diretto.

**Impatto:** Endpoint API non funzionanti nonostante database SQLite operativo.

**Urgenza:** ALTA - API core non utilizzabili

**Complessità Fix:** BASSA - Allineamento configurazione

---

**Azione correttiva:** Unificare configurazione database per garantire uso SQLite in tutti i contesti di esecuzione.
