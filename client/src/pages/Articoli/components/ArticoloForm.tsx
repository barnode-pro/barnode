import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFornitori } from "@/hooks/useFornitori";
import { articoliService } from "@/services/articoli.service";
import type { InsertArticolo } from '@shared/types/schema';
import XIcon from "~icons/tabler/x";

interface ArticoloFormProps {
  articoloId?: string | null;
  onClose: () => void;
  onSave: any; // Semplificato per rispettare 200 righe
}

export function ArticoloForm({ articoloId, onClose, onSave }: ArticoloFormProps) {
  const [formData, setFormData] = useState<InsertArticolo>({
    nome: '', categoria: '', unita: '', confezione: '',
    fornitore_id: '', note: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fornitori } = useFornitori();

  useEffect(() => {
    if (articoloId) loadArticolo(articoloId);
  }, [articoloId]);

  const loadArticolo = async (id: string) => {
    setLoading(true);
    try {
      const response = await articoliService.getById(id);
      if (response.success && response.data) {
        const a = response.data;
        setFormData({
          nome: a.nome, categoria: a.categoria || '', unita: a.unita || '',
          confezione: a.confezione || '', fornitore_id: a.fornitore.id,
          note: a.note || ''
        });
      } else setError(response.message || 'Errore caricamento');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore di rete');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const success = articoloId ? await onSave(articoloId, formData) : await onSave(formData);
      if (success) onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore salvataggio');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof InsertArticolo, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{articoloId ? 'Modifica' : 'Nuovo'} Articolo</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nome *</Label>
              <Input value={formData.nome} onChange={(e) => handleChange('nome', e.target.value)} required disabled={loading} />
            </div>
            <div>
              <Label>Categoria</Label>
              <Input value={formData.categoria} onChange={(e) => handleChange('categoria', e.target.value)} disabled={loading} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Unità</Label>
                <Input value={formData.unita} onChange={(e) => handleChange('unita', e.target.value)} placeholder="pz, kg..." disabled={loading} />
              </div>
              <div>
                <Label>Confezione</Label>
                <Input value={formData.confezione} onChange={(e) => handleChange('confezione', e.target.value)} placeholder="scatola..." disabled={loading} />
              </div>
            </div>
            {/* Campi giacenze rimossi - gestione disabilitata */}
            <div>
              <Label>Fornitore *</Label>
              <Select value={formData.fornitore_id} onValueChange={(value) => handleChange('fornitore_id', value)} disabled={loading}>
                <SelectTrigger><SelectValue placeholder="Seleziona fornitore" /></SelectTrigger>
                <SelectContent>
                  {fornitori.map(f => <SelectItem key={f.id} value={f.id}>{f.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Note</Label>
              <Input value={formData.note} onChange={(e) => handleChange('note', e.target.value)} disabled={loading} />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Annulla</Button>
              <Button type="submit" disabled={loading || !formData.nome || !formData.fornitore_id}>
                {loading ? 'Salvataggio...' : (articoloId ? 'Aggiorna' : 'Crea')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
