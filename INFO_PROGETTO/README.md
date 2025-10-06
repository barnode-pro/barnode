# 📁 INFO_PROGETTO - File Informativi BarNode

**Data creazione:** 06 Ottobre 2025  
**Scopo:** Governance e orientamento progetto  
**Limite:** 200 righe per file

---

## 🎯 RUOLO DELLA CARTELLA

Questa cartella contiene **file informativi di governance** per mantenere sempre chiaro:
- Come è organizzato il progetto BarNode
- Quali funzionalità sono implementate
- Quali regole seguire per lo sviluppo
- Qual è lo stato attuale del progetto

### 📋 DESTINATARI
- **Cascade AI:** Per orientarsi prima di ogni intervento
- **Sviluppatori:** Per comprendere struttura e standard
- **Stakeholder:** Per monitorare avanzamento progetto

---

## 📚 CONTENUTO FILE

### 🏗️ STRUTTURA_PROGETTO.md
**Scopo:** Schema completo cartelle e file principali  
**Contenuto:**
- Mappa visiva gerarchia frontend/backend
- Descrizione breve ogni directory
- Punti di navigazione chiave
- Relazioni tra moduli

### 🚀 FUNZIONALITÀ_APP.md
**Scopo:** Stato avanzamento funzionalità  
**Contenuto:**
- Moduli implementati e da sviluppare
- Relazioni tra componenti
- Roadmap prossimi obiettivi
- Tabella stato avanzamento

### ⚙️ SETUP_TECNICO.md
**Scopo:** Stack tecnologico e configurazioni  
**Contenuto:**
- Dipendenze e versioni
- Comandi sviluppo e build
- Configurazione ambiente
- Setup testing e backup

### 📋 STANDARD_GOVERNANCE.md
**Scopo:** Regole sviluppo e best practices  
**Contenuto:**
- Policy 200 righe per file
- Convenzioni naming e import/export
- Test obbligatori per nuove feature
- Note specifiche per Cascade AI

### 📊 STATO_ATTUALE.md
**Scopo:** Snapshot corrente progetto  
**Contenuto:**
- Status build, test, deployment
- Ultime modifiche rilevanti
- Metriche performance
- Issues noti e monitoraggio

### 📖 README.md
**Scopo:** Spiegazione cartella (questo file)  
**Contenuto:**
- Ruolo e destinatari
- Descrizione ogni file
- Regole utilizzo e aggiornamento

---

## 🔒 REGOLE UTILIZZO

### ✅ CONSULTAZIONE
- **Obbligatoria** per Cascade prima di modifiche strutturali
- **Consigliata** per sviluppatori prima di nuove feature
- **Utile** per comprendere stato progetto

### 📝 AGGIORNAMENTO
- **Automatico** ad ogni milestone completato
- **Manuale** per modifiche strutturali significative
- **Responsabilità** di chi implementa modifiche

### 🚫 LIMITAZIONI
- **Solo consultazione** - non modificare senza necessità
- **Massimo 200 righe** per ogni file
- **Contenuto tecnico** - non documentazione utente

---

## 🎯 GOVERNANCE GENERALE

### Policy 200 Righe
- **Tutti i file** del progetto devono rispettare il limite
- **Split obbligatorio** se superato
- **Eccezioni** solo per configurazioni complesse
- **Monitoraggio** continuo dimensioni file

### Documentazione Sempre Aggiornata
- **INFO_PROGETTO/** aggiornato ad ogni modifica strutturale
- **DOCS/** per documentazione tecnica dettagliata
- **README.md** principale sempre valido

### Standard Qualità
- **Test obbligatori** per nuove feature
- **Lint senza errori** prima di commit
- **Build funzionante** sempre garantito
- **Backup automatico** prima di modifiche rischiose

---

## 🤖 ISTRUZIONI CASCADE

### Prima di Agire
1. **Leggere STATO_ATTUALE.md** per contesto corrente
2. **Consultare STRUTTURA_PROGETTO.md** per orientamento
3. **Verificare STANDARD_GOVERNANCE.md** per regole
4. **Controllare FUNZIONALITÀ_APP.md** per impatto

### Durante Sviluppo
- **Rispettare** limite 200 righe per file
- **Implementare** test per nuove feature
- **Seguire** convenzioni naming e import
- **Mantenere** modularità e separazione logica

### Dopo Modifiche
- **Aggiornare** file INFO_PROGETTO se necessario
- **Verificare** build e test funzionanti
- **Documentare** modifiche significative
- **Eseguire** backup se richiesto

---

## 📍 RIFERIMENTI RAPIDI

### File Critici Progetto
- **Configurazioni:** `vite.config.ts`, `package.json`, `tsconfig.json`
- **Entry point:** `client/src/main.tsx`, `server/index.ts`
- **Routing:** `client/src/App.tsx`
- **Stili:** `client/src/styles/theme.css`

### Documentazione Completa
- **Architettura:** `DOCS/ARCHITETTURA_BARNODE.md`
- **Icone:** `DOCS/ICONS_GUIDE.md`
- **Storia:** `DOCS/REPORT_IMPORT_BARNODE.md`
- **STEP 1:** `DOCS/REPORT_STEP_1.md`

### Comandi Essenziali
```bash
npm run dev          # Sviluppo locale
npm run build        # Build produzione
npm run test         # Test suite
npm run backup       # Backup progetto
```

---

**Cartella creata automaticamente**  
**Percorso:** `INFO_PROGETTO/`  
**Consultazione:** Prima di ogni intervento significativo
