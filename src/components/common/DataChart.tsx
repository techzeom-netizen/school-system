import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import { SkeletonChart } from './Skeleton';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface DataChartProps {
  title?: string;
  subtitle?: string;
  data: ChartData[];
  type?: 'bar' | 'line' | 'pie' | 'donut';
  loading?: boolean;
  error?: string;
  className?: string;
  height?: number;
  showLegend?: boolean;
  showValues?: boolean;
}

const DataChart: React.FC<DataChartProps> = ({
  title,
  subtitle,
  data,
  type = 'bar',
  loading = false,
  error,
  className = '',
  height = 300,
  showLegend = true,
  showValues = false,
}) => {
  if (loading) {
    return <SkeletonChart className={className} />;
  }

  if (error) {
    return (
      <div
        className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-red-200 dark:border-red-700 ${className}`}
      >
        <div className="flex items-center justify-center text-red-600 dark:text-red-400 mb-2">
          <svg
            className="h-8 w-8 mr-2"
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
          <span className="font-medium">Failed to load chart</span>
        </div>
        <p className="text-sm text-red-500 dark:text-red-400 text-center">
          {error}
        </p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const colors = [
    '#3B82F6',
    '#EF4444',
    '#10B981',
    '#F59E0B',
    '#8B5CF6',
    '#EC4899',
    '#06B6D4',
    '#84CC16',
  ];

  const renderBarChart = () => (
    <div className="space-y-4">
      <div className="h-64 flex items-end justify-between space-x-2">
        {data.map((item, index) => {
          const height = (item.value / maxValue) * 100;
          const color = item.color || colors[index % colors.length];

          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="relative w-full">
                <div
                  className="w-full bg-blue-500 rounded-t transition-all duration-500 ease-out"
                  style={{
                    height: `${height}%`,
                    backgroundColor: color,
                    minHeight: '4px',
                  }}
                />
                {showValues && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600 dark:text-gray-400">
                    {item.value}
                  </div>
                )}
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center truncate w-full">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;

    return (
      <div className="flex items-center space-x-6">
        <div className="relative w-48 h-48">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const startAngle = (cumulativePercentage / 100) * 360;
              const endAngle =
                ((cumulativePercentage + percentage) / 100) * 360;

              const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
              const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

              const largeArcFlag = percentage > 50 ? 1 : 0;
              const pathData = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z',
              ].join(' ');

              cumulativePercentage += percentage;

              return (
                <path
                  key={index}
                  d={pathData}
                  fill={item.color || colors[index % colors.length]}
                  className="transition-all duration-300 hover:opacity-80"
                />
              );
            })}
          </svg>
          {showValues && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-700 dark:text-gray-200">
                {total}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'pie':
      case 'donut':
        return renderPieChart();
      default:
        return renderBarChart();
    }
  };

  return (
    <ErrorBoundary>
      <div
        className={`p-6 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 ${className}`}
      >
        <div className="space-y-4">
          {/* Header */}
          {(title || subtitle) && (
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Chart */}
          <div style={{ height: `${height}px` }}>{renderChart()}</div>

          {/* Legend */}
          {showLegend && data.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4">
              {data.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor:
                        item.color || colors[index % colors.length],
                    }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {item.label}
                  </span>
                  {showValues && (
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      ({item.value})
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DataChart;
