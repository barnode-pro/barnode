import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, Link, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import { importService } from '@/services/import.service';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

/**
 * Dialog per import prodotti da file Excel/CSV o Google Sheet
 * Supporta upload file e URL Google Sheet
 */

interface ImportProdottiDialogProps {
  children: React.ReactNode;
}

export function ImportProdottiDialog({ children }: ImportProdottiDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [result, setResult] = useState<any>(null);
  
  const queryClient = useQueryClient();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
    setResult(null);
  };

  const handleFileImport = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await importService.importFromFile(selectedFile);
      
      if (response.success && response.data) {
        setResult(response.data);
        
        // Invalida cache per aggiornare liste
        queryClient.invalidateQueries({ queryKey: ['articoli'] });
        queryClient.invalidateQueries({ queryKey: ['fornitori'] });
        
        toast.success(`Import completato: ${response.data.creati} creati, ${response.data.aggiornati} aggiornati`);
      } else {
        toast.error(response.message || 'Errore durante import');
      }
    } catch (error) {
      toast.error('Errore durante import file');
    } finally {
      setLoading(false);
    }
  };

  const handleGSheetImport = async () => {
    if (!googleSheetUrl.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await importService.importFromGSheet(googleSheetUrl.trim());
      
      if (response.success && response.data) {
        setResult(response.data);
        
        // Invalida cache per aggiornare liste
        queryClient.invalidateQueries({ queryKey: ['articoli'] });
        queryClient.invalidateQueries({ queryKey: ['fornitori'] });
        
        toast.success(`Import completato: ${response.data.creati} creati, ${response.data.aggiornati} aggiornati`);
      } else {
        toast.error(response.message || 'Errore durante import');
      }
    } catch (error) {
      toast.error('Errore durante import Google Sheet');
    } finally {
      setLoading(false);
    }
  };

  const resetDialog = () => {
    setSelectedFile(null);
    setGoogleSheetUrl('');
    setResult(null);
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) resetDialog();
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Importa Prodotti
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              File Excel/CSV
            </TabsTrigger>
            <TabsTrigger value="gsheet" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Google Sheet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upload File</CardTitle>
                <CardDescription>
                  Carica un file Excel (.xlsx) o CSV con i prodotti da importare
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Seleziona File</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    disabled={loading}
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      File selezionato: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Colonne supportate:</strong> Nome Prodotto, Categoria, Fornitore, Prezzo acquisto, Prezzo vendita.
                    Massimo 200 righe per import.
                  </AlertDescription>
                </Alert>

                <Button 
                  onClick={handleFileImport}
                  disabled={!selectedFile || loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importando...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Importa File
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gsheet" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Google Sheet</CardTitle>
                <CardDescription>
                  Importa direttamente da un Google Sheet pubblico
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gsheet-url">URL Google Sheet</Label>
                  <Input
                    id="gsheet-url"
                    type="url"
                    placeholder="https://docs.google.com/.../export?format=csv"
                    value={googleSheetUrl}
                    onChange={(e) => setGoogleSheetUrl(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Formato URL:</strong> Usa il link di export CSV del Google Sheet.
                    Esempio: https://docs.google.com/spreadsheets/d/ID/export?format=csv
                  </AlertDescription>
                </Alert>

                <Button 
                  onClick={handleGSheetImport}
                  disabled={!googleSheetUrl.trim() || loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importando...
                    </>
                  ) : (
                    <>
                      <Link className="mr-2 h-4 w-4" />
                      Importa da Google Sheet
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Risultati Import */}
        {result && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Import Completato
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Prodotti creati:</span> {result.creati}
                </div>
                <div>
                  <span className="font-medium">Prodotti aggiornati:</span> {result.aggiornati}
                </div>
                <div>
                  <span className="font-medium">Fornitori creati:</span> {result.fornitori_creati}
                </div>
                <div>
                  <span className="font-medium">Righe saltate:</span> {result.saltati}
                </div>
              </div>
              
              {result.warnings && result.warnings.length > 0 && (
                <div className="mt-4">
                  <p className="font-medium text-amber-600 mb-2">Avvisi:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {result.warnings.map((warning: string, index: number) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
