import { PageContainer } from "@/components/layout/PageContainer";

/**
 * OrdiniPage - Gestione ordini e comunicazioni
 * Creazione, invio e monitoraggio degli ordini ai fornitori
 */
export default function OrdiniPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="page-title">
            Ordini
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestione completa del ciclo ordini: creazione, invio via WhatsApp e monitoraggio stato. 
            Tieni traccia di tutti gli ordini in corso e della loro progressione.
          </p>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-8 text-center">
          <p className="text-muted-foreground">
            Sezione in preparazione - Creazione ordini, invio WhatsApp e tracking stato verranno implementati nei prossimi step
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
