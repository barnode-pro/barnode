import { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
}

/**
 * AppShell - Contenitore principale dell'applicazione
 * Gestisce il layout base e i provider globali
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {children}
    </div>
  );
}
