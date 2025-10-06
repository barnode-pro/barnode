import { PageContainer } from "@/components/layout/PageContainer";
import OrdiniDaFareSection from "./components/OrdiniDaFareSection";
import CatalogoSection from "./components/CatalogoSection";

/**
 * HomePage - Pagina principale dell'applicazione BarNode
 * Dashboard con panoramica generale e accesso rapido alle funzionalità
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
            Dashboard principale per la gestione del tuo bar. 
            Aggiungi articoli alle bozze ordini e gestisci i tuoi fornitori.
          </p>
        </div>
        
        {/* Sezioni principali */}
        <div className="grid gap-6 md:grid-cols-2">
          <OrdiniDaFareSection />
          <CatalogoSection />
        </div>
      </div>
    </PageContainer>
  );
}
