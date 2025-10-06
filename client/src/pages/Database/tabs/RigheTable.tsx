import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Tabella righe ordine (placeholder)
 * TODO: Implementare quando disponibile servizio righe ordine
 */
export default function RigheTable() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca righe ordine..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button variant="outline" disabled>
          Export CSV
        </Button>
      </div>

      {/* Tabella */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 text-left font-medium">Ordine</th>
                <th className="p-3 text-left font-medium">Articolo</th>
                <th className="p-3 text-left font-medium">Qta Ordinata</th>
                <th className="p-3 text-left font-medium">Qta Ricevuta</th>
                <th className="p-3 text-left font-medium">Stato</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  Funzionalità in sviluppo
                  <br />
                  <span className="text-xs">Sarà disponibile nella prossima versione</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
