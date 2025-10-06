import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Edit } from 'lucide-react';
import ExportCsvButton from '../components/ExportCsvButton';
import { exportArticoliToCsv } from '@/services/exportCsv';

/**
 * Toolbar per ArticoliTable
 * Search, filtri, export CSV, bulk-edit
 */

interface ArticoliToolbarProps {
  search: string;
  categoria: string;
  selectedIds: string[];
  data: any[];
  onSearchChange: (value: string) => void;
  onCategoriaChange: (value: string) => void;
  onBulkEditClick: () => void;
}

export default function ArticoliToolbar({
  search,
  categoria,
  selectedIds,
  data,
  onSearchChange,
  onCategoriaChange,
  onBulkEditClick
}: ArticoliToolbarProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between">
      <div className="flex gap-2 flex-1">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca articoli..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtro Categoria */}
        <Select value={categoria} onValueChange={onCategoriaChange}>
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
          data={data || []}
          onExport={() => exportArticoliToCsv(data || [])}
          disabled={!data?.length}
        />

        {/* Bulk Edit */}
        {selectedIds.length > 0 && (
          <Button
            variant="outline"
            onClick={onBulkEditClick}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Modifica {selectedIds.length}
          </Button>
        )}
      </div>
    </div>
  );
}
