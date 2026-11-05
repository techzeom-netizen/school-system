import React, { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlarmClock,
  Clock,
  RotateCcw,
  SearchX,
  UserCheck,
  UserX,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import TanStackTable from '@/components/common/TanStackTable';
import type { ColumnDef } from '@tanstack/react-table';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import {
  monthlyMusterBranchFilterOptions,
  monthlyMusterBranchOptions,
  monthlyMusterMonthOptions,
  monthlyMusterSortOptions,
  monthlyMusterYearOptions,
} from '@/data/reusableDropdownData';

type StatusCode = 'P' | 'L' | 'E' | 'H' | 'A' | 'WO';

const STATUS: Record<StatusCode, { label: string; color: string }> = {
  P: { label: 'Present', color: 'hsl(var(--primary))' },
  L: { label: 'Late in', color: 'hsl(var(--accent-foreground))' },
  E: { label: 'Early out', color: 'hsl(var(--secondary-foreground))' },
  H: { label: 'Half day', color: 'hsl(var(--muted-foreground))' },
  A: { label: 'Absent', color: 'hsl(var(--destructive))' },
  WO: { label: 'Weekly off', color: 'hsl(var(--foreground))' },
};
const STATUS_ORDER: StatusCode[] = ['P', 'L', 'E', 'H', 'A', 'WO'];

const MONTH_NAMES = monthlyMusterMonthOptions.map(option => option.label);
const BRANCHES = monthlyMusterBranchOptions.map(option => option.value);
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const WEEKDAYS_LONG = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const BASE_EMPLOYEES = [
  {
    employeeId: 'A04100266',
    employeeName: 'ABISHEK M',
    designation: 'Senior Associate',
  },
  {
    employeeId: 'A03900256',
    employeeName: 'AMBAREESHA P',
    designation: 'Associate',
  },
  {
    employeeId: 'A04600282',
    employeeName: 'BALA CHANDRANAIK',
    designation: 'Manager',
  },
  {
    employeeId: 'A04400276',
    employeeName: 'CHETHANA CD',
    designation: 'Senior Associate',
  },
  {
    employeeId: 'A03900255',
    employeeName: 'CHOWDAPPA P',
    designation: 'Associate',
  },
  {
    employeeId: 'A04400278',
    employeeName: 'DHANUSH D',
    designation: 'Trainee',
  },
  {
    employeeId: 'A03900267',
    employeeName: 'GIRISHA G V',
    designation: 'Senior Associate',
  },
  {
    employeeId: 'A04100264',
    employeeName: 'GOKULA A',
    designation: 'Associate',
  },
  {
    employeeId: 'A04100301',
    employeeName: 'HARISH K',
    designation: 'Associate',
  },
  {
    employeeId: 'A04200310',
    employeeName: 'KAVYA R',
    designation: 'Senior Associate',
  },
  { employeeId: 'A04300322', employeeName: 'LOKESH N', designation: 'Trainee' },
  {
    employeeId: 'A04500335',
    employeeName: 'MEGHANA S',
    designation: 'Manager',
  },
];

interface DayRecord {
  day: number;
  dow: number;
  status: StatusCode;
  firstIn: number | null;
  lastOut: number | null;
  lateMin: number;
  earlyMin: number;
  otMin: number;
  workMin: number;
}

interface Employee {
  id: string;
  employeeId: string;
  employeeName: string;
  branch: string;
  department: string;
  designation: string;
  days: DayRecord[];
  summary: {
    present: number;
    absent: number;
    wo: number;
    lateCount: number;
    lateMin: number;
    otMin: number;
    earlyMin: number;
    workMin: number;
  };
}

const seeded = (n: number) => {
  const x = Math.sin(n + 1) * 99_999;
  return x - Math.floor(x);
};
const pad = (n: number) => String(n).padStart(2, '0');
const hhmm = (min: number) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;
const clock = (min: number | null) => (min === null ? '--' : hhmm(min));
const dur = (min: number) => (min > 0 ? hhmm(min) : '--');
const r1 = (n: number) => Math.round(n * 10) / 10;
const initials = (name: string) =>
  name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
const AVATAR_COLORS = [
  'bg-primary text-primary-foreground',
  'bg-secondary text-secondary-foreground',
  'bg-accent text-accent-foreground',
  'bg-destructive text-destructive-foreground',
  'bg-muted text-muted-foreground',
];

function buildEmployee(
  base: (typeof BASE_EMPLOYEES)[number],
  idx: number,
  month: number,
  year: number
): Employee {
  const dim = new Date(year, month, 0).getDate();
  const days: DayRecord[] = Array.from({ length: dim }, (_, i) => {
    const day = i + 1;
    const dow = new Date(year, month - 1, day).getDay();
    const empty = {
      day,
      dow,
      firstIn: null,
      lastOut: null,
      lateMin: 0,
      earlyMin: 0,
      otMin: 0,
      workMin: 0,
    };
    if (dow === 0) return { ...empty, status: 'WO' as StatusCode };

    const s = month * 101 + year * 13 + idx * 37 + day * 7;
    const r = seeded(s);
    const status: StatusCode =
      r < 0.72 ? 'P' : r < 0.8 ? 'L' : r < 0.86 ? 'E' : r < 0.91 ? 'H' : 'A';
    if (status === 'A') return { ...empty, status };

    let firstIn = 530 + Math.floor(seeded(s + 1) * 10);
    let lastOut = 1080 + Math.floor(seeded(s + 2) * 60);
    if (status === 'L') firstIn = 555 + Math.floor(seeded(s + 1) * 60);
    if (status === 'E') lastOut = 1020 + Math.floor(seeded(s + 2) * 40);
    if (status === 'H') {
      firstIn = 540;
      lastOut = 810;
    }
    return {
      ...empty,
      status,
      firstIn,
      lastOut,
      lateMin: Math.max(0, firstIn - 540),
      earlyMin: status === 'E' ? 1080 - lastOut : 0,
      otMin: status === 'P' || status === 'L' ? Math.max(0, lastOut - 1110) : 0,
      workMin: lastOut - firstIn,
    };
  });

  const count = (c: StatusCode) => days.filter(d => d.status === c).length;
  return {
    id: base.employeeId,
    employeeId: base.employeeId,
    employeeName: base.employeeName,
    branch: BRANCHES[idx % BRANCHES.length],
    department: 'CRO',
    designation: base.designation,
    days,
    summary: {
      present: count('P') + count('L') + count('E') + count('H') * 0.5,
      absent: count('A') + count('H') * 0.5,
      wo: count('WO'),
      lateCount: count('L'),
      lateMin: days.reduce((a, d) => a + d.lateMin, 0),
      otMin: days.reduce((a, d) => a + d.otMin, 0),
      earlyMin: days.reduce((a, d) => a + d.earlyMin, 0),
      workMin: days.reduce((a, d) => a + d.workMin, 0),
    },
  };
}

const gridProps = {
  strokeDasharray: '3 3',
  stroke: 'currentColor',
  strokeOpacity: 0.1,
  vertical: false,
};
const axisTick = { fontSize: 11, fill: 'currentColor', opacity: 0.55 };
const cardCls =
  'rounded-xl border border-border bg-card p-5 dark:border-border dark:bg-card';

function ChartTooltip({
  active,
  payload,
  label,
  labelPrefix = '',
}: {
  active?: boolean;
  payload?: any[];
  label?: string | number;
  labelPrefix?: string;
}) {
  if (!active || !payload?.length) return null;
  const rows = payload.filter(p => p.value > 0);
  if (!rows.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card/95 px-3 py-2 text-xs shadow-lg backdrop-blur dark:border-border dark:bg-muted/95">
      {label !== undefined && (
        <div className="mb-1 font-semibold text-foreground dark:text-foreground">
          {labelPrefix}
          {label}
        </div>
      )}
      {rows.map(p => (
        <div
          key={p.dataKey ?? p.name}
          className="flex items-center justify-between gap-6 text-muted-foreground dark:text-foreground"
        >
          <span className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: p.color || p.fill || p.payload?.color }}
            />
            {p.name}
          </span>
          <span className="font-semibold tabular-nums text-foreground dark:text-primary-foreground">
            {p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="inline-flex rounded-lg bg-muted p-1 dark:bg-muted">
      {options.map(o => (
        <Button
          variant="ghost"
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`h-auto rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
            value === o.value
              ? 'bg-card text-foreground shadow-sm hover:bg-card dark:bg-muted dark:text-primary-foreground'
              : 'text-muted-foreground hover:bg-transparent hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground'
          }`}
        >
          {o.label}
        </Button>
      ))}
    </div>
  );
}

function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  const color = AVATAR_COLORS[name.length % AVATAR_COLORS.length];
  return (
    <span
      className={`flex flex-shrink-0 items-center justify-center rounded-full font-semibold ${color}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
      }}
    >
      {initials(name)}
    </span>
  );
}

function StatusChip({ code }: { code: StatusCode }) {
  const c = STATUS[code].color;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ background: `${c}1f`, color: c }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />
      {STATUS[code].label}
    </span>
  );
}

interface KpiItem {
  key: string;
  label: string;
  value: string | number;
  hint: string;
  icon: React.ElementType;
  color: string;
  spark?: number[];
}

function Kpi({ item }: { item: KpiItem }) {
  const Icon = item.icon;
  const id = `kpi-${item.key}`;
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4 dark:border-border dark:bg-card">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground dark:text-muted-foreground">
          {item.label}
        </span>
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{
            background: `color-mix(in srgb, ${item.color} 12%, transparent)`,
            color: item.color,
          }}
        >
          <Icon size={14} />
        </span>
      </div>
      <div className="mt-2 text-2xl font-semibold tabular-nums text-foreground dark:text-primary-foreground">
        {item.value}
      </div>
      <div className="mt-0.5 truncate text-xs text-muted-foreground dark:text-muted-foreground">
        {item.hint}
      </div>
      <div className="h-6" />
      {item.spark && item.spark.length > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-9">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={item.spark.map(v => ({ v }))}
              margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={item.color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={item.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={item.color}
                strokeWidth={1.5}
                fill={`url(#${id})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

type SortKey = 'name' | 'absent' | 'late';

const MonthlyMusterReport: React.FC = () => {
  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));
  const [branch, setBranch] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('name');
  const [highlight, setHighlight] = useState<StatusCode | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const m = parseInt(month);
  const y = parseInt(year);
  const periodLabel = `${MONTH_NAMES[m - 1]} ${y}`;
  const daysInMonth = new Date(y, m, 0).getDate();

  const allEmployees = useMemo(
    () => BASE_EMPLOYEES.map((b, i) => buildEmployee(b, i, m, y)),
    [m, y]
  );

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = allEmployees.filter(
      e =>
        (branch === 'all' || e.branch === branch) &&
        (!q ||
          e.employeeName.toLowerCase().includes(q) ||
          e.employeeId.toLowerCase().includes(q))
    );
    return [...list].sort((a, b) =>
      sortBy === 'absent'
        ? b.summary.absent - a.summary.absent
        : sortBy === 'late'
          ? b.summary.lateMin - a.summary.lateMin
          : a.employeeName.localeCompare(b.employeeName)
    );
  }, [allEmployees, branch, search, sortBy]);

  const dayHeaders = useMemo(
    () =>
      Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        dow: new Date(y, m - 1, i + 1).getDay(),
      })),
    [daysInMonth, m, y]
  );

  const daily = useMemo(
    () =>
      dayHeaders.map(({ day, dow }) => {
        const point: Record<string, number> = { day };
        STATUS_ORDER.forEach(c => {
          point[c] = rows.filter(e => e.days[day - 1].status === c).length;
        });
        point.presentTotal = point.P + point.L + point.E + point.H;
        point.dow = dow;
        return point;
      }),
    [dayHeaders, rows]
  );

  const statusTotals = STATUS_ORDER.map(c => ({
    code: c,
    name: STATUS[c].label,
    value: rows.reduce(
      (a, e) => a + e.days.filter(d => d.status === c).length,
      0
    ),
    color: STATUS[c].color,
  }));

  const totalPresent = rows.reduce((a, e) => a + e.summary.present, 0);
  const totalAbsent = rows.reduce((a, e) => a + e.summary.absent, 0);
  const attendanceRate =
    totalPresent + totalAbsent
      ? r1((totalPresent / (totalPresent + totalAbsent)) * 100)
      : 0;
  const lateCount = rows.reduce((a, e) => a + e.summary.lateCount, 0);
  const lateMin = rows.reduce((a, e) => a + e.summary.lateMin, 0);
  const otMin = rows.reduce((a, e) => a + e.summary.otMin, 0);
  const workMin = rows.reduce((a, e) => a + e.summary.workMin, 0);
  const workedDays = rows.reduce(
    (a, e) => a + e.days.filter(d => d.workMin > 0).length,
    0
  );

  const kpis: KpiItem[] = [
    {
      key: 'emp',
      label: 'Employees',
      value: rows.length,
      hint: branch === 'all' ? 'All branches' : branch,
      icon: Users,
      color: 'hsl(var(--primary))',
    },
    {
      key: 'rate',
      label: 'Attendance rate',
      value: `${attendanceRate}%`,
      hint: `${r1(totalPresent)} present days`,
      icon: UserCheck,
      color: 'hsl(var(--secondary-foreground))',
      spark: daily.filter(d => d.dow !== 0).map(d => d.presentTotal),
    },
    {
      key: 'absent',
      label: 'Absent days',
      value: r1(totalAbsent),
      hint: `${r1(totalAbsent / rows.length)} per employee`,
      icon: UserX,
      color: 'hsl(var(--destructive))',
    },
    {
      key: 'late',
      label: 'Late arrivals',
      value: lateCount,
      hint: `${hhmm(lateMin)} hrs lost`,
      icon: AlarmClock,
      color: 'hsl(var(--accent-foreground))',
    },
    {
      key: 'ot',
      label: 'Overtime',
      value: `${hhmm(otMin)}`,
      hint: `${hhmm(workedDays ? Math.round(workMin / workedDays) : 0)} avg day`,
      icon: Clock,
      color: 'hsl(var(--muted-foreground))',
    },
  ];

  const selected =
    rows.find(e => e.id === selectedId) ??
    allEmployees.find(e => e.id === selectedId) ??
    null;
  const filtersActive = branch !== 'all' || search.trim() !== '';

  const musterColumns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        id: 'employee',
        accessorKey: 'employeeName',
        header: 'Employee',
        size: 220,
        cell: ({ row }) => {
          const employee = row.original;
          return (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setSelectedId(employee.id)}
              aria-label={`View ${employee.employeeName} details`}
              className="flex h-auto w-full items-center justify-start gap-2.5 px-0 py-0 text-left hover:bg-transparent"
            >
              <Avatar name={employee.employeeName} />
              <span className="leading-tight">
                <span className="block text-sm font-medium">
                  {employee.employeeName}
                </span>
                <span className="block text-[11px] text-muted-foreground dark:text-muted-foreground">
                  {employee.employeeId} · {employee.branch}
                </span>
              </span>
            </Button>
          );
        },
      },
      ...dayHeaders.map(
        ({ day, dow }): ColumnDef<Employee> => ({
          id: `day-${day}`,
          size: 38,
          header: () => (
            <div className="text-center">
              <div className="tabular-nums">{day}</div>
              <div className="text-[10px] font-normal text-muted-foreground">
                {WEEKDAYS[dow]}
              </div>
            </div>
          ),
          cell: ({ row }) => {
            const record = row.original.days[day - 1];
            const color = STATUS[record.status].color;
            const dim = highlight !== null && highlight !== record.status;
            return (
              <span
                title={`${record.day} ${MONTH_NAMES[m - 1].slice(0, 3)} · ${STATUS[record.status].label}`}
                className="mx-auto flex h-6 w-6 items-center justify-center rounded-md text-[9px] font-bold transition-opacity"
                style={{
                  background: `${color}26`,
                  color,
                  opacity: dim ? 0.15 : 1,
                }}
              >
                {record.status === 'WO' ? '·' : record.status}
              </span>
            );
          },
        })
      ),
      {
        id: 'present',
        header: 'P',
        size: 60,
        cell: ({ row }) => (
          <span className="font-semibold tabular-nums text-primary">
            {row.original.summary.present}
          </span>
        ),
      },
      {
        id: 'absent',
        header: 'A',
        size: 60,
        cell: ({ row }) => (
          <span className="font-semibold tabular-nums text-destructive">
            {row.original.summary.absent}
          </span>
        ),
      },
      {
        id: 'weeklyOff',
        header: 'WO',
        size: 60,
        cell: ({ row }) => (
          <span className="tabular-nums text-muted-foreground">
            {row.original.summary.wo}
          </span>
        ),
      },
      {
        id: 'late',
        header: 'Late',
        size: 72,
        cell: ({ row }) => (
          <span className="tabular-nums text-secondary-foreground">
            {dur(row.original.summary.lateMin)}
          </span>
        ),
      },
      {
        id: 'overtime',
        header: 'OT',
        size: 72,
        cell: ({ row }) => (
          <span className="tabular-nums text-primary">
            {dur(row.original.summary.otMin)}
          </span>
        ),
      },
    ],
    [dayHeaders, highlight, m]
  );

  const detailColumns = useMemo<ColumnDef<DayRecord>[]>(
    () => [
      {
        id: 'date',
        accessorKey: 'day',
        header: 'Date',
        cell: ({ row }) => (
          <span className="tabular-nums">
            {pad(row.original.day)} {MONTH_NAMES[m - 1].slice(0, 3)},{' '}
            {WEEKDAYS_LONG[row.original.dow]}
          </span>
        ),
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusChip code={row.original.status} />,
      },
      {
        id: 'firstIn',
        header: 'First in',
        cell: ({ row }) => (
          <span className="tabular-nums text-muted-foreground dark:text-muted-foreground">
            {clock(row.original.firstIn)}
          </span>
        ),
      },
      {
        id: 'lastOut',
        header: 'Last out',
        cell: ({ row }) => (
          <span className="tabular-nums text-muted-foreground dark:text-muted-foreground">
            {clock(row.original.lastOut)}
          </span>
        ),
      },
      {
        id: 'late',
        header: 'Late in',
        cell: ({ row }) => (
          <span className="tabular-nums text-secondary-foreground dark:text-secondary-foreground">
            {dur(row.original.lateMin)}
          </span>
        ),
      },
      {
        id: 'early',
        header: 'Early out',
        cell: ({ row }) => (
          <span className="tabular-nums text-destructive dark:text-destructive">
            {dur(row.original.earlyMin)}
          </span>
        ),
      },
      {
        id: 'overtime',
        header: 'OT',
        cell: ({ row }) => (
          <span className="tabular-nums text-primary dark:text-primary">
            {dur(row.original.otMin)}
          </span>
        ),
      },
      {
        id: 'totalHours',
        header: 'Total hours',
        cell: ({ row }) => (
          <span className="tabular-nums">
            {row.original.workMin ? hhmm(row.original.workMin) : '--'}
          </span>
        ),
      },
    ],
    [m]
  );

  const handleReset = () => {
    setMonth(String(now.getMonth() + 1));
    setYear(String(now.getFullYear()));
    setBranch('all');
    setSearch('');
    setSortBy('name');
    setHighlight(null);
  };

  return (
    <div className="min-h-screen space-y-4  p-1 text-foreground  dark:text-foreground">
      <Section
        title="Monthly Muster Report"
        menuId="monthly-muster-report"
        showBreadcrumbs
      >
        <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <FormField
            label="Month"
            name="month"
            type="select"
            value={month}
            onChange={setMonth}
            options={monthlyMusterMonthOptions}
          />
          <FormField
            label="Year"
            name="year"
            type="select"
            value={year}
            onChange={setYear}
            options={monthlyMusterYearOptions}
          />
          <FormField
            label="Branch"
            name="branch"
            type="select"
            value={branch}
            onChange={setBranch}
            options={monthlyMusterBranchFilterOptions}
          />
          <FormField
            label="Search employee"
            name="searchEmployee"
            type="text"
            value={search}
            onChange={setSearch}
            placeholder="Name or ID..."
          />
          <div className="flex lg:justify-end">
            <Button type="button" variant="outline" onClick={handleReset}>
              <RotateCcw size={14} />
              Reset
            </Button>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground dark:text-muted-foreground">
          Showing {periodLabel} · {branch === 'all' ? 'all branches' : branch}
          {search.trim() ? ` · “${search.trim()}”` : ''} · {rows.length} of{' '}
          {allEmployees.length} employees
          {filtersActive ? ' (filtered)' : ''}
        </p>
      </Section>

      {rows.length === 0 ? (
        <div
          className={`${cardCls} flex flex-col items-center py-14 text-center`}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground dark:bg-muted">
            <SearchX size={22} />
          </span>
          <h3 className="mt-4 text-sm font-semibold">No employees found</h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground dark:text-muted-foreground">
            Nothing matches these filters. Try another branch or search term for{' '}
            {periodLabel}.
          </p>
          <Button className="mt-4" variant="outline" onClick={handleReset}>
            <RotateCcw size={14} />
            Reset filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
            {kpis.map(item => (
              <Kpi key={item.key} item={item} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className={`${cardCls} xl:col-span-2`}>
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold">Daily headcount</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
                    How many employees were in each state, by day of{' '}
                    {MONTH_NAMES[m - 1]}
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground dark:text-muted-foreground">
                  {(['P', 'L', 'E', 'H', 'A'] as StatusCode[]).map(c => (
                    <span key={c} className="flex items-center gap-1.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: STATUS[c].color }}
                      />
                      {STATUS[c].label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-foreground dark:text-foreground">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={daily}
                    margin={{ top: 8, right: 8, bottom: 0, left: -20 }}
                  >
                    <CartesianGrid {...gridProps} />
                    <XAxis
                      dataKey="day"
                      tick={axisTick}
                      tickLine={false}
                      axisLine={false}
                      interval={1}
                    />
                    <YAxis
                      tick={axisTick}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      cursor={{ fill: 'currentColor', fillOpacity: 0.05 }}
                      content={
                        <ChartTooltip
                          labelPrefix={`${MONTH_NAMES[m - 1].slice(0, 3)} `}
                        />
                      }
                    />
                    {(['P', 'L', 'E', 'H', 'A'] as StatusCode[]).map(
                      (c, i, arr) => (
                        <Bar
                          key={c}
                          dataKey={c}
                          name={STATUS[c].label}
                          stackId="a"
                          fill={STATUS[c].color}
                          maxBarSize={22}
                          radius={
                            i === arr.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]
                          }
                        />
                      )
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={cardCls}>
              <h3 className="text-sm font-semibold">Status split</h3>
              <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
                All employee-days in {periodLabel}
              </p>
              <div className="relative mt-2">
                <ResponsiveContainer width="100%" height={190}>
                  <PieChart>
                    <Pie
                      data={statusTotals}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={58}
                      outerRadius={82}
                      paddingAngle={2}
                      cornerRadius={4}
                      stroke="none"
                    >
                      {statusTotals.map(s => (
                        <Cell
                          key={s.code}
                          fill={s.color}
                          fillOpacity={
                            highlight === null || highlight === s.code ? 1 : 0.2
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-semibold tabular-nums">
                    {attendanceRate}%
                  </span>
                  <span className="text-[11px] text-muted-foreground dark:text-muted-foreground">
                    attendance
                  </span>
                </div>
              </div>
              <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
                {statusTotals.map(s => (
                  <li
                    key={s.code}
                    className="flex items-center justify-between text-xs text-muted-foreground dark:text-muted-foreground"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: s.color }}
                      />
                      {s.name}
                    </span>
                    <span className="font-medium tabular-nums">{s.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={cardCls}>
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold">
                  Muster · {periodLabel}
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
                  Select a status below to highlight it. Select an employee for
                  the day-by-day detail.
                </p>
              </div>
              <Segmented
                value={sortBy}
                onChange={value => {
                  if (
                    value === 'name' ||
                    value === 'absent' ||
                    value === 'late'
                  ) {
                    setSortBy(value);
                  }
                }}
                options={monthlyMusterSortOptions}
              />
            </div>

            <div className="mb-3 flex flex-wrap gap-2">
              {STATUS_ORDER.map(c => {
                const on = highlight === c;
                return (
                  <Button
                    variant="ghost"
                    key={c}
                    type="button"
                    onClick={() => setHighlight(on ? null : c)}
                    className={`h-auto inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                      on
                        ? 'hover:bg-transparent'
                        : 'border-border text-muted-foreground hover:bg-muted dark:border-border dark:text-foreground dark:hover:bg-muted'
                    }`}
                    style={
                      on
                        ? {
                            borderColor: STATUS[c].color,
                            background: `${STATUS[c].color}1a`,
                            color: STATUS[c].color,
                          }
                        : undefined
                    }
                  >
                    <span
                      className="flex h-4 w-5 items-center justify-center rounded text-[9px] font-bold"
                      style={{
                        background: `${STATUS[c].color}26`,
                        color: STATUS[c].color,
                      }}
                    >
                      {c}
                    </span>
                    {STATUS[c].label}
                  </Button>
                );
              })}
            </div>

            <TanStackTable
              showDownload={true}
              data={rows}
              columns={musterColumns}
              enablePagination={false}
              enableSorting={false}
            />
          </div>
        </>
      )}

      <Dialog
        open={!!selected}
        onOpenChange={open => !open && setSelectedId(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-4xl">
          {selected && (
            <>
              <div className="border-b border-border px-6 pb-4 pt-6 dark:border-border">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={selected.employeeName} size={44} />
                    <div>
                      <h2 className="text-lg font-semibold">
                        {selected.employeeName}
                      </h2>
                      <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                        {selected.employeeId} · {selected.designation} ·{' '}
                        {selected.department} · {selected.branch}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      {
                        label: 'Present',
                        value: selected.summary.present,
                        color: STATUS.P.color,
                      },
                      {
                        label: 'Absent',
                        value: selected.summary.absent,
                        color: STATUS.A.color,
                      },
                      {
                        label: 'W/O',
                        value: selected.summary.wo,
                        color: STATUS.WO.color,
                      },
                      {
                        label: 'Late in',
                        value: dur(selected.summary.lateMin),
                        color: STATUS.L.color,
                      },
                      {
                        label: 'Overtime',
                        value: dur(selected.summary.otMin),
                        color: 'hsl(var(--muted-foreground))',
                      },
                      {
                        label: 'Total hours',
                        value: hhmm(selected.summary.workMin),
                        color: 'hsl(var(--primary))',
                      },
                    ].map(s => (
                      <div
                        key={s.label}
                        className="min-w-[74px] rounded-lg bg-muted px-3 py-2 dark:bg-muted/60"
                      >
                        <div
                          className="text-base font-semibold tabular-nums leading-none"
                          style={{ color: s.color }}
                        >
                          {s.value}
                        </div>
                        <div className="mt-1 text-[11px] text-muted-foreground dark:text-muted-foreground">
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 pb-2">
                {selected && (
                  <TanStackTable
                    showDownload={true}
                    data={selected.days}
                    columns={detailColumns}
                    enablePagination={false}
                    enableSorting={false}
                    scrollable
                    scrollableHeight="50vh"
                  />
                )}
              </div>

              <DialogFooter className="justify-end px-6 pb-6">
                <Button variant="outline" onClick={() => setSelectedId(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MonthlyMusterReport;
