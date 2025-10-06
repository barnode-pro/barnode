# ⚙️ SETUP TECNICO BARNODE

**Data:** 06 Ottobre 2025  
**Versione:** 1.0  
**Limite:** 200 righe per file

---

## 🛠️ STACK COMPLETO

### Frontend
- **React:** 18.3.1 (JSX, Hooks, Context)
- **TypeScript:** 5.6.3 (Strict mode attivo)
- **Vite:** 5.4.20 (Build tool, dev server)
- **Tailwind CSS:** 3.4.17 (Utility-first styling)
- **Radix UI + Shadcn/ui:** Componenti accessibili
- **Wouter:** 3.3.5 (Client-side routing)
- **TanStack Query:** 5.60.5 (Server state management)

### Backend
- **Node.js:** 20+ (ESM modules)
- **Express.js:** 4.21.2 (Web framework)
- **TypeScript:** 5.6.3 (Backend tipizzato)
- **Drizzle ORM:** 0.39.1 (Database ORM)
- **PostgreSQL:** 14+ (Database principale)

### Sviluppo e Qualità
- **ESLint:** 9.37.0 (Linting)
- **Prettier:** 3.x (Code formatting)
- **Vitest:** 3.2.4 (Testing framework)
- **Testing Library:** React testing utilities

### Icone e Asset
- **unplugin-icons:** Sistema icone unificato
- **Tabler Icons:** Set principale (24×24px, stroke 2px)
- **Lucide Icons:** Set fallback

---

## 🚀 COMANDI SVILUPPO

### Ambiente Locale
```bash
# Installazione dipendenze
npm install

# Avvio development (localhost:5000)
npm run dev

# Build produzione
npm run build

# Avvio produzione
npm run start
```

### Qualità Codice
```bash
# Linting
npm run lint
npm run lint:fix

# Formattazione
npm run format
npm run format:check

# Test
npm run test
npm run test:watch
npm run test:ui
```

### Database
```bash
# Sincronizza schema
npm run db:push

# Type checking
npm run check
```

### Backup Sistema
```bash
# Backup automatico
npm run backup

# Lista backup
npm run backup:list

# Ripristino
npm run backup:restore
npm run restore-confirm <nome-backup>
```

---

## 🌐 CONFIGURAZIONE AMBIENTE

### Variabili (.env)
```bash
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/barnode

# Session
SESSION_SECRET=your-secret-key

# Development
VITE_API_URL=http://localhost:5000/api
```

### Porte e URL
- **Development:** http://localhost:5000
- **API Base:** /api/v1/
- **Database:** localhost:5432 (PostgreSQL)

---

## 🧪 TESTING

### Framework
- **Vitest:** Test runner principale
- **Testing Library:** React component testing
- **jsdom:** Browser environment simulation

### Configurazione
- **Setup:** `client/src/test/setup.ts`
- **Config:** `vitest.config.ts`
- **Coverage:** Smoke test per tutte le pagine

### Test Attuali
- 13 test smoke implementati
- Copertura: HomePage, ArticoliPage, OrdiniPage, NotFoundPage, BottomNav
- Tutti i test passanti ✅

---

## 💾 SISTEMA BACKUP

### Caratteristiche
- **Rotazione:** Mantiene max 3 backup
- **Esclusioni:** node_modules, .git, dist, build
- **Formato:** .tar.gz con timestamp
- **Log:** Operazioni registrate in backup.log
- **Integrità:** Verifica checksum SHA256

### Automazione
- Backup automatico prima di ogni ripristino
- Comando manuale disponibile
- Gestione errori e rollback

---

## 🔒 SICUREZZA

### Validazione
- **Zod schemas:** Validazione runtime client/server
- **TypeScript:** Type safety compile-time
- **ESLint:** Regole sicurezza codice

### Environment
- **Variables:** Template in .env.example
- **Secrets:** Mai committati in Git
- **Session:** Configurazione sicura

---

## 📱 PWA CONFIGURATION

### Manifest
- **File:** `client/public/manifest.json`
- **Icone:** logo.png (app) + home.png (installazione)
- **Tema:** Colori BarNode (#145304, #fef9e2)
- **Display:** Standalone mode

### Meta Tags
- **Theme color:** #145304 (verde BarNode)
- **Viewport:** Responsive ottimizzato
- **Apple touch icon:** Supporto iOS

---

## 🎨 STYLING SYSTEM

### Tailwind Configuration
- **Config:** `tailwind.config.ts`
- **Palette BarNode:** Integrata in CSS variables
- **Responsive:** Mobile-first approach
- **Dark mode:** Supportato

### CSS Structure
- **Globals:** `client/src/styles/globals.css`
- **Theme:** `client/src/styles/theme.css`
- **Components:** Utility classes Tailwind

---

## 📦 BUILD E DEPLOY

### Produzione
- **Client bundle:** ~268 kB (87 kB gzipped)
- **Server bundle:** ~4.5 kB
- **Ottimizzazioni:** Tree-shaking, code splitting
- **Asset:** Ottimizzazione automatica

### Performance
- **Build time:** ~2 secondi
- **Hot reload:** < 100ms
- **Bundle analysis:** Disponibile

---

**File generato automaticamente**  
**Percorso:** `INFO_PROGETTO/SETUP_TECNICO.md`  
**Riferimento:** Per setup ambiente e troubleshooting
