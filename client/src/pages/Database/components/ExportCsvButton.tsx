import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

/**
 * Pulsante per export CSV
 * Generico per qualsiasi tipo di dati
 */

interface ExportCsvButtonProps {
  data: any[];
  onExport: () => void;
  disabled?: boolean;
  label?: string;
}

export default function ExportCsvButton({ 
  data, 
  onExport, 
  disabled = false,
  label = 'Export CSV'
}: ExportCsvButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onExport}
      disabled={disabled || data.length === 0}
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      {label}
      {data.length > 0 && (
        <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
          {data.length}
        </span>
      )}
    </Button>
  );
}
