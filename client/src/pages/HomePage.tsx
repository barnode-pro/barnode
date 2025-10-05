import { Button } from "@/components/ui/button";

export default function HomePage() {
  const handleIniziaClick = () => {
    console.log("Inizia button clicked");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="flex justify-center mb-8">
          <img 
            src="/logo.png" 
            alt="BarNode Logo" 
            className="h-20 md:h-24 w-auto"
            data-testid="img-logo"
          />
        </div>
        
        <h1 
          className="text-5xl md:text-6xl font-bold text-primary tracking-tight"
          data-testid="text-title"
        >
          BarNode
        </h1>
        
        <p 
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          data-testid="text-subtitle"
        >
          Un'applicazione moderna e modulare progettata per offrire 
          un'esperienza utente eccellente con un design pulito e funzionalità intuitive
        </p>
        
        <div className="pt-4">
          <Button 
            size="lg"
            onClick={handleIniziaClick}
            className="px-8 py-6 text-lg font-semibold"
            data-testid="button-inizia"
          >
            Inizia
          </Button>
        </div>
      </div>
    </div>
  );
}
