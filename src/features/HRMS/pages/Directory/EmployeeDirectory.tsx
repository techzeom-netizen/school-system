import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Copy,
  Grid3x3,
  Layers,
  List,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  SearchX,
  UserCheck,
  Users,
  X,
  Check,
  type LucideIcon,
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { TanStackTable } from '@/components/common';
import {
  employeeDirectoryDepartmentOptions,
  employeeDirectoryLocationOptions,
  employeeDirectoryManagerOptions,
} from '@/data/reusableDropdownData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  reportsTo: string;
  employeeId: string;
  hireDate: string;
}

const CEO = 'Sanjana Kapoor';
const ME = 'Ishaan Verma';

const DEPT_COLORS: Record<string, string> = {
  'Route Intelligence': 'hsl(var(--primary))',
  'Data & Trust': 'hsl(var(--accent-foreground))',
  'Enterprise Sales': 'hsl(var(--secondary-foreground))',
  'Brand & Demand': 'hsl(var(--muted-foreground))',
  'Hub Operations': 'hsl(var(--destructive))',
  'People & Culture': 'hsl(var(--foreground))',
};
const LOC_COLORS: Record<string, string> = {
  Pune: 'hsl(var(--primary))',
  Bangalore: 'hsl(var(--accent-foreground))',
  Mumbai: 'hsl(var(--secondary-foreground))',
  Delhi: 'hsl(var(--destructive))',
  Remote: 'hsl(var(--muted-foreground))',
};
const DEPARTMENTS = employeeDirectoryDepartmentOptions.map(
  option => option.value
);
const LOCATIONS = employeeDirectoryLocationOptions.map(option => option.value);

const mk = (
  n: number,
  name: string,
  role: string,
  department: string,
  location: string,
  reportsTo: string,
  hireDate: string,
  phone: string
): Employee => ({
  id: String(n),
  name,
  role,
  department,
  location,
  reportsTo,
  hireDate,
  phone,
  email: `${name
    .toLowerCase()
    .replace(/[^a-z ]/g, '')
    .replace(' ', '.')}@meridianft.com`,
  employeeId: `MF-${20100 + n}`,
});

const EMPLOYEES: Employee[] = [
  mk(
    1,
    'Ishaan Verma',
    'VP Engineering',
    'Route Intelligence',
    'Pune',
    CEO,
    '2021-03-08',
    '9822014456'
  ),
  mk(
    2,
    'Tanvi Kulkarni',
    'Head of Data',
    'Data & Trust',
    'Bangalore',
    CEO,
    '2021-09-20',
    '9845100231'
  ),
  mk(
    3,
    'Rohan Bhatt',
    'VP Sales',
    'Enterprise Sales',
    'Mumbai',
    CEO,
    '2020-11-02',
    '9820077315'
  ),
  mk(
    4,
    'Zoya Qureshi',
    'Head of Marketing',
    'Brand & Demand',
    'Mumbai',
    CEO,
    '2022-01-17',
    '9833412098'
  ),
  mk(
    5,
    'Dev Patil',
    'Director, Hubs',
    'Hub Operations',
    'Pune',
    CEO,
    '2020-06-15',
    '9890033127'
  ),
  mk(
    6,
    'Samar Joshi',
    'CHRO',
    'People & Culture',
    'Pune',
    CEO,
    '2021-05-10',
    '9822290417'
  ),
  mk(
    7,
    'Neha Pillai',
    'Senior Backend Engineer',
    'Route Intelligence',
    'Pune',
    'Ishaan Verma',
    '2022-07-04',
    '9850112277'
  ),
  mk(
    8,
    'Arjun Sethi',
    'ML Engineer',
    'Route Intelligence',
    'Bangalore',
    'Ishaan Verma',
    '2023-02-13',
    '9886547012'
  ),
  mk(
    9,
    'Kiara Banerjee',
    'QA Lead',
    'Route Intelligence',
    'Remote',
    'Ishaan Verma',
    '2023-08-21',
    '9811230045'
  ),
  mk(
    10,
    'Vihaan Rao',
    'Mobile Engineer',
    'Route Intelligence',
    'Pune',
    'Ishaan Verma',
    '2024-04-01',
    '9890455512'
  ),
  mk(
    11,
    'Ananya Shetty',
    'Data Engineer',
    'Data & Trust',
    'Bangalore',
    'Tanvi Kulkarni',
    '2023-10-09',
    '9845098813'
  ),
  mk(
    12,
    'Yash Agarwal',
    'Security Analyst',
    'Data & Trust',
    'Remote',
    'Tanvi Kulkarni',
    '2024-06-17',
    '9871120034'
  ),
  mk(
    13,
    'Ritika Sood',
    'Key Account Manager',
    'Enterprise Sales',
    'Delhi',
    'Rohan Bhatt',
    '2022-12-05',
    '9811776543'
  ),
  mk(
    14,
    'Farhan Sheikh',
    'Solutions Consultant',
    'Enterprise Sales',
    'Mumbai',
    'Rohan Bhatt',
    '2024-01-22',
    '9867001289'
  ),
  mk(
    15,
    'Mira Chandra',
    'Content Strategist',
    'Brand & Demand',
    'Pune',
    'Zoya Qureshi',
    '2023-05-29',
    '9822388014'
  ),
  mk(
    16,
    'Harsh Vora',
    'Performance Marketer',
    'Brand & Demand',
    'Remote',
    'Zoya Qureshi',
    '2024-09-02',
    '9820455671'
  ),
  mk(
    17,
    'Lakshmi Iyer',
    'Hub Supervisor',
    'Hub Operations',
    'Delhi',
    'Dev Patil',
    '2022-03-14',
    '9899012345'
  ),
  mk(
    18,
    'Kunal Deshpande',
    'Last-mile Planner',
    'Hub Operations',
    'Pune',
    'Dev Patil',
    '2023-11-27',
    '9822667788'
  ),
  mk(
    19,
    'Isha Menon',
    'Talent Partner',
    'People & Culture',
    'Pune',
    'Samar Joshi',
    '2024-02-19',
    '9850667102'
  ),
];
const MANAGERS = employeeDirectoryManagerOptions.map(option => option.value);

const TREND: Record<string, { m: string; count: number }[]> = {
  '3M': [
    { m: 'Aug', count: 168 },
    { m: 'Sep', count: 176 },
    { m: 'Oct', count: 183 },
  ],
  '6M': [
    { m: 'May', count: 141 },
    { m: 'Jun', count: 149 },
    { m: 'Jul', count: 160 },
    { m: 'Aug', count: 168 },
    { m: 'Sep', count: 176 },
    { m: 'Oct', count: 183 },
  ],
  '12M': [
    { m: 'Nov', count: 104 },
    { m: 'Jan', count: 112 },
    { m: 'Mar', count: 127 },
    { m: 'May', count: 141 },
    { m: 'Jul', count: 160 },
    { m: 'Oct', count: 183 },
  ],
};

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
const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${String(d).padStart(2, '0')} ${MONTHS[m - 1]} ${y}`;
};
const tenure = (iso: string) => {
  const mo = Math.max(
    0,
    Math.floor((Date.now() - new Date(iso).getTime()) / (30.44 * 864e5))
  );
  return mo < 12
    ? `${mo} mo`
    : `${Math.floor(mo / 12)} yr${mo >= 24 ? 's' : ''}${mo % 12 ? ` ${mo % 12} mo` : ''}`;
};
const cardCls = 'rounded-2xl p-5 shadow-none';
const tick = { fontSize: 11, fill: 'currentColor', opacity: 0.55 };
const grid = {
  strokeDasharray: '3 3',
  stroke: 'currentColor',
  strokeOpacity: 0.1,
  vertical: false,
};
const AV = [
  'bg-primary text-primary-foreground',
  'bg-secondary text-secondary-foreground',
  'bg-accent text-accent-foreground',
  'bg-destructive text-destructive-foreground',
  'bg-muted text-muted-foreground',
];

const Avatar = ({ name, size = 28 }: { name: string; size?: number }) => (
  <span
    className={`flex flex-shrink-0 items-center justify-center rounded-full font-semibold ${AV[name.length % AV.length]}`}
    style={{
      width: size,
      height: size,
      fontSize: size * 0.38,
    }}
  >
    {name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()}
  </span>
);
const DeptChip = ({ dept }: { dept: string }) => {
  const c = DEPT_COLORS[dept] || 'hsl(var(--primary))';
  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{
        backgroundColor: `color-mix(in srgb, ${c} 12%, transparent)`,
        color: c,
      }}
    >
      {dept}
    </span>
  );
};
interface ChartTooltipItem {
  dataKey?: string | number;
  name?: string | number;
  value?: string | number;
}

const Tip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: ChartTooltipItem[];
  label?: string | number;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover/95 px-3 py-2 text-xs shadow-lg">
      {label && <div className="mb-1 font-semibold">{label}</div>}
      {payload.map(p => (
        <div key={p.dataKey ?? p.name} className="flex justify-between gap-5">
          <span>{p.name}</span>
          <b className="tabular-nums">{p.value}</b>
        </div>
      ))}
    </div>
  );
};

function useCountUp(target: number) {
  const [v, setV] = useState(target);
  const current = useRef(target);
  useEffect(() => {
    const from = current.current;
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min((t - t0) / 450, 1);
      const next = Math.round(
        from + (target - from) * (1 - Math.pow(1 - p, 3))
      );
      current.current = next;
      setV(next);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return v;
}
function Stat({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}) {
  const n = useCountUp(value);
  return (
    <Card className={cardCls}>
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        {label}
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{
            backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
            color,
          }}
        >
          <Icon size={14} />
        </span>
      </div>
      <div className="mt-2 text-3xl font-semibold tabular-nums">{n}</div>
    </Card>
  );
}

type Tab = 'all' | 'department' | 'team' | 'org';
const DEFAULTS = {
  search: '',
};

const EmployeeDirectory: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('all');
  const [form, setForm] = useState(DEFAULTS);
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [selected, setSelected] = useState<Employee | null>(null);
  const [range, setRange] = useState<'3M' | '6M' | '12M'>('6M');
  const [toast, setToast] = useState('');
  const set = <K extends keyof typeof DEFAULTS>(k: K, v: string) =>
    setForm(p => ({ ...p, [k]: v }));
  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(''), 2000);
  };
  const me = EMPLOYEES.find(e => e.name === ME)!;

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const filtered = useMemo(() => {
    const q = form.search.trim().toLowerCase();
    return EMPLOYEES.filter(
      e =>
        (tab !== 'department' || e.department === me.department) &&
        (tab !== 'team' || e.reportsTo === ME || e.name === ME) &&
        (!q ||
          [
            e.name,
            e.email,
            e.role,
            e.department,
            e.location,
            e.employeeId,
          ].some(s => s.toLowerCase().includes(q)))
    );
  }, [form.search, tab, me.department]);

  const directoryScopeActive = tab !== 'all' || Boolean(form.search);
  const reset = () => {
    setForm(DEFAULTS);
    setTab('all');
  };

  const count = (keys: string[], f: (e: Employee) => string) =>
    keys
      .map(k => ({ name: k, value: filtered.filter(e => f(e) === k).length }))
      .filter(x => x.value > 0);
  const locData = count(LOCATIONS, e => e.location).map(x => ({
    ...x,
    color: LOC_COLORS[x.name],
  }));
  const deptData = count(DEPARTMENTS, e => e.department).map(x => ({
    ...x,
    short: x.name.split(' ')[0],
    color: DEPT_COLORS[x.name],
  }));

  const copy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text).then(
      () => flash(`${label} copied`),
      () => flash('Copy failed. Select the text manually.')
    );
  };
  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Employee',
        cell: ({ row }) => (
          <Button
            variant="ghost"
            type="button"
            onClick={() => setSelected(row.original)}
            className="flex items-center gap-2.5 text-left"
          >
            <Avatar name={row.original.name} />
            <span className="leading-tight">
              <span className="block text-sm font-medium hover:underline">
                {row.original.name}
              </span>
              <span className="block text-xs text-muted-foreground">
                {row.original.employeeId}
              </span>
            </span>
          </Button>
        ),
      },
      { accessorKey: 'role', header: 'Role' },
      {
        accessorKey: 'department',
        header: 'Department',
        cell: ({ row }) => <DeptChip dept={row.original.department} />,
      },
      { accessorKey: 'location', header: 'Location' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'reportsTo', header: 'Reports To' },
    ],
    []
  );

  const tabs: { k: Tab; label: string }[] = [
    { k: 'all', label: 'All' },
    { k: 'department', label: 'My dept' },
    { k: 'team', label: 'My team' },
    { k: 'org', label: 'Org chart' },
  ];

  return (
    <div className="relative min-h-screen space-y-4  p-1 text-foreground">
      <Section
        title="Employee Directory"
        menuId="employee-directory"
        showBreadcrumbs
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground ">
            Signed in as {ME}. “My department” and “My team” are based on you.
          </p>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat
            label="People"
            value={EMPLOYEES.length}
            icon={Users}
            color="hsl(var(--primary))"
          />
          <Stat
            label="Departments"
            value={new Set(filtered.map(e => e.department)).size}
            icon={Layers}
            color="hsl(var(--accent-foreground))"
          />
          <Stat
            label="Locations"
            value={new Set(filtered.map(e => e.location)).size}
            icon={MapPin}
            color="hsl(var(--secondary-foreground))"
          />
          <Stat
            label="Showing"
            value={filtered.length}
            icon={UserCheck}
            color="hsl(var(--destructive))"
          />
        </div>

        <div
          role="tablist"
          className="mb-4 flex flex-nowrap gap-2 overflow-x-auto"
        >
          {tabs.map(t => (
            <Button
              variant={tab === t.k ? 'default' : 'outline'}
              key={t.k}
              type="button"
              role="tab"
              aria-selected={tab === t.k}
              onClick={() =>
                t.k === 'org'
                  ? navigate('/dashboard/employer/directory/organization-chart')
                  : setTab(t.k)
              }
              className="h-auto shrink-0 rounded-lg px-4 py-1.5 text-sm font-medium"
            >
              {t.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <FormField
            label="Search"
            name="search"
            type="text"
            value={form.search}
            onChange={v => set('search', v)}
            placeholder="Name, role, email, city or ID"
            className="w-full md:max-w-md"
          />
          <div className="flex items-center justify-end gap-2">
            {tab !== 'org' && (
              <div className="flex gap-1 rounded-xl border border-border bg-card p-1">
                {(
                  [
                    ['grid', Grid3x3, 'Column view'],
                    ['table', List, 'Table view'],
                  ] as const
                ).map(([v, I, label]) => (
                  <Button
                    variant={view === v ? 'default' : 'ghost'}
                    key={v}
                    type="button"
                    aria-label={label}
                    aria-pressed={view === v}
                    onClick={() => setView(v)}
                    className="h-auto rounded-lg px-3 py-1.5 text-sm font-medium"
                  >
                    <span className="flex items-center gap-1.5">
                      <I size={14} />
                      {label}
                    </span>
                  </Button>
                ))}
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={reset}
              disabled={!directoryScopeActive}
            >
              <RotateCcw size={14} /> Reset
            </Button>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {filtered.length} of {EMPLOYEES.length} people
          {directoryScopeActive ? ' (matching)' : ''}
        </p>
      </Section>

      {!filtered.length ? (
        <div
          className={`${cardCls} flex flex-col items-center py-14 text-center`}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted ">
            <SearchX size={22} />
          </span>
          <h3 className="mt-4 text-sm font-semibold">No people match</h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground ">
            Clear the search or switch back to the All tab.
          </p>
          <Button className="mt-4" variant="outline" onClick={reset}>
            <RotateCcw size={14} /> Reset directory
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className={`${cardCls} xl:col-span-2`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold">Company headcount</h3>
                  <p className="text-xs text-muted-foreground ">
                    Total people over time
                  </p>
                </div>
                <div className="flex gap-1 rounded-lg border border-border p-0.5 ">
                  {(['3M', '6M', '12M'] as const).map(r => (
                    <Button
                      variant={range === r ? 'default' : 'ghost'}
                      key={r}
                      type="button"
                      onClick={() => setRange(r)}
                      className="h-auto rounded-md px-2.5 py-1 text-xs font-medium"
                    >
                      {r}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="mt-3">
                <ResponsiveContainer width="100%" height={230}>
                  <AreaChart
                    data={TREND[range]}
                    margin={{ top: 8, right: 8, left: -20 }}
                  >
                    <defs>
                      <linearGradient id="hc" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="100%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid {...grid} />
                    <XAxis
                      dataKey="m"
                      tick={tick}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis tick={tick} tickLine={false} axisLine={false} />
                    <Tooltip content={<Tip />} />
                    <Area
                      type="monotone"
                      dataKey="count"
                      name="Headcount"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#hc)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <Card className={cardCls}>
              <h3 className="text-sm font-semibold">By location</h3>
              <p className="text-xs text-muted-foreground ">
                Employee distribution
              </p>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={locData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={42}
                    outerRadius={70}
                    paddingAngle={3}
                    cornerRadius={4}
                    stroke="none"
                  >
                    {locData.map(l => (
                      <Cell key={l.name} fill={l.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<Tip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                {locData.map(l => (
                  <div
                    key={l.name}
                    className="flex items-center justify-between px-1 text-xs"
                  >
                    <span className="flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: l.color }}
                      />
                      {l.name}
                    </span>
                    <b>{l.value}</b>
                  </div>
                ))}
              </div>
            </Card>

            <div className={`${cardCls} xl:col-span-3`}>
              <h3 className="text-sm font-semibold">By department</h3>
              <p className="text-xs text-muted-foreground ">
                Employee distribution
              </p>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart
                  data={deptData}
                  margin={{ top: 16, right: 8, left: -20 }}
                >
                  <CartesianGrid {...grid} />
                  <XAxis
                    dataKey="short"
                    tick={tick}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={tick}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'currentColor', fillOpacity: 0.05 }}
                    content={<Tip />}
                  />
                  <Bar
                    dataKey="value"
                    name="People"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={44}
                  >
                    {deptData.map(d => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                    <LabelList
                      dataKey="value"
                      position="top"
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

          {tab === 'org' ? (
            <Card className={cardCls}>
              <div className="mx-auto mb-4 w-max rounded-xl bg-primary px-5 py-3 text-center text-primary-foreground">
                <div className="text-sm font-semibold">{CEO}</div>
                <div className="text-xs opacity-80">Founder & CEO</div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {MANAGERS.map(m => {
                  const boss = EMPLOYEES.find(e => e.name === m)!;
                  const team = filtered.filter(e => e.reportsTo === m);
                  const showBoss = filtered.some(e => e.id === boss.id);
                  if (!team.length && !showBoss) return null;
                  const c = DEPT_COLORS[boss.department];
                  return (
                    <div
                      key={m}
                      className="rounded-xl border border-border border-t-4 p-3 "
                      style={{ borderTopColor: c }}
                    >
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => setSelected(boss)}
                        className="h-auto flex w-full items-center gap-2 text-left"
                      >
                        <Avatar name={m} size={34} />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold">
                            {m}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {boss.role}
                          </span>
                        </span>
                      </Button>
                      <div
                        className="mt-3 space-y-1 border-l-2 pl-3"
                        style={{
                          borderColor: `color-mix(in srgb, ${c} 33%, transparent)`,
                        }}
                      >
                        {team.length ? (
                          team.map(e => (
                            <Button
                              variant="ghost"
                              key={e.id}
                              type="button"
                              onClick={() => setSelected(e)}
                              className="h-auto flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-muted"
                            >
                              <Avatar name={e.name} size={24} />
                              <span className="min-w-0">
                                <span className="block truncate text-xs font-medium">
                                  {e.name}
                                </span>
                                <span className="block truncate text-[11px] text-muted-foreground">
                                  {e.role}
                                </span>
                              </span>
                            </Button>
                          ))
                        ) : (
                          <p className="py-1 text-xs text-muted-foreground">
                            No direct reports match.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map(e => (
                <div
                  key={e.id}
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition hover:border-primary"
                >
                  <div className="flex items-start gap-3">
                    <Avatar name={e.name} size={44} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">
                        {e.name}
                        {e.name === ME && (
                          <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary  ">
                            You
                          </span>
                        )}
                      </div>
                      <div className="truncate text-xs text-muted-foreground ">
                        {e.role}
                      </div>
                    </div>
                  </div>
                  <div className="w-max">
                    <DeptChip dept={e.department} />
                  </div>
                  <div className="flex flex-col gap-1.5 text-sm text-foreground ">
                    <div className="flex items-center gap-2">
                      <Mail
                        size={13}
                        className="flex-shrink-0 text-muted-foreground"
                      />
                      <a
                        href={`mailto:${e.email}`}
                        className="truncate hover:underline"
                      >
                        {e.email}
                      </a>
                      <Button
                        variant="ghost"
                        type="button"
                        aria-label="Copy email"
                        onClick={() => copy(e.email, 'Email')}
                        className="ml-auto h-6 w-6 p-1 text-muted-foreground hover:text-primary"
                      >
                        <Copy size={12} />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone
                        size={13}
                        className="flex-shrink-0 text-muted-foreground"
                      />
                      <a href={`tel:${e.phone}`} className="hover:underline">
                        {e.phone}
                      </a>
                      <Button
                        variant="ghost"
                        type="button"
                        aria-label="Copy phone"
                        onClick={() => copy(e.phone, 'Phone')}
                        className="ml-auto h-6 w-6 p-1 text-muted-foreground hover:text-primary"
                      >
                        <Copy size={12} />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin
                        size={13}
                        className="flex-shrink-0 text-muted-foreground"
                      />
                      {e.location}
                    </div>
                    <div className="text-xs text-muted-foreground ">
                      Reports to{' '}
                      <span className="font-medium text-primary">
                        {e.reportsTo}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => setSelected(e)}
                    className="mt-1 h-auto w-full rounded-lg border border-border bg-muted py-2 text-sm font-medium transition hover:border-primary hover:bg-primary/10"
                  >
                    View profile
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <Section title="All people">
              <TanStackTable
                showDownload={true}
                key={JSON.stringify([form.search, tab])}
                data={filtered}
                columns={columns}
                searchPlaceholder="Search people..."
                pageSize={10}
                enableColumnVisibility
                enableRowSelection={false}
              />
            </Section>
          )}
        </>
      )}

      <Dialog
        open={Boolean(selected)}
        onOpenChange={open => !open && setSelected(null)}
      >
        {selected && (
          <DialogContent
            showCloseButton={false}
            onInteractOutside={event => event.preventDefault()}
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl p-6"
          >
            <div className="mb-5 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar name={selected.name} size={52} />
                <DialogHeader>
                  <DialogTitle>{selected.name}</DialogTitle>
                  <DialogDescription>{selected.role}</DialogDescription>
                </DialogHeader>
              </div>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                aria-label="Close"
                onClick={() => setSelected(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
              >
                <X size={16} />
              </Button>
            </div>
            <div className="mb-3 flex gap-2">
              <a
                href={`mailto:${selected.email}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Mail size={14} /> Email
              </a>
              <a
                href={`tel:${selected.phone}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border py-2 text-sm font-medium hover:bg-muted"
              >
                <Phone size={14} /> Call
              </a>
            </div>
            {[
              [
                ['Employee ID', selected.employeeId],
                ['Email', selected.email],
                ['Phone', selected.phone],
                ['Work location', selected.location],
              ],
              [
                ['Department', selected.department],
                ['Position', selected.role],
                ['Hire date', fmtDate(selected.hireDate)],
                ['Tenure', tenure(selected.hireDate)],
              ],
            ].map((grp, i) => (
              <div
                key={i}
                className="mb-3 grid grid-cols-2 gap-4 rounded-xl border border-border bg-muted p-4  "
              >
                {grp.map(([k, v]) => (
                  <div key={k} className="min-w-0">
                    <div className="text-xs text-muted-foreground">{k}</div>
                    <div className="truncate text-sm font-medium">{v}</div>
                  </div>
                ))}
              </div>
            ))}
            <div className="rounded-xl border border-border bg-muted p-4  ">
              <div className="mb-2 text-xs text-muted-foreground">
                Reporting line
              </div>
              <div className="flex flex-wrap gap-2">
                {selected.reportsTo !== CEO && (
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() =>
                      setSelected(
                        EMPLOYEES.find(e => e.name === selected.reportsTo) ||
                          selected
                      )
                    }
                    className="h-auto rounded-md border border-primary/40 bg-primary/10 px-2 py-0.5 text-sm font-medium text-primary "
                  >
                    {selected.reportsTo}
                  </Button>
                )}
                {selected.reportsTo === CEO && (
                  <span className="rounded-md border border-border px-2 py-0.5 text-sm ">
                    {CEO} (CEO)
                  </span>
                )}
              </div>
              {EMPLOYEES.some(e => e.reportsTo === selected.name) && (
                <>
                  <div className="mb-2 mt-3 text-xs text-muted-foreground">
                    Direct reports (
                    {
                      EMPLOYEES.filter(e => e.reportsTo === selected.name)
                        .length
                    }
                    )
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {EMPLOYEES.filter(e => e.reportsTo === selected.name).map(
                      e => (
                        <Button
                          variant="ghost"
                          key={e.id}
                          type="button"
                          onClick={() => setSelected(e)}
                          className="h-auto flex items-center gap-1.5 rounded-full border border-border py-0.5 pl-0.5 pr-2.5 text-xs hover:bg-muted"
                        >
                          <Avatar name={e.name} size={20} />
                          {e.name}
                        </Button>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>

      <div
        aria-live="polite"
        className={`pointer-events-none fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground shadow-lg transition ${toast ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
      >
        {toast && <Check size={14} />}
        {toast}
      </div>
    </div>
  );
};

export default EmployeeDirectory;
