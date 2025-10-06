import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/app/AppShell";
import HomePage from "@/pages/Home/HomePage";
import ArticoliPage from "@/pages/Articoli/ArticoliPage";
import FornitoriPage from "@/pages/Fornitori/FornitoriPage";
import OrdiniPage from "@/pages/Ordini/OrdiniPage";
import RicezionePage from "@/pages/Ricezione/RicezionePage";
import DatabasePage from "@/pages/Database/DatabasePage";
import NotFoundPage from "@/pages/NotFound/NotFoundPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/articoli" component={ArticoliPage} />
      <Route path="/fornitori" component={FornitoriPage} />
      <Route path="/ordini" component={OrdiniPage} />
      <Route path="/ricezione" component={RicezionePage} />
      <Route path="/database" component={DatabasePage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppShell>
          <Router />
        </AppShell>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
