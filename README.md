# 🌟 BarNode - Applicazione Moderna

Una moderna applicazione full-stack React + Express progettata per offrire un'esperienza utente eccellente con un design pulito e funzionalità intuitive.

![BarNode Logo](./client/public/logo.png)

## 🚀 Quick Start

### Prerequisiti
- **Node.js** 18+ 
- **npm** 8+
- **PostgreSQL** 14+ (per database)

### Installazione e Avvio

```bash
# Clona il repository
git clone <repository-url>
cd barnode_main

# Installa dipendenze
npm install

# Configura environment
cp .env.example .env
# Modifica .env con le tue configurazioni

# Avvia in development
npm run dev
```

L'applicazione sarà disponibile su **http://localhost:5000**

## 🛠️ Comandi Disponibili

### Sviluppo
```bash
npm run dev          # Avvia server development
npm run build        # Build per produzione
npm run start        # Avvia server produzione
```

### Qualità Codice
```bash
npm run lint         # Controllo ESLint
npm run lint:fix     # Fix automatico errori
npm run format       # Formattazione Prettier
npm run format:check # Verifica formattazione
```

### Testing
```bash
npm run test         # Esegui tutti i test
npm run test:watch   # Test in modalità watch
npm run test:ui      # Interface grafica test
```

### Database
```bash
npm run db:push      # Sincronizza schema database
```

## 🏗️ Architettura

### Stack Tecnologico
- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Express.js + Node.js (ESM)
- **Database:** PostgreSQL + Drizzle ORM
- **Styling:** Tailwind CSS + Radix UI + Shadcn/ui
- **Testing:** Vitest + Testing Library
- **Linting:** ESLint + Prettier

### Struttura Progetto
```
barnode_main/
├── client/          # Frontend React
│   ├── src/
│   │   ├── app/     # Bootstrap e providers
│   │   ├── pages/   # Pagine applicazione
│   │   ├── components/ # Componenti riusabili
│   │   ├── hooks/   # Custom hooks
│   │   ├── services/ # API client e servizi
│   │   └── styles/  # Temi e stili globali
│   └── public/      # Asset statici
├── server/          # Backend Express
│   ├── routes/      # API endpoints
│   ├── db/          # Database e ORM
│   └── utils/       # Utilities e middleware
├── shared/          # Codice condiviso
│   └── types/       # Schemi e tipizzazioni
└── DOCS/           # Documentazione
```

## 🎨 Design System

### Palette Colori BarNode
- **Cream:** `#fef9e2` - Sfondi chiari e accenti
- **Mint:** `#afe4a2` - Stati positivi e highlight
- **Green:** `#145304` - Colore primario e brand

### Componenti UI
Utilizziamo **Shadcn/ui** basato su **Radix UI** per componenti accessibili e personalizzabili.

## 🧪 Testing

### Strategia Test
- **Unit Tests:** Componenti e funzioni isolate
- **Integration Tests:** Interazioni tra componenti
- **Smoke Tests:** Rendering base senza errori

### Convenzioni
- Test file: `ComponentName.test.tsx`
- Descrizioni in italiano
- Coverage minimo 70% per componenti core
- Mock delle dipendenze esterne

## 📚 Documentazione

### File Principali
- **[Architettura](./DOCS/ARCHITETTURA_BARNODE.md)** - Struttura e convenzioni complete
- **[Report Import](./DOCS/REPORT_IMPORT_BARNODE.md)** - Analisi progetto e pulizia Replit

### Convenzioni Codice
- **Componenti:** PascalCase (`HomePage.tsx`)
- **Hook:** useCamelCase (`useAuth.ts`)
- **Utilities:** camelCase (`apiClient.ts`)
- **Massimo 300-400 righe** per file

## 🔧 Configurazione Ambiente

### Variabili Environment (.env)
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

## 🚀 Deploy

### Build Produzione
```bash
npm run build
npm run start
```

### Verifica Build
- Client build in `dist/public/`
- Server build in `dist/index.js`
- Asset statici ottimizzati

## 🤝 Contribuire

### Workflow
1. Fork del repository
2. Crea branch feature (`git checkout -b feature/nuova-funzionalita`)
3. Sviluppa seguendo le convenzioni
4. Esegui test e linting
5. Commit con messaggi descrittivi
6. Push e crea Pull Request

### Standard Qualità
- ✅ Tutti i test passano
- ✅ Nessun errore ESLint
- ✅ Codice formattato con Prettier
- ✅ Build produzione funzionante

## 📄 Licenza

MIT License - vedi file [LICENSE](./LICENSE) per dettagli.

## 🆘 Supporto

Per problemi o domande:
1. Controlla la [documentazione](./DOCS/)
2. Cerca negli [issues esistenti](../../issues)
3. Crea un nuovo issue con template appropriato

---

**Sviluppato con ❤️ per un'esperienza utente moderna e intuitiva**
