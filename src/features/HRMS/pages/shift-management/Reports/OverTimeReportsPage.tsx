import {
  type FormEvent,
  type ReactNode,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AlertTriangle,
  Check,
  Clock,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import { TanStackTable } from '@/components/common';
import Section from '@/components/common/Section';
import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { overtimeReportDateRangeOptions } from '@/data/reusableDropdownData';

type ApprovalStatus = 'pending' | 'approved' | 'rejected';

type StatusTab = 'all' | ApprovalStatus;

type Decision = Exclude<ApprovalStatus, 'pending'>;

type QuickRange = 'today' | 'week' | 'month' | 'lastMonth' | 'custom';

type Department =
  | 'Operations'
  | 'Customer Support'
  | 'Warehouse'
  | 'IT Support'
  | 'HR & Admin';

type ShiftId = 'morning' | 'general' | 'evening' | 'night';

type DayType = 'working' | 'weeklyOff' | 'holiday';

interface ShiftType {
  name: string;
  time: string;
  scheduledMinutes: number;
}

interface OvertimeRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  department: Department;
  shift: ShiftId;
  date: string;
  workedMinutes: number;
  status: ApprovalStatus;
}

interface Filters {
  range: QuickRange;
  from: string;
  to: string;
  department: Department | 'all';
  shift: ShiftId | 'all';
  status: ApprovalStatus | 'all';
  search: string;
}

interface ChartSegment {
  key: string;
  label: string;
  value: number;
  color: string;
}

const referenceDate = '2026-10-14';
const hourlyRate = 250;
const totalActiveEmployees = 168;
const holidays = ['2026-10-02'];
const rowsPerPageOptions = [8, 16, 24, 50];

const departments: Department[] = [
  'Operations',
  'Customer Support',
  'Warehouse',
  'IT Support',
  'HR & Admin',
];

const departmentColors: Record<Department, string> = {
  Operations: 'hsl(var(--primary))',
  'Customer Support': 'hsl(var(--secondary-foreground))',
  Warehouse: 'hsl(var(--accent-foreground))',
  'IT Support': 'hsl(var(--destructive))',
  'HR & Admin': 'hsl(var(--muted-foreground))',
};

const shiftTypes: Record<ShiftId, ShiftType> = {
  morning: { name: 'Morning', time: '6 AM – 2 PM', scheduledMinutes: 480 },
  general: { name: 'General', time: '9 AM – 6 PM', scheduledMinutes: 540 },
  evening: { name: 'Evening', time: '2 PM – 10 PM', scheduledMinutes: 480 },
  night: { name: 'Night', time: '10 PM – 6 AM', scheduledMinutes: 480 },
};

const shiftIds = Object.keys(shiftTypes) as ShiftId[];

const statusMeta: Record<
  ApprovalStatus,
  { label: string; chip: string; color: string }
> = {
  approved: {
    label: 'Approved',
    chip: 'bg-primary/10 text-primary',
    color: 'hsl(var(--primary))',
  },
  pending: {
    label: 'Pending',
    chip: 'bg-secondary text-secondary-foreground',
    color: 'hsl(var(--secondary-foreground))',
  },
  rejected: {
    label: 'Rejected',
    chip: 'bg-destructive/10 text-destructive',
    color: 'hsl(var(--destructive))',
  },
};

const statusOrder: ApprovalStatus[] = ['approved', 'pending', 'rejected'];

const overtimeRates: Record<DayType, number> = {
  working: 1.5,
  weeklyOff: 2,
  holiday: 2,
};

const dayTypeLabels: Record<DayType, string> = {
  working: 'Working day',
  weeklyOff: 'Weekly off',
  holiday: 'Holiday',
};

const avatarPalette = [
  'bg-primary/10 text-primary',
  'bg-secondary text-secondary-foreground',
  'bg-accent text-accent-foreground',
  'bg-muted text-muted-foreground',
  'bg-destructive/10 text-destructive',
];

const approveButtonClass =
  'bg-primary text-primary-foreground hover:bg-primary/90';
const rejectButtonClass =
  'border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive';

const departmentOptions = [
  { label: 'All departments', value: 'all' },
  ...departments.map(department => ({ label: department, value: department })),
];

const shiftOptions = [
  { label: 'All shifts', value: 'all' },
  ...shiftIds.map(id => ({ label: shiftTypes[id].name, value: id })),
];

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  ...statusOrder.map(status => ({
    label: statusMeta[status].label,
    value: status,
  })),
];

const statusTabOptions: { label: string; value: StatusTab }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

const pad = (value: number) => String(value).padStart(2, '0');

const parseDate = (date: string) => new Date(`${date}T00:00:00`);

const toIsoDate = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const addDays = (date: string, days: number) => {
  const result = parseDate(date);
  result.setDate(result.getDate() + days);
  return toIsoDate(result);
};

const getDaysBetween = (from: string, to: string) =>
  Math.round((parseDate(to).getTime() - parseDate(from).getTime()) / 86400000) +
  1;

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parseDate(date));

const formatRangeLabel = (from: string, to: string) => {
  if (from === to) return formatDate(to);
  if (from.slice(0, 7) === to.slice(0, 7)) {
    return `${Number(from.slice(8))} – ${formatDate(to)}`;
  }
  return `${formatDate(from)} – ${formatDate(to)}`;
};

const getRangeDates = (
  range: Exclude<QuickRange, 'custom'>,
  today = referenceDate
) => {
  const monthStart = `${today.slice(0, 8)}01`;

  if (range === 'today') return { from: today, to: today };

  if (range === 'week') {
    const daysSinceMonday = (parseDate(today).getDay() + 6) % 7;
    return { from: addDays(today, -daysSinceMonday), to: today };
  }

  if (range === 'lastMonth') {
    const previousMonthStart = parseDate(monthStart);
    previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
    return {
      from: toIsoDate(previousMonthStart),
      to: addDays(monthStart, -1),
    };
  }

  return { from: monthStart, to: today };
};

const getDayType = (date: string): DayType => {
  if (holidays.includes(date)) return 'holiday';
  return parseDate(date).getDay() === 0 ? 'weeklyOff' : 'working';
};

const hoursAndMinutes = (hours: number, minutes: number) =>
  hours * 60 + minutes;

const seedRecords: OvertimeRecord[] = [
  {
    id: 'ot-1',
    employeeName: 'Rahul Sharma',
    employeeId: 'EMP-1042',
    department: 'Operations',
    shift: 'night',
    date: '2026-10-13',
    workedMinutes: hoursAndMinutes(11, 30),
    status: 'pending',
  },
  {
    id: 'ot-2',
    employeeName: 'Priya Nair',
    employeeId: 'EMP-0987',
    department: 'Customer Support',
    shift: 'morning',
    date: '2026-10-13',
    workedMinutes: hoursAndMinutes(10, 15),
    status: 'approved',
  },
  {
    id: 'ot-3',
    employeeName: 'Amit Verma',
    employeeId: 'EMP-1103',
    department: 'Warehouse',
    shift: 'evening',
    date: '2026-10-12',
    workedMinutes: hoursAndMinutes(12, 0),
    status: 'pending',
  },
  {
    id: 'ot-4',
    employeeName: 'Sneha Patil',
    employeeId: 'EMP-0764',
    department: 'IT Support',
    shift: 'general',
    date: '2026-10-12',
    workedMinutes: hoursAndMinutes(11, 45),
    status: 'approved',
  },
  {
    id: 'ot-5',
    employeeName: 'Karan Mehta',
    employeeId: 'EMP-1210',
    department: 'Operations',
    shift: 'night',
    date: '2026-10-11',
    workedMinutes: hoursAndMinutes(13, 0),
    status: 'approved',
  },
  {
    id: 'ot-6',
    employeeName: 'Divya Reddy',
    employeeId: 'EMP-0655',
    department: 'HR & Admin',
    shift: 'general',
    date: '2026-10-10',
    workedMinutes: hoursAndMinutes(10, 30),
    status: 'rejected',
  },
  {
    id: 'ot-7',
    employeeName: 'Mohammed Iqbal',
    employeeId: 'EMP-1177',
    department: 'Warehouse',
    shift: 'morning',
    date: '2026-10-10',
    workedMinutes: hoursAndMinutes(10, 30),
    status: 'pending',
  },
  {
    id: 'ot-8',
    employeeName: 'Ananya Das',
    employeeId: 'EMP-0902',
    department: 'Customer Support',
    shift: 'evening',
    date: '2026-10-09',
    workedMinutes: hoursAndMinutes(9, 45),
    status: 'approved',
  },
];

const firstNames = [
  'Aarav',
  'Neha',
  'Rohan',
  'Kavya',
  'Vikram',
  'Isha',
  'Arjun',
  'Meera',
  'Suresh',
  'Pooja',
  'Nikhil',
  'Anita',
];
const lastNames = [
  'Iyer',
  'Gupta',
  'Singh',
  'Nair',
  'Joshi',
  'Kapoor',
  'Menon',
  'Bose',
  'Shetty',
  'Rao',
  'Khan',
];
const overtimeOptions = [
  60, 75, 90, 105, 120, 135, 150, 165, 180, 210, 240, 270, 300,
];
const statusPattern: ApprovalStatus[] = [
  'approved',
  'approved',
  'approved',
  'pending',
  'approved',
  'approved',
  'rejected',
  'approved',
  'pending',
  'approved',
];

const generatedRecordCount = 92;

const getGeneratedDate = (index: number) => {
  if (index < 34) return `2026-10-${pad(14 - (index % 14))}`;
  if (index < 72) return `2026-09-${pad(30 - ((index - 34) % 14))}`;
  return `2026-09-${pad(16 - ((index - 72) % 16))}`;
};

const createGeneratedRecord = (index: number): OvertimeRecord => {
  const shift = shiftIds[(index * 3 + 1) % shiftIds.length];
  const extraMinutes = overtimeOptions[(index * 5) % overtimeOptions.length];

  return {
    id: `ot-${seedRecords.length + index + 1}`,
    employeeName: `${firstNames[index % firstNames.length]} ${
      lastNames[index % lastNames.length]
    }`,
    employeeId: `EMP-${String(1300 + index * 7).padStart(4, '0')}`,
    department: departments[index % departments.length],
    shift,
    date: getGeneratedDate(index),
    workedMinutes: shiftTypes[shift].scheduledMinutes + extraMinutes,
    status: statusPattern[index % statusPattern.length],
  };
};

const initialRecords: OvertimeRecord[] = [
  ...seedRecords,
  ...Array.from({ length: generatedRecordCount }, (_, index) =>
    createGeneratedRecord(index)
  ),
].sort((a, b) => b.date.localeCompare(a.date));

const defaultFilters: Filters = {
  range: 'month',
  ...getRangeDates('month'),
  department: 'all',
  shift: 'all',
  status: 'all',
  search: '',
};

const pluralize = (count: number, singular: string, plural = `${singular}s`) =>
  count === 1 ? singular : plural;

const formatMoney = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

const formatDuration = (totalMinutes: number) =>
  `${Math.floor(totalMinutes / 60)}h ${pad(totalMinutes % 60)}m`;

const formatHours = (totalMinutes: number) =>
  `${Number((totalMinutes / 60).toFixed(1))} hrs`;

const formatRate = (rate: number) => `${rate.toFixed(1)}×`;

const getOvertimeMinutes = (record: OvertimeRecord) =>
  Math.max(record.workedMinutes - shiftTypes[record.shift].scheduledMinutes, 0);

const getRate = (record: OvertimeRecord) =>
  overtimeRates[getDayType(record.date)];

const getAmount = (record: OvertimeRecord) =>
  Math.round((getOvertimeMinutes(record) / 60) * getRate(record) * hourlyRate);

const getInitials = (name: string) =>
  name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

const getAvatarClass = (name: string) => {
  const hash = Array.from(name).reduce(
    (total, character) => total + character.charCodeAt(0),
    0
  );
  return avatarPalette[hash % avatarPalette.length];
};

const sumOvertime = (records: OvertimeRecord[]) =>
  records.reduce((total, record) => total + getOvertimeMinutes(record), 0);

const matchesFilters = (record: OvertimeRecord, filters: Filters) => {
  if (filters.department !== 'all' && record.department !== filters.department)
    return false;
  if (filters.shift !== 'all' && record.shift !== filters.shift) return false;
  if (filters.status !== 'all' && record.status !== filters.status)
    return false;

  const query = filters.search.trim().toLowerCase();
  if (
    query &&
    !`${record.employeeName} ${record.employeeId}`.toLowerCase().includes(query)
  )
    return false;

  return true;
};

const isInRange = (record: OvertimeRecord, from: string, to: string) =>
  record.date >= from && record.date <= to;

const getTrendText = (current: number, previous: number) => {
  if (previous === 0) {
    return {
      text: 'No data for the previous period',
      className: 'text-muted-foreground',
    };
  }
  const change = Math.round(((current - previous) / previous) * 100);
  if (change === 0) {
    return {
      text: 'Same as previous period',
      className: 'text-muted-foreground',
    };
  }
  return change > 0
    ? {
        text: `${change}% more than previous period`,
        className: 'text-secondary-foreground',
      }
    : {
        text: `${Math.abs(change)}% less than previous period`,
        className: 'text-primary',
      };
};

const getShareText = (percent: number) => {
  if (percent >= 50) return 'over half of';
  if (percent >= 28 && percent <= 38) return 'close to a third of';
  return `about ${Math.round(percent)}% of`;
};

const isDepartment = (value: string): value is Department =>
  (departments as string[]).includes(value);

const isQuickRange = (value: string): value is QuickRange =>
  overtimeReportDateRangeOptions.some(option => option.value === value);

const isShiftId = (value: string): value is ShiftId => value in shiftTypes;

const isApprovalStatus = (value: string): value is ApprovalStatus =>
  value in statusMeta;

const StatusBadge = ({ status }: { status: ApprovalStatus }) => (
  <Badge
    className={`gap-1.5 border-transparent font-semibold ${statusMeta[status].chip}`}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
    {statusMeta[status].label}
  </Badge>
);

const StatCard = ({
  icon: Icon,
  iconClassName,
  label,
  value,
  className = '',
  children,
}: {
  icon: LucideIcon;
  iconClassName: string;
  label: string;
  value: string;
  className?: string;
  children: ReactNode;
}) => (
  <Card className={`flex items-start gap-4 p-5 ${className}`}>
    <span
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
    <div className="min-w-0 space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      <div className="text-xs">{children}</div>
    </div>
  </Card>
);

const DonutChart = ({
  segments,
  centerValue,
  centerLabel,
  label,
}: {
  segments: ChartSegment[];
  centerValue: string;
  centerLabel: string;
  label: string;
}) => {
  const size = 180;
  const strokeWidth = 30;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const visible = segments.filter(segment => segment.value > 0);
  const total = visible.reduce((sum, segment) => sum + segment.value, 0);
  const gap = visible.length > 1 ? 2 : 0;

  let consumed = 0;
  const arcs = visible.map(segment => {
    const length = (segment.value / total) * circumference;
    const arc = { ...segment, length, offset: consumed };
    consumed += length;
    return arc;
  });

  return (
    <div className="relative h-44 w-44 shrink-0">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-full w-full -rotate-90"
        role="img"
        aria-label={label}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-muted"
        />
        {arcs.map(arc => (
          <circle
            key={arc.key}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={arc.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${Math.max(arc.length - gap, 0)} ${circumference}`}
            strokeDashoffset={-arc.offset}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-foreground">
          {centerValue}
        </span>
        <span className="text-xs text-muted-foreground">{centerLabel}</span>
      </div>
    </div>
  );
};

const ChartLegend = ({
  segments,
  total,
  formatValue,
}: {
  segments: ChartSegment[];
  total: number;
  formatValue: (value: number) => string;
}) => (
  <div className="min-w-0 flex-1 divide-y divide-border" role="list">
    {segments.map(segment => (
      <div
        key={segment.key}
        className="flex items-center gap-3 py-2.5 text-sm text-foreground"
        role="listitem"
      >
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-sm"
          style={{ backgroundColor: segment.color }}
          aria-hidden="true"
        />
        <span className="flex-1">{segment.label}</span>
        <span className="font-semibold">{formatValue(segment.value)}</span>
        <span className="w-14 text-right text-muted-foreground">
          {total > 0 ? `${((segment.value / total) * 100).toFixed(1)}%` : '0%'}
        </span>
      </div>
    ))}
  </div>
);

const DetailItem = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="space-y-0.5">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-sm font-semibold text-foreground">{children}</p>
  </div>
);

const RecordsTable = ({
  records,
  onOpen,
}: {
  records: OvertimeRecord[];
  onOpen: (id: string) => void;
}) => {
  const columns = useMemo<ColumnDef<OvertimeRecord>[]>(
    () => [
      {
        id: 'employee',
        header: 'Employee',
        accessorFn: record => record.employeeName,
        cell: ({ row }) => {
          const record = row.original;
          return (
            <div className="flex items-center gap-3">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${getAvatarClass(
                  record.employeeName
                )}`}
                aria-hidden="true"
              >
                {getInitials(record.employeeName)}
              </span>
              <div className="min-w-[6rem]">
                <p className="font-semibold text-foreground">
                  {record.employeeName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {record.employeeId}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'department',
        header: 'Department',
      },
      {
        id: 'shift',
        header: 'Shift',
        accessorFn: record => shiftTypes[record.shift].name,
        cell: ({ row }) => {
          const shift = shiftTypes[row.original.shift];
          return (
            <div>
              <p className="font-semibold text-foreground">{shift.name}</p>
              <p className="text-xs text-muted-foreground">{shift.time}</p>
            </div>
          );
        },
      },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => {
          const { date } = row.original;
          const dayType = getDayType(date);
          return (
            <div>
              <p className="whitespace-nowrap">{formatDate(date)}</p>
              {dayType !== 'working' && (
                <p className="text-xs text-muted-foreground">
                  {dayTypeLabels[dayType]}
                </p>
              )}
            </div>
          );
        },
      },
      {
        id: 'scheduled',
        header: 'Scheduled',
        accessorFn: record => shiftTypes[record.shift].scheduledMinutes,
        cell: ({ row }) =>
          formatDuration(shiftTypes[row.original.shift].scheduledMinutes),
      },
      {
        accessorKey: 'workedMinutes',
        header: 'Worked',
        cell: ({ row }) => formatDuration(row.original.workedMinutes),
      },
      {
        id: 'overtime',
        header: 'Overtime',
        accessorFn: getOvertimeMinutes,
        cell: ({ row }) => (
          <Badge className="whitespace-nowrap border-transparent bg-secondary text-secondary-foreground">
            {formatDuration(getOvertimeMinutes(row.original))}
          </Badge>
        ),
      },
      {
        id: 'rate',
        header: 'Rate',
        accessorFn: getRate,
        cell: ({ row }) => formatRate(getRate(row.original)),
      },
      {
        id: 'amount',
        header: 'Amount',
        accessorFn: getAmount,
        cell: ({ row }) => (
          <span className="whitespace-nowrap font-semibold text-foreground">
            {formatMoney(getAmount(row.original))}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: 'actions',
        header: 'Action',
        enableSorting: false,
        cell: ({ row }) => (
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label={`${
              row.original.status === 'pending' ? 'Review' : 'View'
            } overtime for ${row.original.employeeName}`}
            onClick={() => onOpen(row.original.id)}
          >
            {row.original.status === 'pending' ? 'Review' : 'View'}
          </Button>
        ),
      },
    ],
    [onOpen]
  );

  return (
    <TanStackTable
      data={records}
      columns={columns}
      enableSearch={false}
      enableSorting={false}
      showDownload={true}
      enableColumnVisibility
      enablePagination
      pageSize={rowsPerPageOptions[0]}
      pageSizeOptions={rowsPerPageOptions}
      getRowId={record => record.id}
      emptyMessage="No overtime records found."
    />
  );
};

const ReviewDialog = ({
  record,
  onClose,
  onDecision,
}: {
  record: OvertimeRecord | null;
  onClose: () => void;
  onDecision: (decision: Decision) => void;
}) => (
  <Dialog open={record !== null} onOpenChange={open => !open && onClose()}>
    <DialogContent
      className="sm:max-w-lg"
      onInteractOutside={event => event.preventDefault()}
    >
      {record && (
        <>
          <DialogHeader>
            <DialogTitle>
              {record.status === 'pending'
                ? 'Review overtime request'
                : 'Overtime request'}
            </DialogTitle>
            <DialogDescription>
              {record.employeeName} · {record.employeeId}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <DetailItem label="Department">{record.department}</DetailItem>
            <DetailItem label="Shift">
              {shiftTypes[record.shift].name} ({shiftTypes[record.shift].time})
            </DetailItem>
            <DetailItem label="Date">
              {formatDate(record.date)} ·{' '}
              {dayTypeLabels[getDayType(record.date)]}
            </DetailItem>
            <DetailItem label="Status">
              <StatusBadge status={record.status} />
            </DetailItem>
            <DetailItem label="Scheduled">
              {formatDuration(shiftTypes[record.shift].scheduledMinutes)}
            </DetailItem>
            <DetailItem label="Worked">
              {formatDuration(record.workedMinutes)}
            </DetailItem>
            <DetailItem label="Overtime">
              {formatDuration(getOvertimeMinutes(record))} at{' '}
              {formatRate(getRate(record))}
            </DetailItem>
            <DetailItem label="Amount">
              {formatMoney(getAmount(record))}
            </DetailItem>
          </div>

          <DialogFooter>
            {record.status === 'pending' ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className={rejectButtonClass}
                  onClick={() => onDecision('rejected')}
                >
                  Reject
                </Button>
                <Button
                  type="button"
                  className={approveButtonClass}
                  onClick={() => onDecision('approved')}
                >
                  <Check /> Approve
                </Button>
              </>
            ) : (
              <Button type="button" variant="destructive" onClick={onClose}>
                Close
              </Button>
            )}
          </DialogFooter>
        </>
      )}
    </DialogContent>
  </Dialog>
);

const OverTimeReportsPage = () => {
  const [records, setRecords] = useState(initialRecords);
  const [draftFilters, setDraftFilters] = useState(defaultFilters);
  const [filters, setFilters] = useState(defaultFilters);
  const [statusTab, setStatusTab] = useState<StatusTab>('all');
  const [reviewId, setReviewId] = useState<string | null>(null);
  const recordsSectionRef = useRef<HTMLDivElement>(null);

  const rangeRecords = useMemo(
    () =>
      records.filter(
        record =>
          isInRange(record, filters.from, filters.to) &&
          matchesFilters(record, filters)
      ),
    [records, filters]
  );

  const previousMinutes = useMemo(() => {
    const previousTo = addDays(filters.from, -1);
    const previousFrom = addDays(
      previousTo,
      -(getDaysBetween(filters.from, filters.to) - 1)
    );
    return sumOvertime(
      records.filter(
        record =>
          isInRange(record, previousFrom, previousTo) &&
          matchesFilters(record, filters)
      )
    );
  }, [records, filters]);

  const tabRecords = useMemo(
    () =>
      statusTab === 'all'
        ? rangeRecords
        : rangeRecords.filter(record => record.status === statusTab),
    [rangeRecords, statusTab]
  );

  const totalMinutes = sumOvertime(rangeRecords);
  const totalPay = rangeRecords.reduce(
    (total, record) => total + getAmount(record),
    0
  );
  const employeeCount = new Set(rangeRecords.map(record => record.employeeId))
    .size;
  const trend = getTrendText(totalMinutes, previousMinutes);

  const statusCounts: Record<ApprovalStatus, number> = {
    approved: rangeRecords.filter(record => record.status === 'approved')
      .length,
    pending: rangeRecords.filter(record => record.status === 'pending').length,
    rejected: rangeRecords.filter(record => record.status === 'rejected')
      .length,
  };
  const tabCounts: Record<StatusTab, number> = {
    all: rangeRecords.length,
    ...statusCounts,
  };

  const departmentSegments: ChartSegment[] = departments
    .map(department => ({
      key: department,
      label: department,
      value: sumOvertime(
        rangeRecords.filter(record => record.department === department)
      ),
      color: departmentColors[department],
    }))
    .filter(segment => segment.value > 0)
    .sort((a, b) => b.value - a.value);
  const topDepartment = departmentSegments[0];
  const topDepartmentPercent = topDepartment
    ? (topDepartment.value / totalMinutes) * 100
    : 0;

  const statusSegments: ChartSegment[] = statusOrder.map(status => ({
    key: status,
    label: statusMeta[status].label,
    value: statusCounts[status],
    color: statusMeta[status].color,
  }));

  const rangeLabel = formatRangeLabel(filters.from, filters.to);

  const reviewRecord = records.find(record => record.id === reviewId) ?? null;

  const updateDraft = (changes: Partial<Filters>) =>
    setDraftFilters(current => ({ ...current, ...changes }));

  const handleQuickRange = (range: QuickRange) => {
    if (range === 'custom') {
      updateDraft({ range });
      return;
    }
    const dates = getRangeDates(range);
    updateDraft({ range, ...dates });
    setFilters(current => ({ ...current, range, ...dates }));
  };

  const handleApplyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (draftFilters.range === 'custom') {
      if (!draftFilters.from || !draftFilters.to) {
        toast.error('Pick both a start date and an end date.');
        return;
      }
      if (draftFilters.from > draftFilters.to) {
        toast.error('The start date must be on or before the end date.');
        return;
      }
    }

    setFilters({ ...draftFilters, search: draftFilters.search.trim() });
  };

  const handleResetFilters = () => {
    setDraftFilters(defaultFilters);
    setFilters(defaultFilters);
    setStatusTab('all');
  };

  const handleTabChange = (tab: StatusTab) => {
    setStatusTab(tab);
  };

  const handleReviewPending = () => {
    updateDraft({ status: 'all' });
    setFilters(current => ({ ...current, status: 'all' }));
    setStatusTab('pending');
    recordsSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const applyDecision = (ids: string[], decision: Decision) =>
    setRecords(current =>
      current.map(record =>
        ids.includes(record.id) && record.status === 'pending'
          ? { ...record, status: decision }
          : record
      )
    );

  const handleReviewDecision = (decision: Decision) => {
    if (!reviewRecord) return;
    applyDecision([reviewRecord.id], decision);
    toast.success(`${reviewRecord.employeeName}'s overtime ${decision}.`);
    setReviewId(null);
  };

  return (
    <>
      <Section
        title="Overtime Report"
        menuId="overtime-reports"
        showBreadcrumbs
      >
        <div className="space-y-6">
          <Card className="p-6 print:hidden">
            <form onSubmit={handleApplyFilters} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                <FormField
                  label="Date range"
                  name="overtime-range"
                  type="select"
                  value={draftFilters.range}
                  onChange={value => {
                    if (isQuickRange(value)) handleQuickRange(value);
                  }}
                  options={overtimeReportDateRangeOptions}
                />
                {draftFilters.range === 'custom' && (
                  <>
                    <FormField
                      label="From"
                      name="overtime-from"
                      type="date"
                      value={draftFilters.from}
                      onChange={from => updateDraft({ from })}
                      required
                    />
                    <FormField
                      label="To"
                      name="overtime-to"
                      type="date"
                      value={draftFilters.to}
                      onChange={to => updateDraft({ to })}
                      required
                    />
                  </>
                )}
                <FormField
                  label="Department"
                  name="overtime-department"
                  type="select"
                  value={draftFilters.department}
                  onChange={value => {
                    if (value === 'all' || isDepartment(value))
                      updateDraft({ department: value });
                  }}
                  options={departmentOptions}
                />
                <FormField
                  label="Shift"
                  name="overtime-shift"
                  type="select"
                  value={draftFilters.shift}
                  onChange={value => {
                    if (value === 'all' || isShiftId(value))
                      updateDraft({ shift: value });
                  }}
                  options={shiftOptions}
                />
                <FormField
                  label="Approval status"
                  name="overtime-status"
                  type="select"
                  value={draftFilters.status}
                  onChange={value => {
                    if (value === 'all' || isApprovalStatus(value))
                      updateDraft({ status: value });
                  }}
                  options={statusOptions}
                />
                <FormField
                  label="Employee"
                  name="overtime-employee"
                  value={draftFilters.search}
                  onChange={search => updateDraft({ search })}
                  placeholder="Name or employee ID"
                />
              </div>

              <div className="flex flex-wrap justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetFilters}
                >
                  Reset
                </Button>
                <Button type="submit">Apply filters</Button>
              </div>
            </form>
          </Card>

          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={Clock}
              iconClassName="bg-primary/10 text-primary"
              label="Total overtime hours"
              value={formatHours(totalMinutes)}
            >
              <span className={`font-medium ${trend.className}`}>
                {trend.text}
              </span>
            </StatCard>
            <StatCard
              icon={Users}
              iconClassName="bg-secondary text-secondary-foreground"
              label="Employees on overtime"
              value={String(employeeCount)}
            >
              <span className="text-muted-foreground">
                out of {totalActiveEmployees} active employees
              </span>
            </StatCard>
            <StatCard
              icon={Wallet}
              iconClassName="bg-accent text-accent-foreground"
              label="Estimated overtime pay"
              value={formatMoney(totalPay)}
            >
              <span className="text-muted-foreground">
                at 1.5× and 2× rates
              </span>
            </StatCard>
            <StatCard
              icon={AlertTriangle}
              iconClassName="bg-destructive/10 text-destructive"
              label="Waiting for approval"
              value={String(statusCounts.pending)}
            >
              {statusCounts.pending > 0 ? (
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-xs font-semibold text-foreground underline"
                  onClick={handleReviewPending}
                >
                  Review pending requests
                </Button>
              ) : (
                <span className="text-muted-foreground">
                  You are all caught up
                </span>
              )}
            </StatCard>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Card className="space-y-6 p-6">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">
                  Where is overtime happening?
                </h3>
                <p className="text-xs text-muted-foreground">
                  Overtime hours by department, {rangeLabel}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 sm:flex-nowrap">
                <DonutChart
                  segments={departmentSegments}
                  centerValue={String(Number((totalMinutes / 60).toFixed(1)))}
                  centerLabel="total hours"
                  label="Overtime hours by department"
                />
                {departmentSegments.length > 0 ? (
                  <ChartLegend
                    segments={departmentSegments}
                    total={totalMinutes}
                    formatValue={formatHours}
                  />
                ) : (
                  <p className="flex-1 text-sm text-muted-foreground">
                    No overtime in this period.
                  </p>
                )}
              </div>
              {topDepartment && (
                <p className="rounded-lg bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                  {topDepartment.label} has the most overtime,{' '}
                  {getShareText(topDepartmentPercent)} the total this period.
                </p>
              )}
            </Card>

            <Card className="space-y-6 p-6">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">
                  Approval status
                </h3>
                <p className="text-xs text-muted-foreground">
                  Overtime requests, {rangeLabel}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 sm:flex-nowrap">
                <DonutChart
                  segments={statusSegments}
                  centerValue={String(rangeRecords.length)}
                  centerLabel="requests"
                  label="Overtime requests by approval status"
                />
                <ChartLegend
                  segments={statusSegments}
                  total={rangeRecords.length}
                  formatValue={String}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/50 px-4 py-3">
                <p className="text-sm text-muted-foreground">
                  {statusCounts.pending > 0 ? (
                    <>
                      <span className="font-semibold text-foreground">
                        {statusCounts.pending}{' '}
                        {pluralize(statusCounts.pending, 'request')}
                      </span>{' '}
                      {pluralize(statusCounts.pending, 'is', 'are')} waiting for
                      your decision.
                    </>
                  ) : (
                    'No requests are waiting for your decision.'
                  )}
                </p>
                {statusCounts.pending > 0 && (
                  <Button type="button" onClick={handleReviewPending}>
                    Review pending
                  </Button>
                )}
              </div>
            </Card>
          </div>

          <div ref={recordsSectionRef} className="scroll-mt-6">
            <Card className="overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4 p-6">
                <div className="flex flex-wrap items-center gap-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Overtime records
                  </h3>
                  <div
                    className="flex gap-1 rounded-xl bg-muted/60 p-1"
                    role="group"
                    aria-label="Filter by approval status"
                  >
                    {statusTabOptions.map(option => {
                      const isActive = statusTab === option.value;
                      return (
                        <Button
                          key={option.value}
                          type="button"
                          variant="ghost"
                          aria-pressed={isActive}
                          className={`h-9 px-4 ${
                            isActive
                              ? 'bg-background text-foreground shadow-sm hover:bg-background'
                              : 'text-muted-foreground'
                          }`}
                          onClick={() => handleTabChange(option.value)}
                        >
                          {option.label} ({tabCounts[option.value]})
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {tabRecords.length > 0 ? (
                <RecordsTable records={tabRecords} onOpen={setReviewId} />
              ) : (
                <div className="space-y-3 border-t border-border px-6 py-14 text-center">
                  <p className="text-base font-semibold text-foreground">
                    No overtime records found
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try a different date range or clear your filters.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResetFilters}
                  >
                    Reset filters
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </Section>

      <ReviewDialog
        record={reviewRecord}
        onClose={() => setReviewId(null)}
        onDecision={handleReviewDecision}
      />
    </>
  );
};

export default OverTimeReportsPage;
