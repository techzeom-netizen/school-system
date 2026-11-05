import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import type { LoanRecord, RecordStatus, RecordType } from './loanAdvanceTypes';
import {
  formatCurrency,
  getEmi,
  getInitials,
  getOutstanding,
  statusConfig,
  typeBadgeClass,
} from './loanAdvanceData';
export const requestColumns: ColumnDef<LoanRecord>[] = [
  {
    accessorKey: 'employee',
    header: 'Employee',
    cell: ({ row }) => (
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {getInitials(row.original.employee)}
        </span>
        <div className="min-w-0">
          <p className="truncate font-medium">{row.original.employee}</p>
          <p className="truncate text-xs text-muted-foreground">
            {row.original.purpose}
          </p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ getValue }) => {
      const type = getValue<RecordType>();
      return (
        <Badge variant="secondary" className={typeBadgeClass[type]}>
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<RecordStatus>();
      const { label, dotClass, textClass } = statusConfig[status];
      return (
        <span
          className={`flex items-center gap-2 text-sm font-medium ${textClass}`}
        >
          <span
            className={`h-2 w-2 rounded-full ${dotClass}`}
            aria-hidden="true"
          />
          {label}
        </span>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ getValue }) => (
      <span className="font-medium">{formatCurrency(getValue<number>())}</span>
    ),
  },
  {
    id: 'repayment',
    header: 'Repayment',
    cell: ({ row }) => {
      const { paidMonths, months } = row.original;
      const percent = Math.min(Math.round((paidMonths / months) * 100), 100);
      return (
        <div className="min-w-[8rem]">
          <div
            className="h-2 w-full rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Repayment progress"
          >
            <div
              className={`h-2 rounded-full ${
                row.original.type === 'Loan'
                  ? 'bg-primary'
                  : 'bg-secondary-foreground'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            EMI {formatCurrency(getEmi(row.original))} Â· {paidMonths} of{' '}
            {months} paid
          </p>
        </div>
      );
    },
  },
  {
    id: 'outstanding',
    header: 'Outstanding',
    cell: ({ row }) => (
      <span className="font-semibold">
        {formatCurrency(getOutstanding(row.original))}
      </span>
    ),
  },
];
