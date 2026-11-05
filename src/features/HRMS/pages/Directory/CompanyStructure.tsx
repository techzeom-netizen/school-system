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
  Check,
  ChevronDown,
  ChevronRight,
  Globe,
  Layers,
  LayoutGrid,
  List,
  MapPin,
  Network,
  RotateCcw,
  Search,
  SearchX,
  TrendingUp,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import Section from '@/components/common/Section';
import { TanStackTable } from '@/components/common';

interface Dept {
  id: string;
  buId: string;
  name: string;
  head: string;
  headRole: string;
  budget: number;
  growth: number;
  color: string;
  description: string;
  locations: Record<string, number>;
  subs: { name: string; count: number }[];
}
interface BU {
  id: string;
  name: string;
  lead: string;
  leadRole: string;
  revenue: number;
  color: string;
}

const BUS: BU[] = [
  {
    id: 'platform',
    name: 'Platform',
    lead: 'Aarav Deshmukh',
    leadRole: 'Chief Product & Tech Officer',
    revenue: 6.4,
    color: 'hsl(var(--primary))',
  },
  {
    id: 'commercial',
    name: 'Commercial',
    lead: 'Meera Iyer',
    leadRole: 'Chief Revenue Officer',
    revenue: 8.9,
    color: 'hsl(var(--secondary-foreground))',
  },
  {
    id: 'fulfilment',
    name: 'Fulfilment',
    lead: 'Kabir Malhotra',
    leadRole: 'Chief Operating Officer',
    revenue: 5.2,
    color: 'hsl(var(--destructive))',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    lead: 'Nandini Rao',
    leadRole: 'Chief of Staff',
    revenue: 0,
    color: 'hsl(var(--accent-foreground))',
  },
];

const DEPTS: Dept[] = [
  {
    id: 'd1',
    buId: 'platform',
    name: 'Route Intelligence',
    head: 'Ishaan Verma',
    headRole: 'VP Engineering',
    budget: 2.6,
    growth: 21,
    color: 'hsl(var(--primary))',
    description: 'Builds the routing engine and live ETA models.',
    locations: { Pune: 14, Bangalore: 9, Remote: 3 },
    subs: [
      { name: 'Optimisation', count: 9 },
      { name: 'ML Platform', count: 8 },
      { name: 'Mobile', count: 6 },
      { name: 'QA', count: 3 },
    ],
  },
  {
    id: 'd2',
    buId: 'platform',
    name: 'Data & Trust',
    head: 'Tanvi Kulkarni',
    headRole: 'Head of Data',
    budget: 1.4,
    growth: 27,
    color: 'hsl(var(--accent-foreground))',
    description: 'Pipelines, analytics and security for shipment data.',
    locations: { Pune: 6, Bangalore: 5, Remote: 2 },
    subs: [
      { name: 'Data Eng', count: 6 },
      { name: 'Analytics', count: 4 },
      { name: 'Security', count: 3 },
    ],
  },
  {
    id: 'd3',
    buId: 'commercial',
    name: 'Enterprise Sales',
    head: 'Rohan Bhatt',
    headRole: 'VP Sales',
    budget: 1.9,
    growth: 34,
    color: 'hsl(var(--secondary-foreground))',
    description: 'Wins and expands large shipper and retailer accounts.',
    locations: { Mumbai: 8, Delhi: 6, Dubai: 3 },
    subs: [
      { name: 'Key Accounts', count: 7 },
      { name: 'Solutions', count: 6 },
      { name: 'Sales Ops', count: 4 },
    ],
  },
  {
    id: 'd4',
    buId: 'commercial',
    name: 'Brand & Demand',
    head: 'Zoya Qureshi',
    headRole: 'Head of Marketing',
    budget: 1.1,
    growth: 16,
    color: 'hsl(var(--muted-foreground))',
    description: 'Positioning, campaigns and the partner programme.',
    locations: { Mumbai: 5, Pune: 3, Remote: 2 },
    subs: [
      { name: 'Content', count: 4 },
      { name: 'Performance', count: 3 },
      { name: 'Partners', count: 3 },
    ],
  },
  {
    id: 'd5',
    buId: 'fulfilment',
    name: 'Hub Operations',
    head: 'Dev Patil',
    headRole: 'Director, Hubs',
    budget: 3.1,
    growth: 11,
    color: 'hsl(var(--destructive))',
    description: 'Runs sorting hubs and last-mile partner networks.',
    locations: { Pune: 12, Delhi: 9, Mumbai: 7 },
    subs: [
      { name: 'Sorting', count: 11 },
      { name: 'Last Mile', count: 10 },
      { name: 'Safety', count: 7 },
    ],
  },
  {
    id: 'd6',
    buId: 'fulfilment',
    name: 'Customer Care',
    head: 'Pooja Nair',
    headRole: 'Head of Support',
    budget: 0.8,
    growth: 9,
    color: 'hsl(var(--foreground))',
    description: 'Tracks exceptions and resolves delivery issues.',
    locations: { Bangalore: 8, Remote: 5 },
    subs: [
      { name: 'Tier 1', count: 8 },
      { name: 'Escalations', count: 5 },
    ],
  },
  {
    id: 'd7',
    buId: 'corporate',
    name: 'People & Culture',
    head: 'Samar Joshi',
    headRole: 'CHRO',
    budget: 0.7,
    growth: 7,
    color: 'hsl(var(--primary))',
    description: 'Hiring, learning and employee experience.',
    locations: { Pune: 4, Remote: 2 },
    subs: [
      { name: 'Talent', count: 3 },
      { name: 'Learning', count: 3 },
    ],
  },
  {
    id: 'd8',
    buId: 'corporate',
    name: 'Finance & Legal',
    head: 'Kavya Menon',
    headRole: 'CFO',
    budget: 0.6,
    growth: 5,
    color: 'hsl(var(--destructive))',
    description: 'Planning, treasury, compliance and contracts.',
    locations: { Delhi: 4, Mumbai: 3 },
    subs: [
      { name: 'FP&A', count: 3 },
      { name: 'Legal', count: 4 },
    ],
  },
];

const LOC_COLORS: Record<string, string> = {
  Pune: 'hsl(var(--primary))',
  Bangalore: 'hsl(var(--accent-foreground))',
  Mumbai: 'hsl(var(--secondary-foreground))',
  Delhi: 'hsl(var(--destructive))',
  Dubai: 'hsl(var(--foreground))',
  Remote: 'hsl(var(--muted-foreground))',
};
const TREND: Record<string, { m: string; headcount: number; hires: number }[]> =
  {
    '3M': [
      { m: 'Aug', headcount: 168, hires: 7 },
      { m: 'Sep', headcount: 176, hires: 8 },
      { m: 'Oct', headcount: 183, hires: 7 },
    ],
    '6M': [
      { m: 'May', headcount: 141, hires: 5 },
      { m: 'Jun', headcount: 149, hires: 8 },
      { m: 'Jul', headcount: 160, hires: 11 },
      { m: 'Aug', headcount: 168, hires: 7 },
      { m: 'Sep', headcount: 176, hires: 8 },
      { m: 'Oct', headcount: 183, hires: 7 },
    ],
    '12M': [
      { m: 'Nov', headcount: 104, hires: 4 },
      { m: 'Jan', headcount: 112, hires: 5 },
      { m: 'Mar', headcount: 127, hires: 9 },
      { m: 'May', headcount: 141, hires: 6 },
      { m: 'Jul', headcount: 160, hires: 11 },
      { m: 'Sep', headcount: 176, hires: 8 },
      { m: 'Oct', headcount: 183, hires: 7 },
    ],
  };

const sum = (o: Record<string, number>) =>
  Object.values(o).reduce((a, b) => a + b, 0);
const people = (d: Dept) => sum(d.locations);
const initials = (n: string) =>
  n
    .split(' ')
    .map(x => x[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
const cardCls = 'rounded-2xl p-5 shadow-none';
const tick = { fontSize: 11, fill: 'currentColor', opacity: 0.55 };
interface ChartTooltipItem {
  dataKey?: string | number;
  name?: string | number;
  value?: string | number;
}
interface ChartDatum {
  name: string;
}

function useCountUp(target: number) {
  const [v, setV] = useState(target);
  const current = useRef(target);
  useEffect(() => {
    const from = current.current;
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min((t - t0) / 500, 1);
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

const Avatar = ({
  name,
  color,
  size = 36,
}: {
  name: string;
  color: string;
  size?: number;
}) => (
  <span
    className="flex flex-shrink-0 items-center justify-center rounded-full font-semibold text-primary-foreground"
    style={{
      width: size,
      height: size,
      background: color,
      fontSize: size * 0.36,
    }}
  >
    {initials(name)}
  </span>
);

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

function Stat({
  label,
  value,
  icon: Icon,
  color,
  suffix = '',
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  suffix?: string;
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
      <div className="mt-2 text-3xl font-semibold tabular-nums">
        {n}
        {suffix}
      </div>
    </Card>
  );
}

const CompanyStructure: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [bu, setBu] = useState<string | null>(null);
  const [loc, setLoc] = useState<string | null>(null);
  const [sort, setSort] = useState<'people' | 'growth' | 'budget' | 'name'>(
    'people'
  );
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [drawer, setDrawer] = useState<string | null>(null);
  const [range, setRange] = useState<'3M' | '6M' | '12M'>('6M');
  const [toast, setToast] = useState('');

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(''), 2200);
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawer(null);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = DEPTS.filter(
      d =>
        (!bu || d.buId === bu) &&
        (!loc || d.locations[loc]) &&
        (!q ||
          [
            d.name,
            d.head,
            d.headRole,
            ...d.subs.map(s => s.name),
            ...Object.keys(d.locations),
          ].some(s => s.toLowerCase().includes(q)))
    );
    const by = {
      people: (a: Dept, b: Dept) => people(b) - people(a),
      growth: (a: Dept, b: Dept) => b.growth - a.growth,
      budget: (a: Dept, b: Dept) => b.budget - a.budget,
      name: (a: Dept, b: Dept) => a.name.localeCompare(b.name),
    }[sort];
    return [...list].sort(by);
  }, [search, bu, loc, sort]);

  const total = filtered.reduce((s, d) => s + people(d), 0);
  const budget = filtered.reduce((s, d) => s + d.budget, 0);
  const locData = useMemo(() => {
    const m: Record<string, number> = {};
    DEPTS.filter(d => !bu || d.buId === bu).forEach(d =>
      Object.entries(d.locations).forEach(([k, v]) => {
        m[k] = (m[k] || 0) + v;
      })
    );
    return Object.entries(m)
      .map(([name, value]) => ({ name, value, color: LOC_COLORS[name] }))
      .sort((a, b) => b.value - a.value);
  }, [bu]);
  const growthData = filtered.map(d => ({
    name: d.name.split(' ')[0],
    growth: d.growth,
    color: d.color,
  }));
  const filtersOn = !!(search || bu || loc);
  const reset = () => {
    setSearch('');
    setBu(null);
    setLoc(null);
    setSort('people');
  };
  const activeDept = DEPTS.find(d => d.id === drawer);
  const buOf = (id: string) => BUS.find(b => b.id === id)!;

  const columns = useMemo<ColumnDef<Dept>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Department',
        cell: ({ row }) => (
          <Button
            variant="link"
            type="button"
            onClick={() => setDrawer(row.original.id)}
            className="h-auto flex items-center gap-2 p-0 font-medium"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: row.original.color }}
            />
            {row.original.name}
          </Button>
        ),
      },
      { accessorKey: 'head', header: 'Head' },
      { id: 'people', header: 'People', accessorFn: d => people(d) },
      {
        id: 'budget',
        header: 'Budget',
        accessorFn: d => `$${d.budget.toFixed(1)}M`,
      },
      {
        accessorKey: 'growth',
        header: 'Growth',
        cell: ({ row }) => (
          <span className="text-primary ">↑ {row.original.growth}%</span>
        ),
      },
      {
        id: 'loc',
        header: 'Locations',
        accessorFn: d => Object.keys(d.locations).join(', '),
      },
    ],
    []
  );

  const Chip = ({
    active,
    onClick,
    children,
    color,
  }: {
    active: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    children: React.ReactNode;
    color?: string;
  }) => (
    <Button
      variant={active ? 'default' : 'outline'}
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="h-auto rounded-full px-3 py-1 text-xs font-medium"
      style={
        active ? { background: color || 'hsl(var(--primary))' } : undefined
      }
    >
      {active && <Check size={12} />}
      {children}f
    </Button>
  );

  return (
    <div className="relative min-h-screen space-y-4  p-1 text-foreground">
      <Section
        title="Company Structure"
        menuId="company-structure"
        showBreadcrumbs
      >
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-primary ">
              <Network size={14} /> Meridian Freight Tech
            </div>
            <p className="text-xs text-muted-foreground ">
              Click a business unit or location to filter everything on this
              page.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              className="bg-primary hover:bg-primary/90"
              onClick={() =>
                navigate('/dashboard/employer/directory/organization-chart')
              }
            >
              View org chart
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat
            label="People"
            value={total}
            icon={Users}
            color="hsl(var(--primary))"
          />
          <Stat
            label="Departments"
            value={filtered.length}
            icon={Layers}
            color="hsl(var(--accent-foreground))"
          />
          <Stat
            label="Annual budget ($M)"
            value={Math.round(budget * 10) / 10}
            icon={TrendingUp}
            color="hsl(var(--secondary-foreground))"
          />
          <Stat
            label="Locations"
            value={
              new Set(filtered.flatMap(d => Object.keys(d.locations))).size
            }
            icon={Globe}
            color="hsl(var(--destructive))"
          />
        </div>
      </Section>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Business units</h3>
          {bu && (
            <Button
              variant="link"
              type="button"
              className="h-auto px-2 py-1 text-xs"
              onClick={() => setBu(null)}
            >
              Show all
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {BUS.map(u => {
            const ds = DEPTS.filter(d => d.buId === u.id);
            const on = bu === u.id;
            return (
              <Button
                variant="outline"
                key={u.id}
                type="button"
                onClick={() => setBu(on ? null : u.id)}
                aria-pressed={on}
                className={`h-auto w-full relative overflow-hidden rounded-2xl p-4 text-left transition ${on ? 'shadow-lg' : 'hover:-translate-y-0.5 hover:shadow-md'} ${bu && !on ? 'opacity-50' : ''}`}
                style={
                  on
                    ? {
                        borderColor: u.color,
                        boxShadow: `0 0 0 1px ${u.color}`,
                      }
                    : undefined
                }
              >
                <div
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ background: u.color }}
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{u.name}</span>
                  {on ? (
                    <Check size={15} style={{ color: u.color }} />
                  ) : (
                    <ChevronRight size={15} className="text-muted-foreground" />
                  )}
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <Avatar name={u.lead} color={u.color} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{u.lead}</div>
                    <div className="truncate text-xs text-muted-foreground ">
                      {u.leadRole}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex justify-between border-t border-border pt-2 text-xs text-muted-foreground  ">
                  <span>
                    {ds.length} depts · {ds.reduce((s, d) => s + people(d), 0)}{' '}
                    people
                  </span>
                  <span className="font-semibold text-foreground ">
                    {u.revenue ? `$${u.revenue}M rev` : 'Support'}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className={`${cardCls} xl:col-span-2`}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold">Headcount trend</h3>
              <p className="text-xs text-muted-foreground ">
                Company-wide, headcount vs hires
              </p>
            </div>
            <div className="flex gap-1 rounded-lg border border-border p-0.5 ">
              {(['3M', '6M', '12M'] as const).map(r => (
                <Button
                  variant={range === r ? 'default' : 'ghost'}
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  size="sm"
                  className="h-auto rounded-md px-2.5 py-1 text-xs font-medium"
                >
                  {r}
                </Button>
              ))}
            </div>
          </div>
          <div className="mt-3">
            <ResponsiveContainer width="100%" height={240}>
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
                  <linearGradient id="hr" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="hsl(var(--secondary-foreground))"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(var(--secondary-foreground))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  strokeOpacity={0.1}
                  vertical={false}
                />
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
                  dataKey="headcount"
                  name="Headcount"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#hc)"
                />
                <Area
                  type="monotone"
                  dataKey="hires"
                  name="New hires"
                  stroke="hsl(var(--secondary-foreground))"
                  strokeWidth={2}
                  fill="url(#hr)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <Card className={cardCls}>
          <h3 className="text-sm font-semibold">Where people work</h3>
          <p className="text-xs text-muted-foreground ">
            Click a slice or name to filter by location
          </p>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie
                data={locData}
                dataKey="value"
                nameKey="name"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
                cornerRadius={4}
                stroke="none"
                onClick={(e: ChartDatum) =>
                  setLoc(l => (l === e.name ? null : e.name))
                }
                className="cursor-pointer"
              >
                {locData.map(l => (
                  <Cell
                    key={l.name}
                    fill={l.color}
                    fillOpacity={loc && loc !== l.name ? 0.25 : 1}
                  />
                ))}
              </Pie>
              <Tooltip content={<Tip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1.5">
            {locData.map(l => (
              <Button
                variant={loc === l.name ? 'default' : 'ghost'}
                key={l.name}
                type="button"
                onClick={() => setLoc(loc === l.name ? null : l.name)}
                className="h-auto flex items-center justify-between rounded px-1 text-xs"
                style={
                  loc === l.name ? { backgroundColor: l.color } : undefined
                }
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: l.color }}
                  />
                  {l.name}
                </span>
                <b className="tabular-nums">{l.value}</b>
              </Button>
            ))}
          </div>
        </Card>
      </div>

      <Card className={cardCls}>
        <h3 className="text-sm font-semibold">Year-over-year growth</h3>
        <p className="text-xs text-muted-foreground ">
          Follows your current filters
        </p>
        {growthData.length ? (
          <ResponsiveContainer width="100%" height={210}>
            <BarChart
              data={growthData}
              margin={{ top: 16, right: 8, left: -20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                strokeOpacity={0.1}
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={tick}
                tickLine={false}
                axisLine={false}
              />
              <YAxis tick={tick} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'currentColor', fillOpacity: 0.05 }}
                content={<Tip />}
              />
              <Bar
                dataKey="growth"
                name="Growth %"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              >
                {growthData.map(g => (
                  <Cell key={g.name} fill={g.color} />
                ))}
                <LabelList
                  dataKey="growth"
                  position="top"
                  formatter={(value: React.ReactNode) => `${String(value)}%`}
                  style={{ fontSize: 11, fill: 'currentColor', opacity: 0.7 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="py-10 text-center text-xs text-muted-foreground">
            No data for these filters.
          </p>
        )}
      </Card>

      <Section title="Departments" menuId="company-departments">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 focus-within:ring-2 focus-within:ring-ring  ">
            <Search size={14} className="text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by team, head, sub-team or city"
              className="h-auto w-full border-0 bg-transparent p-0 text-sm shadow-none outline-none placeholder:text-muted-foreground focus-visible:ring-0"
            />
            {search && (
              <Button
                variant="ghost"
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch('')}
                className="h-6 w-6 p-1"
              >
                <X size={14} className="text-muted-foreground" />
              </Button>
            )}
          </label>
          <Select
            value={sort}
            onValueChange={value =>
              setSort(value as 'people' | 'growth' | 'budget' | 'name')
            }
          >
            <SelectTrigger
              aria-label="Sort departments"
              className="h-auto w-auto bg-card px-3 py-2"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="people">Sort: Most people</SelectItem>
              <SelectItem value="growth">Sort: Fastest growth</SelectItem>
              <SelectItem value="budget">Sort: Biggest budget</SelectItem>
              <SelectItem value="name">Sort: A to Z</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-1 rounded-lg border border-border bg-card p-1  ">
            {(
              [
                ['grid', LayoutGrid],
                ['list', List],
              ] as const
            ).map(([v, I]) => (
              <Button
                variant={view === v ? 'default' : 'ghost'}
                key={v}
                type="button"
                aria-label={`${v} view`}
                onClick={() => setView(v)}
                className="h-auto rounded-md p-1.5"
              >
                <I size={15} />
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            type="button"
            onClick={reset}
            disabled={!filtersOn && sort === 'people'}
          >
            <RotateCcw size={14} /> Reset
          </Button>
        </div>

        {filtersOn && (
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground">
              Showing {filtered.length} of {DEPTS.length}:
            </span>
            {bu && (
              <Chip active color={buOf(bu).color} onClick={() => setBu(null)}>
                {buOf(bu).name} <X size={11} />
              </Chip>
            )}
            {loc && (
              <Chip active color={LOC_COLORS[loc]} onClick={() => setLoc(null)}>
                {loc} <X size={11} />
              </Chip>
            )}
            {search && (
              <Chip
                active
                color="hsl(var(--muted-foreground))"
                onClick={() => setSearch('')}
              >
                “{search}” <X size={11} />
              </Chip>
            )}
          </div>
        )}

        {!filtered.length ? (
          <div
            className={`${cardCls} flex flex-col items-center py-14 text-center`}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted ">
              <SearchX size={22} />
            </span>
            <h3 className="mt-4 text-sm font-semibold">No departments match</h3>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground ">
              Remove a filter or clear the search to see all departments.
            </p>
            <Button
              className="mt-4"
              variant="outline"
              type="button"
              onClick={reset}
            >
              Clear all filters
            </Button>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filtered.map(d => {
              const isOpen = open.has(d.id);
              const n = people(d);
              return (
                <div
                  key={d.id}
                  className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary"
                >
                  <div className="flex items-start justify-between gap-3">
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => setDrawer(d.id)}
                      className="h-auto flex items-start gap-3 text-left"
                    >
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${d.color} 12%, transparent)`,
                          color: d.color,
                        }}
                      >
                        <Layers size={16} />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold hover:underline">
                          {d.name}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground ">
                          {d.description}
                        </span>
                      </span>
                    </Button>
                    <Button
                      variant={isOpen ? 'default' : 'ghost'}
                      type="button"
                      aria-expanded={isOpen}
                      aria-label="Toggle sub-teams"
                      onClick={() =>
                        setOpen(s => {
                          const x = new Set(s);
                          if (x.has(d.id)) {
                            x.delete(d.id);
                          } else {
                            x.add(d.id);
                          }
                          return x;
                        })
                      }
                      className="h-auto rounded-lg p-1 text-muted-foreground hover:bg-muted"
                    >
                      {isOpen ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </Button>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {(
                      [
                        ['Head', d.head],
                        ['People', n],
                        ['Budget', `$${d.budget.toFixed(1)}M`],
                        ['Growth', `↑ ${d.growth}%`],
                      ] as const
                    ).map(([k, v]) => (
                      <div key={k}>
                        <div className="text-xs text-muted-foreground ">
                          {k}
                        </div>
                        <div
                          className={`text-sm font-medium ${k === 'Growth' ? 'text-primary ' : ''}`}
                        >
                          {v}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground ">
                    <MapPin size={12} />
                    {Object.keys(d.locations).map(l => (
                      <Button
                        variant="ghost"
                        key={l}
                        type="button"
                        onClick={() => setLoc(loc === l ? null : l)}
                        className="h-auto rounded-full px-2 py-0.5"
                        style={
                          loc === l
                            ? {
                                backgroundColor: LOC_COLORS[l],
                              }
                            : undefined
                        }
                      >
                        {l}
                      </Button>
                    ))}
                  </div>
                  {isOpen && (
                    <div className="mt-4 space-y-2 border-t border-border pt-4 ">
                      {d.subs.map(s => (
                        <div
                          key={s.name}
                          className="flex items-center gap-3 text-xs"
                        >
                          <span className="w-24 text-foreground ">
                            {s.name}
                          </span>
                          <span className="h-1.5 flex-1 rounded-full bg-muted ">
                            <span
                              className="block h-full rounded-full"
                              style={{
                                width: `${(s.count / n) * 100}%`,
                                background: d.color,
                              }}
                            />
                          </span>
                          <b className="w-6 text-right tabular-nums">
                            {s.count}
                          </b>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <TanStackTable
            showDownload={true}
            key={`${search}-${bu}-${loc}-${sort}`}
            data={filtered}
            columns={columns}
            searchPlaceholder="Search departments..."
            pageSize={10}
            enableColumnVisibility
            enableRowSelection={false}
          />
        )}
      </Section>

      <Section title="Leadership" menuId="company-leadership">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {BUS.map(u => (
            <Button
              variant="ghost"
              key={u.id}
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(`${u.lead}`);
                flash(`Copied ${u.lead}`);
              }}
              className="h-auto w-full flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left hover:border-primary"
            >
              <Avatar name={u.lead} color={u.color} size={44} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">
                  {u.lead}
                </span>
                <span className="block truncate text-xs text-muted-foreground ">
                  {u.leadRole}
                </span>
              </span>
            </Button>
          ))}
        </div>
      </Section>

      {activeDept && (
        <div
          className="fixed inset-0 z-40 flex justify-end bg-background/40"
          onClick={() => setDrawer(null)}
        >
          <aside
            role="dialog"
            aria-label={activeDept.name}
            onClick={e => e.stopPropagation()}
            className="h-full w-full max-w-md overflow-y-auto bg-card p-6 shadow-2xl "
          >
            <div className="flex items-start justify-between">
              <div>
                <div
                  className="text-xs font-medium"
                  style={{ color: buOf(activeDept.buId).color }}
                >
                  {buOf(activeDept.buId).name}
                </div>
                <h2 className="text-xl font-semibold">{activeDept.name}</h2>
              </div>
              <Button
                variant="ghost"
                type="button"
                aria-label="Close"
                onClick={() => setDrawer(null)}
                className="h-auto rounded-lg p-1 hover:bg-muted"
              >
                <X size={18} />
              </Button>
            </div>
            <p className="mt-2 text-sm text-foreground ">
              {activeDept.description}
            </p>
            <div className="mt-5 flex items-center gap-3 rounded-xl bg-muted p-3 ">
              <Avatar
                name={activeDept.head}
                color={activeDept.color}
                size={44}
              />
              <div>
                <div className="text-sm font-semibold">{activeDept.head}</div>
                <div className="text-xs text-muted-foreground">
                  {activeDept.headRole}
                </div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              {[
                ['People', people(activeDept)],
                ['Budget', `$${activeDept.budget.toFixed(1)}M`],
                ['Growth', `↑ ${activeDept.growth}%`],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-border p-3 ">
                  <div className="text-lg font-semibold">{v}</div>
                  <div className="text-xs text-muted-foreground">{k}</div>
                </div>
              ))}
            </div>
            <h3 className="mb-2 mt-6 text-sm font-semibold">Sub-teams</h3>
            {activeDept.subs.map(s => (
              <div
                key={s.name}
                className="flex justify-between border-b border-border py-2 text-sm "
              >
                <span>{s.name}</span>
                <b>{s.count}</b>
              </div>
            ))}
            <h3 className="mb-2 mt-6 text-sm font-semibold">By location</h3>
            {Object.entries(activeDept.locations).map(([l, c]) => (
              <div key={l} className="mb-2 flex items-center gap-3 text-xs">
                <span className="w-20">{l}</span>
                <span className="h-1.5 flex-1 rounded-full bg-muted ">
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: `${(c / people(activeDept)) * 100}%`,
                      background: LOC_COLORS[l],
                    }}
                  />
                </span>
                <b className="w-6 text-right">{c}</b>
              </div>
            ))}
          </aside>
        </div>
      )}

      <div
        aria-live="polite"
        className={`pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground shadow-lg transition ${toast ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
      >
        {toast}
      </div>
    </div>
  );
};

export default CompanyStructure;
