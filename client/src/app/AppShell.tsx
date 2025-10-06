import { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";

interface AppShellProps {
  children: ReactNode;
}

/**
 * AppShell - Contenitore principale dell'applicazione
 * Gestisce il layout base con Header e BottomNav
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <div className="flex-1 pt-16">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
