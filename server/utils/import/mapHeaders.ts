/**
 * Utilità per mapping headers CSV/Excel con sinonimi
 * Estratto da import.routes.ts per rispettare governance ≤200 righe
 */

import { logger } from '../logger.ts';

// Mapping colonne con sinonimi (case-insensitive) - Allineato alla documentazione
export const COLUMN_MAPPINGS = {
  nome: ['nome prodotto', 'nome', 'descrizione', 'prodotto'],
  categoria: ['categoria', 'reparto'],
  fornitore: ['fornitore', 'supplier', 'marca'],
  prezzo_acquisto: ['prezzo acquisto', 'acquisto', 'costo', "prezzo d'acquisto"],
  prezzo_vendita: ['prezzo vendita', 'vendita', 'listino', 'prezzo']
};

export interface ParsedProduct {
  nome: string;
  categoria: string | null;
  fornitore: string;
  prezzo_acquisto: number | null;
  prezzo_vendita: number | null;
}

// Flag debug per log dettagliati
const isDebugMode = () => process.env.DEBUG_IMPORT === 'true' || process.env.NODE_ENV !== 'production';

/**
 * Log debug condizionale
 */
function debugLog(message: string, data?: any) {
  if (isDebugMode()) {
    logger.info(message, data);
  }
}

/**
 * Normalizza prezzo: rimuove €, spazi, separatori migliaia, converte virgola in punto
 */
export function parsePrezzo(input: string | number | null): number | null {
  if (!input || input === '') return null;
  
  let str = String(input).trim();
  if (!str) return null;
  
  // Rimuove simboli e spazi
  str = str.replace(/[€$\s]/g, '');
  
  // Se contiene sia virgola che punto, assume che il punto sia separatore migliaia
  if (str.includes(',') && str.includes('.')) {
    const lastComma = str.lastIndexOf(',');
    const lastDot = str.lastIndexOf('.');
    
    if (lastComma > lastDot) {
      // Virgola è decimale: 1.234,56
      str = str.replace(/\./g, '').replace(',', '.');
    } else {
      // Punto è decimale: 1,234.56
      str = str.replace(/,/g, '');
    }
  } else if (str.includes(',')) {
    // Solo virgola: assume decimale
    str = str.replace(',', '.');
  }
  
  const num = parseFloat(str);
  return isNaN(num) ? null : num;
}

/**
 * Mappa headers con sinonimi case-insensitive e normalizzazione migliorata
 */
export function mapHeaders(row: Record<string, any>): ParsedProduct | null {
  const originalHeaders = Object.keys(row);
  const normalizedHeaders = originalHeaders.map(h => h.toLowerCase().trim());
  
  debugLog('🔍 Mapping headers', { originalHeaders, normalizedHeaders });
  
  // Trova colonna nome (obbligatoria)
  const nomeKey = originalHeaders.find(key => 
    COLUMN_MAPPINGS.nome.includes(key.toLowerCase().trim())
  );
  
  if (!nomeKey || !row[nomeKey]) {
    debugLog('❌ Nome column not found or empty', { nomeKey, availableHeaders: originalHeaders });
    return null;
  }
  
  // Trova altre colonne
  const categoriaKey = originalHeaders.find(key => 
    COLUMN_MAPPINGS.categoria.includes(key.toLowerCase().trim())
  );
  
  const fornitoreKey = originalHeaders.find(key => 
    COLUMN_MAPPINGS.fornitore.includes(key.toLowerCase().trim())
  );
  
  const prezzoAcquistoKey = originalHeaders.find(key => 
    COLUMN_MAPPINGS.prezzo_acquisto.includes(key.toLowerCase().trim())
  );
  
  const prezzoVenditaKey = originalHeaders.find(key => 
    COLUMN_MAPPINGS.prezzo_vendita.includes(key.toLowerCase().trim())
  );
  
  const mappedProduct = {
    nome: String(row[nomeKey]).trim().replace(/\s+/g, ' '),
    categoria: categoriaKey ? String(row[categoriaKey]).trim() || null : null,
    fornitore: fornitoreKey ? String(row[fornitoreKey]).trim() || 'Fornitore Generico' : 'Fornitore Generico',
    prezzo_acquisto: prezzoAcquistoKey ? parsePrezzo(row[prezzoAcquistoKey]) : null,
    prezzo_vendita: prezzoVenditaKey ? parsePrezzo(row[prezzoVenditaKey]) : null
  };
  
  debugLog('✅ Product mapped', { 
    foundKeys: { nomeKey, categoriaKey, fornitoreKey, prezzoAcquistoKey, prezzoVenditaKey },
    mappedProduct 
  });
  
  return mappedProduct;
}

/**
 * Log normalizzazione prezzi per debug della prima riga
 */
export function logFirstRowPriceNormalization(row: Record<string, any>, product: ParsedProduct) {
  if (!isDebugMode()) return;
  
  const prezzoAcquistoKey = Object.keys(row).find(key => 
    COLUMN_MAPPINGS.prezzo_acquisto.includes(key.toLowerCase().trim())
  );
  const prezzoVenditaKey = Object.keys(row).find(key => 
    COLUMN_MAPPINGS.prezzo_vendita.includes(key.toLowerCase().trim())
  );
  
  if (prezzoAcquistoKey || prezzoVenditaKey) {
    debugLog('💰 Price normalization (first row)', {
      prezzo_acquisto: {
        original: prezzoAcquistoKey ? row[prezzoAcquistoKey] : 'N/A',
        parsed: product.prezzo_acquisto
      },
      prezzo_vendita: {
        original: prezzoVenditaKey ? row[prezzoVenditaKey] : 'N/A', 
        parsed: product.prezzo_vendita
      }
    });
  }
}

export { isDebugMode, debugLog };
