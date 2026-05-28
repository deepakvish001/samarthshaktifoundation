import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Users, Circle, Clock } from 'lucide-react';
import { useAdminPresence } from '@/hooks/useAdminPresence';

interface AdminPresenceIndicatorProps {
  currentSection?: string;
  showSectionUsers?: boolean;
  showOnlineCount?: boolean;
}

export const AdminPresenceIndicator: React.FC<AdminPresenceIndicatorProps> = ({
  currentSection,
  showSectionUsers = false,
  showOnlineCount = true
}) => {
  const { 
    onlineAdmins, 
    getAdminsInSection, 
    getOnlineCount, 
    isConnected,
    updateCurrentSection 
  } = useAdminPresence(currentSection);

  React.useEffect(() => {
    if (currentSection && isConnected) {
      updateCurrentSection(currentSection);
    }
  }, [currentSection, isConnected, updateCurrentSection]);

  const sectionAdmins = showSectionUsers && currentSection ? getAdminsInSection(currentSection) : [];
  const onlineCount = getOnlineCount();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'away':
        return 'text-yellow-500';
      case 'busy':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isConnected) {
    return (
      <div className="flex items-center text-gray-400 text-sm">
        <Circle className="h-3 w-3 mr-1" />
        <span>Connecting...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {/* Online Count */}
      {showOnlineCount && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                <Users className="h-4 w-4 text-green-600" />
                <span className="text-green-700 font-medium text-sm">{onlineCount}</span>
                <Circle className="h-2 w-2 fill-green-500 text-green-500" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{onlineCount} admin{onlineCount !== 1 ? 's' : ''} online</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Section Users */}
      {showSectionUsers && sectionAdmins.length > 0 && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Active in this section:</span>
          <div className="flex -space-x-2">
            {sectionAdmins.slice(0, 3).map((admin) => (
              <TooltipProvider key={admin.user_id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <Avatar className="h-8 w-8 border-2 border-white">
                        <AvatarImage src={admin.avatar_url} alt={admin.full_name} />
                        <AvatarFallback className="bg-blue-500 text-white text-xs">
                          {getInitials(admin.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <Circle 
                        className={`absolute -bottom-1 -right-1 h-3 w-3 ${getStatusColor(admin.status)} fill-current border-2 border-white rounded-full`} 
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-center">
                      <p className="font-medium">{admin.full_name}</p>
                      <p className="text-xs text-gray-500">{admin.email}</p>
                      <div className="flex items-center justify-center space-x-1 mt-1">
                        <Circle className={`h-2 w-2 ${getStatusColor(admin.status)} fill-current`} />
                        <span className="text-xs capitalize">{admin.status}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-1 mt-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {new Date(admin.last_activity).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
            {sectionAdmins.length > 3 && (
              <div className="flex items-center justify-center h-8 w-8 bg-gray-100 border-2 border-white rounded-full">
                <span className="text-xs text-gray-600">+{sectionAdmins.length - 3}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* All Online Admins (expandable list) */}
      {onlineAdmins.length > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                <Users className="h-3 w-3 mr-1" />
                Online Admins
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-md">
              <div className="space-y-2">
                <p className="font-medium">Currently Online:</p>
                {onlineAdmins.map((admin) => (
                  <div key={admin.user_id} className="flex items-center space-x-2 p-2 bg-white rounded border">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={admin.avatar_url} alt={admin.full_name} />
                      <AvatarFallback className="bg-blue-500 text-white text-xs">
                        {getInitials(admin.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{admin.full_name}</p>
                      {admin.current_section && (
                        <p className="text-xs text-gray-500 truncate">
                          Working on: {admin.current_section.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                      )}
                    </div>
                    <Circle className={`h-2 w-2 ${getStatusColor(admin.status)} fill-current`} />
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};