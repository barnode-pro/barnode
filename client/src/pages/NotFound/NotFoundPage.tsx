import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

/**
 * NotFoundPage - Pagina 404 per route non trovate
 * Fornisce navigazione di ritorno alle sezioni principali
 */
export default function NotFoundPage() {
  const [, setLocation] = useLocation();

  return (
    <PageContainer>
      <div className="text-center space-y-6 py-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground" data-testid="page-title">
            404
          </h1>
          <h2 className="text-xl font-semibold text-muted-foreground">
            Pagina non trovata
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            La pagina che stai cercando non esiste o è stata spostata. 
            Torna alla home page o naviga verso una delle sezioni principali.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={() => setLocation("/")}
            className="px-6"
          >
            Torna alla Home
          </Button>
          <Button 
            variant="outline"
            onClick={() => setLocation("/articoli")}
            className="px-6"
          >
            Vai agli Articoli
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
