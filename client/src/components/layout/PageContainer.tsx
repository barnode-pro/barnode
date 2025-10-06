import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * PageContainer - Shell responsiva per contenuti pagina
 * Mobile-first con ottimizzazioni desktop per tabelle
 */
export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <main 
      className={`
        flex-1 px-4 py-6 pb-20 
        max-w-7xl mx-auto w-full
        md:px-6 lg:px-8
        ${className}
      `}
      role="main"
    >
      {children}
    </main>
  );
}
