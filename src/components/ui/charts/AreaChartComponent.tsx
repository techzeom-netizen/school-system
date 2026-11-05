import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { CustomTooltip } from './CustomTooltip';

interface AreaChartData {
  [key: string]: string | number;
}

interface AreaData {
  dataKey: string;
  stroke: string;
  fill: string;
  strokeWidth?: number;
  name?: string;
  type?:
    | 'monotone'
    | 'linear'
    | 'natural'
    | 'step'
    | 'stepBefore'
    | 'stepAfter';
}

interface AreaChartComponentProps {
  data: AreaChartData[];
  areas: AreaData[];
  xAxisKey?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  angle?: number;
  xAxisFormatter?: (value: string | number) => string;
  yAxisFormatter?: (value: number) => string;
  tooltipStyles?: React.CSSProperties;
  className?: string;
}

export const AreaChartComponent: React.FC<AreaChartComponentProps> = ({
  data,
  areas,
  xAxisKey = 'date',
  height = 300,
  showGrid = true,
  showLegend = false,
  angle = 0,
  xAxisFormatter,
  yAxisFormatter,
  tooltipStyles,
  className = '',
}) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-gray-200 dark:text-gray-700"
            />
          )}
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 12, fill: 'currentColor' }}
            className="text-gray-700 dark:text-gray-300"
            angle={angle}
            textAnchor={angle !== 0 ? 'end' : 'middle'}
            height={angle !== 0 ? 80 : 30}
            tickFormatter={xAxisFormatter}
          />
          <YAxis
            tick={{ fontSize: 12, fill: 'currentColor' }}
            className="text-gray-700 dark:text-gray-300"
            tickFormatter={yAxisFormatter}
          />
          {tooltipStyles ? (
            <Tooltip contentStyle={tooltipStyles} />
          ) : (
            <CustomTooltip />
          )}
          {showLegend && <Legend wrapperStyle={{ color: 'currentColor' }} />}
          {areas.map((area, index) => (
            <Area
              key={index}
              type={area.type || 'monotone'}
              dataKey={area.dataKey}
              stroke={area.stroke}
              fill={area.fill}
              strokeWidth={area.strokeWidth || 2}
              name={area.name}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
