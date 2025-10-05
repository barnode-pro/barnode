import type { ProdottoBar } from '@/domain/prodottiBar/types';
import type { WineType } from '@/hooks/useWines';

export function toProdottoBar(w: WineType): ProdottoBar {
  return { 
    id: w.id,
    nome: w.name, // mapping name → nome
    marca: w.supplier, // mapping supplier → marca
    categoria: w.type, // mapping type → categoria
    formato: w.vintage || undefined, // mapping vintage → formato
    fornitore_id: null, // non presente in WineType legacy
    costo_prodotto: w.cost || null, // mapping cost → costo_prodotto
    created_at: undefined,
    updated_at: undefined
  }; 
}
