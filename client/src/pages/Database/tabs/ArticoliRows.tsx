import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Componente per rendering righe tabella articoli
 * Include tabella, checkbox, paginazione
 */

interface ArticoliRowsProps {
  data: any;
  isLoading: boolean;
  selectedIds: string[];
  page: number;
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (id: string, checked: boolean) => void;
  onPageChange: (page: number) => void;
}

export default function ArticoliRows({
  data,
  isLoading,
  selectedIds,
  page,
  onSelectAll,
  onSelectItem,
  onPageChange
}: ArticoliRowsProps) {
  return (
    <>
      {/* Tabella */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 text-left">
                  <Checkbox
                    checked={selectedIds.length === data?.data?.length && data?.data?.length > 0}
                    onCheckedChange={onSelectAll}
                  />
                </th>
                <th className="p-3 text-left font-medium">Nome</th>
                <th className="p-3 text-left font-medium">Categoria</th>
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
                    <td className="p-3"><Skeleton className="h-4 w-24" /></td>
                  </tr>
                ))
              ) : data?.data?.length ? (
                data.data.map((articolo: any) => (
                  <tr key={articolo.id} className="border-t hover:bg-muted/25">
                    <td className="p-3">
                      <Checkbox
                        checked={selectedIds.includes(articolo.id)}
                        onCheckedChange={(checked) => onSelectItem(articolo.id, !!checked)}
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
                    <td className="p-3">{articolo.fornitore?.nome || 'Nessun fornitore'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
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
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= data.pagination.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
