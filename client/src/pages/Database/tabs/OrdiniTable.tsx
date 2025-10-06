import { useState, useMemo } from 'react';
import { useOrdiniTable } from '@/hooks/useDatabaseTables';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { exportOrdiniToCsv } from '@/services/exportCsv';
import ExportCsvButton from '../components/ExportCsvButton';

/**
 * Tabella ordini con ricerca e export
 */
export default function OrdiniTable() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);

  const filters = useMemo(() => ({
    search: search || undefined,
    page,
    pageSize
  }), [search, page, pageSize]);

  const { data, isLoading, error } = useOrdiniTable(filters);

  const getStatoBadgeVariant = (stato: string) => {
    switch (stato) {
      case 'nuovo': return 'default';
      case 'inviato': return 'secondary';
      case 'in_ricezione': return 'outline';
      case 'archiviato': return 'secondary';
      default: return 'default';
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Errore caricamento ordini</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Riprova
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca ordini..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <ExportCsvButton
          data={data?.data || []}
          onExport={() => exportOrdiniToCsv(data?.data || [])}
          disabled={!data?.data?.length}
        />
      </div>

      {/* Tabella */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 text-left font-medium">Data</th>
                <th className="p-3 text-left font-medium">Fornitore</th>
                <th className="p-3 text-left font-medium">Stato</th>
                <th className="p-3 text-left font-medium">Note</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-3"><Skeleton className="h-4 w-20" /></td>
                    <td className="p-3"><Skeleton className="h-4 w-32" /></td>
                    <td className="p-3"><Skeleton className="h-4 w-16" /></td>
                    <td className="p-3"><Skeleton className="h-4 w-24" /></td>
                  </tr>
                ))
              ) : data?.data?.length ? (
                data.data.map((ordine) => (
                  <tr key={ordine.id} className="border-t hover:bg-muted/25">
                    <td className="p-3 font-medium">
                      {new Date(ordine.data).toLocaleDateString('it-IT')}
                    </td>
                    <td className="p-3">{ordine.fornitore.nome}</td>
                    <td className="p-3">
                      <Badge variant={getStatoBadgeVariant(ordine.stato)}>
                        {ordine.stato.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-3">
                      {ordine.note ? (
                        <span className="text-sm text-muted-foreground">
                          {ordine.note.length > 50 
                            ? `${ordine.note.substring(0, 50)}...`
                            : ordine.note
                          }
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    Nessun ordine trovato
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
            ({data.pagination.total} ordini totali)
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
    </div>
  );
}
