import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  CalendarCheck,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  Clock3,
  Timer,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import TanStackTable from '@/components/common/TanStackTable';
import {
  attendanceMonthOptions,
  attendanceYearOptions,
} from '@/data/reusableDropdownData';

type AttendanceStatus =
  | 'Present'
  | 'Absent'
  | 'Holiday'
  | 'Weekly Off'
  | 'Half Day';

interface AttendanceRecord {
  id: string;
  date: string;
  status: AttendanceStatus;
  firstIn: string;
  lastOut: string;
  workingHours: string;
  overtimeHours: string;
}

const attendanceRecords: AttendanceRecord[] = [
  {
    id: '2026-10-01',
    date: 'Thu, 1 Oct',
    status: 'Absent',
    firstIn: '—',
    lastOut: '—',
    workingHours: '—',
    overtimeHours: '—',
  },
  {
    id: '2026-10-02',
    date: 'Fri, 2 Oct',
    status: 'Holiday',
    firstIn: '—',
    lastOut: '—',
    workingHours: '—',
    overtimeHours: '—',
  },
  {
    id: '2026-10-03',
    date: 'Sat, 3 Oct',
    status: 'Absent',
    firstIn: '—',
    lastOut: '—',
    workingHours: '—',
    overtimeHours: '—',
  },
  {
    id: '2026-10-04',
    date: 'Sun, 4 Oct',
    status: 'Weekly Off',
    firstIn: '—',
    lastOut: '—',
    workingHours: '—',
    overtimeHours: '—',
  },
  {
    id: '2026-10-05',
    date: 'Mon, 5 Oct',
    status: 'Present',
    firstIn: '09:12 AM',
    lastOut: '06:45 PM',
    workingHours: '8h 33m',
    overtimeHours: '1h 12m',
  },
  {
    id: '2026-10-06',
    date: 'Tue, 6 Oct',
    status: 'Absent',
    firstIn: '—',
    lastOut: '—',
    workingHours: '—',
    overtimeHours: '—',
  },
  {
    id: '2026-10-07',
    date: 'Wed, 7 Oct',
    status: 'Present',
    firstIn: '09:05 AM',
    lastOut: '06:32 PM',
    workingHours: '8h 12m',
    overtimeHours: '0h 45m',
  },
];

const statusStyles: Record<AttendanceStatus, string> = {
  Present: 'bg-primary/10 text-primary',
  Absent: 'bg-destructive/10 text-destructive',
  Holiday: 'bg-secondary text-secondary-foreground',
  'Weekly Off': 'bg-accent text-accent-foreground',
  'Half Day': 'bg-muted text-muted-foreground',
};

const statusIcons: Record<AttendanceStatus, LucideIcon> = {
  Present: CheckCircle2,
  Absent: XCircle,
  Holiday: CalendarDays,
  'Weekly Off': CalendarPlus,
  'Half Day': Clock3,
};

const summaryItems: {
  label: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  iconStyle: string;
  borderStyle: string;
}[] = [
  {
    label: 'Present',
    value: '4',
    unit: 'Days',
    icon: CalendarCheck,
    iconStyle: 'bg-primary/10 text-primary',
    borderStyle: 'border-b-primary/40',
  },
  {
    label: 'Absent',
    value: '2',
    unit: 'Days',
    icon: XCircle,
    iconStyle: 'bg-destructive/10 text-destructive',
    borderStyle: 'border-b-destructive/40',
  },
  {
    label: 'Late',
    value: '0',
    unit: 'Days',
    icon: Clock3,
    iconStyle: 'bg-accent text-accent-foreground',
    borderStyle: 'border-b-accent',
  },
  {
    label: 'Weekly Off',
    value: '1',
    unit: 'Day',
    icon: CalendarPlus,
    iconStyle: 'bg-secondary text-secondary-foreground',
    borderStyle: 'border-b-secondary-foreground/30',
  },
  {
    label: 'Overtime',
    value: '0',
    unit: 'Hours',
    icon: Timer,
    iconStyle: 'bg-muted text-muted-foreground',
    borderStyle: 'border-b-muted-foreground/30',
  },
];

const legendStatuses: AttendanceStatus[] = [
  'Present',
  'Absent',
  'Holiday',
  'Weekly Off',
  'Half Day',
];

const columns: ColumnDef<AttendanceRecord>[] = [
  {
    accessorKey: 'date',
    header: () => <span className="inline-flex items-center gap-2">Date</span>,
    cell: ({ row }) => (
      <div className="min-w-[96px]">
        <p className="font-medium text-card-foreground">{row.original.date}</p>
        <p className="text-muted-foreground">(2026)</p>
      </div>
    ),
    size: 150,
  },
  {
    accessorKey: 'status',
    header: () => (
      <span className="inline-flex items-center gap-2">Status</span>
    ),
    cell: ({ getValue }) => {
      const status = getValue<AttendanceStatus>();
      const StatusIcon = statusIcons[status];

      return (
        <span
          className={`inline-flex min-w-[92px] items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide ${statusStyles[status]}`}
        >
          <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {status}
        </span>
      );
    },
    size: 140,
  },
  {
    accessorKey: 'firstIn',
    header: () => (
      <span className="inline-flex items-center gap-2">First In</span>
    ),
    size: 130,
  },
  {
    accessorKey: 'lastOut',
    header: () => (
      <span className="inline-flex items-center gap-2">Last Out</span>
    ),
    size: 130,
  },
  {
    accessorKey: 'workingHours',
    header: () => (
      <span className="inline-flex items-center gap-2">Working Hours</span>
    ),
    size: 155,
  },
  {
    accessorKey: 'overtimeHours',
    header: () => (
      <span className="inline-flex items-center gap-2">Overtime Hours</span>
    ),
    size: 160,
  },
];

const AttendanceTab = () => {
  const [selectedMonth, setSelectedMonth] = useState('10');
  const [selectedYear, setSelectedYear] = useState('2026');
  const filteredRecords = useMemo(
    () =>
      attendanceRecords.filter(
        record =>
          record.id.slice(0, 4) === selectedYear &&
          record.id.slice(5, 7) === selectedMonth
      ),
    [selectedMonth, selectedYear]
  );

  return (
    <div className="min-w-0 space-y-5">
      <Section title="Attendance Logs">
        <div className="grid w-full gap-3 sm:grid-cols-2 xl:w-auto">
          <FormField
            label="Month"
            name="attendance-month"
            type="select"
            value={selectedMonth}
            onChange={setSelectedMonth}
            options={attendanceMonthOptions}
          />
          <FormField
            label="Year"
            name="attendance-year"
            type="select"
            value={selectedYear}
            onChange={setSelectedYear}
            options={attendanceYearOptions}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5 mt-3">
          {summaryItems.map(item => {
            const Icon = item.icon;

            return (
              <Card
                key={item.label}
                className={`min-w-0 border border-border border-b-2 bg-card ${item.borderStyle}`}
              >
                <CardContent className="flex items-center gap-3 p-3 sm:p-4">
                  <span
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${item.iconStyle}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-1 text-xl font-semibold leading-none text-card-foreground">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.unit}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div
          role="list"
          aria-label="Attendance status legend"
          className="flex flex-wrap gap-x-4 gap-y-2 sm:justify-end"
        >
          {legendStatuses.map(status => (
            <div
              role="listitem"
              key={status}
              className="inline-flex items-center gap-2 text-xs text-muted-foreground"
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${statusStyles[status].split(' ')[0]}`}
                aria-hidden="true"
              />
              {status}
            </div>
          ))}
        </div>

        <TanStackTable
          data={filteredRecords}
          columns={columns}
          enableSorting={false}
          className="space-y-0"
          getRowId={record => record.id}
          emptyMessage="No attendance records for this month."
        />
      </Section>
    </div>
  );
};

export default AttendanceTab;
