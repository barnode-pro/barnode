/**
 * Helper per gestione file Excel (.xlsx)
 * Utilities per import prodotti da fogli di calcolo
 */

import XLSX from 'xlsx';

export interface ProdottoExcel {
  descrizione: string;
  categoria: string;
  fornitore: string;
  prezzo_acquisto: number | null;
  prezzo_vendita: number | null;
}

export interface ImportStats {
  righe_totali: number;
  righe_valide: number;
  righe_saltate: number;
  anomalie: string[];
}

/**
 * Legge file Excel e estrae dati prodotti dal foglio specificato
 */
export function leggiExcelProdotti(filePath: string, sheetName: string = 'prodotti'): {
  prodotti: ProdottoExcel[];
  stats: ImportStats;
} {
  const workbook = XLSX.readFile(filePath);
  
  if (!workbook.SheetNames.includes(sheetName)) {
    throw new Error(`Foglio '${sheetName}' non trovato. Fogli disponibili: ${workbook.SheetNames.join(', ')}`);
  }

  const worksheet = workbook.Sheets[sheetName];
  const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  if (rawData.length < 2) {
    throw new Error('File Excel vuoto o senza dati');
  }

  const headers = rawData[0] as string[];
  const rows = rawData.slice(1) as any[][];

  // Trova indici colonne (case-insensitive e flessibile)
  const colIndices = {
    descrizione: trovaColonna(headers, ['descrizione', 'nome', 'prodotto']),
    categoria: trovaColonna(headers, ['categoria', 'cat']),
    fornitore: trovaColonna(headers, ['fornitore', 'supplier']),
    prezzo_acquisto: trovaColonna(headers, ['prezzo acquisto', 'prezzo_acquisto', 'costo']),
    prezzo_vendita: trovaColonna(headers, ['prezzo vendita', 'prezzo_vendita', 'prezzo'])
  };

  const prodotti: ProdottoExcel[] = [];
  const stats: ImportStats = {
    righe_totali: rows.length,
    righe_valide: 0,
    righe_saltate: 0,
    anomalie: []
  };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const numeroRiga = i + 2; // +2 perché partiamo da riga 1 e saltiamo header

    try {
      const descrizione = normalizzaStringa(row[colIndices.descrizione]);
      
      // Salta righe senza descrizione
      if (!descrizione) {
        stats.righe_saltate++;
        if (stats.anomalie.length < 10) {
          stats.anomalie.push(`Riga ${numeroRiga}: Descrizione mancante`);
        }
        continue;
      }

      const categoria = normalizzaStringa(row[colIndices.categoria]) || '';
      const fornitore = normalizzaStringa(row[colIndices.fornitore]) || '';
      const prezzo_acquisto = normalizzaPrezzo(row[colIndices.prezzo_acquisto]);
      const prezzo_vendita = normalizzaPrezzo(row[colIndices.prezzo_vendita]);

      prodotti.push({
        descrizione,
        categoria,
        fornitore,
        prezzo_acquisto,
        prezzo_vendita
      });

      stats.righe_valide++;

    } catch (error) {
      stats.righe_saltate++;
      if (stats.anomalie.length < 10) {
        stats.anomalie.push(`Riga ${numeroRiga}: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
      }
    }
  }

  return { prodotti, stats };
}

/**
 * Trova l'indice di una colonna usando nomi alternativi
 */
function trovaColonna(headers: string[], nomiPossibili: string[]): number {
  for (const nome of nomiPossibili) {
    const index = headers.findIndex(h => 
      h && h.toLowerCase().trim() === nome.toLowerCase()
    );
    if (index !== -1) return index;
  }
  
  // Se non trova nessuna corrispondenza esatta, prova match parziale
  for (const nome of nomiPossibili) {
    const index = headers.findIndex(h => 
      h && h.toLowerCase().includes(nome.toLowerCase())
    );
    if (index !== -1) return index;
  }
  
  return -1; // Non trovato
}

/**
 * Normalizza stringhe: trim, collapse spazi multipli
 */
export function normalizzaStringa(value: any): string {
  if (value === null || value === undefined) return '';
  return String(value).trim().replace(/\s+/g, ' ');
}

/**
 * Normalizza prezzi: gestisce virgole, punti, valori non numerici
 */
export function normalizzaPrezzo(value: any): number | null {
  if (value === null || value === undefined || value === '') return null;
  
  // Converti a stringa e pulisci
  let str = String(value).trim();
  if (!str) return null;
  
  // Sostituisci virgola con punto per decimali
  str = str.replace(',', '.');
  
  // Rimuovi caratteri non numerici eccetto punto
  str = str.replace(/[^\d.-]/g, '');
  
  const num = parseFloat(str);
  
  // Verifica che sia un numero valido e positivo
  if (isNaN(num) || num < 0) return null;
  
  return Math.round(num * 100) / 100; // Arrotonda a 2 decimali
}
