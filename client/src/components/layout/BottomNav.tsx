import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { useOrdiniDrafts } from "@/hooks/useOrdiniDrafts";
import HomeIcon from "~icons/tabler/home";
import PackageIcon from "~icons/tabler/package";
import ShoppingCartIcon from "~icons/tabler/shopping-cart";

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { path: "/", label: "Home", icon: HomeIcon },
  { path: "/articoli", label: "Articoli", icon: PackageIcon },
  { path: "/ordini", label: "Ordini", icon: ShoppingCartIcon },
];

/**
 * BottomNav - Navigazione mobile-first con 3 voci principali
 * Design touch-friendly con stato attivo evidente
 */
export function BottomNav() {
  const [location, setLocation] = useLocation();
  const { totalDrafts } = useOrdiniDrafts();

  const isActive = (path: string) => {
    if (path === "/") {
      return location === "/";
    }
    return location.startsWith(path);
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-40"
      role="navigation"
      aria-label="Navigazione principale"
    >
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`
                flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg
                min-w-[64px] min-h-[48px] transition-colors duration-200 relative
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                ${active 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }
              `}
              aria-label={`Vai a ${item.label}`}
              aria-current={active ? "page" : undefined}
            >
              <div className="relative">
                <Icon className="h-5 w-5" aria-hidden="true" />
                {item.path === "/ordini" && totalDrafts > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs flex items-center justify-center"
                    data-testid="nav-badge-drafts"
                  >
                    {totalDrafts}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
