import { PageContainer } from "@/components/layout/PageContainer";

/**
 * RicezionePage - Gestione ricezione merce
 * Registrazione e controllo della merce ricevuta dai fornitori
 */
export default function RicezionePage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="page-title">
            Ricezione
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestione della ricezione merce e aggiornamento delle scorte. 
            Registra le quantità ricevute e verifica la corrispondenza con gli ordini.
          </p>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-8 text-center">
          <p className="text-muted-foreground">
            Sezione in preparazione - Controllo ricezioni, aggiornamento scorte e chiusura ordini verranno implementati nei prossimi step
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
