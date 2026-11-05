import type { ColumnDef } from '@tanstack/react-table';
import {
  CalendarDays,
  Clock,
  Repeat,
  UserCheck,
  type LucideIcon,
} from 'lucide-react';
import { TanStackTable } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import {
  formatDate,
  getInitials,
  getTone,
  statusLabels,
  typeLabels,
  type ApprovalRequest,
  type ApprovalStatus,
  type ApprovalType,
} from './approvalInboxUtils';

const typeIcons: Record<ApprovalType, LucideIcon> = {
  leave: CalendarDays,
  shiftSwap: Repeat,
  overtime: Clock,
  regularization: UserCheck,
};

const typeTones: Record<ApprovalType, string> = {
  leave: 'bg-primary/10 text-primary',
  shiftSwap: 'bg-secondary text-secondary-foreground',
  overtime: 'bg-accent text-accent-foreground',
  regularization: 'bg-muted text-muted-foreground',
};

const statusTones: Record<ApprovalStatus, string> = {
  pending: 'bg-secondary text-secondary-foreground',
  approved: 'bg-primary/10 text-primary',
  rejected: 'bg-destructive/10 text-destructive',
};

export const EmployeeCell = ({ record }: { record: ApprovalRequest }) => (
  <div className="flex min-w-48 items-center gap-3">
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${getTone(record.id)}`}
      aria-hidden="true"
    >
      {getInitials(record.name)}
    </span>
    <div className="min-w-0">
      <p className="font-semibold text-foreground">{record.name}</p>
      <p className="text-xs text-muted-foreground">
        {record.department} · {record.position}
      </p>
    </div>
  </div>
);

export const RequestCell = ({ record }: { record: ApprovalRequest }) => {
  const Icon = typeIcons[record.type];

  return (
    <div className="min-w-48 space-y-1">
      <Badge
        variant="secondary"
        className={`gap-1 whitespace-nowrap ${typeTones[record.type]}`}
      >
        <Icon className="h-3 w-3" aria-hidden="true" />
        {typeLabels[record.type]}
      </Badge>
      <p className="text-sm font-semibold text-foreground">{record.title}</p>
      <p className="text-xs text-muted-foreground">{record.details}</p>
    </div>
  );
};

const DecidedColumns: ColumnDef<ApprovalRequest>[] = [
  {
    accessorKey: 'name',
    header: 'Employee',
    cell: ({ row }) => <EmployeeCell record={row.original} />,
  },
  {
    accessorKey: 'title',
    header: 'Request',
    cell: ({ row }) => <RequestCell record={row.original} />,
  },
  {
    accessorKey: 'submittedOn',
    header: 'Submitted on',
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {formatDate(getValue<string>())}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Decision',
    cell: ({ row }) => (
      <div className="space-y-1 whitespace-nowrap">
        <Badge variant="secondary" className={statusTones[row.original.status]}>
          {statusLabels[row.original.status]}
        </Badge>
        <p className="text-xs text-muted-foreground">
          on {formatDate(row.original.decidedOn)}
        </p>
      </div>
    ),
  },
  {
    accessorKey: 'note',
    header: 'Your note',
    enableSorting: false,
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue<string>() || '—'}</span>
    ),
  },
];

export const DecidedRequestsTable = ({
  records,
  emptyMessage,
}: {
  records: ApprovalRequest[];
  emptyMessage: string;
}) => (
  <TanStackTable
    data={records}
    columns={DecidedColumns}
    enableSearch={false}
    enablePagination
    showDownload={true}
    pageSize={8}
    pageSizeOptions={[8, 10, 20]}
    getRowId={record => record.id}
    emptyMessage={emptyMessage}
  />
);
