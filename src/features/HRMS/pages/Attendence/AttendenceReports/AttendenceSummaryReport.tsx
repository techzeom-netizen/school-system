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
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlarmClock,
  CalendarOff,
  Clock,
  Eye,
  Plane,
  RotateCcw,
  SearchX,
  UserCheck,
  Users,
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import Section from '@/components/common/Section';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import TanStackTable from '@/components/common/TanStackTable';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import {
  attendanceSummaryBranchFilterOptions,
  attendanceSummaryBranchOptions,
  attendanceSummaryComparisonOptions,
  attendanceSummaryEmployeeFilterOptions,
  employeeAttendanceMonthOptions,
  employeeAttendanceYearOptions,
} from '@/data/reusableDropdownData';

const C = {
  present: 'hsl(var(--primary))',
  absent: 'hsl(var(--destructive))',
  leave: 'hsl(var(--accent-foreground))',
  team: 'hsl(var(--secondary-foreground))',
  employee: 'hsl(var(--muted-foreground))',
};

const OFFICES = attendanceSummaryBranchOptions.map(option => option.value);
const SHIFTS = ['General', 'Morning', 'Night', 'Evening'];
const MONTH_NAMES = employeeAttendanceMonthOptions.map(option => option.label);
const NAMES = [
  'John Doe',
  'Jane Smith',
  'Mike Johnson',
  'Sarah Williams',
  'Robert Brown',
  'Emily Davis',
  'Michael Wilson',
  'Lisa Anderson',
  'David Jones',
  'Patricia Martinez',
  'James Miller',
  'Linda Garcia',
  'William Rodriguez',
  'Elizabeth Martinez',
  'Richard Hernandez',
  'Susan Lopez',
  'Joseph Gonzalez',
  'Jessica Wilson',
  'Thomas Anderson',
  'Karen Moore',
];

interface EmployeeAttendance {
  sn: number;
  name: string;
  empId: string;
  branch: string;
  direct: boolean;
  shift: string;
  presentDays: number;
  totalHours: number;
  absentDays: number;
  leaves: number;
  lateIn: number;
  earlyOut: number;
  overtime: number;
}

interface DailyAttendanceRecord {
  date: string;
  status: string;
  firstIn: string;
  lastOut: string;
  workingHours: string;
  overtime: string;
}

const seeded = (n: number) => {
  const x = Math.sin(n + 1) * 99_999;
  return x - Math.floor(x);
};
const rnd = (seed: number, min: number, max: number) =>
  Math.floor(seeded(seed) * (max - min + 1)) + min;
const r1 = (n: number) => Math.round(n * 10) / 10;
const pad = (n: number) => String(n).padStart(2, '0');
const initials = (name: string) =>
  name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

function workingDays(month: number, year: number) {
  const days = new Date(year, month, 0).getDate();
  let n = 0;
  for (let d = 1; d <= days; d++)
    if (new Date(year, month - 1, d).getDay() !== 0) n++;
  return n;
}

function buildEmployees(month: number, year: number): EmployeeAttendance[] {
  const work = workingDays(month, year);
  return NAMES.map((name, i) => {
    const s = month * 31 + year * 7 + i * 13;
    const absent = rnd(s + 1, 0, 4);
    const leaves = rnd(s + 2, 0, 3);
    const present = Math.max(0, work - absent - leaves);
    return {
      sn: i + 1,
      name,
      empId: `EMP${pad(i + 1).padStart(3, '0')}`,
      branch: OFFICES[i % OFFICES.length],
      direct: i % 3 === 0,
      shift: SHIFTS[(i + 1) % SHIFTS.length],
      presentDays: present,
      totalHours: Math.round(present * (7.4 + seeded(s + 5) * 1.4)),
      absentDays: absent,
      leaves,
      lateIn: rnd(s + 3, 0, Math.min(6, present)),
      earlyOut: rnd(s + 4, 0, 4),
      overtime: rnd(s + 6, 0, 20),
    };
  });
}

function applyFilters(
  list: EmployeeAttendance[],
  branch: string,
  scope: string,
  query: string
) {
  const q = query.trim().toLowerCase();
  return list.filter(
    e =>
      (branch === 'all' || e.branch === branch) &&
      (scope === 'all' || e.direct) &&
      (!q ||
        e.name.toLowerCase().includes(q) ||
        e.empId.toLowerCase().includes(q))
  );
}

function rates(rows: EmployeeAttendance[]) {
  const present = rows.reduce((a, e) => a + e.presentDays, 0);
  const absent = rows.reduce((a, e) => a + e.absentDays, 0);
  const leave = rows.reduce((a, e) => a + e.leaves, 0);
  const late = rows.reduce((a, e) => a + e.lateIn, 0);
  const hours = rows.reduce((a, e) => a + e.totalHours, 0);
  const ot = rows.reduce((a, e) => a + e.overtime, 0);
  const total = present + absent + leave || 1;
  return {
    present,
    absent,
    leave,
    late,
    availability: r1((present / total) * 100),
    absenteeism: r1((absent / total) * 100),
    leaveRate: r1((leave / total) * 100),
    punctuality: present ? r1(((present - late) / present) * 100) : 0,
    avgHours: present ? hours / present : 0,
    avgOvertime: rows.length ? ot / rows.length : 0,
  };
}
const toHHMM = (h: number) =>
  `${pad(Math.floor(h))}:${pad(Math.round((h % 1) * 60))}`;

const gridProps = {
  strokeDasharray: '3 3',
  stroke: 'currentColor',
  strokeOpacity: 0.1,
  vertical: false,
};
const axisTick = { fontSize: 11, fill: 'currentColor', opacity: 0.55 };
const cardCls =
  'rounded-xl border border-border bg-card p-5 dark:border-border dark:bg-card';
const AVATAR_COLORS = [
  'bg-primary text-primary-foreground',
  'bg-secondary text-secondary-foreground',
  'bg-accent text-accent-foreground',
  'bg-destructive text-destructive-foreground',
  'bg-muted text-muted-foreground',
];

function ChartTooltip({
  active,
  payload,
  label,
  unit = '',
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
  unit?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card/95 px-3 py-2 text-xs shadow-lg backdrop-blur dark:border-border dark:bg-muted/95">
      {label && (
        <div className="mb-1 font-semibold text-foreground dark:text-foreground">
          {label}
        </div>
      )}
      {payload.map(p => (
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
            {unit}
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
      {item.spark && (
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

function Gauge({
  label,
  team,
  employee,
  compare,
}: {
  label: string;
  team: number;
  employee: number | null;
  compare: boolean;
}) {
  const data = [
    ...(compare && employee !== null
      ? [{ name: 'Employee', value: employee, fill: C.employee }]
      : []),
    { name: 'Team', value: team, fill: C.team },
  ];
  return (
    <div className="text-center">
      <div className="relative mx-auto h-[104px] w-full max-w-[170px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius="115%"
            outerRadius="200%"
            barSize={9}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              tick={false}
              angleAxisId={0}
            />
            <RadialBar
              dataKey="value"
              background={{ fill: 'currentColor', fillOpacity: 0.08 }}
              cornerRadius={6}
              isAnimationActive
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center">
          <span className="text-lg font-semibold tabular-nums leading-none">
            {team}%
          </span>
          {compare && (
            <span
              className="mt-1 text-[11px] font-medium tabular-nums"
              style={{ color: C.employee }}
            >
              {employee === null ? 'No data' : `${employee}%`}
            </span>
          )}
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground dark:text-muted-foreground">
        {label}
      </p>
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

function Pill({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: 'amber' | 'sky' | 'violet' | 'green' | 'red' | 'blue' | 'gray';
}) {
  const tones = {
    amber:
      'bg-secondary text-secondary-foreground dark:text-secondary-foreground',
    sky: 'bg-primary/10 text-primary dark:text-primary',
    violet: 'bg-primary/10 text-primary dark:text-primary',
    green: 'bg-primary/10 text-primary dark:text-primary',
    red: 'bg-destructive/10 text-destructive dark:text-destructive',
    blue: 'bg-primary/10 text-primary dark:text-primary',
    gray: 'bg-muted/10 text-muted-foreground dark:text-foreground',
  };
  return (
    <span
      className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

const AttendanceSummaryReport = () => {
  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));
  const [branch, setBranch] = useState('all');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [searchEmployee, setSearchEmployee] = useState('');

  const [compareEnabled, setCompareEnabled] = useState(false);
  const [compareEmployee, setCompareEmployee] = useState('');
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeAttendance | null>(null);

  const m = parseInt(month);
  const y = parseInt(year);
  const periodLabel = `${MONTH_NAMES[m - 1]} ${y}`;

  const monthEmployees = useMemo(() => buildEmployees(m, y), [m, y]);
  const rows = useMemo(
    () => applyFilters(monthEmployees, branch, employeeFilter, searchEmployee),
    [monthEmployees, branch, employeeFilter, searchEmployee]
  );
  const team = useMemo(() => rates(rows), [rows]);

  const trend = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const d = new Date(y, m - 1 - (5 - i), 1);
        const list = applyFilters(
          buildEmployees(d.getMonth() + 1, d.getFullYear()),
          branch,
          employeeFilter,
          searchEmployee
        );
        const r = rates(list);
        return {
          month: MONTH_NAMES[d.getMonth()].slice(0, 3),
          availability: r.availability,
          absenteeism: r.absenteeism,
          leave: r.leaveRate,
        };
      }),
    [m, y, branch, employeeFilter, searchEmployee]
  );
  const bestMonth = trend.reduce(
    (best, t) => (t.availability > best.availability ? t : best),
    trend[0]
  );

  const distribution = [
    { name: 'Present', value: team.availability, color: C.present },
    { name: 'Absent', value: team.absenteeism, color: C.absent },
    { name: 'Leave', value: team.leaveRate, color: C.leave },
  ];

  const work = workingDays(m, y);
  const kpis: KpiItem[] = [
    {
      key: 'total',
      label: 'Employees',
      value: rows.length,
      hint: branch === 'all' ? 'All branches' : branch,
      icon: Users,
      color: 'hsl(var(--primary))',
    },
    {
      key: 'present',
      label: 'Avg present / day',
      value: r1(team.present / work),
      hint: `${team.availability}% availability`,
      icon: UserCheck,
      color: C.present,
      spark: trend.map(t => t.availability),
    },
    {
      key: 'absent',
      label: 'Avg absent / day',
      value: r1(team.absent / work),
      hint: `${team.absent} absent days`,
      icon: CalendarOff,
      color: C.absent,
      spark: trend.map(t => t.absenteeism),
    },
    {
      key: 'leave',
      label: 'Avg on leave / day',
      value: r1(team.leave / work),
      hint: `${team.leave} leave days`,
      icon: Plane,
      color: C.leave,
      spark: trend.map(t => t.leave),
    },
    {
      key: 'late',
      label: 'Late arrivals',
      value: team.late,
      hint: `${team.punctuality}% punctual`,
      icon: AlarmClock,
      color: 'hsl(var(--accent-foreground))',
    },
    {
      key: 'hours',
      label: 'Avg working hours',
      value: `${r1(team.avgHours)}h`,
      hint: 'Per present day',
      icon: Clock,
      color: 'hsl(var(--muted-foreground))',
    },
  ];

  const watchlist = [
    {
      label: 'High absenteeism',
      note: '3+ absent days',
      count: rows.filter(e => e.absentDays >= 3).length,
      color: C.absent,
    },
    {
      label: 'Frequent late in',
      note: '4+ late arrivals',
      count: rows.filter(e => e.lateIn >= 4).length,
      color: 'hsl(var(--accent-foreground))',
    },
    {
      label: 'Leave balance low',
      note: '3+ leave days',
      count: rows.filter(e => e.leaves >= 3).length,
      color: C.leave,
    },
    {
      label: 'Overtime exceeded',
      note: '15h+ overtime',
      count: rows.filter(e => e.overtime >= 15).length,
      color: C.team,
    },
  ];

  const compared = rows.find(e => e.empId === compareEmployee) ?? null;
  const empRates = compared ? rates([compared]) : null;
  const comparing = compareEnabled && !!empRates;
  const compareMissing = compareEnabled && !!compareEmployee && !compared;

  const handleViewDetail = (employee: EmployeeAttendance) => {
    setSelectedEmployee(employee);
    setShowDetailDialog(true);
  };

  const handleReset = () => {
    setMonth(String(now.getMonth() + 1));
    setYear(String(now.getFullYear()));
    setBranch('all');
    setEmployeeFilter('all');
    setSearchEmployee('');
    setCompareEnabled(false);
    setCompareEmployee('');
  };

  const columns = useMemo<ColumnDef<EmployeeAttendance>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Employee',
        size: 240,
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <Avatar name={row.original.name} />
            <div className="leading-tight">
              <div className="text-sm font-medium">{row.original.name}</div>
              <div className="text-xs text-muted-foreground dark:text-muted-foreground">
                {row.original.empId} · {row.original.branch}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'shift',
        header: 'Shift',
        size: 100,
        cell: ({ row }) => <Pill tone="gray">{row.original.shift}</Pill>,
      },
      {
        accessorKey: 'presentDays',
        header: 'Present days',
        size: 150,
        cell: ({ row }) => {
          const e = row.original;
          const total = e.presentDays + e.absentDays + e.leaves || 1;
          return (
            <div className="min-w-[110px]">
              <div className="flex justify-between text-xs tabular-nums">
                <span className="font-medium">{e.presentDays}</span>
                <span className="text-muted-foreground">of {total}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted dark:bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(e.presentDays / total) * 100}%`,
                    background: C.present,
                  }}
                />
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'totalHours',
        header: 'Total hours',
        size: 100,
        cell: ({ row }) => (
          <span className="tabular-nums">{row.original.totalHours}h</span>
        ),
      },
      {
        accessorKey: 'absentDays',
        header: 'Absent',
        size: 80,
        cell: ({ row }) =>
          row.original.absentDays ? (
            <Pill tone="red">{row.original.absentDays}</Pill>
          ) : (
            <span className="text-muted-foreground">0</span>
          ),
      },
      {
        accessorKey: 'leaves',
        header: 'Leaves',
        size: 80,
        cell: ({ row }) => (
          <span className="tabular-nums">{row.original.leaves}</span>
        ),
      },
      {
        accessorKey: 'lateIn',
        header: 'Late in',
        size: 80,
        cell: ({ row }) => <Pill tone="amber">{row.original.lateIn}</Pill>,
      },
      {
        accessorKey: 'earlyOut',
        header: 'Early out',
        size: 80,
        cell: ({ row }) => <Pill tone="sky">{row.original.earlyOut}</Pill>,
      },
      {
        accessorKey: 'overtime',
        header: 'Overtime',
        size: 90,
        cell: ({ row }) => <Pill tone="violet">{row.original.overtime}h</Pill>,
      },
      {
        id: 'details',
        header: 'Details',
        size: 70,
        cell: ({ row }) => (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleViewDetail(row.original)}
            className="p-1"
            aria-label={`View ${row.original.name} details`}
          >
            <Eye className="h-4 w-4 text-muted-foreground hover:text-primary" />
          </Button>
        ),
      },
    ],
    []
  );

  const dailyRecords = useMemo<DailyAttendanceRecord[]>(() => {
    if (!selectedEmployee) return [];
    const daysInMonth = new Date(y, m, 0).getDate();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const ratio = selectedEmployee.presentDays / (work || 1);

    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dow = new Date(y, m - 1, day).getDay();
      const rec: DailyAttendanceRecord = {
        date: `${dayNames[dow]}, ${pad(day)} ${MONTH_NAMES[m - 1].slice(0, 3)}`,
        status: 'ABSENT',
        firstIn: '-',
        lastOut: '-',
        workingHours: '-',
        overtime: '-',
      };
      if (dow === 0) {
        rec.status = 'WEEKLY OFF';
        return rec;
      }
      const s = selectedEmployee.sn * 1000 + day * 7 + m * 11;
      if (seeded(s) < ratio) {
        const inH = 9 + Math.floor(seeded(s + 1) * 2);
        const inM = Math.floor(seeded(s + 2) * 60);
        const outH = 17 + Math.floor(seeded(s + 3) * 3);
        const outM = Math.floor(seeded(s + 4) * 60);
        const mins = (outH - inH) * 60 + (outM - inM);
        rec.status = 'PRESENT';
        rec.firstIn = `${pad(inH)}:${pad(inM)}`;
        rec.lastOut = `${pad(outH)}:${pad(outM)}`;
        rec.workingHours = `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;
        if (mins > 480)
          rec.overtime = `${pad(Math.floor((mins - 480) / 60))}:${pad((mins - 480) % 60)}`;
      }
      return rec;
    });
  }, [selectedEmployee, m, y, work]);

  const dailyColumns: ColumnDef<DailyAttendanceRecord>[] = [
    { accessorKey: 'date', header: 'Date', size: 140 },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 120,
      cell: ({ row }) => {
        const s = row.original.status;
        return (
          <Pill
            tone={
              s === 'PRESENT' ? 'green' : s === 'WEEKLY OFF' ? 'blue' : 'red'
            }
          >
            {s}
          </Pill>
        );
      },
    },
    { accessorKey: 'firstIn', header: 'First in', size: 100 },
    { accessorKey: 'lastOut', header: 'Last out', size: 100 },
    { accessorKey: 'workingHours', header: 'Working hours', size: 120 },
    { accessorKey: 'overtime', header: 'Overtime', size: 100 },
  ];

  const dialogStats = useMemo(
    () => ({
      present: dailyRecords.filter(r => r.status === 'PRESENT').length,
      absent: dailyRecords.filter(r => r.status === 'ABSENT').length,
      off: dailyRecords.filter(r => r.status === 'WEEKLY OFF').length,
    }),
    [dailyRecords]
  );

  const filtersActive =
    branch !== 'all' ||
    employeeFilter !== 'all' ||
    searchEmployee.trim() !== '';

  return (
    <div className="min-h-screen space-y-4  p-1 text-foreground  dark:text-foreground">
      <Section
        title="Attendance Summary Report"
        menuId="attendance-summary-report"
        showBreadcrumbs
      >
        <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <FormField
            label="Month"
            name="month"
            type="select"
            value={month}
            onChange={setMonth}
            options={employeeAttendanceMonthOptions}
          />
          <FormField
            label="Year"
            name="year"
            type="select"
            value={year}
            onChange={setYear}
            options={employeeAttendanceYearOptions}
          />
          <FormField
            label="Branch"
            name="branch"
            type="select"
            value={branch}
            onChange={setBranch}
            options={attendanceSummaryBranchFilterOptions}
          />
          <FormField
            label="Employees"
            name="employeeFilter"
            type="select"
            value={employeeFilter}
            onChange={setEmployeeFilter}
            placeholder="-- Select --"
            options={attendanceSummaryEmployeeFilterOptions}
          />
          <FormField
            label="Search employee"
            name="searchEmployee"
            type="text"
            value={searchEmployee}
            onChange={setSearchEmployee}
            placeholder="Name or ID..."
          />
          <div className="flex lg:justify-end">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw size={14} />
              Reset
            </Button>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground dark:text-muted-foreground">
          Showing {periodLabel} · {branch === 'all' ? 'all branches' : branch} ·{' '}
          {rows.length} of {monthEmployees.length} employees
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
          <h3 className="mt-4 text-sm font-semibold">
            No employees match these filters
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground dark:text-muted-foreground">
            Try a different branch or search term, or reset the filters to see
            everyone for {periodLabel}.
          </p>
          <Button className="mt-4" variant="outline" onClick={handleReset}>
            <RotateCcw size={14} />
            Reset filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {kpis.map(item => (
              <Kpi key={item.key} item={item} />
            ))}
          </div>

          <div className={cardCls}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold">
                  Attendance rates · {periodLabel}
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
                  {comparing ? (
                    <span className="flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: C.team }}
                        />
                        Team
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: C.employee }}
                        />
                        {compared?.name}
                      </span>
                    </span>
                  ) : compareMissing ? (
                    "The selected employee isn't in the current filters."
                  ) : (
                    `Based on ${rows.length} employees`
                  )}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Segmented
                  value={compareEnabled ? 'compare' : 'team'}
                  onChange={v => setCompareEnabled(v === 'compare')}
                  options={attendanceSummaryComparisonOptions}
                />
                {compareEnabled && (
                  <div className="w-60">
                    <FormField
                      label=""
                      name="compareEmployee"
                      type="searchSelect"
                      value={compareEmployee}
                      onChange={setCompareEmployee}
                      options={rows.map(emp => ({
                        value: emp.empId,
                        label: emp.name,
                      }))}
                      placeholder="Search employee name"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="grid grid-cols-2 gap-4 lg:col-span-8 lg:grid-cols-4">
                <Gauge
                  label="Availability"
                  team={team.availability}
                  employee={empRates?.availability ?? null}
                  compare={comparing}
                />
                <Gauge
                  label="Absenteeism"
                  team={team.absenteeism}
                  employee={empRates?.absenteeism ?? null}
                  compare={comparing}
                />
                <Gauge
                  label="Leave"
                  team={team.leaveRate}
                  employee={empRates?.leaveRate ?? null}
                  compare={comparing}
                />
                <Gauge
                  label="Punctuality"
                  team={team.punctuality}
                  employee={empRates?.punctuality ?? null}
                  compare={comparing}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 border-border dark:border-border lg:col-span-4 lg:border-l lg:pl-6">
                {[
                  {
                    label: 'Daily average working hours',
                    team: toHHMM(team.avgHours),
                    emp: empRates ? toHHMM(empRates.avgHours) : null,
                  },
                  {
                    label: 'Average overtime per employee',
                    team: toHHMM(team.avgOvertime),
                    emp: empRates ? toHHMM(empRates.avgOvertime) : null,
                  },
                ].map(p => (
                  <div
                    key={p.label}
                    className="rounded-lg bg-muted p-3 dark:bg-muted/60"
                  >
                    <div className="text-xl font-semibold tabular-nums">
                      {p.team}
                      <span className="ml-1 text-xs font-normal text-muted-foreground dark:text-muted-foreground">
                        hrs
                      </span>
                    </div>
                    {comparing && (
                      <div
                        className="text-sm font-medium tabular-nums"
                        style={{ color: C.employee }}
                      >
                        {p.emp} <span className="text-xs font-normal">hrs</span>
                      </div>
                    )}
                    <div className="mt-1 text-xs text-muted-foreground dark:text-muted-foreground">
                      {p.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className={`${cardCls} xl:col-span-2`}>
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold">Attendance trend</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
                    Share of working days, 6 months to {periodLabel}
                  </p>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground dark:text-muted-foreground">
                  {[
                    ['Present', C.present],
                    ['Absent', C.absent],
                    ['Leave', C.leave],
                  ].map(([n, c]) => (
                    <span key={n} className="flex items-center gap-1.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: c }}
                      />
                      {n}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-foreground dark:text-foreground">
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart
                    data={trend}
                    margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
                  >
                    <defs>
                      {[
                        ['availability', C.present],
                        ['absenteeism', C.absent],
                        ['leave', C.leave],
                      ].map(([k, c]) => (
                        <linearGradient
                          key={k}
                          id={`tr-${k}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor={c} stopOpacity={0.5} />
                          <stop
                            offset="100%"
                            stopColor={c}
                            stopOpacity={0.05}
                          />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid {...gridProps} />
                    <XAxis
                      dataKey="month"
                      tick={axisTick}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={axisTick}
                      tickLine={false}
                      axisLine={false}
                      unit="%"
                      domain={[0, 100]}
                    />
                    <Tooltip content={<ChartTooltip unit="%" />} />
                    <Area
                      type="monotone"
                      dataKey="availability"
                      name="Present"
                      stackId="a"
                      stroke={C.present}
                      strokeWidth={1.5}
                      fill="url(#tr-availability)"
                    />
                    <Area
                      type="monotone"
                      dataKey="absenteeism"
                      name="Absent"
                      stackId="a"
                      stroke={C.absent}
                      strokeWidth={1.5}
                      fill="url(#tr-absenteeism)"
                    />
                    <Area
                      type="monotone"
                      dataKey="leave"
                      name="Leave"
                      stackId="a"
                      stroke={C.leave}
                      strokeWidth={1.5}
                      fill="url(#tr-leave)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={cardCls}>
              <h3 className="text-sm font-semibold">Attendance split</h3>
              <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
                {periodLabel}
              </p>
              <div className="relative mt-2">
                <ResponsiveContainer width="100%" height={190}>
                  <PieChart>
                    <Pie
                      data={distribution}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={58}
                      outerRadius={82}
                      paddingAngle={3}
                      cornerRadius={4}
                      stroke="none"
                    >
                      {distribution.map(d => (
                        <Cell key={d.name} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip unit="%" />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-semibold tabular-nums">
                    {distribution[0].value}%
                  </span>
                  <span className="text-[11px] text-muted-foreground dark:text-muted-foreground">
                    present
                  </span>
                </div>
              </div>
              <ul className="mt-2 space-y-1.5">
                {distribution.map(d => (
                  <li
                    key={d.name}
                    className="flex items-center justify-between text-xs text-muted-foreground dark:text-muted-foreground"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: d.color }}
                      />
                      {d.name}
                    </span>
                    <span className="font-medium tabular-nums">{d.value}%</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`${cardCls} xl:col-span-2`}>
              <h3 className="text-sm font-semibold">Availability by month</h3>
              <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
                Best month: {bestMonth.month} at {bestMonth.availability}%
              </p>
              <div className="mt-3 text-foreground dark:text-foreground">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={trend}
                    margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
                  >
                    <CartesianGrid {...gridProps} />
                    <XAxis
                      dataKey="month"
                      tick={axisTick}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={axisTick}
                      tickLine={false}
                      axisLine={false}
                      unit="%"
                      domain={[
                        (min: number) => Math.max(0, Math.floor(min - 5)),
                        100,
                      ]}
                    />
                    <Tooltip
                      cursor={{ fill: 'currentColor', fillOpacity: 0.05 }}
                      content={<ChartTooltip unit="%" />}
                    />
                    <Bar
                      dataKey="availability"
                      name="Availability"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={44}
                    >
                      {trend.map(t => (
                        <Cell
                          key={t.month}
                          fill={C.present}
                          fillOpacity={t.month === bestMonth.month ? 1 : 0.35}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={cardCls}>
              <h3 className="text-sm font-semibold">Watchlist</h3>
              <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
                Employees to follow up with in {periodLabel}
              </p>
              <ul className="mt-4 space-y-4">
                {watchlist.map(w => (
                  <li key={w.label}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 font-medium">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: w.color }}
                        />
                        {w.label}
                        <span className="font-normal text-muted-foreground">
                          {w.note}
                        </span>
                      </span>
                      <span className="tabular-nums text-muted-foreground dark:text-muted-foreground">
                        {w.count}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-muted dark:bg-muted">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(w.count / rows.length) * 100}%`,
                          background: w.color,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Section title="Employee attendance details">
            <TanStackTable
              showDownload={true}
              key={`${month}-${year}-${branch}-${employeeFilter}`}
              data={rows}
              columns={columns}
              enableSearch={false}
              enableSorting={false}
              enableColumnVisibility={true}
              enablePagination={true}
              pageSize={10}
              emptyMessage="No employee attendance records found."
            />
          </Section>
        </>
      )}

      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-4xl">
          {selectedEmployee && (
            <div className="border-b border-border px-6 pb-4 pt-6 dark:border-border">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar name={selectedEmployee.name} size={44} />
                  <div>
                    <h2 className="text-lg font-semibold">
                      {selectedEmployee.name}
                    </h2>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                      {selectedEmployee.empId} · {selectedEmployee.shift} shift
                      · {selectedEmployee.branch} · {periodLabel}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[
                    {
                      label: 'Present',
                      value: dialogStats.present,
                      color: C.present,
                    },
                    {
                      label: 'Absent',
                      value: dialogStats.absent,
                      color: C.absent,
                    },
                    {
                      label: 'Weekly off',
                      value: dialogStats.off,
                      color: C.team,
                    },
                  ].map(s => (
                    <div
                      key={s.label}
                      className="min-w-[78px] rounded-lg bg-muted px-3 py-2 dark:bg-muted/60"
                    >
                      <div
                        className="text-lg font-semibold tabular-nums leading-none"
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
          )}

          <div className="px-6 pb-2">
            <TanStackTable
              showDownload={true}
              data={dailyRecords}
              columns={dailyColumns}
              enableSearch={false}
              enableSorting={false}
              enableColumnVisibility={false}
              enablePagination={false}
              emptyMessage="No attendance records found."
            />
          </div>

          <DialogFooter className="justify-end px-6 pb-6">
            <Button
              variant="outline"
              onClick={() => setShowDetailDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttendanceSummaryReport;
