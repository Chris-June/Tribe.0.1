import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Toast } from '@/components/ui/common/Toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    Toast.error(
      'Authentication Required',
      'Please sign in to access this page'
    );
    
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
