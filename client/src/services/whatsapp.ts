import type { OrdineCompleto } from './ordini.service';

/**
 * Servizio per la generazione di link WhatsApp
 * Costruisce messaggi formattati per l'invio ordini ai fornitori
 */

/**
 * Genera un link WhatsApp per inviare un ordine al fornitore
 */
export function generaLinkWhatsApp(ordine: OrdineCompleto): string {
  if (!ordine.fornitore.whatsapp) {
    throw new Error('Numero WhatsApp del fornitore non disponibile');
  }
  
  const numeroWhatsApp = ordine.fornitore.whatsapp.replace(/\D/g, '');
  const messaggio = generaMessaggioOrdine(ordine);
  const messaggioCodificato = encodeURIComponent(messaggio);
  
  // TODO: Validare numero WhatsApp e gestire formati internazionali
  return `https://wa.me/${numeroWhatsApp}?text=${messaggioCodificato}`;
}

/**
 * Genera il testo del messaggio per l'ordine
 */
function generaMessaggioOrdine(ordine: OrdineCompleto): string {
  const dataFormattata = new Date(ordine.data).toLocaleDateString('it-IT');
  
  let messaggio = `🛒 *Nuovo Ordine BarNode*\n\n`;
  messaggio += `📅 Data: ${dataFormattata}\n`;
  messaggio += `🏪 Fornitore: ${ordine.fornitore.nome}\n\n`;
  messaggio += `📋 *Articoli richiesti:*\n`;
  
  ordine.righe.forEach((riga, index) => {
    messaggio += `${index + 1}. ${riga.articolo.nome}\n`;
    messaggio += `   Quantità: ${riga.qta_ordinata} ${riga.articolo.unita}\n`;
    messaggio += `   Confezione: ${riga.articolo.confezione}\n`;
    if (riga.note) {
      messaggio += `   Note: ${riga.note}\n`;
    }
    messaggio += `\n`;
  });
  
  messaggio += `📞 Per conferme o modifiche, contattaci!\n`;
  messaggio += `\n_Messaggio generato automaticamente da BarNode_`;
  
  return messaggio;
}

/**
 * Valida un numero WhatsApp
 */
export function validaNumeroWhatsApp(numero: string): boolean {
  // TODO: Implementare validazione completa
  const numeroPulito = numero.replace(/\D/g, '');
  return numeroPulito.length >= 10 && numeroPulito.length <= 15;
}

/**
 * Formatta un numero WhatsApp per la visualizzazione
 */
export function formattaNumeroWhatsApp(numero: string): string {
  // TODO: Implementare formattazione per diversi paesi
  const numeroPulito = numero.replace(/\D/g, '');
  
  // Formato italiano di base
  if (numeroPulito.startsWith('39') && numeroPulito.length === 12) {
    return `+39 ${numeroPulito.slice(2, 5)} ${numeroPulito.slice(5, 8)} ${numeroPulito.slice(8)}`;
  }
  
  return `+${numeroPulito}`;
}
