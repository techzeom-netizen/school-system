import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { CustomTooltip } from './CustomTooltip';

interface LineChartData {
  name: string;
  [key: string]: string | number;
}

interface LineData {
  dataKey: string;
  stroke: string;
  strokeWidth?: number;
  dot?: {
    fill: string;
    strokeWidth: number;
    r: number;
  };
  name: string;
  yAxisId?: string;
}

interface LineChartComponentProps {
  data: LineChartData[];
  lines: LineData[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  angle?: number;
  leftYAxisFormatter?: (value: number) => string;
  rightYAxisFormatter?: (value: number) => string;
  className?: string;
}

export const LineChartComponent: React.FC<LineChartComponentProps> = ({
  data,
  lines,
  height = 300,
  showGrid = true,
  showLegend = true,
  angle = -45,
  leftYAxisFormatter,
  rightYAxisFormatter,
  className = '',
}) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
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
          {leftYAxisFormatter && (
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12, fill: 'currentColor' }}
              className="text-gray-700 dark:text-gray-300"
              tickFormatter={leftYAxisFormatter}
            />
          )}
          {rightYAxisFormatter && (
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12, fill: 'currentColor' }}
              className="text-gray-700 dark:text-gray-300"
              tickFormatter={rightYAxisFormatter}
            />
          )}
          <CustomTooltip />
          {showLegend && <Legend wrapperStyle={{ color: 'currentColor' }} />}
          {lines.map((line, index) => (
            <Line
              key={index}
              yAxisId={line.yAxisId}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.stroke}
              strokeWidth={line.strokeWidth || 3}
              dot={line.dot}
              name={line.name}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
