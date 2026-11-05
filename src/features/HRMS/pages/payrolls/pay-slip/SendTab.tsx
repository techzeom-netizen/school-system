import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Send } from 'lucide-react';
import { TanStackTable } from '@/components/common';
import { Button } from '@/components/ui/button';
import {
  formatCurrency,
  formatDate,
  getNet,
  type PayslipRecord,
} from './payslipUtils';
import { PersonCell } from './payslipShared';

interface SendTabProps {
  records: PayslipRecord[];
  currentMonth: string;
  onView: (record: PayslipRecord) => void;
  onResend: (record: PayslipRecord) => void;
}

const SendTab = ({ records, currentMonth, onView, onResend }: SendTabProps) => {
  const columns = useMemo<ColumnDef<PayslipRecord>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Employee',
        cell: ({ row }) => <PersonCell record={row.original} />,
      },
      {
        id: 'net',
        header: 'Take-home pay',
        accessorFn: record => getNet(record),
        cell: ({ row }) => (
          <span className="whitespace-nowrap font-semibold">
            {formatCurrency(getNet(row.original))}
          </span>
        ),
      },
      {
        accessorKey: 'sentOn',
        header: 'Sent on',
        cell: ({ row }) => (
          <span className="whitespace-nowrap">
            {formatDate(row.original.sentOn)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onView(row.original)}
            >
              View
            </Button>
            {row.original.month === currentMonth && (
              <Button
                type="button"
                size="sm"
                onClick={() => onResend(row.original)}
              >
                <Send className="h-4 w-4" aria-hidden="true" /> Send again
              </Button>
            )}
          </div>
        ),
      },
    ],
    [currentMonth, onResend, onView]
  );

  return (
    <TanStackTable
      data={records}
      columns={columns}
      enableSearch={false}
      enablePagination
      pageSize={8}
      pageSizeOptions={[8, 10, 20]}
      getRowId={record => record.id}
      emptyMessage="No payslip has been sent for this month yet."
    />
  );
};

export default SendTab;
