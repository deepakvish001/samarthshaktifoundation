import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, Clock, User, FileText, Settings, Users, Database } from 'lucide-react';
import { useAdminPresence } from '@/hooks/useAdminPresence';
import { useGlobalCrud } from '@/contexts/GlobalCrudContext';

interface ActivityItem {
  id: string;
  type: 'crud' | 'presence' | 'system';
  action: string;
  user: {
    name: string;
    avatar?: string;
    email: string;
  };
  target?: string;
  section?: string;
  timestamp: string;
  details?: string;
}

export const AdminActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const { onlineAdmins } = useAdminPresence();
  const { lastEvent } = useGlobalCrud();

  // Add new activity when CRUD events occur
  useEffect(() => {
    if (lastEvent) {
      const newActivity: ActivityItem = {
        id: `${Date.now()}-${Math.random()}`,
        type: 'crud',
        action: lastEvent.operation.toLowerCase(),
        user: {
          name: 'Current Admin', // This would come from auth context in real app
          email: 'admin@example.com'
        },
        target: lastEvent.table,
        timestamp: new Date().toISOString(),
        details: `${lastEvent.operation} operation on ${lastEvent.table}`
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 49)]); // Keep last 50 activities
    }
  }, [lastEvent]);

  // Add presence activities when admins join/leave
  useEffect(() => {
    const currentTime = new Date().toISOString();
    
    onlineAdmins.forEach(admin => {
      const existingActivity = activities.find(
        activity => 
          activity.type === 'presence' && 
          activity.user.email === admin.email &&
          activity.action === 'joined'
      );

      if (!existingActivity) {
        const joinActivity: ActivityItem = {
          id: `join-${admin.user_id}-${Date.now()}`,
          type: 'presence',
          action: 'joined',
          user: {
            name: admin.full_name,
            email: admin.email,
            avatar: admin.avatar_url
          },
          section: admin.current_section,
          timestamp: currentTime
        };

        setActivities(prev => [joinActivity, ...prev.slice(0, 49)]);
      }
    });
  }, [onlineAdmins]);

  const getActivityIcon = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'crud':
        switch (activity.action) {
          case 'insert':
            return <Database className="h-4 w-4 text-green-600" />;
          case 'update':
            return <FileText className="h-4 w-4 text-blue-600" />;
          case 'delete':
            return <Database className="h-4 w-4 text-red-600" />;
          default:
            return <Activity className="h-4 w-4 text-gray-600" />;
        }
      case 'presence':
        return <User className="h-4 w-4 text-purple-600" />;
      case 'system':
        return <Settings className="h-4 w-4 text-orange-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityColor = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'crud':
        switch (activity.action) {
          case 'insert':
            return 'bg-green-50 text-green-700 border-green-200';
          case 'update':
            return 'bg-blue-50 text-blue-700 border-blue-200';
          case 'delete':
            return 'bg-red-50 text-red-700 border-red-200';
          default:
            return 'bg-gray-50 text-gray-700 border-gray-200';
        }
      case 'presence':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'system':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return time.toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="h-96">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center space-x-2">
          <Activity className="h-5 w-5 text-blue-600" />
          <span>Recent Activity</span>
          <Badge variant="secondary" className="ml-auto">
            {activities.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80 px-6">
          {activities.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Activity className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No recent activity</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pb-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg border ${getActivityColor(activity)}`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                        <AvatarFallback className="bg-blue-500 text-white text-xs">
                          {getInitials(activity.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm truncate">
                        {activity.user.name}
                      </span>
                    </div>
                    
                    <p className="text-sm mt-1">
                      {activity.type === 'crud' && (
                        <>
                          <span className="capitalize">{activity.action}</span>
                          {activity.target && (
                            <span> in <span className="font-medium">{activity.target.replace('_', ' ')}</span></span>
                          )}
                        </>
                      )}
                      {activity.type === 'presence' && (
                        <>
                          {activity.action === 'joined' ? 'Joined admin panel' : 'Left admin panel'}
                          {activity.section && (
                            <span> - Working on <span className="font-medium">{activity.section}</span></span>
                          )}
                        </>
                      )}
                    </p>
                    
                    {activity.details && (
                      <p className="text-xs text-gray-600 mt-1">{activity.details}</p>
                    )}
                  </div>
                  
                  <div className="flex-shrink-0 text-xs text-gray-500 flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatRelativeTime(activity.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};