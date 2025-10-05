// compat: OrdiniContext aggregator - index unificato per evitare doppie istanze modulo
export { useOrdini, OrdiniProvider } from './OrdiniContext';
export { OrdersProvider } from './OrdersProvider';
export type { Ordine, OrdineDettaglio } from '../types/orders';

// BarNode domain exports
export { useProdottiBar } from '../hooks/useProdottiBar';
export type { ProdottoBar } from '../domain/prodottiBar/types';
