import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Area,
  AreaChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LabelList,
} from 'recharts';
import {
  ArrowRight,
  Bot,
  FileText,
  Layers,
  RotateCcw,
  SearchX,
  UserCheck,
  Users,
  Wrench,
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { TanStackTable } from '@/components/common';
import {
  attendanceCorrectionDesignationFilterOptions,
  attendanceCorrectionDesignationOptions,
  attendanceSummaryBranchFilterOptions,
  attendanceSummaryBranchOptions,
} from '@/data/reusableDropdownData';

type Status = 'Present' | 'Absent' | 'Late' | 'Half Day' | 'Holiday' | 'Leave';
type CorrectionType = 'Manual' | 'Bulk' | 'Import' | 'Regularization';

interface AttendanceCorrectionRecord {
  id: string;
  name: string;
  empId: string;
  isoDate: string;
  originalTime: string;
  originalStatus: Status;
  correctedTime: string;
  correctedStatus: Status;
  type: CorrectionType;
  branch: string;
  designation: string;
  remarks: string;
  updatedBy: string;
}

const STATUS_COLORS: Record<Status, string> = {
  Present: 'hsl(var(--primary))',
  Absent: 'hsl(var(--destructive))',
  Late: 'hsl(var(--accent-foreground))',
  'Half Day': 'hsl(var(--secondary-foreground))',
  Holiday: 'hsl(var(--muted-foreground))',
  Leave: 'hsl(var(--foreground))',
};
const TYPES: CorrectionType[] = ['Manual', 'Bulk', 'Import', 'Regularization'];
const TYPE_COLORS: Record<CorrectionType, string> = {
  Manual: 'hsl(var(--primary))',
  Bulk: 'hsl(var(--accent-foreground))',
  Import: 'hsl(var(--secondary-foreground))',
  Regularization: 'hsl(var(--muted-foreground))',
};
const BRANCHES = attendanceSummaryBranchOptions.map(option => option.value);
const BRANCH_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary-foreground))',
  'hsl(var(--accent-foreground))',
  'hsl(var(--muted-foreground))',
];
const DESIGNATIONS = attendanceCorrectionDesignationOptions.map(
  option => option.value
);
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
];
const UPDATERS = ['Admin', 'HR Manager', 'System'];
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const FLOWS: {
  o: Status;
  c: Status;
  ot: string;
  ct: string;
  remark: string;
  type: CorrectionType;
}[] = [
  {
    o: 'Late',
    c: 'Present',
    ot: '09:45 AM',
    ct: '09:00 AM',
    remark: 'Traffic issue',
    type: 'Manual',
  },
  {
    o: 'Absent',
    c: 'Present',
    ot: '-',
    ct: '09:15 AM',
    remark: 'Forgot to punch in',
    type: 'Regularization',
  },
  {
    o: 'Half Day',
    c: 'Present',
    ot: 'Half day',
    ct: 'Full day',
    remark: 'System correction',
    type: 'Bulk',
  },
  {
    o: 'Leave',
    c: 'Present',
    ot: 'Leave',
    ct: 'Present',
    remark: 'Leave cancelled',
    type: 'Regularization',
  },
  {
    o: 'Holiday',
    c: 'Present',
    ot: 'Holiday',
    ct: 'Present',
    remark: 'Holiday adjustment',
    type: 'Bulk',
  },
  {
    o: 'Present',
    c: 'Present',
    ot: '06:00 PM',
    ct: '06:30 PM',
    remark: 'Overtime adjustment',
    type: 'Manual',
  },
  {
    o: 'Present',
    c: 'Present',
    ot: '09:00 AM',
    ct: '09:00 AM',
    remark: 'Data import correction',
    type: 'Import',
  },
  {
    o: 'Absent',
    c: 'Leave',
    ot: '-',
    ct: 'Leave',
    remark: 'Medical emergency',
    type: 'Regularization',
  },
  {
    o: 'Present',
    c: 'Half Day',
    ot: '09:00 AM',
    ct: 'Half day',
    remark: 'Left early, approved',
    type: 'Manual',
  },
];

const seeded = (n: number) => {
  const x = Math.sin(n + 1) * 99_999;
  return x - Math.floor(x);
};
const pad = (n: number) => String(n).padStart(2, '0');
const initials = (name: string) =>
  name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${pad(d)} ${MONTHS[m - 1]} ${y}`;
};
const shortDate = (iso: string) => fmtDate(iso).slice(0, 6);
const toIso = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function buildRecords(): AttendanceCorrectionRecord[] {
  const start = new Date(2026, 8, 24);
  return Array.from({ length: 44 }, (_, i) => {
    const flow = FLOWS[Math.floor(seeded(i * 3) * FLOWS.length)];
    const d = new Date(start);
    d.setDate(start.getDate() + Math.floor(seeded(i * 5 + 1) * 15));
    const empIdx = Math.floor(seeded(i * 7 + 2) * NAMES.length);
    return {
      id: String(i + 1),
      name: NAMES[empIdx],
      empId: `EMP${pad(empIdx + 1).padStart(3, '0')}`,
      isoDate: toIso(d),
      originalTime: flow.ot,
      originalStatus: flow.o,
      correctedTime: flow.ct,
      correctedStatus: flow.c,
      type: flow.type,
      branch: BRANCHES[empIdx % BRANCHES.length],
      designation: DESIGNATIONS[empIdx % DESIGNATIONS.length],
      remarks: flow.remark,
      updatedBy:
        flow.type === 'Bulk' || flow.type === 'Import'
          ? 'System'
          : UPDATERS[Math.floor(seeded(i + 9) * 2)],
    };
  }).sort((a, b) => a.isoDate.localeCompare(b.isoDate));
}
const ALL_RECORDS = buildRecords();

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
  'bg-muted text-muted-foreground',
  'bg-secondary-foreground text-background',
];

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const rows = payload.filter(p => p.value > 0);
  if (!rows.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card/95 px-3 py-2 text-xs shadow-lg backdrop-blur dark:border-border dark:bg-muted/95">
      {label && (
        <div className="mb-1 font-semibold text-foreground dark:text-foreground">
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

function StatusChip({ status }: { status: Status }) {
  const c = STATUS_COLORS[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ background: `${c}1f`, color: c }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />
      {status}
    </span>
  );
}

function TypeChip({ type }: { type: CorrectionType }) {
  const c = TYPE_COLORS[type];
  return (
    <span
      className="inline-block rounded-md px-2 py-0.5 text-xs font-semibold"
      style={{ background: `${c}1f`, color: c }}
    >
      {type}
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

const AttendanceCorrectionReport: React.FC = () => {
  const DEFAULTS = {
    fromDate: '2026-10-01',
    toDate: '2026-10-08',
    employeeSearch: '',
    branch: 'all',
    designation: 'all',
  };
  const [form, setForm] = useState(DEFAULTS);
  const set = (field: keyof typeof DEFAULTS) => (v: string) =>
    setForm(prev => ({ ...prev, [field]: v }));

  const rows = useMemo(() => {
    const q = form.employeeSearch.trim().toLowerCase();
    return ALL_RECORDS.filter(
      r =>
        (!form.fromDate || r.isoDate >= form.fromDate) &&
        (!form.toDate || r.isoDate <= form.toDate) &&
        (!q ||
          r.name.toLowerCase().includes(q) ||
          r.empId.toLowerCase().includes(q)) &&
        (form.branch === 'all' || r.branch === form.branch) &&
        (form.designation === 'all' || r.designation === form.designation)
    );
  }, [form]);

  const daily = useMemo(() => {
    if (!form.fromDate || !form.toDate || form.fromDate > form.toDate)
      return [];
    const [fy, fm, fd] = form.fromDate.split('-').map(Number);
    const out: Record<string, string | number>[] = [];
    const cursor = new Date(fy, fm - 1, fd);
    for (let i = 0; i < 45; i++) {
      const iso = toIso(cursor);
      if (iso > form.toDate) break;
      const point: Record<string, string | number> = {
        date: shortDate(iso),
        total: 0,
      };
      TYPES.forEach(t => {
        const n = rows.filter(r => r.isoDate === iso && r.type === t).length;
        point[t] = n;
        point.total = (point.total as number) + n;
      });
      out.push(point);
      cursor.setDate(cursor.getDate() + 1);
    }
    return out;
  }, [rows, form.fromDate, form.toDate]);

  const byBranch = useMemo(
    () =>
      BRANCHES.map((b, i) => ({
        name: b,
        value: rows.filter(r => r.branch === b).length,
        color: BRANCH_COLORS[i],
      })),
    [rows]
  );

  const flows = useMemo(() => {
    const map = new Map<
      string,
      { label: string; value: number; color: string }
    >();
    rows.forEach(r => {
      const same = r.originalStatus === r.correctedStatus;
      const label = same
        ? 'Time adjusted'
        : `${r.originalStatus} → ${r.correctedStatus}`;
      const cur = map.get(label) ?? {
        label,
        value: 0,
        color: same
          ? 'hsl(var(--muted-foreground))'
          : STATUS_COLORS[r.correctedStatus],
      };
      cur.value += 1;
      map.set(label, cur);
    });
    return [...map.values()].sort((a, b) => b.value - a.value).slice(0, 6);
  }, [rows]);

  const updaters = useMemo(() => {
    const map = new Map<string, number>();
    rows.forEach(r => map.set(r.updatedBy, (map.get(r.updatedBy) ?? 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [rows]);

  const statusChanged = rows.filter(
    r => r.originalStatus !== r.correctedStatus
  ).length;
  const employeesAffected = new Set(rows.map(r => r.empId)).size;
  const typeCounts = TYPES.map(t => ({
    t,
    n: rows.filter(r => r.type === t).length,
  })).sort((a, b) => b.n - a.n);
  const systemShare = rows.length
    ? Math.round(
        (rows.filter(r => r.updatedBy === 'System').length / rows.length) * 100
      )
    : 0;

  const kpis: KpiItem[] = [
    {
      key: 'total',
      label: 'Total corrections',
      value: rows.length,
      hint: `${daily.length} days in range`,
      icon: Wrench,
      color: 'hsl(var(--primary))',
      spark: daily.map(d => d.total as number),
    },
    {
      key: 'changed',
      label: 'Status changed',
      value: statusChanged,
      hint: `${rows.length - statusChanged} time-only fixes`,
      icon: UserCheck,
      color: 'hsl(var(--secondary-foreground))',
    },
    {
      key: 'emp',
      label: 'Employees affected',
      value: employeesAffected,
      hint: 'Unique employees',
      icon: Users,
      color: 'hsl(var(--accent-foreground))',
    },
    {
      key: 'source',
      label: 'Top source',
      value: typeCounts[0]?.n ? typeCounts[0].t : '–',
      hint: typeCounts[0]?.n ? `${typeCounts[0].n} corrections` : 'No data',
      icon: Layers,
      color: 'hsl(var(--muted-foreground))',
    },
    {
      key: 'system',
      label: 'Made by system',
      value: `${systemShare}%`,
      hint: 'Bulk and import runs',
      icon: Bot,
      color: 'hsl(var(--foreground))',
    },
  ];

  const filtersActive =
    form.employeeSearch.trim() !== '' ||
    form.branch !== 'all' ||
    form.designation !== 'all' ||
    form.fromDate !== DEFAULTS.fromDate ||
    form.toDate !== DEFAULTS.toDate;
  const badRange =
    !!form.fromDate && !!form.toDate && form.fromDate > form.toDate;

  const columns = useMemo<ColumnDef<AttendanceCorrectionRecord>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Employee',
        size: 230,
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
        accessorKey: 'isoDate',
        header: 'Date',
        size: 110,
        cell: ({ row }) => (
          <span className="text-sm tabular-nums">
            {fmtDate(row.original.isoDate)}
          </span>
        ),
      },
      {
        id: 'change',
        header: 'Correction',
        size: 380,
        cell: ({ row }) => {
          const r = row.original;
          return (
            <div className="flex items-center gap-2.5">
              <div className="min-w-[96px]">
                <StatusChip status={r.originalStatus} />
                <div className="mt-0.5 pl-1 text-[11px] text-muted-foreground line-through decoration-border">
                  {r.originalTime}
                </div>
              </div>
              <ArrowRight
                size={14}
                className="flex-shrink-0 text-muted-foreground"
              />
              <div className="min-w-[96px]">
                <StatusChip status={r.correctedStatus} />
                <div className="mt-0.5 pl-1 text-[11px] font-medium text-primary dark:text-primary">
                  {r.correctedTime}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'type',
        header: 'Type',
        size: 120,
        cell: ({ row }) => <TypeChip type={row.original.type} />,
      },
      {
        accessorKey: 'designation',
        header: 'Designation',
        size: 150,
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground dark:text-muted-foreground">
            {row.original.designation}
          </span>
        ),
      },
      {
        accessorKey: 'remarks',
        header: 'Remarks',
        size: 190,
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground dark:text-muted-foreground">
            <FileText className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
            {row.original.remarks}
          </div>
        ),
      },
      {
        accessorKey: 'updatedBy',
        header: 'Updated by',
        size: 130,
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground dark:text-muted-foreground">
            {row.original.updatedBy === 'System' ? (
              <Bot size={13} className="text-primary" />
            ) : (
              <Avatar name={row.original.updatedBy} size={18} />
            )}
            {row.original.updatedBy}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="min-h-screen space-y-4  p-1 text-foreground  dark:text-foreground">
      <Section
        title="Attendance Correction Report"
        menuId="attendance-correction-report"
        showBreadcrumbs
      >
        <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <FormField
            label="From date"
            name="fromDate"
            type="date"
            value={form.fromDate}
            onChange={set('fromDate')}
            placeholder="Select from date"
          />
          <FormField
            label="To date"
            name="toDate"
            type="date"
            value={form.toDate}
            onChange={set('toDate')}
            placeholder="Select to date"
          />
          <FormField
            label="Search employee"
            name="employeeSearch"
            type="text"
            value={form.employeeSearch}
            onChange={set('employeeSearch')}
            placeholder="Name or ID..."
          />
          <FormField
            label="Branch"
            name="branch"
            type="select"
            value={form.branch}
            onChange={set('branch')}
            placeholder="-- Select --"
            options={attendanceSummaryBranchFilterOptions}
          />
          <FormField
            label="Designation"
            name="designation"
            type="select"
            value={form.designation}
            onChange={set('designation')}
            placeholder="-- Select --"
            options={attendanceCorrectionDesignationFilterOptions}
          />
          <div className="flex lg:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setForm(DEFAULTS)}
            >
              <RotateCcw size={14} />
              Reset
            </Button>
          </div>
        </div>
        <p
          className={`mt-3 text-xs ${badRange ? 'text-destructive dark:text-destructive' : 'text-muted-foreground dark:text-muted-foreground'}`}
        >
          {badRange
            ? 'The from date is after the to date. Pick an earlier from date.'
            : `Showing ${form.fromDate ? fmtDate(form.fromDate) : 'start'} – ${form.toDate ? fmtDate(form.toDate) : 'today'} · ${
                form.branch === 'all' ? 'all branches' : form.branch
              }${form.employeeSearch.trim() ? ` · “${form.employeeSearch.trim()}”` : ''} · ${rows.length} of ${ALL_RECORDS.length} corrections${filtersActive ? ' (filtered)' : ''}`}
        </p>
      </Section>

      {rows.length === 0 ? (
        <div
          className={`${cardCls} flex flex-col items-center py-14 text-center`}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground dark:bg-muted">
            <SearchX size={22} />
          </span>
          <h3 className="mt-4 text-sm font-semibold">No corrections found</h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground dark:text-muted-foreground">
            Nothing matches these filters. Widen the date range or clear the
            branch and designation filters.
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => setForm(DEFAULTS)}
          >
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
                  <h3 className="text-sm font-semibold">Corrections per day</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
                    Split by how the correction was made
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground dark:text-muted-foreground">
                  {TYPES.map(t => (
                    <span key={t} className="flex items-center gap-1.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: TYPE_COLORS[t] }}
                      />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-foreground dark:text-foreground">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart
                    data={daily}
                    margin={{ top: 8, right: 8, bottom: 0, left: -20 }}
                  >
                    <CartesianGrid {...gridProps} />
                    <XAxis
                      dataKey="date"
                      tick={axisTick}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={axisTick}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      cursor={{ fill: 'currentColor', fillOpacity: 0.05 }}
                      content={<ChartTooltip />}
                    />
                    {TYPES.map((t, i) => (
                      <Bar
                        key={t}
                        dataKey={t}
                        stackId="a"
                        fill={TYPE_COLORS[t]}
                        maxBarSize={34}
                        radius={
                          i === TYPES.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]
                        }
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={cardCls}>
              <h3 className="text-sm font-semibold">Corrections by branch</h3>
              <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
                Click a slice to filter by branch
              </p>
              <div className="relative mt-2">
                <ResponsiveContainer width="100%" height={190}>
                  <PieChart>
                    <Pie
                      data={byBranch}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={58}
                      outerRadius={82}
                      paddingAngle={3}
                      cornerRadius={4}
                      stroke="none"
                      onClick={d =>
                        setForm(p => ({
                          ...p,
                          branch: p.branch === d.name ? 'all' : d.name,
                        }))
                      }
                    >
                      {byBranch.map(b => (
                        <Cell
                          key={b.name}
                          fill={b.color}
                          fillOpacity={
                            form.branch === 'all' || form.branch === b.name
                              ? 1
                              : 0.2
                          }
                          cursor="pointer"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-semibold tabular-nums">
                    {byBranch.reduce((a, b) => a + b.value, 0)}
                  </span>
                  <span className="text-[11px] text-muted-foreground dark:text-muted-foreground">
                    corrections
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
                        setForm(p => ({
                          ...p,
                          branch: p.branch === b.name ? 'all' : b.name,
                        }))
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
                      </span>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`${cardCls} xl:col-span-2`}>
              <h3 className="text-sm font-semibold">What was corrected</h3>
              <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
                Most common status changes
              </p>
              <div className="mt-3 text-foreground dark:text-foreground">
                <ResponsiveContainer
                  width="100%"
                  height={Math.max(180, flows.length * 40)}
                >
                  <BarChart
                    data={flows}
                    layout="vertical"
                    margin={{ top: 0, right: 36, bottom: 0, left: 8 }}
                  >
                    <CartesianGrid {...gridProps} horizontal={false} vertical />
                    <XAxis
                      type="number"
                      tick={axisTick}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="label"
                      width={140}
                      tick={{ ...axisTick, opacity: 0.85 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: 'currentColor', fillOpacity: 0.05 }}
                      content={<ChartTooltip />}
                    />
                    <Bar
                      dataKey="value"
                      name="Corrections"
                      radius={[0, 6, 6, 0]}
                      barSize={20}
                    >
                      {flows.map(f => (
                        <Cell key={f.label} fill={f.color} />
                      ))}
                      <LabelList
                        dataKey="value"
                        position="right"
                        style={{
                          fontSize: 11,
                          fill: 'currentColor',
                          opacity: 0.7,
                        }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={cardCls}>
              <h3 className="text-sm font-semibold">Updated by</h3>
              <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
                Who made the corrections
              </p>
              <ul className="mt-4 space-y-4">
                {updaters.map(([name, n]) => (
                  <li key={name}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 font-medium">
                        {name === 'System' ? (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Bot size={12} />
                          </span>
                        ) : (
                          <Avatar name={name} size={20} />
                        )}
                        {name}
                      </span>
                      <span className="tabular-nums text-muted-foreground dark:text-muted-foreground">
                        {n}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-muted dark:bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${(n / rows.length) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Section title="Attendance correction records">
            <TanStackTable
              showDownload={true}
              key={JSON.stringify(form)}
              data={rows}
              columns={columns}
              searchPlaceholder="Search attendance correction records..."
              pageSize={10}
              enableColumnVisibility={true}
              enableRowSelection={false}
            />
          </Section>
        </>
      )}
    </div>
  );
};

export default AttendanceCorrectionReport;
