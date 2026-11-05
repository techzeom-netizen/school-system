import React from 'react';
import { Card } from '../ui';

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
  status: 'success' | 'warning' | 'error' | 'info';
}

interface RecentActivityProps {
  title?: string;
  activities: ActivityItem[];
  maxItems?: number;
  className?: string;
}

const RecentActivity: React.FC<RecentActivityProps> = ({
  title,
  activities,
  maxItems = 5,
  className = '',
}) => {
  const getStatusColor = (status: 'success' | 'warning' | 'error' | 'info') => {
    switch (status) {
      case 'success':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'error':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20';
    }
  };

  const displayActivities = activities.slice(0, maxItems);

  return (
    <div className={className}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      )}
      <Card className="p-6">
        <div className="space-y-4">
          {displayActivities.map(activity => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(activity.status)}`}
              >
                <div className="w-4 h-4">{activity.icon}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        {activities.length > maxItems && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium">
              View all activities ({activities.length})
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default RecentActivity;
