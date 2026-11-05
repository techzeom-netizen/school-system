import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileClock,
  Stethoscope,
  Umbrella,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import TanStackTable from '@/components/common/TanStackTable';
import {
  leaveMonthFilterOptions,
  leaveStatusFilterOptions,
  leaveYearFilterOptions,
} from '@/data/reusableDropdownData';

type LeaveStatus = 'Approved' | 'Rejected' | 'Pending';

interface LeaveRecord {
  id: string;
  requestedOn: string;
  date: string;
  leaveType: string;
  reason: string;
  status: LeaveStatus;
  approvedBy: string;
}

interface LeaveBalance {
  type: string;
  total: number;
  remaining: number;
  icon: LucideIcon;
}

const leaveBalances: LeaveBalance[] = [
  { type: 'Annual Leave', total: 18, remaining: 12, icon: Umbrella },
  { type: 'Sick Leave', total: 10, remaining: 8, icon: Stethoscope },
  { type: 'Casual Leave', total: 7, remaining: 5, icon: CalendarDays },
  { type: 'Personal Leave', total: 5, remaining: 4, icon: FileClock },
];

const leaveRecords: LeaveRecord[] = [
  {
    id: 'leave-001',
    requestedOn: '2026-01-12',
    date: '2026-01-20',
    leaveType: 'Annual Leave',
    reason: 'Family commitment',
    status: 'Approved',
    approvedBy: 'Pooja Sharma',
  },
  {
    id: 'leave-002',
    requestedOn: '2026-02-08',
    date: '2026-02-14',
    leaveType: 'Sick Leave',
    reason: 'Medical appointment',
    status: 'Approved',
    approvedBy: 'Pooja Sharma',
  },
  {
    id: 'leave-003',
    requestedOn: '2026-04-18',
    date: '2026-04-25',
    leaveType: 'Casual Leave',
    reason: 'Personal work',
    status: 'Rejected',
    approvedBy: 'Rahul Mehta',
  },
  {
    id: 'leave-004',
    requestedOn: '2026-06-02',
    date: '2026-06-10',
    leaveType: 'Annual Leave',
    reason: 'Travel',
    status: 'Pending',
    approvedBy: '—',
  },
  {
    id: 'leave-005',
    requestedOn: '2026-10-05',
    date: '2026-10-16',
    leaveType: 'Casual Leave',
    reason: 'Personal appointment',
    status: 'Pending',
    approvedBy: '—',
  },
];

const statusStyles: Record<LeaveStatus, string> = {
  Approved: 'bg-primary/10 text-primary',
  Rejected: 'bg-destructive/10 text-destructive',
  Pending: 'bg-secondary text-secondary-foreground',
};

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const columns: ColumnDef<LeaveRecord>[] = [
  {
    id: '0',
    header: 'S.No.',
    cell: ({ row }) => row.index + 1,
    size: 20,
  },
  {
    accessorKey: 'requestedOn',
    header: 'Leave Requested',
    cell: ({ getValue }) => formatDate(getValue<string>()),
    size: 60,
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ getValue }) => formatDate(getValue<string>()),
    size: 30,
  },
  {
    accessorKey: 'leaveType',
    header: 'Leave Type',
    size: 30,
  },
  {
    accessorKey: 'reason',
    header: 'Reason',
    size: 60,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<LeaveStatus>();

      return (
        <span
          className={`inline-flex min-w-[88px] items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${statusStyles[status]}`}
        >
          {status === 'Approved' && (
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {status === 'Rejected' && (
            <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {status === 'Pending' && (
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {status}
        </span>
      );
    },
    size: 60,
  },
  {
    accessorKey: 'approvedBy',
    header: 'Approved By',
    size: 60,
  },
];

const LeavesTab = () => {
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredRecords = useMemo(
    () =>
      leaveRecords.filter(record => {
        const matchesYear =
          selectedYear === 'all' || record.date.slice(0, 4) === selectedYear;
        const matchesMonth =
          selectedMonth === 'all' || record.date.slice(5, 7) === selectedMonth;
        const matchesStatus =
          selectedStatus === 'all' || record.status === selectedStatus;

        return matchesYear && matchesMonth && matchesStatus;
      }),
    [selectedMonth, selectedStatus, selectedYear]
  );

  return (
    <>
      <Section title="Leave Requests">
        <div className="min-w-0 space-y-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-end">
            <div className="grid w-auto gap-3 sm:grid-cols-2 xl:w-auto xl:grid-cols-3">
              <FormField
                label="Year"
                name="leave-year"
                type="select"
                value={selectedYear}
                onChange={setSelectedYear}
                options={leaveYearFilterOptions}
              />
              <FormField
                label="Month"
                name="leave-month"
                type="select"
                value={selectedMonth}
                onChange={setSelectedMonth}
                options={leaveMonthFilterOptions}
              />
              <FormField
                label="Status"
                name="leave-status"
                type="select"
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={leaveStatusFilterOptions}
              />
            </div>
          </div>

          <section
            aria-label="Leave balance summary"
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
          >
            {leaveBalances.map(balance => {
              const Icon = balance.icon;
              const used = balance.total - balance.remaining;
              const usedPercentage = (used / balance.total) * 100;

              return (
                <Card
                  key={balance.type}
                  className="min-w-0 border-border bg-card"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-muted-foreground">
                          {balance.type}
                        </p>
                        <p className="mt-3 flex items-baseline gap-1">
                          <span className="text-2xl font-semibold text-card-foreground">
                            {balance.remaining}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            remaining of {balance.total} days
                          </span>
                        </p>
                      </div>
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </div>
                    <div
                      className="mt-4 h-2 overflow-hidden rounded-auto"
                      role="progressbar"
                      aria-label={`${balance.type} used`}
                      aria-valuemin={0}
                      aria-valuemax={balance.total}
                      aria-valuenow={used}
                    >
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${usedPercentage}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {used} used · {balance.total} days total
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          <div className="min-w-0 overflow-hidden rounded-md">
            <TanStackTable
              data={filteredRecords}
              columns={columns}
              enableSorting={false}
              className="space-y-0"
              getRowId={record => record.id}
              emptyMessage="No leave requests match the selected filters."
            />
          </div>
        </div>
      </Section>
    </>
  );
};

export default LeavesTab;
