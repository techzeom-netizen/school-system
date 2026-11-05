import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import { SkeletonCard } from './Skeleton';
import { useTheme } from '../../hooks/useTheme';

interface DataCardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  value?: string | number;
  change?: {
    value: string | number;
    type: 'positive' | 'negative' | 'neutral';
  };
  loading?: boolean;
  error?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const DataCard: React.FC<DataCardProps> = ({
  title,
  subtitle,
  icon,
  value,
  change,
  loading = false,
  error,
  className = '',
  children,
  onClick,
}) => {
  // Get dark mode state from theme context
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  if (loading) {
    return <SkeletonCard className={className} />;
  }

  if (error) {
    return (
      <div
        className={`p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm border ${isDarkMode ? 'border-red-700' : 'border-red-200'} ${className}`}
      >
        <div
          className={`flex items-center ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}
        >
          <svg
            className="h-5 w-5 mr-2"
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
          <span className="text-sm font-medium">Failed to load data</span>
        </div>
        <p
          className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-500'} mt-1`}
        >
          {error}
        </p>
      </div>
    );
  }

  const getChangeColor = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive':
        return isDarkMode
          ? 'text-green-400 bg-green-900/20'
          : 'text-green-600 bg-green-100';
      case 'negative':
        return isDarkMode
          ? 'text-red-400 bg-red-900/20'
          : 'text-red-600 bg-red-100';
      default:
        return isDarkMode
          ? 'text-gray-400 bg-gray-700'
          : 'text-gray-600 bg-gray-100';
    }
  };

  const getChangeIcon = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive':
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 17l9.2-9.2M17 17V7H7"
            />
          </svg>
        );
      case 'negative':
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 7l-9.2 9.2M7 7v10h10"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 12H4"
            />
          </svg>
        );
    }
  };

  return (
    <ErrorBoundary>
      <div
        className={`data-card p-6 rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md ${
          onClick
            ? `cursor-pointer ${isDarkMode ? 'hover:border-gray-600' : 'hover:border-gray-300'}`
            : ''
        } ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} ${
          isDarkMode ? '' : className
        }`}
        onClick={onClick}
        style={{
          backgroundColor: isDarkMode ? '#1f2937' : 'var(--card-bg)',
          borderColor: isDarkMode ? '#374151' : 'var(--card-border)',
          ...(isDarkMode && { backgroundImage: 'none' }),
        }}
      >
        {children ? (
          children
        ) : (
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {icon && (
                  <div
                    className={`p-2 ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-100'} rounded-lg`}
                  >
                    {icon}
                  </div>
                )}
                <div>
                  {title && (
                    <h3
                      className={`data-card-title text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                      style={{ color: isDarkMode ? '#ffffff' : undefined }}
                    >
                      {title}
                    </h3>
                  )}
                  {subtitle && (
                    <p
                      className={`data-card-subtitle text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                      style={{ color: isDarkMode ? '#9ca3af' : undefined }}
                    >
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Value */}
            {value !== undefined && (
              <div
                className={`data-card-value text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                style={{ color: isDarkMode ? '#ffffff' : undefined }}
              >
                {typeof value === 'number' ? value.toLocaleString() : value}
              </div>
            )}

            {/* Change indicator */}
            {change && (
              <div
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getChangeColor(change.type)}`}
              >
                {getChangeIcon(change.type)}
                <span className="ml-1">{change.value}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default DataCard;
