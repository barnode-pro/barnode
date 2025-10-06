# 📊 IMPORT PRODOTTI END-TO-END - Guida Completa

**Data:** 06/10/2025 23:30  
**Versione:** 1.8.0  
**Status:** ✅ **IMPLEMENTAZIONE COMPLETA E OPERATIVA**

---

## 🎯 FUNZIONALITÀ IMPLEMENTATE

### **Sistema Import Completo**
- ✅ **Upload File:** Excel (.xlsx, .xls) e CSV con parsing completo
- ✅ **Google Sheet:** Import diretto da URL CSV export
- ✅ **Upsert Idempotente:** Chiave `(fornitore_id, lower(trim(nome)))`
- ✅ **Transazioni:** Consistenza database garantita
- ✅ **Validazione Schema:** Endpoint check compatibilità DB
- ✅ **Test E2E:** Backend e frontend verificati

---

## 🚀 COME USARE

### **1️⃣ Upload File Excel/CSV**

1. **Naviga:** `/articoli` → Click "Importa Prodotti"
2. **Tab "File Excel/CSV":** Seleziona file locale
3. **Formati supportati:** `.xlsx`, `.xls`, `.csv` (max 5MB, 200 righe)
4. **Click "Importa File":** Attendi risultati con conteggi reali
5. **Verifica:** Lista articoli si aggiorna automaticamente

### **2️⃣ Import Google Sheet**

1. **Prepara Google Sheet:**
   - Rendi pubblico: `Condividi` → `Chiunque con il link può visualizzare`
   - Copia URL e modifica: `.../edit?...` → `.../export?format=csv`

2. **Esempio URL corretto:**
   ```
   https://docs.google.com/spreadsheets/d/1Gt0jQq8nrXWgsjMgyes_5Og3p4jD883a/export?format=csv
   ```

3. **Import:**
   - Tab "Google Sheet" → Incolla URL
   - Click "Importa da Google Sheet"
   - Attendi risultati

---

## 📋 CAMPI SUPPORTATI

### **Colonne Riconosciute (Case-Insensitive)**

| Campo Obbligatorio | Sinonimi Accettati |
|-------------------|-------------------|
| **Nome Prodotto** ⭐ | `"Descrizione"`, `"Nome"`, `"Prodotto"`, `"Nome Prodotto"` |

| Campi Opzionali | Sinonimi Accettati |
|-----------------|-------------------|
| **Categoria** | `"Categoria"`, `"Reparto"` |
| **Fornitore** | `"Fornitore"`, `"Supplier"`, `"Marca"` |
| **Prezzo Acquisto** | `"Prezzo acquisto"`, `"Acquisto"`, `"Costo"`, `"Prezzo d'acquisto"` |
| **Prezzo Vendita** | `"Prezzo vendita"`, `"Vendita"`, `"Listino"`, `"Prezzo"` |

### **Regole Parsing Prezzi**
- ✅ **Formati:** `1,50` / `1.50` / `€ 1,50` / `1.234,56` / `1,234.50`
- ✅ **Separatori migliaia:** Rimozione automatica
- ✅ **Simboli:** Rimozione `€`, `$`, spazi
- ✅ **Virgola decimale:** Conversione automatica `1,50` → `1.50`
- ✅ **Fallback:** `null` per valori non parsabili

---

## 🔄 LOGICA UPSERT IDEMPOTENTE

### **Fornitori**
```typescript
// 1. Cerca per nome esatto (case-insensitive)
const existing = await fornitoriRepo.findByNome(product.fornitore);

// 2. Se vuoto o mancante → "Fornitore Generico"
const fornitore = product.fornitore || 'Fornitore Generico';

// 3. Se non esiste → crea nuovo
if (!existing) {
  const newFornitore = await fornitoriRepo.create({
    nome: fornitore,
    whatsapp: undefined
  });
}
```

### **Articoli**
```typescript
// 1. Chiave unica: (fornitore_id, lower(trim(nome)))
const existing = await articoliRepo.findByFornitoreAndNome(fornitoreId, product.nome);

// 2. Se esiste → UPDATE solo categoria e prezzi (NO giacenze)
if (existing) {
  await articoliRepo.update(existing.id, {
    categoria: product.categoria,
    prezzo_acquisto: product.prezzo_acquisto,
    prezzo_vendita: product.prezzo_vendita
  });
}

// 3. Se non esiste → INSERT completo
else {
  await articoliRepo.create({
    nome: product.nome,
    categoria: product.categoria,
    fornitore_id: fornitoreId,
    prezzo_acquisto: product.prezzo_acquisto,
    prezzo_vendita: product.prezzo_vendita,
    quantita_attuale: 0,    // Default
    soglia_minima: 10       // Default
  });
}
```

---

## 📊 API ENDPOINTS

### **POST /api/v1/import/prodotti**
**Upload file multipart**

```bash
curl -X POST http://localhost:3001/api/v1/import/prodotti \
  -F "file=@prodotti.xlsx"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "creati": 15,
    "aggiornati": 3,
    "saltati": 1,
    "fornitori_creati": 2,
    "warnings": [
      "Prodotto XYZ: Prezzo acquisto non valido, impostato a null"
    ]
  }
}
```

### **POST /api/v1/import/prodotti/gsheet**
**Google Sheet URL**

```bash
curl -X POST http://localhost:3001/api/v1/import/prodotti/gsheet \
  -H "Content-Type: application/json" \
  -d '{"url": "https://docs.google.com/.../export?format=csv"}'
```

### **GET /api/v1/import/check-schema**
**Verifica compatibilità database**

```bash
curl http://localhost:3001/api/v1/import/check-schema
```

**Response:**
```json
{
  "ok": true,
  "details": {
    "fornitori": {
      "exists": true,
      "columns": { "nome": "TEXT" }
    },
    "articoli": {
      "exists": true,
      "columns": {
        "nome": "TEXT",
        "categoria": "TEXT",
        "prezzo_acquisto": "NUMERIC",
        "prezzo_vendita": "NUMERIC",
        "fornitore_id": "TEXT"
      }
    }
  },
  "missing": [],
  "wrongType": []
}
```

---

## 🧪 TESTING

### **Test Backend E2E**
```bash
npm test server/tests/e2e/import-prodotti.api.test.ts
```

**Copertura:**
- ✅ Check schema database
- ✅ Import CSV inline con prezzi virgola
- ✅ Idempotenza (secondo import aggiorna, non duplica)
- ✅ Gestione errori file mancante
- ✅ Validazione URL Google Sheet

### **Test Frontend Smoke**
```bash
npm test client/src/test/e2e/import.dialog.smoke.test.tsx
```

**Copertura:**
- ✅ Rendering dialog con tabs
- ✅ Mock import file con risultati
- ✅ Mock import Google Sheet con warnings
- ✅ Gestione errori UI

---

## 📁 ESEMPIO FILE CSV

```csv
Nome Prodotto,Categoria,Fornitore,Prezzo acquisto,Prezzo vendita
Pasta Penne 500g,Alimentari,Barilla SRL,"1,20","2,50"
Coca Cola 330ml,Bevande,Coca Cola Co,"0,80","1,50"
Pane Integrale,Panetteria,,"0,90","1,80"
Olio EVO 1L,Condimenti,Oleificio Toscano,"4,50","8,00"
```

**Risultato import:**
- **Prodotti creati:** 4
- **Fornitori creati:** 3 (Barilla SRL, Coca Cola Co, Fornitore Generico)
- **Prezzi:** Convertiti automaticamente (1,20 → 1.20)

---

## 🔒 LIMITAZIONI E VINCOLI

### **File Upload**
- **Max size:** 5MB per file
- **Max righe:** 200 prodotti per import
- **Formati:** Solo .xlsx, .xls, .csv
- **Encoding:** UTF-8 per CSV

### **Google Sheet**
- **Accesso:** Deve essere pubblico
- **URL format:** Solo `/export?format=csv`
- **Timeout:** 30s per download
- **Dimensioni:** Max 200 righe

### **Database**
- **Transazioni:** Rollback automatico su errore
- **Campi ignorati:** Giacenze gestite separatamente
- **Chiave unica:** Nome prodotto per fornitore

---

## 🎯 VERIFICA FUNZIONAMENTO

### **1. Check Schema**
```bash
curl http://localhost:3001/api/v1/import/check-schema
# Deve restituire ok: true
```

### **2. Test Import CSV**
Crea file `test.csv`:
```csv
Nome,Categoria,Fornitore,Prezzo acquisto,Prezzo vendita
Test Prodotto,Test,"Test Supplier","1,50","3,00"
```

Upload via UI o curl:
```bash
curl -X POST http://localhost:3001/api/v1/import/prodotti \
  -F "file=@test.csv"
```

### **3. Verifica in /articoli**
- Naviga a `/articoli`
- Cerca "Test Prodotto"
- Verifica fornitore "Test Supplier"
- Prezzi: 1.50 / 3.00

### **4. Test Idempotenza**
- Rilancia stesso import
- Verifica: `creati: 0, aggiornati: 1`

---

## 🚀 CONCLUSIONE

**Status:** ✅ **IMPORT PRODOTTI END-TO-END OPERATIVO** 🎉

### **Funzionalità Complete**
- ✅ **Parser robusto:** Excel, CSV, Google Sheet
- ✅ **Upsert intelligente:** Idempotente con transazioni
- ✅ **UI completa:** Dialog, loading, risultati, cache invalidation
- ✅ **Test coverage:** Backend E2E + Frontend smoke
- ✅ **Documentazione:** Guida completa con esempi

### **Pronto per Produzione**
- **Gestione errori:** Completa con warnings dettagliati
- **Performance:** Transazioni, limite 200 righe, timeout
- **Compatibilità:** SQLite (locale) + Postgres (Supabase)
- **UX ottimale:** Toast, progress, auto-refresh

**Il sistema BarNode ora supporta import prodotti reali end-to-end!** 🚀

Testa con i tuoi dati:
1. Prepara Excel/CSV con colonne supportate
2. Usa `/articoli` → "Importa Prodotti"
3. Verifica risultati e conteggi reali
4. Rilancia per testare idempotenza
