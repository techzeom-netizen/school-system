import React, { Suspense, ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
  showErrorDetails?: boolean;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * SuspenseWrapper combines ErrorBoundary and Suspense for comprehensive error handling and loading states.
 *
 * Usage:
 * <SuspenseWrapper fallback={<CustomLoader />}>
 *   <LazyComponent />
 * </SuspenseWrapper>
 */
const SuspenseWrapper: React.FC<SuspenseWrapperProps> = ({
  children,
  fallback,
  errorFallback,
  showErrorDetails = false,
  onError,
}) => {
  // Default loading fallback
  const defaultFallback = (
    <div className="flex items-center justify-center p-8">
      <LoadingSpinner size="lg" />
      <span className="ml-3 text-gray-600">Loading...</span>
    </div>
  );

  // Default error fallback
  const defaultErrorFallback = (
    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Something went wrong
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>
              This component encountered an error and couldn't be displayed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary
      fallback={errorFallback || defaultErrorFallback}
      showDetails={showErrorDetails}
      onError={onError}
    >
      <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
};

export default SuspenseWrapper;
