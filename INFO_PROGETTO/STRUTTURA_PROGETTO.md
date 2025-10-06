# 🏗️ STRUTTURA PROGETTO BARNODE

**Data:** 06 Ottobre 2025  
**Versione:** 1.0  
**Limite:** 200 righe per file

---

## 📂 SCHEMA COMPLETO CARTELLE

```
barnode_main/
├── client/                    # Frontend React + TypeScript
│   ├── public/               # Asset statici (logo, manifest PWA)
│   └── src/
│       ├── app/              # Bootstrap app, providers, AppShell
│       ├── pages/            # Pagine principali (Home, Articoli, Ordini)
│       ├── components/       # Componenti UI riusabili + layout
│       ├── hooks/            # Custom hooks React
│       ├── services/         # API client, WhatsApp, storage
│       ├── styles/           # CSS globali, tema BarNode
│       ├── types/            # Definizioni TypeScript client
│       └── test/             # Setup test e utilities
├── server/                   # Backend Express + Node.js
│   ├── index.ts             # Entry point server principale
│   ├── routes/              # API endpoints modulari
│   ├── db/                  # Database, ORM, storage
│   └── utils/               # Middleware, helper, Vite integration
├── shared/                  # Codice condiviso frontend/backend
│   └── types/               # Schemi Zod, validazioni comuni
├── scripts/                 # Automazioni progetto
│   └── backup-system.js     # Sistema backup con rotazione
├── DOCS/                    # Documentazione tecnica
│   ├── ARCHITETTURA_BARNODE.md    # Convenzioni sviluppo
│   ├── ICONS_GUIDE.md             # Standard icone Tabler/Lucide
│   ├── REPORT_IMPORT_BARNODE.md   # Storia import da Replit
│   └── REPORT_STEP_1.md           # Fondamenta modulari
├── INFO_PROGETTO/           # File informativi governance
│   ├── STRUTTURA_PROGETTO.md      # Questo file
│   ├── FUNZIONALITÀ_APP.md        # Moduli e stato avanzamento
│   ├── SETUP_TECNICO.md           # Stack e configurazioni
│   ├── STANDARD_GOVERNANCE.md     # Regole sviluppo
│   ├── STATO_ATTUALE.md           # Snapshot corrente
│   └── README.md                  # Scopo cartella
├── Backup_Automatico/       # Backup con rotazione (max 3)
└── Configurazioni root
    ├── package.json         # Dipendenze, script npm
    ├── vite.config.ts       # Build tool + governance icone
    ├── tsconfig.json        # TypeScript configurazione
    ├── tailwind.config.ts   # Styling + palette BarNode
    ├── eslint.config.js     # Linting regole
    ├── .prettierrc          # Formattazione codice
    ├── .env.example         # Template variabili ambiente
    └── .gitignore           # File esclusi da Git
```

---

## 🎯 DIRECTORY PRINCIPALI

### Frontend (`client/`)
- **`public/`** - Logo, manifest PWA, favicon
- **`src/app/`** - AppShell, routing, provider globali
- **`src/pages/`** - Home, Articoli, Fornitori, Ordini, Ricezione, 404
- **`src/components/`** - UI Shadcn/ui, layout Header/BottomNav
- **`src/services/`** - API client, WhatsApp link builder
- **`src/styles/`** - Globals CSS, tema colori BarNode

### Backend (`server/`)
- **`routes/`** - API REST endpoints modulari
- **`db/`** - Drizzle ORM, storage interface
- **`utils/`** - Middleware Express, Vite dev integration

### Condiviso (`shared/`)
- **`types/`** - Schemi Zod per validazione runtime

### Automazioni (`scripts/`)
- **`backup-system.js`** - Backup automatico con rotazione

### Documentazione (`DOCS/`)
- **Architettura** - Convenzioni sviluppo complete
- **Report** - Storia progetto e milestone

### Governance (`INFO_PROGETTO/`)
- **File informativi** - Struttura, funzionalità, setup
- **Standard** - Regole sviluppo e governance

---

## 🗺️ MAPPA RELAZIONI

### Frontend → Backend
- `client/src/services/apiClient.ts` → `server/routes/`
- `client/src/types/` ← `shared/types/`
- `client/src/services/whatsapp.ts` → Link esterni

### Sviluppo → Produzione
- `npm run dev` → Server development (localhost:5000)
- `npm run build` → Bundle client + server
- `npm run start` → Produzione

### Test → Qualità
- `client/src/test/` → Setup Vitest
- `*.test.tsx` → Test smoke pagine/componenti
- `eslint.config.js` → Linting regole

---

## 📍 PUNTI CHIAVE NAVIGAZIONE

### Dove trovare...
- **API endpoints:** `server/routes/`
- **Componenti UI:** `client/src/components/`
- **Pagine app:** `client/src/pages/`
- **Stili tema:** `client/src/styles/theme.css`
- **Test:** File `*.test.tsx` accanto ai componenti
- **Backup:** `Backup_Automatico/` (auto-gestito)
- **Documentazione:** `DOCS/` + `INFO_PROGETTO/`

### Configurazioni critiche
- **Build:** `vite.config.ts` (+ governance icone)
- **Database:** `drizzle.config.ts`
- **Styling:** `tailwind.config.ts` (palette BarNode)
- **TypeScript:** `tsconfig.json` (path aliases)
- **Environment:** `.env.example` (template)

---

**File generato automaticamente**  
**Percorso:** `INFO_PROGETTO/STRUTTURA_PROGETTO.md`  
**Consultazione:** Prima di modifiche strutturali
