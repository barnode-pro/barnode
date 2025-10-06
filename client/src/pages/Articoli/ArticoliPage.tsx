import { PageContainer } from "@/components/layout/PageContainer";

/**
 * ArticoliPage - Gestione articoli e inventario
 * Visualizzazione, ricerca e gestione degli articoli disponibili
 */
export default function ArticoliPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="page-title">
            Articoli
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestione dell'inventario e monitoraggio delle scorte. 
            Visualizza tutti gli articoli disponibili e le loro quantità attuali.
          </p>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-8 text-center">
          <p className="text-muted-foreground">
            Sezione in preparazione - Lista articoli, filtri e gestione scorte verranno implementati nei prossimi step
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
