import { useState, useMemo, useEffect } from 'react';
import { useArticoliTable } from '@/hooks/useDatabaseTables';
import { Button } from '@/components/ui/button';
import BulkEditDialog from '../components/BulkEditDialog';
import ArticoliToolbar from './ArticoliToolbar';
import ArticoliRows from './ArticoliRows';

/**
 * Tabella articoli - Shell principale
 * Gestisce state e coordina toolbar + righe
 */
export default function ArticoliTable() {
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState<string>('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkEdit, setShowBulkEdit] = useState(false);

  // Query con filtri
  const filters = useMemo(() => ({
    search: search || undefined,
    categoria: categoria || undefined,
    page,
    pageSize
  }), [search, categoria, page, pageSize]);

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
  }, [search, categoria, page]);

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
      <ArticoliToolbar
        search={search}
        categoria={categoria}
        selectedIds={selectedIds}
        data={data?.data || []}
        onSearchChange={setSearch}
        onCategoriaChange={setCategoria}
        onBulkEditClick={() => setShowBulkEdit(true)}
      />

      {/* Righe Tabella */}
      <ArticoliRows
        data={data}
        isLoading={isLoading}
        selectedIds={selectedIds}
        page={page}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        onPageChange={setPage}
      />

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
