import { useState } from 'react';
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ImportProdottiDialog } from "@/components/ImportProdottiDialog";
import { useArticoli } from "@/hooks/useArticoli";
import { useFornitori } from "@/hooks/useFornitori";
import BoxIcon from "~icons/tabler/box";
import PlusIcon from "~icons/tabler/plus";
import SearchIcon from "~icons/tabler/search";
import EditIcon from "~icons/tabler/edit";
import TrashIcon from "~icons/tabler/trash";
import UploadIcon from "~icons/tabler/upload";

/**
 * ArticoliPage - Gestione inventario articoli
 * Lista, ricerca, filtri e operazioni CRUD
 */
export default function ArticoliPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('');
  const [selectedFornitore, setSelectedFornitore] = useState<string>('');
  
  const { 
    articoli, 
    loading, 
    error, 
    pagination,
    deleteArticolo,
    updateFilters,
    retry 
  } = useArticoli({
    search: searchTerm,
    categoria: selectedCategoria || undefined,
    fornitore_id: selectedFornitore || undefined
  });

  const { fornitori } = useFornitori();

  // Estrai categorie uniche dagli articoli
  const categorie = Array.from(new Set(articoli.map(a => a.categoria).filter(Boolean))) as string[];

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    updateFilters({ search: value });
  };

  const handleCategoriaChange = (value: string) => {
    const categoria = value === 'all' ? '' : value;
    setSelectedCategoria(categoria);
    updateFilters({ categoria: categoria || undefined });
  };

  const handleFornitoreChange = (value: string) => {
    const fornitore = value === 'all' ? '' : value;
    setSelectedFornitore(fornitore);
    updateFilters({ fornitore_id: fornitore || undefined });
  };

  const handleEdit = (id: string) => {
    console.log('Edit articolo:', id);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questo articolo?')) {
      await deleteArticolo(id);
    }
  };

  if (error) {
    return (
      <PageContainer>
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-red-500 mb-4">Errore: {error}</p>
            <Button onClick={retry}>Riprova</Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ErrorBoundary>
        <div className="h-screen flex flex-col">
          {/* Header - Fisso */}
          <div className="flex-shrink-0 flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Articoli</h1>
              <p className="text-muted-foreground">
                Gestione inventario e scorte dell'attività
              </p>
            </div>
            <div className="flex gap-2">
              <ImportProdottiDialog>
                <Button variant="outline" className="gap-2">
                  <UploadIcon className="h-4 w-4" />
                  Importa Prodotti
                </Button>
              </ImportProdottiDialog>
              <Button className="gap-2" disabled>
                <PlusIcon className="h-4 w-4" />
                Nuovo Articolo
              </Button>
            </div>
          </div>

          {/* Filtri e Ricerca - Fisso */}
          <Card className="flex-shrink-0 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SearchIcon className="h-5 w-5" />
                Ricerca e Filtri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Cerca articoli..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <Select value={selectedCategoria} onValueChange={handleCategoriaChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tutte le categorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutte le categorie</SelectItem>
                    {categorie && categorie.length > 0 && categorie.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedFornitore} onValueChange={handleFornitoreChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tutti i fornitori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti i fornitori</SelectItem>
                    {fornitori && fornitori.length > 0 && fornitori.map(fornitore => (
                      <SelectItem key={fornitore.id} value={fornitore.id}>
                        {fornitore.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista Articoli - Scrollabile */}
          <Card className="flex-1 flex flex-col min-h-0">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="flex items-center gap-2">
                <BoxIcon className="h-5 w-5" />
                Inventario ({pagination.total})
              </CardTitle>
              <CardDescription>
                Catalogo articoli dell'attività
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              {loading ? (
                <div className="text-center py-8">Caricamento...</div>
              ) : articoli.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nessun articolo trovato
                </div>
              ) : (
                <div className="h-full overflow-y-auto space-y-4 pr-2">
                  {articoli.map((articolo) => (
                    <div
                      key={articolo.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <h3 className="font-medium">{articolo.nome}</h3>
                        <p className="text-sm text-muted-foreground">
                          {articolo.categoria} • {articolo.fornitore.nome}
                        </p>
                        {articolo.note && (
                          <p className="text-xs text-muted-foreground">{articolo.note}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Badge giacenze rimossi - gestione disabilitata */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(articolo.id)}
                          >
                            <EditIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(articolo.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </ErrorBoundary>
    </PageContainer>
  );
}
