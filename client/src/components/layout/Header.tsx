import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * Header - Barra superiore dell'applicazione
 * Logo centrato, pulsante theme a destra, design pulito
 */
export function Header() {
  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm pt-[env(safe-area-inset-top)]"
      role="banner"
    >
      <div className="container mx-auto px-4 h-16 relative flex items-center">
        {/* Spaziatore sinistro per centraggio perfetto */}
        <div className="w-10"></div>
        
        {/* Logo centrato - aumentato del 20% */}
        <div className="absolute inset-x-0 flex justify-center items-center">
          <img 
            src="/logo.png" 
            alt="Logo BarNode" 
            aria-label="Logo BarNode"
            className="h-12 w-auto"
            draggable="false"
          />
        </div>
        
        {/* Pulsante Theme Toggle a destra */}
        <div className="w-10 ml-auto flex justify-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
