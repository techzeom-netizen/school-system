import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  Calendar,
  Check,
  Clock,
  Pencil,
  Plane,
  RotateCcw,
  SearchX,
  Undo2,
  UserCheck,
  UserX,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import Section from '@/components/common/Section';
import FormField from '@/components/common/FormField';
import TanStackTable from '@/components/common/TanStackTable';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  employeeAttendanceDepartmentOptions,
  employeeAttendanceMonthOptions,
  employeeAttendanceTimeOptions,
  employeeAttendanceYearOptions,
} from '@/data/reusableDropdownData';

type Code = 'P' | 'A' | 'H' | 'L' | 'SL' | 'O';

const AttendanceOptionsWithColors: {
  value: Code;
  label: string;
  color: string;
}[] = [
  { value: 'P', label: 'Present', color: 'hsl(var(--primary))' },
  { value: 'A', label: 'Absent', color: 'hsl(var(--destructive))' },
  { value: 'H', label: 'Half day', color: 'hsl(var(--accent-foreground))' },
  { value: 'L', label: 'Leave', color: 'hsl(var(--secondary-foreground))' },
  { value: 'SL', label: 'Sick leave', color: 'hsl(var(--muted-foreground))' },
  { value: 'O', label: 'On duty', color: 'hsl(var(--foreground))' },
];
const CODE = Object.fromEntries(
  AttendanceOptionsWithColors.map(o => [o.value, o])
) as Record<Code, (typeof AttendanceOptionsWithColors)[number]>;
const CODES = AttendanceOptionsWithColors.map(o => o.value);

const MONTH_NAMES = employeeAttendanceMonthOptions.map(option => option.label);
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const WEEKDAYS_LONG = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const BASE_EMPLOYEES = [
  {
    employeeNo: 'EMP001',
    employeeName: 'John Doe',
    designation: 'Software Engineer',
    branchName: 'Head Office',
    department: 'Engineering',
  },
  {
    employeeNo: 'EMP002',
    employeeName: 'Jane Smith',
    designation: 'Product Manager',
    branchName: 'Head Office',
    department: 'Product',
  },
  {
    employeeNo: 'EMP003',
    employeeName: 'Robert Johnson',
    designation: 'UI/UX Designer',
    branchName: 'Branch Office',
    department: 'Design',
  },
  {
    employeeNo: 'EMP004',
    employeeName: 'Emily Davis',
    designation: 'HR Executive',
    branchName: 'Head Office',
    department: 'Human Resources',
  },
  {
    employeeNo: 'EMP005',
    employeeName: 'Michael Wilson',
    designation: 'Senior Engineer',
    branchName: 'Branch Office',
    department: 'Engineering',
  },
  {
    employeeNo: 'EMP006',
    employeeName: 'Lisa Anderson',
    designation: 'Accountant',
    branchName: 'Head Office',
    department: 'Finance',
  },
  {
    employeeNo: 'EMP007',
    employeeName: 'David Jones',
    designation: 'Sales Manager',
    branchName: 'Branch Office',
    department: 'Sales',
  },
  {
    employeeNo: 'EMP008',
    employeeName: 'Patricia Martinez',
    designation: 'Product Designer',
    branchName: 'Head Office',
    department: 'Design',
  },
  {
    employeeNo: 'EMP009',
    employeeName: 'James Miller',
    designation: 'QA Engineer',
    branchName: 'Branch Office',
    department: 'Engineering',
  },
  {
    employeeNo: 'EMP010',
    employeeName: 'Linda Garcia',
    designation: 'Finance Analyst',
    branchName: 'Head Office',
    department: 'Finance',
  },
];
interface Employee {
  employeeNo: string;
  employeeName: string;
  designation: string;
  branchName: string;
  department: string;
  base: Record<number, Code>;
}
interface RowView extends Employee {
  att: Record<number, Code | ''>;
}

const seeded = (n: number) => {
  const x = Math.sin(n + 1) * 99_999;
  return x - Math.floor(x);
};
const pad = (n: number) => String(n).padStart(2, '0');
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

/** Weekdays only, like the original. Every month and year gets its own stable data. */
function buildBase(
  idx: number,
  month: number,
  year: number
): Record<number, Code> {
  const out: Record<number, Code> = {};
  const dim = new Date(year, month, 0).getDate();
  for (let day = 1; day <= dim; day++) {
    const dow = new Date(year, month - 1, day).getDay();
    if (dow === 0 || dow === 6) continue;
    const r = seeded(month * 97 + year * 11 + idx * 31 + day * 7);
    out[day] =
      r < 0.66
        ? 'P'
        : r < 0.74
          ? 'A'
          : r < 0.81
            ? 'H'
            : r < 0.89
              ? 'L'
              : r < 0.94
                ? 'SL'
                : 'O';
  }
  return out;
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

interface MenuState {
  empNo: string;
  day: number;
  x: number;
  y: number;
}
interface RegState {
  empNo: string;
  day: number;
}

const EmployeeAttendance = () => {
  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));
  const [department, setDepartment] = useState('all');
  const [search, setSearch] = useState('');
  const [highlight, setHighlight] = useState<Code | null>(null);

  /* Edits live in one map: "year-month:empNo:day" → status. A cell is "edited" when it differs from the base data. */
  const [overrides, setOverrides] = useState<Record<string, Code | ''>>({});
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [reg, setReg] = useState<RegState | null>(null);
  const [checkIn, setCheckIn] = useState('09:00');
  const [checkOut, setCheckOut] = useState('18:00');
  const [remark, setRemark] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const m = parseInt(month);
  const y = parseInt(year);
  const periodKey = `${y}-${m}`;
  const periodLabel = `${MONTH_NAMES[m - 1]} ${y}`;
  const daysInMonth = new Date(y, m, 0).getDate();

  const employees = useMemo<Employee[]>(
    () => BASE_EMPLOYEES.map((e, i) => ({ ...e, base: buildBase(i, m, y) })),
    [m, y]
  );

  const rows = useMemo<RowView[]>(() => {
    const q = search.trim().toLowerCase();
    return employees
      .filter(
        e =>
          (department === 'all' || e.department === department) &&
          (!q ||
            e.employeeName.toLowerCase().includes(q) ||
            e.employeeNo.toLowerCase().includes(q))
      )
      .map(e => {
        const att: Record<number, Code | ''> = { ...e.base };
        for (let d = 1; d <= daysInMonth; d++) {
          const o = overrides[`${periodKey}:${e.employeeNo}:${d}`];
          if (o !== undefined) att[d] = o;
        }
        return { ...e, att };
      });
  }, [employees, overrides, department, search, periodKey, daysInMonth]);

  const dayHeaders = useMemo(
    () =>
      Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        dow: new Date(y, m - 1, i + 1).getDay(),
      })),
    [daysInMonth, m, y]
  );

  /* Aggregates */
  const daily = useMemo(
    () =>
      dayHeaders.map(({ day, dow }) => {
        const p: Record<string, number> = { day, dow };
        CODES.forEach(c => {
          p[c] = rows.filter(r => r.att[day] === c).length;
        });
        p.rate = rows.length
          ? Math.round(((p.P + p.O + p.H * 0.5) / rows.length) * 100)
          : 0;
        return p;
      }),
    [dayHeaders, rows]
  );

  const totals = CODES.map(c => ({
    code: c,
    name: CODE[c].label,
    value: rows.reduce(
      (a, r) => a + Object.values(r.att).filter(v => v === c).length,
      0
    ),
    color: CODE[c].color,
  }));
  const count = (c: Code) => totals.find(t => t.code === c)!.value;
  const recorded = totals.reduce((a, t) => a + t.value, 0);
  const presentDays = count('P') + count('O') + count('H') * 0.5;
  const absentDays = count('A') + count('H') * 0.5;
  const leaveDays = count('L') + count('SL');
  const rate = recorded ? r1((presentDays / recorded) * 100) : 0;
  const editedCount = Object.keys(overrides).filter(k =>
    k.startsWith(`${periodKey}:`)
  ).length;

  const kpis: KpiItem[] = [
    {
      key: 'emp',
      label: 'Employees',
      value: rows.length,
      hint: department === 'all' ? 'All departments' : department,
      icon: Users,
      color: 'hsl(var(--primary))',
    },
    {
      key: 'rate',
      label: 'Attendance rate',
      value: `${rate}%`,
      hint: `${r1(presentDays)} present days`,
      icon: UserCheck,
      color: 'hsl(var(--secondary-foreground))',
      spark: daily.filter(d => d.dow !== 0 && d.dow !== 6).map(d => d.rate),
    },
    {
      key: 'absent',
      label: 'Absent days',
      value: r1(absentDays),
      hint: `${rows.length ? r1(absentDays / rows.length) : 0} per employee`,
      icon: UserX,
      color: 'hsl(var(--destructive))',
    },
    {
      key: 'leave',
      label: 'Leave days',
      value: leaveDays,
      hint: `${count('SL')} sick · ${count('L')} planned`,
      icon: Plane,
      color: 'hsl(var(--accent-foreground))',
    },
    {
      key: 'edit',
      label: 'Changes made',
      value: editedCount,
      hint: editedCount ? 'Edited in this session' : 'No edits yet',
      icon: Pencil,
      color: 'hsl(var(--muted-foreground))',
    },
  ];

  /* Editing */
  const setValue = (empNo: string, day: number, value: Code | '') => {
    const base = employees.find(e => e.employeeNo === empNo)?.base[day] ?? '';
    const key = `${periodKey}:${empNo}:${day}`;
    setOverrides(prev => {
      const next = { ...prev };
      if (value === base) delete next[key];
      else next[key] = value;
      return next;
    });
  };

  const openMenu = (
    e: React.MouseEvent<HTMLButtonElement>,
    empNo: string,
    day: number
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const W = 208;
    const H = 330;
    const x = Math.min(
      Math.max(8, rect.left + rect.width / 2 - W / 2),
      window.innerWidth - W - 8
    );
    const below = rect.bottom + 6;
    const y =
      below + H > window.innerHeight ? Math.max(8, rect.top - H - 6) : below;
    setMenu({ empNo, day, x, y });
  };

  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    const onDown = (ev: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(ev.target as Node))
        close();
    };
    const onKey = (ev: KeyboardEvent) => ev.key === 'Escape' && close();
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [menu]);

  const pick = (code: Code | '') => {
    if (!menu) return;
    const { empNo, day } = menu;
    setMenu(null);
    if (code === 'O') {
      setCheckIn('09:00');
      setCheckOut('18:00');
      setRemark('');
      setReg({ empNo, day });
      return;
    }
    setValue(empNo, day, code);
    toast.success(
      code ? `Updated attendance to ${CODE[code].label}` : 'Attendance cleared'
    );
  };

  const submitRegularization = () => {
    if (!reg) return;
    if (!remark.trim()) {
      toast.error('Please enter a remark');
      return;
    }
    if (checkOut <= checkIn) {
      toast.error('Check-out time must be after check-in time');
      return;
    }
    setValue(reg.empNo, reg.day, 'O');
    setReg(null);
    toast.success('Attendance regularized successfully');
  };

  const discardEdits = () => {
    setOverrides(prev =>
      Object.fromEntries(
        Object.entries(prev).filter(([k]) => !k.startsWith(`${periodKey}:`))
      )
    );
    toast.success('Changes discarded');
  };

  const handleReset = () => {
    setMonth(String(now.getMonth() + 1));
    setYear(String(now.getFullYear()));
    setDepartment('all');
    setSearch('');
    setHighlight(null);
  };

  const menuEmp = menu
    ? employees.find(e => e.employeeNo === menu.empNo)
    : null;
  const menuValue = menu
    ? (rows.find(r => r.employeeNo === menu.empNo)?.att[menu.day] ?? '')
    : '';
  const regEmp = reg ? employees.find(e => e.employeeNo === reg.empNo) : null;
  const filtersActive = department !== 'all' || search.trim() !== '';

  const attendanceColumns = useMemo<ColumnDef<RowView>[]>(
    () => [
      {
        id: 'employee',
        accessorKey: 'employeeName',
        header: 'Employee',
        size: 230,
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5 text-left">
            <Avatar name={row.original.employeeName} />
            <div className="leading-tight">
              <div className="text-sm font-medium">
                {row.original.employeeName}
              </div>
              <div className="text-[11px] text-muted-foreground dark:text-muted-foreground">
                {row.original.employeeNo} · {row.original.department}
              </div>
            </div>
          </div>
        ),
      },
      ...dayHeaders.map(
        ({ day, dow }): ColumnDef<RowView> => ({
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
            const employee = row.original;
            const value = employee.att[day] ?? '';
            const color = value
              ? CODE[value].color
              : 'hsl(var(--muted-foreground))';
            const dim = highlight !== null && highlight !== value;
            const edited =
              `${periodKey}:${employee.employeeNo}:${day}` in overrides;
            const weekend = dow === 0 || dow === 6;

            return (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={event => openMenu(event, employee.employeeNo, day)}
                aria-label={`${employee.employeeName}, ${day} ${MONTH_NAMES[m - 1]}: ${value ? CODE[value].label : 'no status'}. Change status`}
                title={`${day} ${MONTH_NAMES[m - 1].slice(0, 3)} · ${value ? CODE[value].label : 'Weekly off'}`}
                className={`relative mx-auto flex h-7 w-7 min-w-7 items-center justify-center rounded-md p-0 text-[9px] font-bold transition-all hover:scale-110 hover:ring-2 hover:ring-ring focus-visible:ring-2 focus-visible:ring-primary/30 ${
                  weekend ? 'bg-muted/70 dark:bg-muted/30' : ''
                }`}
                style={{
                  backgroundColor: value
                    ? `${color}26`
                    : weekend
                      ? undefined
                      : 'transparent',
                  color,
                  opacity: dim ? 0.15 : value ? 1 : 0.6,
                }}
              >
                {value || '·'}
                {edited && (
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
                )}
              </Button>
            );
          },
        })
      ),
      {
        id: 'present',
        header: 'P',
        size: 62,
        cell: ({ row }) => {
          const values = Object.values(row.original.att);
          const count = (code: Code) =>
            values.filter(value => value === code).length;
          return (
            <span className="font-semibold tabular-nums text-primary">
              {r1(count('P') + count('O') + count('H') * 0.5)}
            </span>
          );
        },
      },
      {
        id: 'absent',
        header: 'A',
        size: 62,
        cell: ({ row }) => {
          const values = Object.values(row.original.att);
          const count = (code: Code) =>
            values.filter(value => value === code).length;
          return (
            <span className="font-semibold tabular-nums text-destructive">
              {r1(count('A') + count('H') * 0.5)}
            </span>
          );
        },
      },
      {
        id: 'leave',
        header: 'Leave',
        size: 62,
        cell: ({ row }) => {
          const values = Object.values(row.original.att);
          return (
            <span className="tabular-nums text-secondary-foreground">
              {values.filter(value => value === 'L' || value === 'SL').length}
            </span>
          );
        },
      },
    ],
    [dayHeaders, highlight, m, openMenu, overrides, periodKey]
  );

  return (
    <>
      <div className="min-h-screen space-y-4  p-1 text-foreground  dark:text-foreground">
        {/* ── Filters ── */}
        <Section
          title="Employee Attendance"
          menuId="employee-attendance"
          showBreadcrumbs
        >
          <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
              label="Department"
              name="department"
              type="select"
              value={department}
              onChange={setDepartment}
              options={employeeAttendanceDepartmentOptions}
            />
            <FormField
              label="Search employee"
              name="searchValue"
              type="text"
              value={search}
              onChange={setSearch}
              placeholder="Name or Emp No..."
            />
            <div className="flex lg:justify-end">
              <Button type="button" variant="outline" onClick={handleReset}>
                <RotateCcw size={14} />
                Reset
              </Button>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground dark:text-muted-foreground">
            Showing {periodLabel} ·{' '}
            {department === 'all' ? 'all departments' : department}
            {search.trim() ? ` · “${search.trim()}”` : ''} · {rows.length} of{' '}
            {employees.length} employees
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
              Nothing matches these filters for {periodLabel}. Try another
              department or search term.
            </p>
            <Button className="mt-4" variant="outline" onClick={handleReset}>
              <RotateCcw size={14} />
              Reset filters
            </Button>
          </div>
        ) : (
          <>
            {/* ── KPI strip ── */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
              {kpis.map(item => (
                <Kpi key={item.key} item={item} />
              ))}
            </div>

            {/* ── Charts ── */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <div className={`${cardCls} xl:col-span-2`}>
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold">Daily headcount</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
                      Updates as you edit cells below
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground dark:text-muted-foreground">
                    {CODES.map(c => (
                      <span key={c} className="flex items-center gap-1.5">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ background: CODE[c].color }}
                        />
                        {CODE[c].label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-foreground dark:text-foreground">
                  <ResponsiveContainer width="100%" height={240}>
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
                      {CODES.map((c, i) => (
                        <Bar
                          key={c}
                          dataKey={c}
                          name={CODE[c].label}
                          stackId="a"
                          fill={CODE[c].color}
                          maxBarSize={22}
                          radius={
                            i === CODES.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]
                          }
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={cardCls}>
                <h3 className="text-sm font-semibold">Attendance statistics</h3>
                <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
                  {periodLabel}
                </p>
                <div className="relative mt-2">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={totals}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={56}
                        outerRadius={80}
                        paddingAngle={2}
                        cornerRadius={4}
                        stroke="none"
                      >
                        {totals.map(t => (
                          <Cell
                            key={t.code}
                            fill={t.color}
                            fillOpacity={
                              highlight === null || highlight === t.code
                                ? 1
                                : 0.2
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-semibold tabular-nums">
                      {rate}%
                    </span>
                    <span className="text-[11px] text-muted-foreground dark:text-muted-foreground">
                      attendance
                    </span>
                  </div>
                </div>
                <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {totals.map(t => (
                    <li
                      key={t.code}
                      className="flex items-center justify-between text-xs text-muted-foreground dark:text-muted-foreground"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: t.color }}
                        />
                        {t.name}
                      </span>
                      <span className="font-medium tabular-nums">
                        {t.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── Editable grid ── */}
            <div className={cardCls}>
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold">
                    Attendance · {periodLabel}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
                    Select any cell to change that day. Edited cells show a
                    purple dot.
                  </p>
                </div>
                {editedCount > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={discardEdits}
                  >
                    <Undo2 size={14} />
                    Discard {editedCount}{' '}
                    {editedCount === 1 ? 'change' : 'changes'}
                  </Button>
                )}
              </div>

              <div className="mb-3 flex flex-wrap gap-2">
                {CODES.map(c => {
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
                              borderColor: CODE[c].color,
                              background: `color-mix(in srgb, ${CODE[c].color} 10%, transparent)`,
                              color: CODE[c].color,
                            }
                          : undefined
                      }
                    >
                      <span
                        className="flex h-4 min-w-[20px] items-center justify-center rounded px-0.5 text-[9px] font-bold"
                        style={{
                          background: `color-mix(in srgb, ${CODE[c].color} 15%, transparent)`,
                          color: CODE[c].color,
                        }}
                      >
                        {c}
                      </span>
                      {CODE[c].label}
                    </Button>
                  );
                })}
              </div>

              <TanStackTable
                showDownload={true}
                data={rows}
                columns={attendanceColumns}
                enablePagination={false}
                enableSorting={false}
                scrollable
                scrollableHeight="560px"
              />
            </div>
          </>
        )}

        {/* ── Status menu (one shared popup for every cell) ── */}
        {menu && menuEmp && (
          <div
            ref={menuRef}
            role="menu"
            className="fixed z-50 w-52 rounded-xl border border-border bg-card p-1.5 shadow-xl dark:border-border dark:bg-muted"
            style={{ left: menu.x, top: menu.y }}
          >
            <div className="px-2 pb-1.5 pt-1">
              <div className="truncate text-xs font-semibold">
                {menuEmp.employeeName}
              </div>
              <div className="text-[11px] text-muted-foreground dark:text-muted-foreground">
                {menu.day} {MONTH_NAMES[m - 1]} ·{' '}
                {WEEKDAYS_LONG[new Date(y, m - 1, menu.day).getDay()]}
              </div>
            </div>
            {AttendanceOptionsWithColors.map(o => (
              <Button
                variant="ghost"
                key={o.value}
                type="button"
                role="menuitem"
                onClick={() => pick(o.value)}
                className="h-auto w-full justify-start gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-muted focus:bg-muted focus:outline-none dark:hover:bg-muted dark:focus:bg-muted"
              >
                <span
                  className="flex h-6 w-8 items-center justify-center rounded-md text-[10px] font-bold"
                  style={{
                    background: `color-mix(in srgb, ${o.color} 15%, transparent)`,
                    color: o.color,
                  }}
                >
                  {o.value}
                </span>
                <span className="flex-1">{o.label}</span>
                {menuValue === o.value && (
                  <Check size={14} className="text-muted-foreground" />
                )}
                {o.value === 'O' && (
                  <Clock size={12} className="text-muted-foreground" />
                )}
              </Button>
            ))}
            <Button
              variant="ghost"
              type="button"
              role="menuitem"
              onClick={() => pick('')}
              className="mt-1 h-auto w-full justify-start rounded-lg border-t border-border px-2 py-1.5 text-left text-xs text-muted-foreground hover:bg-muted dark:border-border dark:text-muted-foreground dark:hover:bg-muted"
            >
              Clear this day
            </Button>
          </div>
        )}

        {/* ── Regularization dialog ── */}
        <Dialog open={!!reg} onOpenChange={open => !open && setReg(null)}>
          <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-md dark:border-border dark:bg-card">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 dark:text-foreground">
                <Calendar className="h-5 w-5" /> Regularize attendance
              </DialogTitle>
              <DialogDescription className="dark:text-muted-foreground">
                {regEmp?.employeeName} ·{' '}
                {reg && `${pad(reg.day)} ${MONTH_NAMES[m - 1]} ${y}`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-1">
              <div>
                <h4 className="mb-2 text-xs font-medium text-muted-foreground dark:text-muted-foreground">
                  Recorded times
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted p-3 dark:bg-muted/60">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground dark:text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> Check-in
                    </div>
                    <div className="mt-1 text-sm font-semibold tabular-nums">
                      09:00 AM
                    </div>
                  </div>
                  <div className="rounded-lg bg-muted p-3 dark:bg-muted/60">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground dark:text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> Check-out
                    </div>
                    <div className="mt-1 text-sm font-semibold text-destructive dark:text-destructive">
                      Not recorded
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-xs font-medium text-muted-foreground dark:text-muted-foreground">
                  New times
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    label="Check-in"
                    name="checkin-time"
                    type="select"
                    value={checkIn}
                    onChange={setCheckIn}
                    options={employeeAttendanceTimeOptions}
                    placeholder="Select time"
                  />
                  <FormField
                    label="Check-out"
                    name="checkout-time"
                    type="select"
                    value={checkOut}
                    onChange={setCheckOut}
                    options={employeeAttendanceTimeOptions}
                    placeholder="Select time"
                  />
                </div>
              </div>

              <FormField
                label="Remark"
                name="remark"
                type="textarea"
                value={remark}
                onChange={setRemark}
                placeholder="Why is this being regularized?"
                rows={3}
              />
            </div>

            <DialogFooter className="sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setReg(null)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={submitRegularization}>
                Submit regularization
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default EmployeeAttendance;
