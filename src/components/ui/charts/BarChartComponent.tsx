import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { CustomTooltip } from './CustomTooltip';

interface BarChartData {
  name: string;
  amount: number;
  fill?: string;
}

interface BarChartComponentProps {
  data: BarChartData[];
  height?: number;
  showGrid?: boolean;
  angle?: number;
  barRadius?: [number, number, number, number];
  className?: string;
}

// Format currency for Y-axis
const formatCurrency = (amount: number) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else {
    return `₹${(amount / 1000).toFixed(0)}K`;
  }
};

export const BarChartComponent: React.FC<BarChartComponentProps> = ({
  data,
  height = 300,
  showGrid = true,
  angle = -45,
  barRadius = [4, 4, 0, 0],
  className = '',
}) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-gray-200 dark:text-gray-700"
            />
          )}
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: 'currentColor' }}
            className="text-gray-700 dark:text-gray-300"
            angle={angle}
            textAnchor="end"
            height={angle !== 0 ? 80 : 30}
          />
          <YAxis
            tick={{ fontSize: 12, fill: 'currentColor' }}
            tickFormatter={formatCurrency}
            className="text-gray-700 dark:text-gray-300"
          />
          <CustomTooltip />
          <Bar dataKey="amount" radius={barRadius} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
