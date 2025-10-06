# 🏗️ ARCHITETTURA BARNODE — STRUTTURA MODULARE DEFINITIVA

**Data:** 06 Ottobre 2025  
**Versione:** 1.0  
**Stato:** Struttura consolidata e pronta per sviluppo

---

## 📋 PANORAMICA ARCHITETTURALE

BarNode è un'applicazione moderna full-stack costruita con:
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** Express.js + Node.js (ESM) + Drizzle ORM
- **Database:** PostgreSQL
- **Testing:** Vitest + Testing Library
- **Styling:** Tailwind CSS + Radix UI + Shadcn/ui

---

## 🗂️ STRUTTURA CARTELLE DEFINITIVA

```
barnode_main/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── app/              # Inizializzazione app, providers, routing shell
│   │   │   ├── AppShell.tsx  # Contenitore principale applicazione
│   │   │   └── README.md     # Documentazione bootstrap
│   │   ├── pages/            # Sezioni principali dell'applicazione
│   │   │   ├── HomePage.tsx  # Pagina principale
│   │   │   ├── not-found.tsx # Pagina 404
│   │   │   └── README.md     # Convenzioni pagine
│   │   ├── components/       # Componenti UI riutilizzabili
│   │   │   ├── ui/          # Componenti base Shadcn/ui
│   │   │   ├── layout/      # Header, Footer, Sidebar
│   │   │   └── README.md    # Convenzioni componenti
│   │   ├── hooks/           # Custom hooks e logiche condivise
│   │   │   └── README.md    # Convenzioni hooks
│   │   ├── services/        # API client, storage, HTTP
│   │   │   └── README.md    # Convenzioni servizi
│   │   ├── styles/          # Temi, palette, stili globali
│   │   │   ├── globals.css  # Stili globali Tailwind
│   │   │   ├── theme.css    # Palette BarNode
│   │   │   └── README.md    # Convenzioni styling
│   │   └── test/            # Setup test e utilities
│   │       └── setup.ts     # Configurazione testing
│   ├── public/              # Asset statici
│   │   ├── logo.png         # Logo principale applicazione
│   │   └── home.png         # Icona PWA/installazione
│   └── index.html           # Entry point HTML
├── server/                  # Backend Express
│   ├── index.ts            # Entry point server
│   ├── routes/             # API modulari
│   │   ├── routes.ts       # Configurazione route principali
│   │   └── README.md       # Convenzioni API
│   ├── db/                 # Database e ORM
│   │   ├── storage.ts      # Interface storage
│   │   └── README.md       # Convenzioni database
│   └── utils/              # Helper e middleware
│       ├── vite.ts         # Integrazione Vite dev
├── shared/                 # Codice condiviso frontend/backend
│   └── types/              # Schemi e tipizzazioni
│       ├── schema.ts       # Schemi Zod validazione
│       ├── index.ts        # Export centralizzato
│       └── README.md       # Convenzioni tipi
├── DOCS/                   # Documentazione tecnica dettagliata
│   ├── ARCHITETTURA_BARNODE.md      # Questo documento
│   ├── ICONS_GUIDE.md               # Standard icone
│   ├── REPORT_IMPORT_BARNODE.md     # Report analisi import
│   └── REPORT_STEP_1.md             # Fondamenta modulari
├── INFO_PROGETTO/          # File informativi governance (CONSULTARE SEMPRE)
│   ├── STRUTTURA_PROGETTO.md        # Schema cartelle e navigazione
│   ├── FUNZIONALITÀ_APP.md          # Stato moduli e roadmap
│   ├── SETUP_TECNICO.md             # Stack e configurazioni
│   ├── STANDARD_GOVERNANCE.md       # Regole sviluppo (200 righe max)
│   ├── STATO_ATTUALE.md             # Snapshot corrente
│   └── README.md                    # Scopo cartella
│   └── ARCHITETTURA_BARNODE.md       # Questo documento
└── Configurazioni root
    ├── package.json        # Dipendenze e script
    ├── tsconfig.json       # Configurazione TypeScript
    ├── vite.config.ts      # Configurazione Vite
    ├── vitest.config.ts    # Configurazione test
    ├── tailwind.config.ts  # Configurazione Tailwind
    ├── .eslintrc.json      # Regole linting
    ├── .prettierrc         # Formattazione codice
    └── .env.example        # Template variabili ambiente
```

---

## 📝 CONVENZIONI DI NAMING

### File e Cartelle
- **Componenti React:** `PascalCase.tsx` (es. `HomePage.tsx`, `UserCard.tsx`)
- **Hook personalizzati:** `useCamelCase.ts` (es. `useAuth.ts`, `useLocalStorage.ts`)
- **Utilities/Services:** `camelCase.ts` (es. `apiClient.ts`, `formatUtils.ts`)
- **Cartelle:** `kebab-case` o `camelCase` consistente
- **File di test:** `ComponentName.test.tsx` o `functionName.test.ts`

### Variabili e Funzioni
- **Variabili:** `camelCase` (es. `userName`, `isLoading`)
- **Costanti:** `UPPER_SNAKE_CASE` (es. `API_BASE_URL`, `MAX_RETRY_COUNT`)
- **Componenti:** `PascalCase` (es. `UserProfile`, `OrderList`)
- **Interfacce TypeScript:** `PascalCase` con prefisso `I` opzionale (es. `User`, `IApiResponse`)

### CSS e Styling
- **Classi CSS:** Tailwind utility classes
- **Variabili CSS:** `--kebab-case` (es. `--bn-green`, `--primary-color`)

---

## 🔧 REGOLE DI MODULARITÀ

### Regole Modularità

- **Massimo 200 righe** per file (NUOVA POLICY)
- **Split obbligatorio** se superato
- **Eccezioni** solo per configurazioni complesse
- **Riferimento:** `INFO_PROGETTO/STANDARD_GOVERNANCE.md`

### Organizzazione Imports
```typescript
// 1. Import librerie esterne
import React from "react";
import { useState, useEffect } from "react";

// 2. Import interni assoluti (@/)
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

// 3. Import relativi
import "./ComponentName.css";
```

### Export Patterns
```typescript
// ✅ Named exports preferiti
export const ComponentName = () => { ... };
export { ComponentName };

// ✅ Default export solo per pagine
export default HomePage;

// ✅ Barrel exports per cartelle
// components/index.ts
export { Button } from "./ui/button";
export { Header } from "./layout/Header";
```

---

## 🎨 SISTEMA DI DESIGN

### Palette Colori BarNode
```css
/* Colori Brand Primari */
--bn-cream: #fef9e2;    /* Sfondo chiaro, accenti */
--bn-mint: #afe4a2;     /* Accenti, stati positivi */
--bn-green: #145304;    /* Primario, CTA, brand */

/* Variazioni Tonali */
--bn-cream-light: #fffef7;
--bn-cream-dark: #f5f0c8;
--bn-mint-light: #c8f0bb;
--bn-mint-dark: #96d889;
--bn-green-light: #1e7006;
--bn-green-dark: #0f3f02;
```

### Tipografia
- **Font principale:** Sistema font stack (Inter, system-ui)
- **Font mono:** JetBrains Mono per codice
- **Scale tipografica:** Tailwind default (text-sm, text-base, text-lg, etc.)

### Componenti UI
- **Base:** Radix UI headless components
- **Styling:** Shadcn/ui + Tailwind CSS
- **Customizzazione:** Variabili CSS per theming

---

## 🧪 STANDARD TESTING

### Struttura Test
```typescript
// HomePage.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HomePage from "./HomePage";

describe("HomePage", () => {
  it("dovrebbe renderizzare il titolo", () => {
    render(<HomePage />);
    expect(screen.getByTestId("title")).toBeInTheDocument();
  });
});
```

### Convenzioni Test
- **Un file test per componente/funzione**
- **Descrizioni in italiano**
- **Test ID per elementi critici** (`data-testid`)
- **Mock delle dipendenze esterne**
- **Coverage minimo 70% per componenti core**

### Tipi di Test
- **Unit:** Componenti isolati, funzioni pure
- **Integration:** Interazioni tra componenti
- **Smoke:** Rendering base senza errori
- **E2E:** Flussi utente critici (futuro)

---

## 🔌 GESTIONE STATO

### State Management
- **Locale:** `useState`, `useReducer` per stato componente
- **Globale:** Context API per stato condiviso semplice
- **Server:** TanStack Query per cache e sincronizzazione
- **Form:** React Hook Form + Zod validation

### Pattern Consigliati
```typescript
// Custom hook per logica complessa
export const useUserData = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Logica fetch e gestione stato
  
  return { user, loading, refetch };
};

// Context per stato globale
export const ThemeContext = createContext<ThemeContextType>();
```

---

## 🌐 API E COMUNICAZIONE

### Struttura API
- **Base URL:** `/api/v1/`
- **Autenticazione:** JWT tokens
- **Formato:** JSON request/response
- **Validazione:** Zod schemas condivisi

### Client API
```typescript
// services/apiClient.ts
export const apiClient = {
  get: <T>(url: string) => Promise<T>,
  post: <T>(url: string, data: unknown) => Promise<T>,
  // ... altri metodi
};

// Uso nei componenti
const { data, error, isLoading } = useQuery({
  queryKey: ['users', userId],
  queryFn: () => apiClient.get<User>(`/users/${userId}`)
});
```

---

## 📚 DOCUMENTAZIONE

### JSDoc Standard
```typescript
/**
 * Componente per visualizzare informazioni utente
 * @param user - Dati utente da visualizzare
 * @param onEdit - Callback per modifica utente
 * @returns Componente React renderizzato
 */
export const UserCard = ({ user, onEdit }: UserCardProps) => {
  // ...
};
```

### README Structure
Ogni cartella deve contenere un `README.md` con:
- **Scopo** della cartella
- **Convenzioni** specifiche
- **Esempi** di utilizzo
- **Link** a documentazione correlata

---

## 🚀 SCRIPT DI SVILUPPO

### Comandi Principali
```bash
# Sviluppo
npm run dev          # Avvia server development (localhost:5000)

# Build e Deploy
npm run build        # Build produzione (client + server)
npm run start        # Avvia server produzione

# Qualità Codice
npm run lint         # Controllo ESLint
npm run lint:fix     # Fix automatico ESLint
npm run format       # Formattazione Prettier
npm run format:check # Controllo formattazione

# Testing
npm run test         # Esegui tutti i test
npm run test:watch   # Test in modalità watch
npm run test:ui      # Interface grafica test

# Database
npm run db:push      # Sincronizza schema database
```

### Workflow Sviluppo
1. **Checkout** branch feature
2. **Sviluppo** con `npm run dev`
3. **Test** con `npm run test`
4. **Lint** con `npm run lint:fix`
5. **Format** con `npm run format`
6. **Build** con `npm run build`
7. **Commit** e push

---

## 🔒 SICUREZZA E BEST PRACTICES

### Sicurezza
- **Validazione input** con Zod su client e server
- **Sanitizzazione** dati utente
- **HTTPS** in produzione
- **Environment variables** per secrets
- **CORS** configurato correttamente

### Performance
- **Code splitting** con Vite
- **Lazy loading** per route e componenti pesanti
- **Memoizzazione** con `useMemo`, `useCallback`
- **Ottimizzazione bundle** con analyzer

### Accessibilità
- **Semantic HTML** sempre
- **ARIA labels** per elementi interattivi
- **Contrasto colori** conforme WCAG
- **Navigazione keyboard** supportata
- **Screen reader** compatibile

---

## 📈 METRICHE E MONITORING

### Metriche Sviluppo
- **Bundle size:** < 500KB gzipped
- **Test coverage:** > 70%
- **Build time:** < 2 minuti
- **Lint errors:** 0 errori, warning minimizzati

### Performance Goals
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- **Time to Interactive:** < 3s

---

## 🔮 ROADMAP TECNICA

### Prossime Implementazioni
1. **PWA completa** con service worker
2. **Storybook** per documentazione componenti
3. **Husky + lint-staged** per pre-commit hooks
4. **GitHub Actions** CI/CD pipeline
5. **Bundle analyzer** e ottimizzazioni
6. **E2E testing** con Playwright
7. **Docker** containerization
8. **Monitoring** con Sentry/LogRocket

### Evoluzioni Architetturali
- **Micro-frontends** per scalabilità
- **GraphQL** per API più efficienti
- **Server-side rendering** con Next.js
- **Real-time** con WebSockets
- **Offline-first** con service workers

---

**Documento generato automaticamente**  
**Percorso:** `/Users/dero/Documents/barnode_main/DOCS/ARCHITETTURA_BARNODE.md`  
**Ultimo aggiornamento:** 06 Ottobre 2025
