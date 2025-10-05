/**
 * STUB: Giacenza/Stock management stubs for BarNode
 * Original modules archived in ARCHIVE/_wine-legacy/
 */

interface GiacenzaRecord {
  id: string;
  vino_id: string;
  giacenza: number;
  min_stock: number;
  version?: number;
  updated_at: string;
}

interface UseRealtimeGiacenzaProps {
  onInsert?: (record: GiacenzaRecord) => void;
  onUpdate?: (record: GiacenzaRecord) => void;
  onDelete?: (record: GiacenzaRecord) => void;
  enabled?: boolean;
}

/**
 * STUB: Realtime giacenza hook (non-operational)
 * Original: ARCHIVE/_wine-legacy/useRealtimeGiacenza.ts
 */
export function useRealtimeGiacenza({
  onInsert,
  onUpdate,
  onDelete,
  enabled = true
}: UseRealtimeGiacenzaProps) {
  // No-op stub - returns disabled state
  return {
    isConnected: false,
    isSubscribed: false,
    markUpdatePending: (vinoId: string) => {
      // No-op
    }
  };
}

/**
 * STUB: Threshold watcher hook (non-operational)
 */
export function useThresholdWatcher() {
  return {
    alerts: [],
    isEnabled: false,
    toggleEnabled: () => {
      // No-op
    }
  };
}
