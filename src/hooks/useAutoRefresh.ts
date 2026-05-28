import { useEffect, useCallback } from 'react';
import { useGlobalCrud } from '@/contexts/GlobalCrudContext';

interface AutoRefreshOptions {
  tables: string[];
  onRefresh: () => void;
  enabled?: boolean;
}

export const useAutoRefresh = (options: AutoRefreshOptions) => {
  const { lastEvent } = useGlobalCrud();
  const { tables, onRefresh, enabled = true } = options;

  const handleRefresh = useCallback(() => {
    if (enabled && onRefresh) {
      console.log(`🔄 Auto-refreshing due to changes in: ${tables.join(', ')}`);
      onRefresh();
    }
  }, [enabled, onRefresh, tables]);

  useEffect(() => {
    if (!lastEvent || !enabled) return;

    // Check if the event affects any of our monitored tables
    const shouldRefresh = tables.includes(lastEvent.table);
    
    if (shouldRefresh) {
      console.log(`🔄 Auto-refresh triggered for ${lastEvent.table} (${lastEvent.operation})`);
      
      // Small delay to ensure UI feels smooth
      const timeout = setTimeout(() => {
        handleRefresh();
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [lastEvent, tables, handleRefresh, enabled]);

  return {
    isMonitoring: enabled,
    lastRefresh: lastEvent?.timestamp || null
  };
};