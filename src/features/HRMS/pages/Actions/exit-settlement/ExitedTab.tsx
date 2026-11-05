import type { ColumnDef } from '@tanstack/react-table';
import { TanStackTable } from '@/components/common';
import type { ExitRecord } from '@/data/reusableDropdownData';
import { EmployeeCell } from './exitSettlementShared';
import { formatDate, formatMoney } from './exitSettlementUtils';

interface ExitedTabProps {
  records: ExitRecord[];
}

const columns: ColumnDef<ExitRecord>[] = [
  {
    accessorKey: 'name',
    header: 'Employee',
    cell: ({ row }) => <EmployeeCell record={row.original} />,
  },
  {
    accessorKey: 'lastWorkingDay',
    header: 'Last working day',
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {formatDate(getValue<string>())}
      </span>
    ),
  },
  {
    accessorKey: 'reason',
    header: 'Reason',
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'exitedOn',
    header: 'Paid on',
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {formatDate(row.original.exitedOn)}
        {row.original.paymentMode ? ` · ${row.original.paymentMode}` : ''}
      </span>
    ),
  },
  {
    accessorKey: 'finalAmount',
    header: 'Final amount',
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-semibold text-foreground">
        {row.original.finalAmount === null
          ? '—'
          : formatMoney(row.original.finalAmount)}
      </span>
    ),
  },
];

const ExitedTab = ({ records }: ExitedTabProps) => (
  <TanStackTable
    data={records}
    columns={columns}
    enableSearch={false}
    showDownload={true}
    enablePagination
    pageSize={8}
    pageSizeOptions={[8, 10, 20]}
    getRowId={record => record.id}
    emptyMessage="No one has left yet."
  />
);

export default ExitedTab;
