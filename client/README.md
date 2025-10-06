# 🚀 BarNode Client - Avvio Locale

## 📋 Comandi Operativi

### **Avvio Server Backend**
```bash
npm run dev:server
# Avvia Express.js su http://localhost:3001
# API disponibili su /api/v1/*
```

### **Avvio Client Frontend**
```bash
npm run dev
# Avvia Vite dev server su http://localhost:5173
# Hot reload attivo per sviluppo
```

### **Preview Build**
```bash
npm run preview
# Anteprima build produzione su http://localhost:5173
```

## 🔗 Configurazione API Proxy

Il client Vite è configurato con proxy automatico:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001
- **Proxy:** `/api/v1/*` → `http://localhost:3001/api/v1/*`

## 🛠️ Sviluppo Locale

1. **Avvia server backend:**
   ```bash
   npm run dev:server
   ```

2. **Avvia client frontend (in terminale separato):**
   ```bash
   npm run dev
   ```

3. **Apri browser:** http://localhost:5173

Le chiamate API dal frontend vengono automaticamente proxate al backend senza configurazione aggiuntiva.
