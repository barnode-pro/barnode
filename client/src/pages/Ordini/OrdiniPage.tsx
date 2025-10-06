import { useState } from 'react';
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useOrdini } from "@/hooks/useOrdini";
import { useFornitori } from "@/hooks/useFornitori";
import type { StatoOrdine } from '@shared/types/schema';
import ShoppingCartIcon from "~icons/tabler/shopping-cart";
import PlusIcon from "~icons/tabler/plus";
import FilterIcon from "~icons/tabler/filter";
import EyeIcon from "~icons/tabler/eye";
import EditIcon from "~icons/tabler/edit";

/**
 * OrdiniPage - Gestione ordini ai fornitori
 * Lista, filtri, creazione e tracking stati
 */
export default function OrdiniPage() {
  const [selectedStato, setSelectedStato] = useState<StatoOrdine | ''>('');
  const [selectedFornitore, setSelectedFornitore] = useState<string>('');

  const { 
    ordini, 
    loading, 
    error, 
    pagination,
    updateStato,
    deleteOrdine,
    updateFilters,
    retry 
  } = useOrdini({
    stato: selectedStato || undefined,
    fornitore_id: selectedFornitore || undefined
  });


  const { fornitori } = useFornitori();

  const handleStatoChange = (value: string) => {
    if (value === 'tutti') {
      setSelectedStato('');
      updateFilters({ stato: undefined });
    } else {
      const statoValue = value as StatoOrdine;
      setSelectedStato(statoValue);
      updateFilters({ stato: statoValue });
    }
  };

  const handleFornitoreChange = (value: string) => {
    if (value === 'tutti') {
      setSelectedFornitore('');
      updateFilters({ fornitore_id: undefined });
    } else {
      setSelectedFornitore(value);
      updateFilters({ fornitore_id: value });
    }
  };

  const handleStatoUpdate = async (id: string, nuovoStato: StatoOrdine) => {
    await updateStato(id, nuovoStato);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questo ordine?')) {
      await deleteOrdine(id);
    }
  };

  const getStatoBadgeVariant = (stato: StatoOrdine) => {
    switch (stato) {
      case 'bozza': return 'outline';
      case 'nuovo': return 'default';
      case 'inviato': return 'secondary';
      case 'in_ricezione': return 'outline';
      case 'archiviato': return 'secondary';
      default: return 'default';
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
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Ordini</h1>
              <p className="text-muted-foreground">
                Gestione ordini ai fornitori e tracking consegne
              </p>
            </div>
            <Button className="gap-2">
              <PlusIcon className="h-4 w-4" />
              Nuovo Ordine
            </Button>
          </div>

          {/* Filtri */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FilterIcon className="h-5 w-5" />
                Filtri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select value={selectedStato || 'tutti'} onValueChange={handleStatoChange} data-testid="ordini-filter-stato">
                  <SelectTrigger>
                    <SelectValue placeholder="Tutti gli stati" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tutti">Tutti gli stati</SelectItem>
                    <SelectItem value="bozza">Bozza</SelectItem>
                    <SelectItem value="nuovo">Nuovo</SelectItem>
                    <SelectItem value="inviato">Inviato</SelectItem>
                    <SelectItem value="in_ricezione">In Ricezione</SelectItem>
                    <SelectItem value="archiviato">Archiviato</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedFornitore || 'tutti'} onValueChange={handleFornitoreChange} data-testid="ordini-filter-fornitore">
                  <SelectTrigger>
                    <SelectValue placeholder="Tutti i fornitori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tutti">Tutti i fornitori</SelectItem>
                    {fornitori.map(fornitore => (
                      <SelectItem key={fornitore.id} value={fornitore.id}>
                        {fornitore.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista Ordini */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCartIcon className="h-5 w-5" />
                Ordini ({pagination.total})
              </CardTitle>
              <CardDescription>
                Ordini in corso e cronologia
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Caricamento...</div>
              ) : ordini.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nessun ordine trovato
                </div>
              ) : (
                <div className="space-y-4" data-testid="ordini-list">
                  {ordini.map((ordine) => (
                    <div
                      key={ordine.id}
                      className={`flex items-center justify-between p-4 border rounded-lg ${
                        ordine.stato === 'bozza' 
                          ? 'border-amber-200 bg-amber-50/50 shadow-sm' 
                          : ''
                      }`}
                      data-testid={ordine.stato === 'bozza' ? 'ordine-bozza' : undefined}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">Ordine #{ordine.id.slice(-8)}</h3>
                          {ordine.stato === 'bozza' && (
                            <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800 border-amber-300">
                              Bozza
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {ordine.fornitore.nome} • {new Date(ordine.data).toLocaleDateString('it-IT')}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={getStatoBadgeVariant(ordine.stato)}>
                          {ordine.stato}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {ordine.righe.length} articoli
                        </span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          <Select value={ordine.stato} onValueChange={(value) => handleStatoUpdate(ordine.id, value as StatoOrdine)}>
                            <SelectTrigger className="w-auto">
                              <EditIcon className="h-4 w-4" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bozza">Bozza</SelectItem>
                              <SelectItem value="nuovo">Nuovo</SelectItem>
                              <SelectItem value="inviato">Inviato</SelectItem>
                              <SelectItem value="in_ricezione">In Ricezione</SelectItem>
                              <SelectItem value="archiviato">Archiviato</SelectItem>
                            </SelectContent>
                          </Select>
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
