import React from 'react';

// Types
export interface BalanceItem {
  name: string;
  amount: number;
  category: string;
}

export interface StatementFormProps {
  title: string;
  statementPeriod: string;
  headers: string[];
  data: {
    leftColumn: BalanceItem[];
    rightColumn: BalanceItem[];
  };
  totals: {
    leftColumn: number;
    rightColumn: number;
  };
  categoryStyles?: Record<string, string>;
  showFooter?: boolean;
}

// Default category styles
const DEFAULT_CATEGORY_STYLES: Record<string, string> = {
  LIABILITIES: 'font-medium',
  'CURRENT LIABILITIES': 'font-medium text-blue-600',
  ASSETS: 'font-medium',
  'CURRENT ASSETS': 'font-medium text-green-600',
  'TERM ASSETS': 'font-medium text-purple-600',
  LOSS: 'font-medium text-red-600',
};

const StatementForm: React.FC<StatementFormProps> = ({
  title,
  statementPeriod,
  headers,
  data,
  totals,
  categoryStyles = DEFAULT_CATEGORY_STYLES,
  showFooter = true,
}) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getCategoryStyle = (category: string): string => {
    return categoryStyles[category] || '';
  };

  // Calculate max rows for mapping
  const maxRows = Math.max(data.leftColumn.length, data.rightColumn.length);

  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-center">
          {title} FROM : {statementPeriod}
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              {headers.map((header, index) => (
                <th
                  key={header}
                  className={`px-4 py-3 font-semibold border ${
                    index % 2 === 0 ? 'text-left' : 'text-right'
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxRows }).map((_, rowIndex) => {
              const leftItem = data.leftColumn[rowIndex];
              const rightItem = data.rightColumn[rowIndex];

              return (
                <tr key={rowIndex} className="border-b hover:bg-gray-50">
                  {/* Left Column */}
                  <td className="px-4 py-2 border">
                    {leftItem && (
                      <span className={getCategoryStyle(leftItem.category)}>
                        {leftItem.name}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right border font-mono">
                    {leftItem && formatCurrency(leftItem.amount)}
                  </td>

                  {/* Right Column */}
                  <td className="px-4 py-2 border">
                    {rightItem && (
                      <span className={getCategoryStyle(rightItem.category)}>
                        {rightItem.name}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right border font-mono">
                    {rightItem && formatCurrency(rightItem.amount)}
                  </td>
                </tr>
              );
            })}

            {/* Total Row */}
            <tr className="bg-gray-100 font-semibold">
              <td className="px-4 py-3 border text-right">TOTAL :</td>
              <td className="px-4 py-3 border text-right font-mono">
                {formatCurrency(totals.leftColumn)}
              </td>
              <td className="px-4 py-3 border text-right">TOTAL :</td>
              <td className="px-4 py-3 border text-right font-mono">
                {formatCurrency(totals.rightColumn)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer Note */}
      {showFooter && (
        <div className="px-6 py-3 bg-gray-50 border-t text-center text-sm text-gray-600">
          Generated on {new Date().toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default StatementForm;
