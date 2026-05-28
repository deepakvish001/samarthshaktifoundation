import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: 'admin' | 'moderator' | 'user';
  fallbackPath?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true, 
  requireRole,
  fallbackPath = '/login'
}) => {
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();

  // Show loading spinner while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role requirement
  if (requireRole && (!user || !hasRole(requireRole))) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If not requiring auth and user is logged in, allow access
  return <>{children}</>;
};

export default AuthGuard;