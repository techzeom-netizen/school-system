import React from 'react';
import LoadingSpinner from '@/components/ui/loading-spinner';

/**
 * Collection of reusable loading fallback components for different scenarios
 */

// Basic loading fallback
export const BasicLoadingFallback: React.FC<{ message?: string }> = ({
  message = 'Loading...',
}) => (
  <div className="flex items-center justify-center p-8">
    <LoadingSpinner size="lg" />
    <span className="ml-3 text-gray-600">{message}</span>
  </div>
);

// Page loading fallback
export const PageLoadingFallback: React.FC<{ message?: string }> = ({
  message = 'Loading page...',
}) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
    <LoadingSpinner size="xl" />
    <p className="mt-4 text-lg text-gray-600">{message}</p>
    <p className="mt-2 text-sm text-gray-500">
      Please wait while we load your content
    </p>
  </div>
);

// Data loading fallback
export const DataLoadingFallback: React.FC<{ message?: string }> = ({
  message = 'Loading data...',
}) => (
  <div className="flex items-center justify-center p-6 border border-gray-200 rounded-lg bg-gray-50">
    <LoadingSpinner size="md" />
    <span className="ml-3 text-gray-600">{message}</span>
  </div>
);

// Skeleton loading for tables
export const TableLoadingFallback: React.FC = () => (
  <div className="space-y-3 p-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="flex space-x-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/8"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        </div>
      </div>
    ))}
  </div>
);

// Skeleton loading for cards
export const CardLoadingFallback: React.FC = () => (
  <div className="p-6 border border-gray-200 rounded-lg bg-white animate-pulse">
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  </div>
);

// Chart loading fallback
export const ChartLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center h-64 border border-gray-200 rounded-lg bg-gray-50">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="mt-2 text-gray-600">Loading chart data...</p>
    </div>
  </div>
);

// Authentication loading fallback
export const AuthLoadingFallback: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <LoadingSpinner size="xl" />
    <p className="mt-4 text-lg text-gray-600">Authenticating...</p>
    <p className="mt-2 text-sm text-gray-500">
      Please wait while we verify your credentials
    </p>
  </div>
);

// Route loading fallback
export const RouteLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-[300px]">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="mt-2 text-gray-600">Loading route...</p>
    </div>
  </div>
);
