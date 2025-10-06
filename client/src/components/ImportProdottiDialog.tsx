import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, Link, FileSpreadsheet, CheckCircle, AlertCircle, X, File } from 'lucide-react';
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
  const [isDragOver, setIsDragOver] = useState(false);
  
  const queryClient = useQueryClient();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleFileChange(file);
  };

  const handleFileChange = (file: File | undefined) => {
    if (file) {
      // Verifica formato file
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv' // .csv
      ];
      
      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
        toast.error('Formato file non supportato. Usa Excel (.xlsx, .xls) o CSV.');
        return;
      }
      
      // Verifica dimensione (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File troppo grande. Massimo 5MB.');
        return;
      }
      
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
    setResult(null);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  }, []);

  const removeFile = () => {
    setSelectedFile(null);
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
                {!selectedFile ? (
                  // Zona Drag & Drop
                  <div
                    className={`
                      relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
                      ${isDragOver 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                      }
                      ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !loading && document.getElementById('file-upload')?.click()}
                  >
                    <input
                      id="file-upload"
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileSelect}
                      disabled={loading}
                      className="hidden"
                    />
                    
                    <div className="space-y-4">
                      <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="w-6 h-6 text-primary" />
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-lg font-medium">
                          {isDragOver ? 'Rilascia il file qui' : 'Trascina il file qui'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          oppure <span className="text-primary font-medium">clicca per selezionare</span>
                        </p>
                      </div>
                      
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Formati supportati: Excel (.xlsx, .xls) e CSV</p>
                        <p>Dimensione massima: 5MB • Max 200 righe</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // File Selezionato - Preview e Conferma
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/30">
                      <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                        <File className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || 'File'}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        disabled={loading}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Colonne supportate:</strong> Nome Prodotto, Categoria, Fornitore, Prezzo acquisto, Prezzo vendita.
                      </AlertDescription>
                    </Alert>

                    <Button 
                      onClick={handleFileImport}
                      disabled={loading}
                      className="w-full"
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Importando...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Conferma Import
                        </>
                      )}
                    </Button>
                  </div>
                )}
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
                  size="lg"
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
