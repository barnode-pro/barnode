import { PageContainer } from "@/components/layout/PageContainer";

/**
 * HomePage - Pagina principale dell'applicazione BarNode
 * Dashboard con panoramica generale del sistema
 */
export default function HomePage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-primary" data-testid="page-title">
            BarNode
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dashboard principale per il monitoraggio e gestione del ciclo ordini. 
            Da qui puoi accedere a tutte le funzionalità principali dell'applicazione.
          </p>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-8 text-center">
          <p className="text-muted-foreground">
            Sezione in preparazione - Dashboard e statistiche verranno implementate nei prossimi step
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
