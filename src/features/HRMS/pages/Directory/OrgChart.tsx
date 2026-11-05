import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
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
  Copy,
  Crown,
  Layers,
  Mail,
  Maximize2,
  Minimize2,
  RotateCcw,
  Search,
  SearchX,
  Target,
  UserCheck,
  Users,
  X,
  ZoomIn,
  ZoomOut,
  Building2,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Section from '@/components/common/Section';

interface Person {
  id: string;
  name: string;
  role: string;
  dept: string;
  email: string;
  parent: string;
}
const ME = 'ishaan';

const DEPT_COLORS: Record<string, string> = {
  Executive: 'hsl(var(--accent-foreground))',
  'Route Intelligence': 'hsl(var(--primary))',
  'Data & Trust': 'hsl(var(--secondary-foreground))',
  'Enterprise Sales': 'hsl(var(--destructive))',
  'Brand & Demand': 'hsl(var(--muted-foreground))',
  'Hub Operations': 'hsl(var(--foreground))',
  'People & Culture': 'hsl(var(--primary))',
};
const p = (
  id: string,
  name: string,
  role: string,
  dept: string,
  parent: string
): Person => ({
  id,
  name,
  role,
  dept,
  parent,
  email: `${name
    .toLowerCase()
    .replace(/[^a-z ]/g, '')
    .replace(' ', '.')}@meridianft.com`,
});

const PEOPLE: Person[] = [
  p('ceo', 'Sanjana Kapoor', 'Founder & CEO', 'Executive', ''),
  p('ishaan', 'Ishaan Verma', 'VP Engineering', 'Route Intelligence', 'ceo'),
  p('tanvi', 'Tanvi Kulkarni', 'Head of Data', 'Data & Trust', 'ceo'),
  p('rohan', 'Rohan Bhatt', 'VP Sales', 'Enterprise Sales', 'ceo'),
  p('zoya', 'Zoya Qureshi', 'Head of Marketing', 'Brand & Demand', 'ceo'),
  p('dev', 'Dev Patil', 'Director, Hubs', 'Hub Operations', 'ceo'),
  p('samar', 'Samar Joshi', 'CHRO', 'People & Culture', 'ceo'),
  p(
    'neha',
    'Neha Pillai',
    'Senior Backend Engineer',
    'Route Intelligence',
    'ishaan'
  ),
  p('arjun', 'Arjun Sethi', 'ML Engineer', 'Route Intelligence', 'ishaan'),
  p('kiara', 'Kiara Banerjee', 'QA Lead', 'Route Intelligence', 'ishaan'),
  p('vihaan', 'Vihaan Rao', 'Mobile Engineer', 'Route Intelligence', 'neha'),
  p('aditi', 'Aditi Naik', 'Backend Engineer', 'Route Intelligence', 'neha'),
  p('ananya', 'Ananya Shetty', 'Data Engineer', 'Data & Trust', 'tanvi'),
  p('yash', 'Yash Agarwal', 'Security Analyst', 'Data & Trust', 'tanvi'),
  p(
    'ritika',
    'Ritika Sood',
    'Key Account Manager',
    'Enterprise Sales',
    'rohan'
  ),
  p(
    'farhan',
    'Farhan Sheikh',
    'Solutions Consultant',
    'Enterprise Sales',
    'rohan'
  ),
  p('mira', 'Mira Chandra', 'Content Strategist', 'Brand & Demand', 'zoya'),
  p('harsh', 'Harsh Vora', 'Performance Marketer', 'Brand & Demand', 'zoya'),
  p('lakshmi', 'Lakshmi Iyer', 'Hub Supervisor', 'Hub Operations', 'dev'),
  p('kunal', 'Kunal Deshpande', 'Last-mile Planner', 'Hub Operations', 'dev'),
  p('isha', 'Isha Menon', 'Talent Partner', 'People & Culture', 'samar'),
];

const byId = Object.fromEntries(PEOPLE.map(x => [x.id, x]));
const kids = (id: string) => PEOPLE.filter(x => x.parent === id);
const chain = (id: string): Person[] => {
  const out: Person[] = [];
  let c: Person | undefined = byId[id];
  while (c) {
    out.unshift(c);
    c = byId[c.parent];
  }
  return out;
};
const level = (id: string) => chain(id).length;
const subtree = (id: string): string[] => [
  id,
  ...kids(id).flatMap(k => subtree(k.id)),
];
const teamSize = (id: string) => subtree(id).length - 1;

const cardCls = 'rounded-2xl p-5 shadow-none';
const tick = { fontSize: 11, fill: 'currentColor', opacity: 0.55 };
const grid = {
  strokeDasharray: '3 3',
  stroke: 'currentColor',
  strokeOpacity: 0.1,
  vertical: false,
};

const Avatar = ({ person, size = 36 }: { person: Person; size?: number }) => (
  <span
    className="flex flex-shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground ring-2 ring-background"
    style={{
      width: size,
      height: size,
      fontSize: size * 0.36,
    }}
  >
    {person.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()}
  </span>
);
interface ChartTooltipItem {
  dataKey?: string | number;
  name?: string | number;
  value?: string | number;
}
interface ChartDatum {
  name: string;
}

const Tip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: ChartTooltipItem[];
  label?: string | number;
}) =>
  !active || !payload?.length ? null : (
    <div className="rounded-lg border border-border bg-popover/95 px-3 py-2 text-xs shadow-lg">
      {label && <div className="mb-1 font-semibold">{label}</div>}
      {payload.map(x => (
        <div key={x.dataKey ?? x.name} className="flex justify-between gap-5">
          <span>{x.name}</span>
          <b>{x.value}</b>
        </div>
      ))}
    </div>
  );
function useCountUp(target: number) {
  const [v, setV] = useState(target);
  const current = useRef(target);
  useEffect(() => {
    const from = current.current;
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min((t - t0) / 450, 1);
      const next = Math.round(
        from + (target - from) * (1 - Math.pow(1 - k, 3))
      );
      current.current = next;
      setV(next);
      if (k < 1) raf = requestAnimationFrame(step);
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

interface RowProps {
  person: Person;
  visible: Set<string>;
  expanded: Set<string>;
  forceOpen: boolean;
  matches: Set<string> | null;
  selectedId: string;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
}
const TreeRow: React.FC<RowProps> = props => {
  const {
    person,
    visible,
    expanded,
    forceOpen,
    matches,
    selectedId,
    onToggle,
    onSelect,
  } = props;
  const children = kids(person.id).filter(k => visible.has(k.id));
  const open = forceOpen || expanded.has(person.id);
  const selected = selectedId === person.id;
  const dim = matches && !matches.has(person.id);
  return (
    <div>
      <div
        role="treeitem"
        aria-selected={selected}
        aria-expanded={children.length ? open : undefined}
        tabIndex={0}
        onClick={() => onSelect(person.id)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(person.id);
          }
          if (e.key === 'ArrowRight' && children.length && !open)
            onToggle(person.id);
          if (e.key === 'ArrowLeft' && children.length && open)
            onToggle(person.id);
        }}
        className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 outline-none transition focus-visible:ring-2 focus-visible:ring-ring ${
          selected ? 'bg-primary/10 ring-1 ring-primary  ' : 'hover:bg-muted/60'
        } ${dim ? 'opacity-45' : ''}`}
      >
        {children.length ? (
          <Button
            variant="ghost"
            type="button"
            aria-label={open ? 'Collapse' : 'Expand'}
            onClick={e => {
              e.stopPropagation();
              onToggle(person.id);
            }}
            className="h-5 w-5 rounded p-0 text-muted-foreground hover:bg-muted"
          >
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </Button>
        ) : (
          <span className="h-5 w-5" />
        )}
        <Avatar person={person} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold">
              {person.name}
            </span>
            {person.id === ME && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary ">
                You
              </span>
            )}
          </div>
          <div className="truncate text-xs text-muted-foreground ">
            {person.role} · {person.dept}
          </div>
        </div>
        {teamSize(person.id) > 0 && (
          <span
            title={`${teamSize(person.id)} people in this team`}
            className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium text-foreground   "
          >
            {teamSize(person.id)}
          </span>
        )}
      </div>
      {children.length > 0 && open && (
        <div role="group" className="ml-6 border-l border-border pl-2 ">
          {children.map(c => (
            <TreeRow key={c.id} {...props} person={c} />
          ))}
        </div>
      )}
    </div>
  );
};

const OrgChart: React.FC = () => {
  const [tab, setTab] = useState<'full' | 'branch'>('full');
  const [mode, setMode] = useState<'tree' | 'columns'>('tree');
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(['ceo', 'ishaan'])
  );
  const [selectedId, setSelectedId] = useState('ceo');
  const [focusId, setFocusId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [toast, setToast] = useState('');
  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(''), 2000);
  };

  const rootId = focusId ?? 'ceo';

  const scope = useMemo(() => {
    let ids = new Set(subtree(rootId));
    if (tab === 'branch') {
      const mine = new Set([...chain(ME).map(x => x.id), ...subtree(ME)]);
      ids = new Set([...ids].filter(i => mine.has(i)));
      if (!ids.has(rootId)) ids = new Set(mine);
    }
    return ids;
  }, [tab, rootId]);

  const q = search.trim().toLowerCase();
  const filtering = !!(q || dept);
  const matches = useMemo(() => {
    if (!filtering) return null;
    return new Set(
      [...scope].filter(i => {
        const x = byId[i];
        return (
          (!dept || x.dept === dept) &&
          (!q ||
            [x.name, x.role, x.dept, x.email].some(s =>
              s.toLowerCase().includes(q)
            ))
        );
      })
    );
  }, [filtering, scope, q, dept]);
  const visible = useMemo(() => {
    if (!matches) return scope;
    const v = new Set<string>();
    matches.forEach(i => chain(i).forEach(a => scope.has(a.id) && v.add(a.id)));
    return v;
  }, [matches, scope]);

  const effRoot = visible.has(rootId) ? rootId : [...visible][0];
  const inView = [...(matches ?? scope)];
  const levelData = [1, 2, 3, 4]
    .map(l => ({
      level: `L${l}`,
      count: inView.filter(i => level(i) === l).length,
      color: [
        'hsl(var(--accent-foreground))',
        'hsl(var(--primary))',
        'hsl(var(--secondary-foreground))',
        'hsl(var(--destructive))',
      ][l - 1],
    }))
    .filter(x => x.count);
  const deptData = Object.keys(DEPT_COLORS)
    .map(d => ({
      name: d,
      value: [...scope].filter(
        i => byId[i].dept === d && (!q || matches?.has(i))
      ).length,
      color: DEPT_COLORS[d],
    }))
    .filter(x => x.value);
  const selected = byId[selectedId];
  const filtersOn = !!(
    search ||
    dept ||
    focusId ||
    tab !== 'full' ||
    zoom !== 1
  );

  const toggle = (id: string) =>
    setExpanded(s => {
      const n = new Set(s);
      if (n.has(id)) {
        n.delete(id);
      } else {
        n.add(id);
      }
      return n;
    });
  const select = (id: string) => {
    setSelectedId(id);
  };
  const reveal = (id: string) =>
    setExpanded(s => new Set([...s, ...chain(id).map(x => x.id)]));
  const findMe = () => {
    setTab('full');
    setFocusId(null);
    setSearch('');
    setDept(null);
    reveal(ME);
    setSelectedId(ME);
    setMode('tree');
    flash('Found you in the chart');
  };
  const reset = () => {
    setSearch('');
    setDept(null);
    setFocusId(null);
    setTab('full');
    setZoom(1);
  };

  useEffect(() => {
    if (!visible.has(selectedId) && effRoot) setSelectedId(effRoot);
  }, [visible, selectedId, effRoot]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && setSearch('');
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const path = chain(selectedId)
    .filter(x => visible.has(x.id) && chain(effRoot).every(() => true))
    .filter(x => subtree(effRoot).includes(x.id));
  const columns: Person[][] = [
    [byId[effRoot]],
    ...path.map(x => kids(x.id).filter(k => visible.has(k.id))),
  ].filter(c => c.length);

  const tabBtn = (k: 'full' | 'branch', label: string) => (
    <Button
      variant={tab === k ? 'default' : 'ghost'}
      key={k}
      type="button"
      role="tab"
      aria-selected={tab === k}
      onClick={() => setTab(k)}
      className="h-auto rounded-lg px-4 py-1.5 text-sm font-medium"
    >
      {label}
    </Button>
  );

  return (
    <div className="relative min-h-screen space-y-4 p-1 text-foreground">
      <Section title="Organization Chart" menuId="org-chart" showBreadcrumbs>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground ">
            Select a person to see their reporting line. Use the arrow keys to
            open and close teams.
          </p>
          <div className="flex gap-2">
            <Button variant="default" type="button" onClick={findMe}>
              <UserCheck size={14} /> Find me
            </Button>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div
            role="tablist"
            className="flex gap-1 rounded-xl border border-border bg-card p-1  "
          >
            {tabBtn('full', 'Full org')}
            {tabBtn('branch', 'My branch')}
          </div>
          {focusId && (
            <Button
              variant="default"
              type="button"
              onClick={() => setFocusId(null)}
              className="h-auto rounded-xl px-3 py-1.5 text-sm"
            >
              Viewing {byId[focusId].name}’s team <X size={13} />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat
            label="People in view"
            value={inView.length}
            icon={Users}
            color="hsl(var(--primary))"
          />
          <Stat
            label="Levels"
            value={levelData.length}
            icon={Layers}
            color="hsl(var(--accent-foreground))"
          />
          <Stat
            label="Managers"
            value={inView.filter(i => kids(i).length).length}
            icon={Crown}
            color="hsl(var(--secondary-foreground))"
          />
          <Stat
            label="Departments"
            value={new Set(inView.map(i => byId[i].dept)).size}
            icon={Building2}
            color="hsl(var(--destructive))"
          />
        </div>
      </Section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className={cardCls}>
          <h3 className="text-sm font-semibold">People per level</h3>
          <p className="text-xs text-muted-foreground ">
            Follows the current view
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={levelData}
              margin={{ top: 16, right: 8, left: -20 }}
            >
              <CartesianGrid {...grid} />
              <XAxis
                dataKey="level"
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
                dataKey="count"
                name="People"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              >
                {levelData.map(l => (
                  <Cell key={l.level} fill={l.color} />
                ))}
                <LabelList
                  dataKey="count"
                  position="top"
                  style={{ fontSize: 11, fill: 'currentColor', opacity: 0.7 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className={cardCls}>
          <h3 className="text-sm font-semibold">By department</h3>
          <p className="text-xs text-muted-foreground ">
            Click a slice or name to filter the chart
          </p>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie
                data={deptData}
                dataKey="value"
                nameKey="name"
                innerRadius={36}
                outerRadius={60}
                paddingAngle={3}
                cornerRadius={4}
                stroke="none"
                className="cursor-pointer"
                onClick={(e: ChartDatum) =>
                  setDept(d => (d === e.name ? null : e.name))
                }
              >
                {deptData.map(d => (
                  <Cell
                    key={d.name}
                    fill={d.color}
                    fillOpacity={dept && dept !== d.name ? 0.3 : 1}
                  />
                ))}
              </Pie>
              <Tooltip content={<Tip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-1.5">
            {deptData.map(d => (
              <Button
                variant={dept === d.name ? 'default' : 'outline'}
                key={d.name}
                type="button"
                aria-pressed={dept === d.name}
                onClick={() => setDept(dept === d.name ? null : d.name)}
                className="h-auto rounded-full px-2 py-0.5 text-[11px]"
                style={dept === d.name ? { background: d.color } : undefined}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: d.color }}
                />
                {d.name} {d.value}
              </Button>
            ))}
          </div>
        </Card>

        <Card className={cardCls} aria-live="polite">
          <h3 className="text-sm font-semibold">Selected person</h3>
          <div className="mt-3 flex items-start gap-3">
            <Avatar person={selected} size={48} />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">{selected.name}</div>
              <div className="text-xs text-muted-foreground ">
                {selected.role}
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-primary ">
                <Mail size={11} />
                <a
                  href={`mailto:${selected.email}`}
                  className="truncate hover:underline"
                >
                  {selected.email}
                </a>
                <Button
                  variant="ghost"
                  size="xs"
                  type="button"
                  aria-label="Copy email"
                  onClick={() =>
                    navigator.clipboard
                      ?.writeText(selected.email)
                      .then(() => flash('Email copied'))
                  }
                  className="ml-1 h-6 w-6 p-1 text-muted-foreground hover:text-primary"
                >
                  <Copy size={11} />
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
            {chain(selectedId).map((c, i, a) => (
              <React.Fragment key={c.id}>
                <Button
                  variant={i === a.length - 1 ? 'secondary' : 'ghost'}
                  type="button"
                  onClick={() => select(c.id)}
                  className="h-auto rounded px-1"
                >
                  {c.name.split(' ')[0]}
                </Button>
                {i < a.length - 1 && <ChevronRight size={11} />}
              </React.Fragment>
            ))}
          </div>
          {kids(selectedId).length > 0 && (
            <div className="mt-3">
              <div className="mb-1 text-xs text-muted-foreground">
                Direct reports ({kids(selectedId).length}) · team of{' '}
                {teamSize(selectedId)}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {kids(selectedId).map(k => (
                  <Button
                    variant="outline"
                    size="xs"
                    key={k.id}
                    type="button"
                    onClick={() => {
                      reveal(k.id);
                      select(k.id);
                    }}
                    className="h-auto rounded-full py-0.5 pl-0.5 pr-2 text-xs"
                  >
                    <Avatar person={k} size={18} />
                    {k.name.split(' ')[0]}
                  </Button>
                ))}
              </div>
              <Button
                className="mt-3 w-full"
                variant="default"
                type="button"
                onClick={() => {
                  setFocusId(selectedId);
                  setExpanded(s => new Set([...s, selectedId]));
                }}
              >
                <Target size={14} /> View only this team
              </Button>
            </div>
          )}
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1 rounded-xl border border-border bg-card p-1  ">
          {(['tree', 'columns'] as const).map(m => (
            <Button
              variant={m === mode ? 'default' : 'ghost'}
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className="h-auto rounded-lg px-3 py-1.5 text-sm font-medium"
            >
              {m === 'tree' ? 'Tree view' : 'Columns'}
            </Button>
          ))}
        </div>
        <label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 focus-within:ring-2 focus-within:ring-ring  ">
          <Search size={14} className="text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, role, department or email"
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
        {mode === 'tree' && (
          <>
            <Button
              variant="outline"
              type="button"
              onClick={() => setExpanded(new Set(PEOPLE.map(x => x.id)))}
            >
              <Maximize2 size={14} /> Expand all
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => setExpanded(new Set([rootId]))}
            >
              <Minimize2 size={14} /> Collapse
            </Button>
            <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1  ">
              <Button
                variant="ghost"
                type="button"
                aria-label="Zoom out"
                onClick={() =>
                  setZoom(z => Math.max(0.8, +(z - 0.1).toFixed(1)))
                }
                className="h-auto rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
              >
                <ZoomOut size={14} />
              </Button>
              <span className="w-10 text-center text-xs text-muted-foreground">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                type="button"
                aria-label="Zoom in"
                onClick={() =>
                  setZoom(z => Math.min(1.3, +(z + 0.1).toFixed(1)))
                }
                className="h-auto rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
              >
                <ZoomIn size={14} />
              </Button>
            </div>
          </>
        )}
        <Button
          variant="outline"
          type="button"
          onClick={reset}
          disabled={!filtersOn}
        >
          <RotateCcw size={14} /> Reset
        </Button>
      </div>

      {filtering && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {matches?.size ?? 0} match{matches?.size === 1 ? '' : 'es'}; their
          managers stay visible so you can see where they sit.
          {dept && (
            <Button
              variant="default"
              type="button"
              onClick={() => setDept(null)}
              className="h-auto rounded-full px-2.5 py-0.5"
              style={{ background: DEPT_COLORS[dept] }}
            >
              {dept} <X size={11} />
            </Button>
          )}
        </div>
      )}

      {!visible.size || (filtering && !matches?.size) ? (
        <div
          className={`${cardCls} flex flex-col items-center py-14 text-center`}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted ">
            <SearchX size={22} />
          </span>
          <h3 className="mt-4 text-sm font-semibold">No one matches</h3>
          <p className="mt-1 text-xs text-muted-foreground ">
            Try a different name or role, or clear the department filter.
          </p>
          <Button
            className="mt-4"
            variant="outline"
            type="button"
            onClick={reset}
          >
            Clear filters
          </Button>
        </div>
      ) : mode === 'tree' ? (
        <div className={`${cardCls} overflow-x-auto`}>
          <div role="tree" style={{ zoom }}>
            <TreeRow
              person={byId[effRoot]}
              visible={visible}
              expanded={expanded}
              forceOpen={filtering}
              matches={matches}
              selectedId={selectedId}
              onToggle={toggle}
              onSelect={id => {
                select(id);
              }}
            />
          </div>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {columns.map((col, i) => (
            <div key={i} className="w-64 flex-shrink-0 space-y-2">
              <div className="px-1 text-xs font-medium text-muted-foreground">
                {i === 0
                  ? 'Top'
                  : `Reports to ${path[i - 1]?.name.split(' ')[0]}`}{' '}
                · {col.length}
              </div>
              {col.map(x => {
                const inPath = path.some(y => y.id === x.id);
                return (
                  <Button
                    variant="ghost"
                    key={x.id}
                    type="button"
                    onClick={() => select(x.id)}
                    aria-pressed={x.id === selectedId}
                    className={`h-auto w-full flex items-center gap-3 rounded-xl border p-3 text-left transition ${x.id === selectedId ? 'border-primary bg-primary/10 ring-1 ring-primary' : inPath ? 'border-primary/60 bg-card' : 'border-border bg-card hover:border-primary'} ${matches && !matches.has(x.id) ? 'opacity-45' : ''}`}
                  >
                    <Avatar person={x} size={36} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">
                        {x.name}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {x.role}
                      </span>
                    </span>
                    {kids(x.id).length > 0 && (
                      <ChevronRight
                        size={14}
                        className="text-muted-foreground"
                      />
                    )}
                  </Button>
                );
              })}
            </div>
          ))}
        </div>
      )}

      <div
        aria-live="polite"
        className={`pointer-events-none fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground shadow-lg transition ${toast ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
      >
        {toast && <Check size={14} />}
        {toast}
      </div>
    </div>
  );
};

export default OrgChart;
