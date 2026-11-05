import React from 'react';
import { Card } from '../ui';

interface StatItem {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  change?: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
}

interface StatsGridProps {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  columns = 4,
  className = '',
}) => {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const getChangeColor = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return 'text-green-600 dark:text-green-400';
      case 'decrease':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getChangeIcon = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
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
      case 'decrease':
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
    <div className={`grid ${gridCols[columns]} gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {stat.title}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              {stat.change && (
                <div
                  className={`flex items-center mt-2 text-sm ${getChangeColor(stat.change.type)}`}
                >
                  {getChangeIcon(stat.change.type)}
                  <span className="ml-1">{stat.change.value}</span>
                </div>
              )}
            </div>
            <div
              className={`p-3 rounded-lg ${stat.iconBgColor || 'bg-gray-100 dark:bg-gray-800'}`}
            >
              <div
                className={`w-6 h-6 ${stat.iconColor || 'text-gray-600 dark:text-gray-400'}`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsGrid;
