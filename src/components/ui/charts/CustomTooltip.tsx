import React from 'react';

interface TooltipEntry {
  dataKey: string;
  value: number;
  color: string;
  name?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

// Format currency for tooltips
const formatCurrency = (amount: number) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else {
    return `₹${(amount / 1000).toFixed(0)}K`;
  }
};

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className="text-sm text-gray-700 dark:text-gray-300"
            style={{ color: entry.color }}
          >
            {entry.dataKey === 'amount'
              ? formatCurrency(entry.value)
              : entry.dataKey === 'transactions'
                ? `${entry.value} transactions`
                : `${entry.name}: ${formatCurrency(entry.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};
