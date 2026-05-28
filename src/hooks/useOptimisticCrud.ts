import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OptimisticCrudOptions<T> {
  tableName: string;
  orderBy?: { column: string; ascending?: boolean };
  realTimeChannel?: string;
  onSuccess?: (action: 'create' | 'update' | 'delete', data: T) => void;
  onError?: (action: 'create' | 'update' | 'delete', error: any) => void;
}

export function useOptimisticCrud<T extends { id: string }>(options: OptimisticCrudOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Load initial data
  const loadData = useCallback(async () => {
    console.log(`🔄 Loading data for ${options.tableName}...`);
    try {
      setLoading(true);
      let query = (supabase as any).from(options.tableName).select('*');
      
      if (options.orderBy) {
        query = query.order(options.orderBy.column, { ascending: options.orderBy.ascending ?? false });
      }

      const { data: result, error } = await query;
      if (error) {
        console.error(`Error loading ${options.tableName}:`, error);
        // Check if it's an authentication or permission error
        if (error.message?.includes('JWT') || error.message?.includes('auth') || error.message?.includes('permission')) {
          toast.error(`Authentication required to access ${options.tableName} data`);
        } else {
          toast.error(`Failed to load ${options.tableName} data: ${error.message}`);
        }
        setData([]);
        return;
      }
      
      setData(result || []);
    } catch (error: any) {
      console.error(`Error loading ${options.tableName}:`, error);
      toast.error(`Failed to load ${options.tableName} data`);
      setData([]);
    } finally {
      console.log(`✅ Finished loading ${options.tableName} - setting loading to false`);
      setLoading(false);
    }
  }, [options.tableName, options.orderBy]);

  // Real-time subscription
  useEffect(() => {
    loadData();

    const channel = supabase
      .channel(options.realTimeChannel || `${options.tableName}-realtime`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: options.tableName
      }, (payload: any) => {
        console.log(`Real-time ${options.tableName} change:`, payload);
        
        switch (payload.eventType) {
          case 'INSERT':
            setData(prev => {
              const exists = prev.some(item => item.id === payload.new.id);
              if (exists) return prev;
              
              const newData = [payload.new, ...prev];
              if (options.orderBy) {
                return newData.sort((a, b) => {
                  const aVal = a[options.orderBy!.column as keyof T];
                  const bVal = b[options.orderBy!.column as keyof T];
                  const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
                  return options.orderBy!.ascending ? result : -result;
                });
              }
              return newData;
            });
            toast.success("✅ Record added instantly!", { duration: 2000 });
            break;
            
          case 'UPDATE':
            setData(prev => prev.map(item => 
              item.id === payload.new.id ? { ...item, ...payload.new } : item
            ));
            toast.success("⚡ Record updated instantly!", { duration: 2000 });
            break;
            
          case 'DELETE':
            setData(prev => prev.filter(item => item.id !== payload.old.id));
            toast.success("🗑️ Record deleted instantly!", { duration: 2000 });
            break;
        }

        if (options.onSuccess) {
          const action = payload.eventType === 'INSERT' ? 'create' : 
                       payload.eventType === 'UPDATE' ? 'update' : 'delete';
          options.onSuccess(action, payload.new || payload.old);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [options.tableName, options.realTimeChannel]);

  // Optimistic create
  const create = useCallback(async (newItem: Omit<T, 'id' | 'created_at' | 'updated_at'>) => {
    const tempId = `temp-${Date.now()}`;
    setActionLoading(tempId);
    
    // Optimistic update
    const optimisticItem = {
      ...newItem,
      id: tempId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as unknown as T;
    
    setData(prev => [optimisticItem, ...prev]);
    
    try {
      const { data: result, error } = await (supabase as any)
        .from(options.tableName)
        .insert(newItem)
        .select()
        .single();
        
      if (error) throw error;
      
      // Replace optimistic item with real one
      setData(prev => prev.map(item => 
        item.id === tempId ? result : item
      ));
      
      return result;
    } catch (error: any) {
      // Revert optimistic update
      setData(prev => prev.filter(item => item.id !== tempId));
      toast.error(`Failed to create: ${error.message}`);
      if (options.onError) options.onError('create', error);
      throw error;
    } finally {
      setActionLoading(null);
    }
  }, [options]);

  // Optimistic update
  const update = useCallback(async (id: string, updates: Partial<T>) => {
    setActionLoading(id);
    
    // Optimistic update
    const originalItem = data.find(item => item.id === id);
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
    ));
    
    try {
      const { data: result, error } = await (supabase as any)
        .from(options.tableName)
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      // Update with real data
      setData(prev => prev.map(item => 
        item.id === id ? result : item
      ));
      
      return result;
    } catch (error: any) {
      // Revert optimistic update
      if (originalItem) {
        setData(prev => prev.map(item => 
          item.id === id ? originalItem : item
        ));
      }
      toast.error(`Failed to update: ${error.message}`);
      if (options.onError) options.onError('update', error);
      throw error;
    } finally {
      setActionLoading(null);
    }
  }, [data, options]);

  // Optimistic delete
  const deleteItem = useCallback(async (id: string) => {
    setActionLoading(id);
    
    // Optimistic delete
    const originalItem = data.find(item => item.id === id);
    setData(prev => prev.filter(item => item.id !== id));
    
    try {
      const { error } = await (supabase as any)
        .from(options.tableName)
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    } catch (error: any) {
      // Revert optimistic delete
      if (originalItem) {
        setData(prev => [...prev, originalItem]);
      }
      toast.error(`Failed to delete: ${error.message}`);
      if (options.onError) options.onError('delete', error);
      throw error;
    } finally {
      setActionLoading(null);
    }
  }, [data, options]);

  return {
    data,
    loading,
    actionLoading,
    create,
    update,
    delete: deleteItem,
    refresh: loadData
  };
}