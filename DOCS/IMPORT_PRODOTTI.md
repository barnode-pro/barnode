# 📊 IMPORT PRODOTTI DA EXCEL

**Guida completa per importare prodotti da file Excel (.xlsx) nel sistema BarNode**

## 🎯 SCOPO

Importare prodotti da fogli di calcolo Excel mantenendo la coerenza dei dati e prevenendo duplicati.

## 📋 PREREQUISITI

### File Excel
- **Formato:** `.xlsx` (Excel 2007+)
- **Foglio:** `prodotti` (default, configurabile)
- **Posizione:** `data/PRODOTTI_CASSA.xlsx`

### Colonne Richieste
| Colonna Excel | Campo DB | Tipo | Obbligatorio | Note |
|---------------|----------|------|--------------|------|
| `Descrizione` | `nome` | Testo | ✅ Sì | Nome prodotto |
| `Categoria` | `categoria` | Testo | ❌ No | Categoria merceologica |
| `fornitore` | `fornitore_id` | Testo | ❌ No | Nome fornitore (crea se non esiste) |
| `Prezzo acquisto` | `prezzo_acquisto` | Numero | ❌ No | Costo dal fornitore |
| `Prezzo vendita` | `prezzo_vendita` | Numero | ❌ No | Prezzo al cliente |

### Colonne Ignorate
- **Giacenze/Scorte:** NON importate (mantiene valori esistenti)
- **Soglie minime:** NON importate (mantiene valori esistenti)
- **Altri campi:** Ignorati automaticamente

## 🚀 UTILIZZO

### Comando Base
```bash
npm run import:prodotti -- --file=data/PRODOTTI_CASSA.xlsx
```

### Parametri Opzionali
```bash
# Specifica foglio diverso
npm run import:prodotti -- --file=data/PRODOTTI_CASSA.xlsx --sheet=prodotti_2024

# File in posizione diversa
npm run import:prodotti -- --file=/path/to/file.xlsx
```

### Esempio Output
```
🚀 Avvio import prodotti Excel
📁 File: data/PRODOTTI_CASSA.xlsx
🗄️  Database: SQLite

📊 Lettura file Excel: data/PRODOTTI_CASSA.xlsx
📋 Foglio: prodotti

📈 Statistiche lettura:
   - Righe totali: 150
   - Righe valide: 145
   - Righe saltate: 5

🔄 Inizio import 145 prodotti...
   Processate 50/145 righe...
   Processate 100/145 righe...

🎉 Import completato con successo!

📊 Risultati finali:
   - Articoli creati: 120
   - Articoli aggiornati: 25
   - Righe saltate: 5
   - Fornitori creati: 3
```

## 🔧 LOGICA IMPORT

### Gestione Fornitori
1. **Fornitore specificato:** Cerca per nome (case-insensitive)
2. **Fornitore vuoto:** Usa "Fornitore Generico"
3. **Fornitore non trovato:** Crea automaticamente

### Prevenzione Duplicati
- **Chiave univoca:** `(fornitore_id, lower(trim(nome)))`
- **Operazione:** UPSERT (crea se nuovo, aggiorna se esistente)
- **Campi aggiornati:** Solo `categoria`, `prezzo_acquisto`, `prezzo_vendita`

### Normalizzazione Dati

#### Stringhe
- **Trim:** Rimuove spazi iniziali/finali
- **Collapse:** Spazi multipli → spazio singolo
- **Case:** Mantiene maiuscole/minuscole originali

#### Prezzi
- **Decimali:** Virgola → Punto (12,50 → 12.50)
- **Valuta:** Rimuove simboli (€ 12,50 → 12.50)
- **Validazione:** Solo numeri ≥ 0
- **Precisione:** Arrotonda a 2 decimali

## ⚠️ GESTIONE ERRORI

### Righe Saltate
- **Descrizione mancante:** Riga ignorata
- **Prezzi non validi:** Impostati a `null`
- **Errori DB:** Riga saltata, errore loggato

### Anomalie Comuni
```
⚠️  Prime anomalie rilevate:
   - Riga 15: Descrizione mancante
   - Riga 23: Prezzo acquisto non valido: "N/A"
   - Riga 45: Errore DB: vincolo violato
```

## 🔄 OPERAZIONI IDEMPOTENTI

### Rilancio Import
- **Sicuro:** Può essere eseguito più volte
- **Duplicati:** Prevenuti automaticamente
- **Aggiornamenti:** Solo campi modificati

### Strategia Merge
```sql
-- Logica interna (semplificata)
IF EXISTS (fornitore_id, lower(trim(nome))) THEN
  UPDATE categoria, prezzo_acquisto, prezzo_vendita
ELSE
  INSERT nuovo articolo
END IF
```

## 📁 STRUTTURA FILE

### Esempio Excel
```
| Descrizione        | Categoria  | fornitore      | Prezzo acquisto | Prezzo vendita |
|--------------------|------------|----------------|-----------------|----------------|
| Pasta Penne 500g   | Alimentari | Barilla SRL    | 1,20           | 2,50          |
| Coca Cola 330ml    | Bevande    | Coca Cola Co   | 0,80           | 1,50          |
| Pane Integrale     | Panetteria |                | 2,00           | 3,50          |
```

### Mapping Colonne
- **Flessibile:** Nomi colonne case-insensitive
- **Sinonimi:** `Descrizione` = `nome` = `prodotto`
- **Parziale:** Match anche su substring

## 🧪 TEST & VALIDAZIONE

### Test Unitari
```bash
npm test -- import-xlsx.test.ts
```

### Test Smoke
```bash
# Crea file test con 5 righe
npm run import:prodotti -- --file=data/test_sample.xlsx
```

### Verifica Risultati
```bash
# Controlla articoli creati
curl http://localhost:3001/api/v1/articoli | jq '.data | length'

# Controlla fornitori
curl http://localhost:3001/api/v1/fornitori | jq '.data'
```

## 🚨 TROUBLESHOOTING

### Errore: File non trovato
```bash
❌ Parametro --file richiesto
```
**Soluzione:** Specifica path completo al file

### Errore: Foglio non trovato
```bash
❌ Foglio 'prodotti' non trovato. Fogli disponibili: Sheet1, Dati
```
**Soluzione:** Usa `--sheet=Sheet1`

### Errore: Colonne mancanti
```bash
⚠️  Colonna 'Descrizione' non trovata
```
**Soluzione:** Verifica nomi colonne nel file Excel

### Errore: Database locked
```bash
❌ Database is locked
```
**Soluzione:** Ferma server locale prima dell'import

## 📊 PERFORMANCE

### Ottimizzazioni
- **Batch processing:** Elabora 50 righe per volta
- **Cache fornitori:** Evita query ripetute
- **Transazioni:** Rollback automatico su errore

### Limiti Consigliati
- **File size:** < 10MB
- **Righe:** < 10,000 prodotti
- **Tempo:** ~1-2 minuti per 1,000 righe

## 🔐 SICUREZZA

### Validazioni
- **Path traversal:** Prevenuto
- **SQL injection:** Parametri sanitizzati
- **File type:** Solo `.xlsx` accettati

### Backup
```bash
# Backup automatico prima import
npm run backup
```

---

**✅ IMPORT COMPLETATO**

Il sistema BarNode supporta ora l'import massivo di prodotti da Excel mantenendo integrità dei dati e prevenendo duplicati.
