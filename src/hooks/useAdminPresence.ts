import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface AdminUser {
  user_id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  current_section?: string;
  last_activity: string;
  status: 'online' | 'away' | 'busy';
}

interface PresenceState {
  [key: string]: AdminUser[];
}

export const useAdminPresence = (currentSection?: string) => {
  const [presenceState, setPresenceState] = useState<PresenceState>({});
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [onlineAdmins, setOnlineAdmins] = useState<AdminUser[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  // Initialize presence tracking
  useEffect(() => {
    const initializePresence = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get admin profile data
        const { data: adminProfile } = await supabase
          .from('admin_profiles')
          .select('full_name, email, profile_image_url')
          .eq('user_id', user.id)
          .single();

        if (!adminProfile) return;

        const adminUser: AdminUser = {
          user_id: user.id,
          full_name: adminProfile.full_name,
          email: adminProfile.email,
          avatar_url: adminProfile.profile_image_url,
          current_section: currentSection,
          last_activity: new Date().toISOString(),
          status: 'online'
        };

        setCurrentUser(adminUser);

        // Create admin presence channel
        const adminChannel = supabase.channel('admin-presence', {
          config: {
            presence: {
              key: user.id,
            },
          },
        });

        // Listen to presence events
        adminChannel
          .on('presence', { event: 'sync' }, () => {
            const state = adminChannel.presenceState<AdminUser>();
            setPresenceState(state);
            
            // Flatten presence state to get all online admins
            const allAdmins: AdminUser[] = [];
            Object.values(state).forEach(users => {
              allAdmins.push(...users);
            });
            setOnlineAdmins(allAdmins);
          })
          .on('presence', { event: 'join' }, ({ newPresences }) => {
            console.log('Admin joined:', newPresences);
          })
          .on('presence', { event: 'leave' }, ({ leftPresences }) => {
            console.log('Admin left:', leftPresences);
          });

        // Subscribe to channel
        adminChannel.subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            // Track current user presence
            await adminChannel.track(adminUser);
            setChannel(adminChannel);
          }
        });

        // Cleanup function
        return () => {
          adminChannel.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing admin presence:', error);
      }
    };

    initializePresence();
  }, [currentSection]);

  // Update current section when it changes
  const updateCurrentSection = useCallback(async (section: string) => {
    if (!channel || !currentUser) return;

    const updatedUser = {
      ...currentUser,
      current_section: section,
      last_activity: new Date().toISOString()
    };

    setCurrentUser(updatedUser);
    await channel.track(updatedUser);
  }, [channel, currentUser]);

  // Update status (online, away, busy)
  const updateStatus = useCallback(async (status: 'online' | 'away' | 'busy') => {
    if (!channel || !currentUser) return;

    const updatedUser = {
      ...currentUser,
      status,
      last_activity: new Date().toISOString()
    };

    setCurrentUser(updatedUser);
    await channel.track(updatedUser);
  }, [channel, currentUser]);

  // Get admins in specific section
  const getAdminsInSection = useCallback((section: string) => {
    return onlineAdmins.filter(admin => admin.current_section === section);
  }, [onlineAdmins]);

  // Get total online admins count
  const getOnlineCount = useCallback(() => {
    return onlineAdmins.filter(admin => admin.status === 'online').length;
  }, [onlineAdmins]);

  return {
    onlineAdmins,
    currentUser,
    presenceState,
    updateCurrentSection,
    updateStatus,
    getAdminsInSection,
    getOnlineCount,
    isConnected: !!channel
  };
};