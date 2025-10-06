import { useState, useMemo, useEffect } from 'react';
import { useArticoliTable } from '@/hooks/useDatabaseTables';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { exportArticoliToCsv } from '@/services/exportCsv';
import BulkEditDialog from '../components/BulkEditDialog';
import ExportCsvButton from '../components/ExportCsvButton';

/**
 * Tabella densa articoli con funzioni avanzate
 * Search, filter, sort, pagination, bulk-edit, export CSV
 */
export default function ArticoliTable() {
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState<string>('');
  const [fornitore, setFornitore] = useState<string>('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkEdit, setShowBulkEdit] = useState(false);

  // Query con filtri
  const filters = useMemo(() => ({
    search: search || undefined,
    categoria: categoria || undefined,
    fornitore_id: fornitore || undefined,
    page,
    pageSize
  }), [search, categoria, fornitore, page, pageSize]);

  const { data, isLoading, error } = useArticoliTable(filters);

  // Gestione selezione
  const handleSelectAll = (checked: boolean) => {
    if (checked && data?.data) {
      setSelectedIds(data.data.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(itemId => itemId !== id));
    }
  };

  // Reset selezione quando cambiano i dati
  const resetSelection = () => setSelectedIds([]);

  // Auto-reset selezione quando cambiano i filtri
  useEffect(() => {
    setSelectedIds([]);
  }, [search, categoria, fornitore, page]);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Errore caricamento articoli</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Riprova
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca articoli..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtro Categoria */}
          <Select value={categoria} onValueChange={setCategoria}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tutte</SelectItem>
              <SelectItem value="Alimentari">Alimentari</SelectItem>
              <SelectItem value="Bevande">Bevande</SelectItem>
              <SelectItem value="Latticini">Latticini</SelectItem>
              <SelectItem value="Panetteria">Panetteria</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          {/* Export CSV */}
          <ExportCsvButton
            data={data?.data || []}
            onExport={() => exportArticoliToCsv(data?.data || [])}
            disabled={!data?.data?.length}
          />

          {/* Bulk Edit */}
          {selectedIds.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setShowBulkEdit(true)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Modifica {selectedIds.length}
            </Button>
          )}
        </div>
      </div>

      {/* Tabella */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 text-left">
                  <Checkbox
                    checked={selectedIds.length === data?.data?.length && data?.data?.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="p-3 text-left font-medium">Nome</th>
                <th className="p-3 text-left font-medium">Categoria</th>
                <th className="p-3 text-left font-medium">Prezzo Acquisto</th>
                <th className="p-3 text-left font-medium">Prezzo Vendita</th>
                <th className="p-3 text-left font-medium">Fornitore</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Skeleton loading
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-3"><Skeleton className="h-4 w-4" /></td>
                    <td className="p-3"><Skeleton className="h-4 w-32" /></td>
                    <td className="p-3"><Skeleton className="h-4 w-20" /></td>
                    <td className="p-3"><Skeleton className="h-4 w-16" /></td>
                    <td className="p-3"><Skeleton className="h-4 w-16" /></td>
                    <td className="p-3"><Skeleton className="h-4 w-24" /></td>
                  </tr>
                ))
              ) : data?.data?.length ? (
                data.data.map((articolo) => (
                  <tr key={articolo.id} className="border-t hover:bg-muted/25">
                    <td className="p-3">
                      <Checkbox
                        checked={selectedIds.includes(articolo.id)}
                        onCheckedChange={(checked) => handleSelectItem(articolo.id, !!checked)}
                      />
                    </td>
                    <td className="p-3 font-medium">{articolo.nome}</td>
                    <td className="p-3">
                      {articolo.categoria ? (
                        <Badge variant="secondary">{articolo.categoria}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-3">
                      {articolo.prezzo_acquisto ? (
                        `€ ${Number(articolo.prezzo_acquisto).toFixed(2)}`
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-3">
                      {articolo.prezzo_vendita ? (
                        `€ ${Number(articolo.prezzo_vendita).toFixed(2)}`
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-3">{articolo.fornitore.nome}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Nessun articolo trovato
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginazione */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Pagina {data.pagination.page} di {data.pagination.totalPages} 
            ({data.pagination.total} articoli totali)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= data.pagination.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Bulk Edit Dialog */}
      <BulkEditDialog
        open={showBulkEdit}
        onOpenChange={setShowBulkEdit}
        selectedIds={selectedIds}
        onSuccess={resetSelection}
      />
    </div>
  );
}
