import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { bulkEditService } from '@/services/bulkEdit.service';
import { useInvalidateTableCache } from '@/hooks/useDatabaseTables';

/**
 * Dialog per bulk edit articoli
 * Permette modifica categoria e fornitore
 */

interface BulkEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[];
  onSuccess?: () => void;
}

export default function BulkEditDialog({ 
  open, 
  onOpenChange, 
  selectedIds, 
  onSuccess 
}: BulkEditDialogProps) {
  const [categoria, setCategoria] = useState('');
  const [fornitoreId, setFornitoreId] = useState('');
  
  const { toast } = useToast();
  const { invalidateArticoli } = useInvalidateTableCache();

  const bulkEditMutation = useMutation({
    mutationFn: bulkEditService.bulkEditArticoli,
    onSuccess: (data) => {
      toast({
        title: 'Successo',
        description: data.message || `${selectedIds.length} articoli aggiornati`,
      });
      invalidateArticoli();
      onSuccess?.();
      handleClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Errore',
        description: error.message || 'Errore durante aggiornamento',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = () => {
    // Prepara patch con solo i campi compilati
    const patch: any = {};
    if (categoria.trim()) patch.categoria = categoria.trim();
    if (fornitoreId.trim()) patch.fornitore_id = fornitoreId.trim();

    // Verifica che almeno un campo sia compilato
    if (Object.keys(patch).length === 0) {
      toast({
        title: 'Attenzione',
        description: 'Compila almeno un campo da aggiornare',
        variant: 'destructive',
      });
      return;
    }

    bulkEditMutation.mutate({
      ids: selectedIds,
      patch
    });
  };

  const handleClose = () => {
    setCategoria('');
    setFornitoreId('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifica Articoli</DialogTitle>
          <DialogDescription>
            Aggiorna {selectedIds.length} articoli selezionati. 
            Compila solo i campi che vuoi modificare.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria</Label>
            <Input
              id="categoria"
              placeholder="Es: Alimentari, Bevande..."
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fornitore-id">ID Fornitore</Label>
            <Input
              id="fornitore-id"
              placeholder="UUID del fornitore..."
              value={fornitoreId}
              onChange={(e) => setFornitoreId(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Annulla
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={bulkEditMutation.isPending}
          >
            {bulkEditMutation.isPending ? 'Aggiornamento...' : 'Aggiorna'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
