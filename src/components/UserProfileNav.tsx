import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  BookOpen, 
  Award,
  ChevronDown,
  GraduationCap
} from 'lucide-react';

const UserProfileNav = () => {
  const { user, profile, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  // Get display name with fallback logic
  const displayName = profile?.full_name || 
                     user.user_metadata?.full_name || 
                     user.email?.split('@')[0] || 
                     'User';
  
  console.log('UserProfileNav - User:', user);
  console.log('UserProfileNav - Profile:', profile);
  console.log('UserProfileNav - Display Name:', displayName);

  const initials = displayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-destructive text-destructive-foreground';
      case 'moderator':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleAdminClick = () => {
    navigate('/admin/dashboard');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center space-x-2 h-10 w-10 p-0 rounded-full hover:bg-muted/50 focus:bg-muted/50"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url || ''} alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-64 bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl z-[9999] p-1"
        sideOffset={5}
      >
        <DropdownMenuLabel className="flex items-center space-x-2 p-2 bg-muted/20 rounded-lg m-1">
          <Avatar className="h-10 w-10 border border-primary/20">
            <AvatarImage src={profile?.avatar_url || ''} alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-medium text-foreground text-sm truncate">{displayName}</span>
            <span className="text-xs text-muted-foreground truncate">{user.email}</span>
            {userRole && (
              <Badge 
                variant="secondary" 
                className={`text-xs w-fit mt-1 px-1.5 py-0.5 h-5 ${getRoleBadgeColor(userRole.role)}`}
              >
                {userRole.role}
              </Badge>
            )}
          </div>
        </DropdownMenuLabel>
        
        <div className="px-1 py-1 space-y-0.5">
          <DropdownMenuItem className="cursor-pointer p-2 rounded-md hover:bg-muted/50 transition-colors text-sm" onClick={() => navigate('/profile')}>
            <User className="h-4 w-4 mr-2 text-primary" />
            <span>Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer p-2 rounded-md hover:bg-muted/50 transition-colors text-sm" onClick={() => navigate('/my-courses')}>
            <BookOpen className="h-4 w-4 mr-2 text-primary" />
            <span>Courses</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer p-2 rounded-md hover:bg-muted/50 transition-colors text-sm" onClick={() => navigate('/my-certificates')}>
            <Award className="h-4 w-4 mr-2 text-primary" />
            <span>Certificates</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer p-2 rounded-md hover:bg-muted/50 transition-colors text-sm" onClick={() => navigate('/students-corner')}>
            <GraduationCap className="h-4 w-4 mr-2 text-primary" />
            <span>Students Corner</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer p-2 rounded-md hover:bg-muted/50 transition-colors text-sm" onClick={() => navigate('/settings')}>
            <Settings className="h-4 w-4 mr-2 text-primary" />
            <span>Settings</span>
          </DropdownMenuItem>
        </div>
        
        {userRole?.role === 'admin' && (
          <>
            <DropdownMenuSeparator className="my-1 mx-1" />
            <div className="px-1 py-1">
              <DropdownMenuItem 
                className="cursor-pointer p-2 rounded-md hover:bg-muted/50 transition-colors text-sm"
                onClick={handleAdminClick}
              >
                <Shield className="h-4 w-4 mr-2 text-orange-500" />
                <span>Admin</span>
              </DropdownMenuItem>
            </div>
          </>
        )}
        
        <DropdownMenuSeparator className="my-1 mx-1" />
        
        <div className="px-1 py-1">
          <DropdownMenuItem 
            className="cursor-pointer p-2 rounded-md text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors text-sm"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileNav;