import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface ChartContainerProps {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  children: React.ReactNode;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  icon: Icon,
  iconColor = 'text-blue-600',
  children,
  className = '',
}) => {
  return (
    <Card
      className={`bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Icon className={`w-5 h-5 ${iconColor}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-gray-900 dark:text-gray-100">
        {children}
      </CardContent>
    </Card>
  );
};
