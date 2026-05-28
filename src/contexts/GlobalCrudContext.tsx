import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CrudEvent {
  table: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  timestamp: number;
  data?: any;
}

interface GlobalCrudContextType {
  lastEvent: CrudEvent | null;
  triggerRefresh: (table: string) => void;
  isConnected: boolean;
  notifyOperation: (operation: string, table: string) => void;
}

const GlobalCrudContext = createContext<GlobalCrudContextType | undefined>(undefined);

export const useGlobalCrud = () => {
  const context = useContext(GlobalCrudContext);
  if (!context) {
    throw new Error('useGlobalCrud must be used within a GlobalCrudProvider');
  }
  return context;
};

export const GlobalCrudProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lastEvent, setLastEvent] = useState<CrudEvent | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Button operation notification (disabled to prevent false notifications)
  const notifyOperation = (operation: string, table: string) => {
    // Disabled to prevent false notifications from sidebar interactions
    // Only console log for debugging purposes
    console.log(`Button operation detected: ${operation} on ${table}`);
  };

  useEffect(() => {
    console.log('🔄 Starting enhanced global CRUD monitoring...');
    
    // Monitor all tables for real-time changes
    const tables = [
      'head_offices',
      'student_profiles', 
      'courses',
      'assignments',
      'certificates',
      'notifications',
      'user_courses',
      'user_assignments',
      'user_stats',
      'profiles',
      'user_roles',
      'menu_content',
      'photo_gallery',
      'bank_details',
      'state_master',
      'district_master',
      'course_categories',
      'news',
      'visions',
      'missions',
      'director_messages',
      'contact_us',
      'enquiries',
      'employees',
      'course_master'
    ];

    const channels: any[] = [];

    tables.forEach(table => {
      const channel = supabase
        .channel(`global-${table}-changes`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: table
        }, (payload: any) => {
          const event: CrudEvent = {
            table,
            operation: payload.eventType,
            timestamp: Date.now(),
            data: payload.new || payload.old
          };
          
          console.log(`🔄 Global CRUD Event: ${event.operation} on ${event.table}`, event.data);
          setLastEvent(event);
          
          // Disable automatic notifications to prevent spam from sidebar interactions
          // Only actual database operations should trigger notifications, not button clicks
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log(`✅ Global monitoring active for ${table}`);
          }
        });

      channels.push(channel);
    });

    // Monitor connection status
    const connectionChannel = supabase
      .channel('global-connection-status')
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
        if (status === 'SUBSCRIBED') {
          console.log('🌐 Global CRUD monitoring connected');
          // Removed automatic connection toast to reduce notification spam
        } else if (status === 'CLOSED') {
          console.log('❌ Global CRUD monitoring disconnected');
          // Only show disconnection errors, not routine connection changes
        }
      });

    channels.push(connectionChannel);

    return () => {
      console.log('🛑 Cleaning up global CRUD monitoring');
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, []);

  const triggerRefresh = (table: string) => {
    const event: CrudEvent = {
      table,
      operation: 'UPDATE',
      timestamp: Date.now()
    };
    setLastEvent(event);
    console.log(`🔄 Manual refresh triggered for ${table}`);
  };

  return (
    <GlobalCrudContext.Provider value={{
      lastEvent,
      triggerRefresh,
      isConnected,
      notifyOperation
    }}>
      {children}
    </GlobalCrudContext.Provider>
  );
};