import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useOrdiniDrafts } from '@/hooks/useOrdiniDrafts';
import { useLocation } from 'wouter';

/**
 * Sezione Home per "Ordini da fare"
 * Mostra conteggio bozze e link alla pagina Ordini
 */
export default function OrdiniDaFareSection() {
  const { totalDrafts, isLoadingCount } = useOrdiniDrafts();
  const [, setLocation] = useLocation();

  const handleGoToOrdini = () => {
    setLocation('/ordini');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Ordini da fare
          {totalDrafts > 0 && (
            <Badge variant="secondary" className="ml-2">
              {totalDrafts}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Articoli aggiunti alle bozze ordini, pronti per revisione e invio
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingCount ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Caricamento...</p>
          </div>
        ) : totalDrafts > 0 ? (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{totalDrafts}</p>
              <p className="text-sm text-muted-foreground">
                {totalDrafts === 1 ? 'articolo in bozza' : 'articoli in bozza'}
              </p>
            </div>
            <Button 
              onClick={handleGoToOrdini}
              className="w-full flex items-center gap-2"
            >
              Vai a Ordini
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              Nessun articolo in bozza
            </p>
            <p className="text-sm text-muted-foreground">
              Aggiungi articoli dal catalogo per creare bozze ordini
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
