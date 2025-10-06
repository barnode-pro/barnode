# 📋 STANDARD GOVERNANCE BARNODE

**Data:** 06 Ottobre 2025  
**Versione:** 1.0  
**Limite:** 200 righe per file

---

## 🎯 REGOLE PRINCIPALI PROGETTO (VINCOLANTI)

### 📏 LIMITE DIMENSIONI FILE (ERRORE OLTRE SOGLIA)
- **Massimo 200 righe per file** (POLICY VINCOLANTE)
- Se file supera 200 righe → **ERRORE e split obbligatorio**
- Eccezioni solo per configurazioni complesse
- Cascade deve segnalare e proporre split automatico

### 📁 SUDDIVISIONE MODULARE
- **Un componente per file** (React)
- **Un hook per file** (custom hooks)
- **Una funzione principale per file** (utilities)
- **Barrel exports** per cartelle (`index.ts`)
- **Separazione logica** business da presentazione

### 🏷️ NAMING CONVENTION
- **Componenti:** PascalCase (`HomePage.tsx`)
- **Hook:** useCamelCase (`useAuth.ts`)
- **Utilities:** camelCase (`apiClient.ts`)
- **Costanti:** UPPER_SNAKE_CASE (`API_BASE_URL`)
- **File test:** `ComponentName.test.tsx`

---

## 📦 IMPORT/EXPORT STANDARD

### Import Order
```typescript
// 1. Librerie esterne
import React from "react";
import { useState } from "react";

// 2. Import interni assoluti
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

// 3. Import relativi
import "./ComponentName.css";
```

### Export Patterns
```typescript
// ✅ Named exports preferiti
export const ComponentName = () => { ... };

// ✅ Default export solo per pagine
export default HomePage;

// ✅ Barrel exports
export { Button } from "./ui/button";
export { Header } from "./layout/Header";
```

---

## 🧪 TEST OBBLIGATORI

### Regole Test
- **Test obbligatorio** per ogni nuova pagina
- **Test obbligatorio** per ogni nuova feature
- **Smoke test minimo** (rendering senza errori)
- **Test ID** per elementi critici (`data-testid`)

### Convenzioni Test
```typescript
// File: ComponentName.test.tsx
describe("ComponentName", () => {
  it("dovrebbe renderizzare correttamente", () => {
    render(<ComponentName />);
    expect(screen.getByTestId("component")).toBeInTheDocument();
  });
});
```

---

## 📚 DOCUMENTAZIONE SEMPRE AGGIORNATA

### File Informativi
- **INFO_PROGETTO/** → Aggiornare ad ogni modifica strutturale
- **DOCS/** → Documentazione tecnica dettagliata
- **README.md** → Istruzioni quick start sempre valide

### JSDoc Obbligatorio
```typescript
/**
 * Componente per gestione articoli
 * @param articles - Lista articoli da visualizzare
 * @param onEdit - Callback per modifica articolo
 */
export const ArticleList = ({ articles, onEdit }: Props) => {
```

---

## 🤖 NOTE PER CASCADE

### Prima di Intervenire
1. **Leggere INFO_PROGETTO/** per comprendere struttura
2. **Verificare STATO_ATTUALE.md** per contesto
3. **Consultare STANDARD_GOVERNANCE.md** (questo file)
4. **Non modificare** file > 200 righe senza split

### Dove Scrivere
- **Nuovi componenti:** `client/src/components/`
- **Nuove pagine:** `client/src/pages/NomeModulo/`
- **Nuovi hook:** `client/src/hooks/`
- **Nuovi servizi:** `client/src/services/`
- **Documentazione:** `INFO_PROGETTO/` o `DOCS/`

### Dove NON Intervenire (VINCOLANTE)
- **File di configurazione** senza prompt esplicito
- **Sistema backup** (auto-gestito - MAI MODIFICARE)
- **Dipendenze** senza necessità reale
- **Commit GitHub** solo su richiesta esplicita
- **Struttura cartelle** consolidata

### Workflow Modifiche
1. **Analizzare** richiesta e impatto
2. **Verificare** se serve split file esistenti
3. **Implementare** seguendo standard
4. **Testare** con smoke test minimo
5. **Aggiornare** documentazione se necessario

---

## 🎨 STANDARD STILISTICI

### CSS e Styling
- **Tailwind utility classes** preferite
- **CSS variables** per tema BarNode
- **Responsive design** mobile-first
- **Dark mode** supportato

### Icone
- **Tabler Icons** come standard principale
- **Lucide Icons** solo come fallback
- **Dimensione standard:** 24×24px (h-6 w-6)
- **Import:** `~icons/tabler/icon-name`

### Colori BarNode
- **Primario:** #145304 (verde)
- **Accento:** #afe4a2 (mint)
- **Sfondo:** #fef9e2 (cream)

---

## 🔄 PROCESSO SVILUPPO

### Workflow Standard
1. **Analisi** requisiti e impatto
2. **Design** architettura modulare
3. **Implementazione** con test
4. **Review** dimensioni file
5. **Documentazione** aggiornata

### Quality Gates
- ✅ **Lint** senza errori
- ✅ **Test** passanti
- ✅ **Build** funzionante
- ✅ **File < 200 righe**
- ✅ **Documentazione** aggiornata

### Continuous Integration
- **Pre-commit:** Lint + format
- **Pre-push:** Test suite completa
- **Deploy:** Build + backup automatico

---

## 🚨 VIOLAZIONI COMUNI

### Da Evitare
- ❌ File > 200 righe senza split
- ❌ Componenti senza test
- ❌ Import disordinati
- ❌ Hardcoded values invece di costanti
- ❌ Modifiche senza documentazione

### Azioni Correttive
- **Split immediato** file troppo grandi
- **Test obbligatorio** per nuovo codice
- **Refactor** import secondo standard
- **Centralizzazione** valori in costanti
- **Aggiornamento** documentazione

---

---

## 🚨 GOVERNANCE INTERNA CASCADE (REGOLE GLOBALI VINCOLANTI)

### REGOLA 1 - MODULARITÀ OBBLIGATORIA
Tutti i file devono essere brevi, coesi, isolati per dominio

### REGOLA 2 - LIMITE 200 RIGHE (ERRORE OLTRE)
Ogni file deve avere massimo 200 righe. Oltre = ERRORE + split

### REGOLA 3 - CONSULTAZIONE INFO_PROGETTO OBBLIGATORIA
Prima di ogni modifica leggere INFO_PROGETTO/ per comprendere struttura

### REGOLA 4 - LINGUA ITALIANA
Tutti nomi, commenti, testi in italiano. Convenzioni: PascalCase componenti, camelCase funzioni

### REGOLA 5 - STABILITÀ E SICUREZZA
Nessuna modifica distruttiva. Nessuna alterazione logiche senza richiesta

### REGOLA 6 - DOCUMENTAZIONE AUTOMATICA
Aggiornare INFO_PROGETTO/ ad ogni nuova cartella/feature

### REGOLA 7 - BACKUP E COMMIT
Sistema backup attivo. Commit GitHub solo su richiesta esplicita

### REGOLA 8 - CONCLUSIONE AUTOMATICA
Sempre concludere operazioni senza lasciare comandi in sospeso

---

**File generato automaticamente**  
**Percorso:** `INFO_PROGETTO/STANDARD_GOVERNANCE.md`  
**Status:** ATTIVO E VINCOLANTE PER CASCADE
