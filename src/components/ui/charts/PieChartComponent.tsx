import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { CustomTooltip } from './CustomTooltip';

interface PieChartData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface PieChartComponentProps {
  data: PieChartData[];
  height?: number;
  showLegend?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  className?: string;
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
];

export const PieChartComponent: React.FC<PieChartComponentProps> = ({
  data,
  height = 300,
  showLegend = true,
  innerRadius = 0,
  outerRadius = 80,
  className = '',
}) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry: any) =>
              `${entry.name} ${(entry.percent * 100).toFixed(0)}%`
            }
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <CustomTooltip />
          {showLegend && <Legend wrapperStyle={{ color: 'currentColor' }} />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
