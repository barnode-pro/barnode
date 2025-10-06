import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Package, Users, ShoppingCart, List } from 'lucide-react';
import ArticoliTable from './tabs/ArticoliTable';
import FornitoriTable from './tabs/FornitoriTable';
import OrdiniTable from './tabs/OrdiniTable';
import RigheTable from './tabs/RigheTable';

/**
 * Pagina Database - Gestione massiva dati (desktop-optimized)
 * Tabelle dense con funzioni avanzate: search, filter, sort, export, bulk-edit
 */
export default function DatabasePage() {
  const [activeTab, setActiveTab] = useState('articoli');

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Database className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Database</h1>
          <p className="text-muted-foreground">
            Gestione massiva dati - Tabelle, export e bulk-edit
          </p>
        </div>
      </div>

      {/* Tabs Container */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="articoli" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Articoli
          </TabsTrigger>
          <TabsTrigger value="fornitori" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Fornitori
          </TabsTrigger>
          <TabsTrigger value="ordini" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Ordini
          </TabsTrigger>
          <TabsTrigger value="righe" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Righe Ordine
          </TabsTrigger>
        </TabsList>

        {/* Articoli Tab */}
        <TabsContent value="articoli" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Gestione Articoli
              </CardTitle>
              <CardDescription>
                Tabella completa con ricerca, filtri, ordinamento, export CSV e bulk-edit prezzi/categoria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ArticoliTable />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fornitori Tab */}
        <TabsContent value="fornitori" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gestione Fornitori
              </CardTitle>
              <CardDescription>
                Elenco fornitori con informazioni di contatto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FornitoriTable />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ordini Tab */}
        <TabsContent value="ordini" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Gestione Ordini
              </CardTitle>
              <CardDescription>
                Storico ordini con stati e dettagli
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrdiniTable />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Righe Ordine Tab */}
        <TabsContent value="righe" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                Righe Ordine
              </CardTitle>
              <CardDescription>
                Dettaglio articoli ordinati e ricevuti
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RigheTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
