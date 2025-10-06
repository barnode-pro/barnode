# 🧩 GUIDA ICONE BARNODE — STANDARD CASCADE

**Data:** 06 Ottobre 2025  
**Versione:** 1.0  
**Standard:** Tabler Icons (principale) + Lucide Icons (fallback)

---

## 🎯 GOVERNANCE ICONE

### Set di Icone Ufficiali
- **🥇 Set Principale:** [Tabler Icons](https://tabler-icons.io/) (`@iconify-json/tabler`)
- **🥈 Set Secondario:** [Lucide Icons](https://lucide.dev/) (`@iconify-json/lucide`)

### Stile Visivo Standard
- **Dimensione:** 24×24px (default)
- **Stroke:** 2px
- **Color:** `currentColor` (eredita dal parent)
- **Linecap:** round
- **Linejoin:** round
- **Classe CSS:** `barnode-icon` (applicata automaticamente)

---

## 🛠️ CONFIGURAZIONE TECNICA

### Vite Configuration
```typescript
// vite.config.ts
import Icons from "unplugin-icons/vite";

export default defineConfig({
  plugins: [
    Icons({
      compiler: 'jsx',
      jsx: 'react',
      defaultStyle: 'width: 24px; height: 24px;',
      defaultClass: 'barnode-icon',
    }),
  ],
});
```

### TypeScript Support
```typescript
// client/src/types/icons.d.ts
declare module '~icons/*' {
  import { ComponentType, SVGProps } from 'react';
  const component: ComponentType<SVGProps<SVGSVGElement>>;
  export default component;
}
```

---

## 📖 UTILIZZO PRATICO

### Import Standard (Tabler Icons)
```typescript
// ✅ Preferito - Tabler Icons
import HomeIcon from "~icons/tabler/home";
import PackageIcon from "~icons/tabler/package";
import ShoppingCartIcon from "~icons/tabler/shopping-cart";
import MenuIcon from "~icons/tabler/menu-2";
import SunIcon from "~icons/tabler/sun";
import MoonIcon from "~icons/tabler/moon";
```

### Import Fallback (Lucide Icons)
```typescript
// ⚠️ Solo se non disponibile in Tabler
import SpecialIcon from "~icons/lucide/special-icon";
```

### Utilizzo nei Componenti
```typescript
// Esempio: BottomNav
const navItems = [
  { path: "/", label: "Home", icon: HomeIcon },
  { path: "/articoli", label: "Articoli", icon: PackageIcon },
  { path: "/ordini", label: "Ordini", icon: ShoppingCartIcon },
];

// Rendering
<Icon className="h-5 w-5 text-primary" />
```

---

## 🎨 STYLING E PERSONALIZZAZIONE

### Classi CSS Standard
```css
/* Applicata automaticamente */
.barnode-icon {
  width: 24px;
  height: 24px;
  stroke-width: 2px;
  stroke-linecap: round;
  stroke-linejoin: round;
}
```

### Variazioni di Dimensione
```typescript
// Piccola (16px)
<Icon className="h-4 w-4" />

// Standard (20px)
<Icon className="h-5 w-5" />

// Media (24px) - default
<Icon className="h-6 w-6" />

// Grande (32px)
<Icon className="h-8 w-8" />
```

### Colori Tematici
```typescript
// Colore primario BarNode
<Icon className="h-5 w-5 text-primary" />

// Colore foreground (testo normale)
<Icon className="h-5 w-5 text-foreground" />

// Colore muted (testo secondario)
<Icon className="h-5 w-5 text-muted-foreground" />

// Colore specifico
<Icon className="h-5 w-5 text-bn-green" />
```

---

## 📋 ICONE STANDARD BARNODE

### Navigazione
| Icona | Import | Uso |
|-------|--------|-----|
| 🏠 | `~icons/tabler/home` | Homepage, Dashboard |
| 📦 | `~icons/tabler/package` | Articoli, Inventario |
| 🛒 | `~icons/tabler/shopping-cart` | Ordini, Carrello |
| 🏢 | `~icons/tabler/building-store` | Fornitori |
| 📥 | `~icons/tabler/package-import` | Ricezione |

### UI Controls
| Icona | Import | Uso |
|-------|--------|-----|
| ☰ | `~icons/tabler/menu-2` | Menu mobile |
| ☀️ | `~icons/tabler/sun` | Tema chiaro |
| 🌙 | `~icons/tabler/moon` | Tema scuro |
| ⚙️ | `~icons/tabler/settings` | Impostazioni |
| 👤 | `~icons/tabler/user` | Profilo utente |

### Azioni
| Icona | Import | Uso |
|-------|--------|-----|
| ➕ | `~icons/tabler/plus` | Aggiungi |
| ✏️ | `~icons/tabler/edit` | Modifica |
| 🗑️ | `~icons/tabler/trash` | Elimina |
| 💾 | `~icons/tabler/device-floppy` | Salva |
| ↻ | `~icons/tabler/refresh` | Aggiorna |

### Stati e Feedback
| Icona | Import | Uso |
|-------|--------|-----|
| ✅ | `~icons/tabler/check` | Successo |
| ❌ | `~icons/tabler/x` | Errore, Chiudi |
| ⚠️ | `~icons/tabler/alert-triangle` | Attenzione |
| ℹ️ | `~icons/tabler/info-circle` | Informazione |
| 📱 | `~icons/tabler/brand-whatsapp` | WhatsApp |

---

## 🔍 RICERCA ICONE

### Tabler Icons
- **Sito:** https://tabler-icons.io/
- **Ricerca:** Usa il search per trovare icone
- **Naming:** Converti da kebab-case (`icon-name`) a import (`~icons/tabler/icon-name`)

### Lucide Icons (Fallback)
- **Sito:** https://lucide.dev/icons/
- **Ricerca:** Cerca solo se non disponibile in Tabler
- **Import:** `~icons/lucide/icon-name`

---

## ✅ BEST PRACTICES

### DO ✅
- Usa sempre Tabler Icons come prima scelta
- Mantieni dimensioni consistenti (h-5 w-5 per UI standard)
- Usa `currentColor` per ereditare il colore del parent
- Applica classi Tailwind per dimensioni responsive
- Documenta icone custom nel progetto

### DON'T ❌
- Non mescolare set di icone nello stesso componente
- Non hardcodare colori nelle icone
- Non usare dimensioni inconsistenti
- Non importare icone non utilizzate
- Non usare icone troppo complesse per UI piccole

---

## 🧪 TESTING

### Test delle Icone
```typescript
// Verifica presenza icona
expect(screen.getByRole('button')).toContainElement(
  screen.getByLabelText('Home')
);

// Test accessibilità
expect(icon).toHaveAttribute('aria-hidden', 'true');
```

---

## 🚀 ESEMPI PRATICI

### Componente con Icona
```typescript
import HomeIcon from "~icons/tabler/home";

export function HomeButton() {
  return (
    <button className="flex items-center gap-2 px-4 py-2 rounded-lg">
      <HomeIcon className="h-5 w-5 text-primary" />
      <span>Home</span>
    </button>
  );
}
```

### Lista con Icone
```typescript
const menuItems = [
  { icon: HomeIcon, label: "Dashboard", path: "/" },
  { icon: PackageIcon, label: "Articoli", path: "/articoli" },
  { icon: ShoppingCartIcon, label: "Ordini", path: "/ordini" },
];
```

---

## 📊 METRICHE E PERFORMANCE

### Bundle Impact
- **Tabler Icons:** ~2KB per icona (tree-shaking attivo)
- **Lucide Icons:** ~1.5KB per icona
- **Ottimizzazione:** Solo icone utilizzate vengono incluse nel bundle

### Caricamento
- **Lazy Loading:** Icone caricate on-demand
- **Tree Shaking:** Bundle contiene solo icone importate
- **SVG Inline:** Nessuna richiesta HTTP aggiuntiva

---

**Guida creata automaticamente**  
**Percorso:** `/Users/dero/Documents/barnode_main/DOCS/ICONS_GUIDE.md`  
**Standard:** Tabler Icons (principale) + Lucide Icons (fallback)
