import { useWines } from './useWines'; // legacy
import { toProdottoBar } from '@/adapters/prodottiBarFromWines';

export function useProdottiBar() {
  const wines = useWines(); // riusa logica esistente
  return {
    ...wines,
    prodotti: wines.wines?.map(toProdottoBar) ?? [],
  };
}
