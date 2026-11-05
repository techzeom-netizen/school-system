import React, { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  Line,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlarmClock,
  CalendarX2,
  Clock3,
  LogOut,
  RotateCcw,
  TrendingUp,
  Users,
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import Section from '@/components/common/Section';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import TanStackTable from '@/components/common/TanStackTable';
import {
  attendanceInsightsGroupByOptions,
  attendanceInsightsScopeOptions,
  attendanceInsightsViewOptions,
  attendanceSummaryBranchFilterOptions,
  attendanceSummaryBranchOptions,
  monthlyMusterMonthOptions,
  monthlyMusterYearOptions,
} from '@/data/reusableDropdownData';

const OFFICES = attendanceSummaryBranchOptions.map(option => option.value);
const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'HR',
  'Finance',
  'Sales',
];
const EMP_TYPES = ['Permanent', 'Contract', 'Intern', 'Probation'];
const SHIFTS = ['General', 'Morning', 'Night', 'Evening'];
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
  'Sarah Thomas',
  'Charles Taylor',
  'Karen Moore',
  'Daniel Jackson',
  'Nancy Martin',
  'Matthew Lee',
  'Betty White',
  'Paul Harris',
  'Sandra Clark',
  'Mark Lewis',
  'Ashley Robinson',
];
const MONTHS = monthlyMusterMonthOptions;
const DESIGNATIONS = [
  'Software Engineer',
  'Senior Software Engineer',
  'Product Manager',
  'UI/UX Designer',
  'HR Executive',
  'Accountant',
  'Sales Manager',
];

type MetricType = 'lateIn' | 'earlyOut' | 'overtime' | 'notPresent';
type ViewType = 'count' | 'hours';
type GroupByType = 'daily' | 'designation' | 'employeeType';
type ScopeType = 'all' | 'direct';

interface MetricData {
  count: number;
  hours: number;
}
interface Employee {
  id: number;
  name: string;
  empId: string;
  branch: string;
  department: string;
  designation: string;
  employeeType: string;
  shift: string;
  lateIn: MetricData;
  earlyOut: MetricData;
  overtime: MetricData;
  notPresent: MetricData;
}

const METRICS: Record<
  MetricType,
  { label: string; color: string; soft: string; icon: React.ElementType }
> = {
  lateIn: {
    label: 'Late in',
    color: 'hsl(var(--accent-foreground))',
    soft: 'bg-secondary text-secondary-foreground dark:text-secondary-foreground',
    icon: AlarmClock,
  },
  earlyOut: {
    label: 'Early out',
    color: 'hsl(var(--secondary-foreground))',
    soft: 'bg-primary/10 text-primary dark:text-primary',
    icon: LogOut,
  },
  overtime: {
    label: 'Overtime',
    color: 'hsl(var(--muted-foreground))',
    soft: 'bg-primary/10 text-primary dark:text-primary',
    icon: Clock3,
  },
  notPresent: {
    label: 'Not present',
    color: 'hsl(var(--destructive))',
    soft: 'bg-destructive/10 text-destructive dark:text-destructive',
    icon: CalendarX2,
  },
};
const TYPE_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary-foreground))',
  'hsl(var(--accent-foreground))',
  'hsl(var(--muted-foreground))',
];
const BRANCH_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary-foreground))',
  'hsl(var(--accent-foreground))',
  'hsl(var(--muted-foreground))',
];

const seeded = (n: number) => {
  const x = Math.sin(n + 1) * 99_999;
  return x - Math.floor(x);
};
const rnd = (seed: number, min: number, max: number) =>
  Math.floor(seeded(seed) * (max - min + 1)) + min;
const r1 = (n: number) => Math.round(n * 10) / 10;

function buildEmployees(
  month: string,
  year: string,
  scope: ScopeType
): Employee[] {
  const base = parseInt(month) * 7 + parseInt(year) * 3;
  const total = scope === 'direct' ? 8 : 25;
  return Array.from({ length: total }, (_, i) => {
    const s = base + i * 13;
    return {
      id: i + 1,
      name: NAMES[i % NAMES.length],
      empId: `EMP${1001 + i}`,
      branch: OFFICES[i % OFFICES.length],
      department: DEPARTMENTS[(i * 2 + 1) % DEPARTMENTS.length],
      designation: DESIGNATIONS[i % DESIGNATIONS.length],
      employeeType: EMP_TYPES[(i + 1) % EMP_TYPES.length],
      shift: SHIFTS[i % SHIFTS.length],
      lateIn: { count: rnd(s + 1, 0, 15), hours: r1(seeded(s + 2) * 5) },
      earlyOut: { count: rnd(s + 3, 0, 10), hours: r1(seeded(s + 4) * 4) },
      overtime: { count: rnd(s + 5, 0, 8), hours: r1(seeded(s + 6) * 6) },
      notPresent: { count: rnd(s + 7, 0, 6), hours: rnd(s + 8, 0, 48) },
    };
  });
}

const daysIn = (month: string, year: string) =>
  new Date(parseInt(year), parseInt(month), 0).getDate();

function dailyHit(emp: Employee, day: number) {
  return seeded(emp.id * 100 + day) > 0.72;
}

function buildDaily(
  emps: Employee[],
  metric: MetricType,
  month: string,
  year: string
) {
  const rows = Array.from({ length: daysIn(month, year) }, (_, i) => {
    const day = i + 1;
    let count = 0;
    let hours = 0;
    emps.forEach(e => {
      if (dailyHit(e, day)) {
        count += Math.ceil(seeded(e.id * day + 1) * e[metric].count * 0.35);
        hours += seeded(e.id * day + 2) * e[metric].hours * 0.35;
      }
    });
    return { day, count: Math.round(count), hours: r1(hours), avg: 0 };
  });
  return rows;
}

function buildByDesignation(emps: Employee[], metric: MetricType) {
  return DESIGNATIONS.map(d => {
    const list = emps.filter(e => e.designation === d);
    return {
      group: d,
      count: list.reduce((a, e) => a + e[metric].count, 0),
      hours: r1(list.reduce((a, e) => a + e[metric].hours, 0)),
    };
  }).sort((a, b) => b.count - a.count);
}

function buildByType(
  emps: Employee[],
  metric: MetricType,
  view: ViewType,
  month: string,
  year: string
) {
  return Array.from({ length: daysIn(month, year) }, (_, i) => {
    const day = i + 1;
    const point: Record<string, number> = { day };
    EMP_TYPES.forEach(t => {
      let total = 0;
      emps
        .filter(e => e.employeeType === t)
        .forEach(e => {
          if (dailyHit(e, day)) {
            total +=
              view === 'count'
                ? Math.ceil(seeded(e.id * day + 1) * e[metric].count * 0.35)
                : seeded(e.id * day + 2) * e[metric].hours * 0.35;
          }
        });
      point[t] = r1(total);
    });
    return point;
  });
}

const axisTick = { fontSize: 11, fill: 'currentColor', opacity: 0.55 };

function ChartTooltip({
  active,
  payload,
  label,
  unit,
  labelPrefix,
}: {
  active?: boolean;
  payload?: any[];
  label?: string | number;
  unit: string;
  labelPrefix?: string;
}) {
  if (!active || !payload?.length) return null;
  const rows = payload.filter(p => p.dataKey !== 'avg' || payload.length === 1);
  return (
    <div className="rounded-lg border border-border bg-card/95 px-3 py-2 text-xs shadow-lg backdrop-blur dark:border-border dark:bg-muted/95">
      <div className="mb-1 font-semibold text-foreground dark:text-foreground">
        {labelPrefix}
        {label}
      </div>
      {rows.map(p => (
        <div
          key={p.dataKey}
          className="flex items-center justify-between gap-6 text-muted-foreground dark:text-foreground"
        >
          <span className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: p.color || p.fill }}
            />
            {p.dataKey === 'avg' ? '7-day average' : p.name || p.dataKey}
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

function Kpi({
  label,
  value,
  hint,
  icon: Icon,
  color,
  spark,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ElementType;
  color: string;
  spark?: { v: number }[];
}) {
  const id = `spark-${label.replace(/\s/g, '')}`;
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4 dark:border-border dark:bg-card">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground dark:text-muted-foreground">
          {label}
        </span>
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{
            background: `color-mix(in srgb, ${color} 12%, transparent)`,
            color,
          }}
        >
          <Icon size={14} />
        </span>
      </div>
      <div className="mt-2 text-2xl font-semibold tabular-nums text-foreground dark:text-primary-foreground">
        {value}
      </div>
      <div className="mt-0.5 truncate text-xs text-muted-foreground dark:text-muted-foreground">
        {hint}
      </div>
      {spark && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 opacity-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={spark}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={color}
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

const AttendanceInsights: React.FC = () => {
  const now = new Date();
  const [metric, setMetric] = useState<MetricType>('lateIn');
  const [view, setView] = useState<ViewType>('count');
  const [groupBy, setGroupBy] = useState<GroupByType>('daily');
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));
  const [scope, setScope] = useState<ScopeType>('all');
  const [branch, setBranch] = useState('all');

  const theme = METRICS[metric];
  const key: ViewType = view;
  const unit = view === 'count' ? '' : ' h';

  const allEmp = useMemo(
    () => buildEmployees(month, year, scope),
    [month, year, scope]
  );
  const emps = useMemo(
    () => (branch === 'all' ? allEmp : allEmp.filter(e => e.branch === branch)),
    [allEmp, branch]
  );

  const daily = useMemo(() => {
    const rows = buildDaily(emps, metric, month, year);
    return rows.map((r, i) => {
      const win = rows.slice(Math.max(0, i - 6), i + 1);
      return {
        ...r,
        avg: r1(win.reduce((a, x) => a + x[key], 0) / win.length),
      };
    });
  }, [emps, metric, month, year, key]);

  const byDesignation = useMemo(
    () => buildByDesignation(emps, metric),
    [emps, metric]
  );
  const byType = useMemo(
    () => buildByType(emps, metric, view, month, year),
    [emps, metric, view, month, year]
  );

  const byBranch = useMemo(
    () =>
      OFFICES.map((o, i) => ({
        name: o,
        value: r1(
          allEmp
            .filter(e => e.branch === o)
            .reduce((a, e) => a + e[metric][key], 0)
        ),
        color: BRANCH_COLORS[i],
      })),
    [allEmp, metric, key]
  );

  const topEmployees = useMemo(
    () => [...emps].sort((a, b) => b[metric][key] - a[metric][key]).slice(0, 5),
    [emps, metric, key]
  );

  const total = r1(emps.reduce((a, e) => a + e[metric][key], 0));
  const perEmp = emps.length ? r1(total / emps.length) : 0;
  const peak = daily.reduce((m, r) => (r[key] > m[key] ? r : m), daily[0]);
  const dailyAvg = daily.length
    ? r1(daily.reduce((a, r) => a + r[key], 0) / daily.length)
    : 0;
  const worstBranch = [...byBranch].sort((a, b) => b.value - a.value)[0];
  const monthLabel = MONTHS[parseInt(month) - 1].label;

  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'empId', header: 'Employee ID' },
      { accessorKey: 'branch', header: 'Branch' },
      { accessorKey: 'designation', header: 'Designation' },
      { accessorKey: 'employeeType', header: 'Employee type' },
      { accessorKey: 'shift', header: 'Assigned shift' },
      {
        id: 'metricCount',
        header: `${theme.label} (count)`,
        cell: ({ row }) => (
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums ${theme.soft}`}
          >
            {row.original[metric].count}
          </span>
        ),
      },
      {
        id: 'metricHours',
        header: `${theme.label} (hrs)`,
        cell: ({ row }) => (
          <span className="tabular-nums">
            {row.original[metric].hours.toFixed(1)}
          </span>
        ),
      },
    ],
    [metric, theme]
  );

  const handleReset = () => {
    setMetric('lateIn');
    setView('count');
    setGroupBy('daily');
    setMonth(String(now.getMonth() + 1));
    setYear(String(now.getFullYear()));
    setScope('all');
    setBranch('all');
  };

  const chartTitle =
    groupBy === 'daily'
      ? `${theme.label} each day in ${monthLabel}`
      : groupBy === 'designation'
        ? `${theme.label} by designation`
        : `${theme.label} by employee type, per day`;

  const gridProps = {
    strokeDasharray: '3 3',
    stroke: 'currentColor',
    strokeOpacity: 0.1,
    vertical: false,
  };

  return (
    <div className="min-h-screen space-y-4  p-1 text-foreground  dark:text-foreground">
      <Section
        title="Attendance Insights"
        menuId="attendance-insights"
        showBreadcrumbs={true}
      >
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {(Object.keys(METRICS) as MetricType[]).map(m => {
            const t = METRICS[m];
            const active = m === metric;
            const Icon = t.icon;
            return (
              <Button
                variant="ghost"
                key={m}
                type="button"
                onClick={() => setMetric(m)}
                className={`h-auto w-full justify-start gap-3 rounded-xl border px-4 py-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                  active
                    ? 'bg-card shadow-sm hover:bg-card dark:bg-card'
                    : 'border-border bg-transparent hover:bg-card dark:border-border dark:hover:bg-card'
                }`}
                style={
                  active
                    ? {
                        borderColor: t.color,
                        boxShadow: `0 0 0 1px ${t.color}`,
                      }
                    : undefined
                }
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{
                    background: `${t.color}${active ? '26' : '14'}`,
                    color: t.color,
                  }}
                >
                  <Icon size={18} />
                </span>
                <span className="text-sm font-medium">{t.label}</span>
              </Button>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <FormField
            label="Month"
            name="month"
            type="select"
            value={month}
            onChange={setMonth}
            options={MONTHS}
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
            label="Scope"
            name="scope"
            type="select"
            value={scope}
            onChange={v => setScope(v as ScopeType)}
            options={attendanceInsightsScopeOptions}
          />
          <FormField
            label="Branch"
            name="branch"
            type="select"
            value={branch}
            onChange={setBranch}
            options={attendanceSummaryBranchFilterOptions}
          />
          <div className="flex justify-end">
            <Button onClick={handleReset} variant="outline">
              <RotateCcw size={14} />
              Reset
            </Button>
          </div>
        </div>
      </Section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label={`Total ${theme.label.toLowerCase()}`}
          value={`${total}${unit}`}
          hint={`${emps.length} employees · ${monthLabel} ${year}`}
          icon={theme.icon}
          color={theme.color}
          spark={daily.map(d => ({ v: d[key] }))}
        />
        <Kpi
          label="Average per employee"
          value={`${perEmp}${unit}`}
          hint={`${dailyAvg}${unit} per day across the team`}
          icon={Users}
          color="hsl(var(--primary))"
        />
        <Kpi
          label="Busiest day"
          value={peak ? `${monthLabel.slice(0, 3)} ${peak.day}` : '–'}
          hint={peak ? `${peak[key]}${unit} recorded` : 'No data'}
          icon={TrendingUp}
          color="hsl(var(--secondary-foreground))"
        />
        <Kpi
          label="Most affected branch"
          value={worstBranch?.name ?? '–'}
          hint={
            worstBranch ? `${worstBranch.value}${unit} this month` : 'No data'
          }
          icon={Users}
          color="hsl(var(--accent-foreground))"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 dark:border-border dark:bg-card xl:col-span-2">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold">{chartTitle}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
                {branch === 'all' ? 'All branches' : branch}
                {groupBy === 'daily' &&
                  ` · dashed line marks the monthly average (${dailyAvg}${unit})`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Segmented
                value={groupBy}
                onChange={value => {
                  if (
                    value === 'daily' ||
                    value === 'designation' ||
                    value === 'employeeType'
                  ) {
                    setGroupBy(value);
                  }
                }}
                options={attendanceInsightsGroupByOptions}
              />
              <Segmented
                value={view}
                onChange={value => {
                  if (value === 'count' || value === 'hours') {
                    setView(value);
                  }
                }}
                options={attendanceInsightsViewOptions}
              />
            </div>
          </div>

          {groupBy === 'employeeType' && (
            <div className="mb-2 flex flex-wrap gap-4 text-xs text-muted-foreground dark:text-muted-foreground">
              {EMP_TYPES.map((t, i) => (
                <span key={t} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: TYPE_COLORS[i] }}
                  />
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="text-foreground dark:text-foreground">
            <ResponsiveContainer width="100%" height={320}>
              {groupBy === 'daily' ? (
                <ComposedChart
                  data={daily}
                  margin={{ top: 8, right: 8, bottom: 0, left: -12 }}
                >
                  <CartesianGrid {...gridProps} />
                  <XAxis
                    dataKey="day"
                    tick={axisTick}
                    tickLine={false}
                    axisLine={false}
                    interval={1}
                  />
                  <YAxis tick={axisTick} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: 'currentColor', fillOpacity: 0.05 }}
                    content={
                      <ChartTooltip
                        unit={unit}
                        labelPrefix={`${monthLabel.slice(0, 3)} `}
                      />
                    }
                  />
                  <ReferenceLine
                    y={dailyAvg}
                    stroke={theme.color}
                    strokeDasharray="4 4"
                    strokeOpacity={0.6}
                  />
                  <Bar
                    dataKey={key}
                    name={theme.label}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={22}
                  >
                    {daily.map(d => (
                      <Cell
                        key={d.day}
                        fill={theme.color}
                        fillOpacity={d[key] >= dailyAvg ? 1 : 0.3}
                      />
                    ))}
                  </Bar>
                  <Line
                    type="monotone"
                    dataKey="avg"
                    stroke="currentColor"
                    strokeOpacity={0.7}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </ComposedChart>
              ) : groupBy === 'designation' ? (
                <BarChart
                  data={byDesignation}
                  layout="vertical"
                  margin={{ top: 0, right: 40, bottom: 0, left: 8 }}
                >
                  <CartesianGrid {...gridProps} horizontal={false} vertical />
                  <XAxis
                    type="number"
                    tick={axisTick}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="group"
                    width={150}
                    tick={{ ...axisTick, opacity: 0.8 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'currentColor', fillOpacity: 0.05 }}
                    content={<ChartTooltip unit={unit} />}
                  />
                  <Bar
                    dataKey={key}
                    name={theme.label}
                    radius={[0, 6, 6, 0]}
                    barSize={20}
                  >
                    {byDesignation.map((d, i) => (
                      <Cell
                        key={d.group}
                        fill={theme.color}
                        fillOpacity={1 - i * 0.1}
                      />
                    ))}
                    <LabelList
                      dataKey={key}
                      position="right"
                      style={{
                        fontSize: 11,
                        fill: 'currentColor',
                        opacity: 0.7,
                      }}
                    />
                  </Bar>
                </BarChart>
              ) : (
                <AreaChart
                  data={byType}
                  margin={{ top: 8, right: 8, bottom: 0, left: -12 }}
                >
                  <defs>
                    {EMP_TYPES.map((t, i) => (
                      <linearGradient
                        key={t}
                        id={`grad-${i}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={TYPE_COLORS[i]}
                          stopOpacity={0.55}
                        />
                        <stop
                          offset="100%"
                          stopColor={TYPE_COLORS[i]}
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid {...gridProps} />
                  <XAxis
                    dataKey="day"
                    tick={axisTick}
                    tickLine={false}
                    axisLine={false}
                    interval={1}
                  />
                  <YAxis tick={axisTick} tickLine={false} axisLine={false} />
                  <Tooltip
                    content={
                      <ChartTooltip
                        unit={unit}
                        labelPrefix={`${monthLabel.slice(0, 3)} `}
                      />
                    }
                  />
                  {EMP_TYPES.map((t, i) => (
                    <Area
                      key={t}
                      type="monotone"
                      dataKey={t}
                      stackId="a"
                      stroke={TYPE_COLORS[i]}
                      strokeWidth={1.5}
                      fill={`url(#grad-${i})`}
                    />
                  ))}
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-card p-5 dark:border-border dark:bg-card">
            <h3 className="text-sm font-semibold">Share by branch</h3>
            <div className="relative mt-2">
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie
                    data={byBranch}
                    dataKey="value"
                    innerRadius={52}
                    outerRadius={76}
                    paddingAngle={3}
                    cornerRadius={4}
                    stroke="none"
                    onClick={d => setBranch(branch === d.name ? 'all' : d.name)}
                  >
                    {byBranch.map(b => (
                      <Cell
                        key={b.name}
                        fill={b.color}
                        fillOpacity={
                          branch === 'all' || branch === b.name ? 1 : 0.2
                        }
                        cursor="pointer"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip unit={unit} />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-semibold tabular-nums">
                  {r1(byBranch.reduce((a, b) => a + b.value, 0))}
                </span>
                <span className="text-[11px] text-muted-foreground dark:text-muted-foreground">
                  {view === 'count' ? 'total' : 'hours'}
                </span>
              </div>
            </div>
            <ul className="mt-2 space-y-1.5">
              {byBranch.map(b => (
                <li key={b.name}>
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() =>
                      setBranch(branch === b.name ? 'all' : b.name)
                    }
                    className="h-auto w-full justify-between gap-0 px-0 py-0 text-xs text-muted-foreground hover:bg-transparent hover:text-foreground dark:text-muted-foreground dark:hover:text-primary-foreground"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: b.color }}
                      />
                      {b.name}
                    </span>
                    <span className="font-medium tabular-nums">
                      {b.value}
                      {unit}
                    </span>
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 dark:border-border dark:bg-card">
            <h3 className="text-sm font-semibold">Top 5 employees</h3>
            <ul className="mt-3 space-y-3">
              {topEmployees.map(e => {
                const max = topEmployees[0]?.[metric][key] || 1;
                const v = e[metric][key];
                return (
                  <li key={e.id}>
                    <div className="flex justify-between text-xs">
                      <span className="font-medium">{e.name}</span>
                      <span className="tabular-nums text-muted-foreground dark:text-muted-foreground">
                        {v}
                        {unit}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-muted dark:bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(v / max) * 100}%`,
                          background: theme.color,
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <Section title="Employee details">
        <TanStackTable
          showDownload={true}
          data={emps}
          columns={columns}
          enableSearch={true}
          enableSorting={false}
          enableColumnVisibility={true}
          enablePagination={true}
          pageSize={10}
          emptyMessage="No employee records found."
        />
      </Section>
    </div>
  );
};

export default AttendanceInsights;
