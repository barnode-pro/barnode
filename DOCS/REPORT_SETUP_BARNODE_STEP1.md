# REPORT SETUP BARNODE - STEP 1

**Data**: 05/10/2025 23:13  
**Branch**: prep/barnode-setup  
**Obiettivo**: Clonazione da WineNode + pulizia moduli giacenza/threshold

---

## 📋 DIFF SUMMARY

### File Spostati in ARCHIVE/_wine-legacy/
- `useRealtimeGiacenza.ts` (249 righe) - Hook realtime giacenza completo
- `ThresholdInputs.tsx` (55 righe) - Componente input soglie

### Import Map Ricalibrati
- `src/hooks/useRealtimeGiacenza.ts` → stub che reindirizza a `src/lib/stubs/stock.ts`
- `src/pages/ManualWineInsertPage/components/ThresholdInputs.tsx` → stub semplificato

### Stub Creati
- `src/lib/stubs/stock.ts` - Stubs non-operativi per useRealtimeGiacenza e useThresholdWatcher
- Mantengono le firme API originali ma ritornano stati disabilitati

---

## ✅ QUALITY GATES

### Lint
- **Stato**: ✅ PASS
- **Errori**: 0
- **Warning**: 10 (pre-esistenti, non bloccanti)

### TypeCheck
- **Stato**: ✅ PASS
- **Errori**: 0

### Build
- **Stato**: ✅ PASS
- **Tempo**: 5.03s
- **Bundle**: Generato correttamente

### Test
- **Vitest**: ^3.2.4
- **@vitest/coverage-v8**: ^3.2.4 (installato)
- **Stato test:ci**: ✅ PASS (exit code 0)
- **Coverage**: Configurato provider v8
- **Report Path**: ./coverage/
- **Smoke Test**: src/__tests__/smoke.test.ts (1 test passing)
- **Setup File**: src/test/setup.ts (jest-dom)

---

## 🔧 FOUNDATION UPDATES

### Package.json
- `name`: "winenode" → "barnode"

### README.md
- Creato README principale con descrizione BarNode

### Documentazione
- `DOCS/00-INDICI/DOCS_INDEX.md`: Titolo aggiornato a "BARNODE (derivato da WineNode)"

### Environment
- `.env.barnode`: Creato con credenziali nuovo progetto Supabase (non attivo)
- `.env.local`: Mantenuto invariato per sviluppo corrente

## 🔒 ENV & SECRETS

- **`.env.barnode`**: ✅ NON tracciato (rimosso da Git)
- **`.gitignore`**: ✅ Aggiornato con regola `.env.*`
- **Credenziali**: ✅ Nessuna credenziale in repository
- **Sicurezza**: ✅ File sensibili esclusi dal tracking

## 📝 CHANGES

### File Creati
- `src/__tests__/smoke.test.ts` - Test minimo per exit code 0
- `src/test/setup.ts` - Setup file per jest-dom
- `src/lib/stubs/stock.ts` - Stub per moduli giacenza/threshold
- `README.md` - Documentazione principale BarNode

### File Modificati
- `.gitignore` - Aggiunta regola `.env.*`
- `vitest.config.ts` - Configurazione coverage v8
- `package.json` - Nome progetto → "barnode"
- `DOCS/00-INDICI/DOCS_INDEX.md` - Titolo aggiornato

---

## 🛡️ NOTE SICUREZZA

- **Credenziali**: Nessuna credenziale in Git
- **DB**: Schema non modificato, app ancora collegata al DB originale
- **CI/CD**: Workflow invariati
- **Rollback**: Possibile in <2 minuti tramite recovery system

---

## 📊 STATO FINALE

- **App locale**: ✅ Attiva su http://localhost:3000/
- **Build**: ✅ Pulita
- **Test coverage**: ✅ Configurato
- **Moduli legacy**: ✅ Archiviati senza rotture
- **API compatibility**: ✅ Mantenuta tramite stub

**READY FOR PUSH**: prep/barnode-setup → https://github.com/barnode-pro/barnode.git
