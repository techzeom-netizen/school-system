import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthLoadingFallback, SuspenseWrapper } from '@/components/common';

interface AuthSuspenseProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * AuthSuspense component handles authentication loading states and wraps content
 * with both authentication checks and Suspense boundaries
 */
export const AuthSuspense: React.FC<AuthSuspenseProps> = ({
  children,
  fallback,
}) => {
  const { isLoading } = useAuth();

  // Show authentication loading while checking auth state
  if (isLoading) {
    return <>{fallback || <AuthLoadingFallback />}</>;
  }

  // Wrap children with SuspenseWrapper for error handling and loading states
  return <SuspenseWrapper fallback={fallback}>{children}</SuspenseWrapper>;
};

export default AuthSuspense;
