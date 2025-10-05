export type ProdottoBar = {
  id: string;
  nome: string;
  marca?: string;
  categoria?: string;
  formato?: string;
  fornitore_id?: string | null;
  costo_prodotto?: number | null; // solo in memoria per ora
  created_at?: string;
  updated_at?: string;
};
