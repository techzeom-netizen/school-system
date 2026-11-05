import React from 'react';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  children,
  style,
}) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

// Text skeleton variants
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={`h-4 ${index === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
};

// Card skeleton
export const SkeletonCard: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div
      className={`p-6 bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
    >
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <SkeletonText lines={3} />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
};

// Avatar skeleton
export const SkeletonAvatar: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return (
    <Skeleton className={`${sizeClasses[size]} rounded-full ${className}`} />
  );
};

// Table skeleton
export const SkeletonTable: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 4, className = '' }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}
    >
      {/* Table header */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-20" />
          ))}
        </div>
      </div>

      {/* Table rows */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-4 w-16" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Chart skeleton
export const SkeletonChart: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div
      className={`p-6 bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
    >
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <div className="h-64 bg-gray-100 rounded-lg flex items-end justify-between px-4 py-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton
              key={index}
              className="w-8 bg-gray-300"
              style={{ height: `${Math.random() * 60 + 20}%` }}
            />
          ))}
        </div>
        <div className="flex justify-center space-x-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// List skeleton
export const SkeletonList: React.FC<{
  items?: number;
  showAvatar?: boolean;
  className?: string;
}> = ({ items = 5, showAvatar = false, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <div
          key={index}
          className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200"
        >
          {showAvatar && <SkeletonAvatar size="sm" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  );
};

// Dashboard stats skeleton
export const SkeletonStats: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="p-6 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-6 rounded" />
            </div>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
