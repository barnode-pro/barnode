/**
 * Servizio per export CSV
 * Serializza dataset correnti in formato CSV per download
 */

export interface ExportableData {
  [key: string]: any;
}

/**
 * Converte array di oggetti in CSV
 */
export function arrayToCsv(data: ExportableData[], headers?: string[]): string {
  if (data.length === 0) return '';
  
  // Usa headers forniti o estrae dalle chiavi del primo oggetto
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Header CSV
  const headerRow = csvHeaders.map(escapeCSVField).join(',');
  
  // Righe dati
  const dataRows = data.map(row => 
    csvHeaders.map(header => escapeCSVField(row[header] ?? '')).join(',')
  );
  
  return [headerRow, ...dataRows].join('\n');
}

/**
 * Escape campo CSV (gestisce virgole, virgolette, newline)
 */
function escapeCSVField(field: any): string {
  const str = String(field ?? '');
  
  // Se contiene virgole, virgolette o newline, racchiudi tra virgolette
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  
  return str;
}

/**
 * Scarica CSV come file
 */
export function downloadCsv(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Export articoli in CSV - Solo 3 campi essenziali
 */
export function exportArticoliToCsv(articoli: any[], filename?: string): void {
  const headers = ['Nome', 'Categoria', 'Fornitore'];
  
  // Trasforma dati per export
  const exportData = articoli.map(articolo => ({
    Nome: articolo.nome,
    Categoria: articolo.categoria || '',
    Fornitore: articolo.fornitore?.nome || ''
  }));
  
  const csv = arrayToCsv(exportData, headers);
  const fileName = filename || `articoli_${new Date().toISOString().split('T')[0]}.csv`;
  
  downloadCsv(csv, fileName);
}

/**
 * Export fornitori in CSV
 */
export function exportFornitoriToCsv(fornitori: any[], filename?: string): void {
  const headers = ['nome', 'whatsapp', 'email', 'note'];
  
  const exportData = fornitori.map(fornitore => ({
    nome: fornitore.nome,
    whatsapp: fornitore.whatsapp || '',
    email: fornitore.email || '',
    note: fornitore.note || ''
  }));
  
  const csv = arrayToCsv(exportData, headers);
  const fileName = filename || `fornitori_${new Date().toISOString().split('T')[0]}.csv`;
  
  downloadCsv(csv, fileName);
}

/**
 * Export ordini in CSV
 */
export function exportOrdiniToCsv(ordini: any[], filename?: string): void {
  const headers = ['data', 'fornitore', 'stato', 'note'];
  
  const exportData = ordini.map(ordine => ({
    data: ordine.data,
    fornitore: ordine.fornitore?.nome || '',
    stato: ordine.stato,
    note: ordine.note || ''
  }));
  
  const csv = arrayToCsv(exportData, headers);
  const fileName = filename || `ordini_${new Date().toISOString().split('T')[0]}.csv`;
  
  downloadCsv(csv, fileName);
}
