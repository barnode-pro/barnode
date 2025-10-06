import { PageContainer } from "@/components/layout/PageContainer";

/**
 * FornitoriPage - Gestione fornitori e contatti
 * Visualizzazione e gestione dei fornitori con informazioni di contatto
 */
export default function FornitoriPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="page-title">
            Fornitori
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestione dei fornitori e delle informazioni di contatto. 
            Mantieni aggiornati i dati per facilitare la comunicazione e gli ordini.
          </p>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-8 text-center">
          <p className="text-muted-foreground">
            Sezione in preparazione - Lista fornitori, contatti WhatsApp e gestione dati verranno implementati nei prossimi step
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
