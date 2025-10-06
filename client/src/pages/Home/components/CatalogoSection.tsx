import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Package, Plus, Search } from 'lucide-react';
import { useArticoli } from '@/hooks/useArticoli';
import { useOrdiniDrafts } from '@/hooks/useOrdiniDrafts';

/**
 * Sezione Home per catalogo articoli
 * Mostra articoli con possibilità di aggiungerli alle bozze ordini
 */
export default function CatalogoSection() {
  const [search, setSearch] = useState('');
  
  const { articoli, loading } = useArticoli({
    search: search || undefined,
    pageSize: 6 // Mostra solo i primi 6 per la home
  });
  
  const { addItemToDraft, isAddingItem } = useOrdiniDrafts();

  const handleAddToDraft = (articoloId: string) => {
    addItemToDraft(articoloId, 1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Catalogo Articoli
        </CardTitle>
        <CardDescription>
          Aggiungi articoli alle bozze ordini per i tuoi fornitori
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca articoli..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Lista Articoli */}
        {loading ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Caricamento...</p>
          </div>
        ) : articoli.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Nessun articolo trovato</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {articoli.map((articolo) => (
              <div
                key={articolo.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/25"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{articolo.nome}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {articolo.categoria && (
                      <Badge variant="outline" className="text-xs">
                        {articolo.categoria}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {articolo.fornitore.nome}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddToDraft(articolo.id)}
                  disabled={isAddingItem}
                  className="flex items-center gap-1"
                  title="Aggiungi a ordini da fare"
                >
                  <Plus className="h-3 w-3" />
                  Aggiungi
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
