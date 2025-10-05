import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * Header - Intestazione dell'applicazione
 * Contiene logo, navigazione e controlli utente
 */
export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src="/logo.png" 
            alt="Logo BarNode" 
            className="h-8 w-auto"
          />
          <h1 className="text-xl font-semibold text-foreground">
            BarNode
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
