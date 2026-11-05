import React from 'react';

// Props interfaces - export these so other components can use them
export interface Transaction {
  sn: number;
  date: string;
  particulars: string;
  vType: string;
  vchNo: string;
  accType: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface TransactionSummary {
  totalDebit: number;
  totalCredit: number;
  openingBalance: number;
  closingBalance: number;
}

export interface TransactionTableProps {
  title: string;
  transactions: Transaction[];
  summary: TransactionSummary;
  showVoucherType?: boolean;
  showAccountType?: boolean;
  className?: string;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  title,
  transactions,
  summary,
  showVoucherType = true,
  showAccountType = true,
  className = '',
}) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getVoucherTypeColor = (vType: string): string => {
    switch (vType) {
      case 'Rct':
      case 'Receipt':
        return 'text-green-600 bg-green-50';
      case 'Pyt':
      case 'Payment':
        return 'text-red-600 bg-red-50';
      case 'Jrn':
      case 'Journal':
        return 'text-blue-600 bg-blue-50';
      case 'Contra':
        return 'text-purple-600 bg-purple-50';
      case 'Transfer':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-center">{title}</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-center font-semibold border">
                S.N.
              </th>
              <th className="px-4 py-3 text-left font-semibold border">DATE</th>
              <th className="px-4 py-3 text-left font-semibold border">
                PARTICULARS
              </th>
              {showVoucherType && (
                <th className="px-4 py-3 text-center font-semibold border">
                  V.TYPE
                </th>
              )}
              <th className="px-4 py-3 text-center font-semibold border">
                VCH NO
              </th>
              {showAccountType && (
                <th className="px-4 py-3 text-center font-semibold border">
                  ACC TYPE
                </th>
              )}
              <th className="px-4 py-3 text-right font-semibold border">
                DEBIT
              </th>
              <th className="px-4 py-3 text-right font-semibold border">
                CREDIT
              </th>
              <th className="px-4 py-3 text-right font-semibold border">
                BALANCE
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.sn} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-center border">
                  {transaction.sn}
                </td>
                <td className="px-4 py-2 border">{transaction.date}</td>
                <td className="px-4 py-2 border">{transaction.particulars}</td>
                {showVoucherType && (
                  <td className="px-4 py-2 text-center border">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getVoucherTypeColor(transaction.vType)}`}
                    >
                      {transaction.vType}
                    </span>
                  </td>
                )}
                <td className="px-4 py-2 text-center border font-mono">
                  {transaction.vchNo}
                </td>
                {showAccountType && (
                  <td className="px-4 py-2 text-center border">
                    {transaction.accType}
                  </td>
                )}
                <td className="px-4 py-2 text-right border font-mono">
                  {transaction.debit > 0
                    ? formatCurrency(transaction.debit)
                    : '-'}
                </td>
                <td className="px-4 py-2 text-right border font-mono">
                  {transaction.credit > 0
                    ? formatCurrency(transaction.credit)
                    : '-'}
                </td>
                <td className="px-4 py-2 text-right border font-mono font-semibold">
                  {formatCurrency(transaction.balance)}
                </td>
              </tr>
            ))}

            {/* Summary Row */}
            <tr className="bg-gray-100 font-semibold">
              <td
                colSpan={
                  (showVoucherType ? 1 : 0) + (showAccountType ? 1 : 0) + 4 // S.N., DATE, PARTICULARS, VCH NO
                }
                className="px-4 py-3 border text-right"
              >
                Total
              </td>
              <td className="px-4 py-3 border text-right font-mono">
                {formatCurrency(summary.totalDebit)}
              </td>
              <td className="px-4 py-3 border text-right font-mono">
                {formatCurrency(summary.totalCredit)}
              </td>
              <td className="px-4 py-3 border text-right font-mono">
                {formatCurrency(summary.closingBalance)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      <div className="bg-gray-50 px-6 py-4 border-t">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-gray-600">Opening Balance</div>
            <div className="text-lg font-bold text-blue-600">
              {formatCurrency(summary.openingBalance)}
            </div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-600">Total Debit</div>
            <div className="text-lg font-bold text-green-600">
              {formatCurrency(summary.totalDebit)}
            </div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-600">Total Credit</div>
            <div className="text-lg font-bold text-red-600">
              {formatCurrency(summary.totalCredit)}
            </div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-600">Closing Balance</div>
            <div className="text-lg font-bold text-purple-600">
              {formatCurrency(summary.closingBalance)}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="px-6 py-3 bg-gray-50 border-t text-center text-sm text-gray-600">
        Generated on {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default TransactionTable;
