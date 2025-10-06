import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import Icons from "unplugin-icons/vite";

/**
 * 🧩 GOVERNANCE ICONE BARNODE (STANDARD CASCADE)
 * 
 * Set principale: Tabler Icons (@iconify-json/tabler)
 * Set secondario: Lucide Icons (@iconify-json/lucide)
 * 
 * Stile standard:
 * - Dimensione: 24×24px
 * - Stroke: 2px
 * - Color: currentColor
 * - Linecap: round, linejoin: round
 * 
 * Uso: import IconName from '~icons/tabler/icon-name'
 * Fallback: import IconName from '~icons/lucide/icon-name'
 */

export default defineConfig({
  plugins: [
    react(),
    Icons({
      compiler: 'jsx',
      jsx: 'react',
      defaultStyle: 'width: 24px; height: 24px;',
      defaultClass: 'barnode-icon',
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
