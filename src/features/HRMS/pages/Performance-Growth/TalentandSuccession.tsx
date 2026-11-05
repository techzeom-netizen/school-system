import React, { useMemo, useRef, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Radar,
  RadarChart,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LabelList,
} from 'recharts';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  ChevronRight,
  Crown,
  GraduationCap,
  RotateCcw,
  SearchX,
  Shield,
  Star,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { TanStackTable } from '@/components/common';
import {
  talentBoxFilterOptions,
  talentDepartmentFilterOptions,
  talentReadinessFilterOptions,
} from '@/data/reusableDropdownData';

type Performance = 'Low' | 'Medium' | 'High';
type Potential = 'Low' | 'Medium' | 'High';
type BoxLabel =
  | 'Star'
  | 'High Potential'
  | 'Core Player'
  | 'Workhorse'
  | 'Inconsistent'
  | 'Risk'
  | 'Enigma'
  | 'Underperformer'
  | 'Solid Performer';

interface Talent {
  id: string;
  name: string;
  role: string;
  department: string;
  performance: Performance;
  potential: Potential;
  box: BoxLabel;
  readiness: 'Ready Now' | 'Ready in 1-2 yrs' | 'Ready in 3+ yrs' | 'Not Ready';
  flightRisk: 'Low' | 'Medium' | 'High';
  successor: string | null;
  tenure: string;
  rating: number;
}

interface CriticalRole {
  id: string;
  title: string;
  department: string;
  incumbent: string;
  criticality: 'Mission Critical' | 'High' | 'Medium';
  riskLevel: 'Low' | 'Medium' | 'High';
  successors: { name: string; readiness: string; confidence: number }[];
  vacantSince?: string;
}

const BOX_COLORS: Record<BoxLabel, string> = {
  Star: 'hsl(var(--primary))',
  'High Potential': 'hsl(var(--accent-foreground))',
  'Core Player': 'hsl(var(--primary))',
  Workhorse: 'hsl(var(--secondary-foreground))',
  Inconsistent: 'hsl(var(--accent-foreground))',
  Risk: 'hsl(var(--destructive))',
  Enigma: 'hsl(var(--destructive))',
  Underperformer: 'hsl(var(--muted-foreground))',
  'Solid Performer': 'hsl(var(--primary))',
};

const READINESS_COLORS: Record<string, string> = {
  'Ready Now': 'hsl(var(--primary))',
  'Ready in 1-2 yrs': 'hsl(var(--secondary-foreground))',
  'Ready in 3+ yrs': 'hsl(var(--accent-foreground))',
  'Not Ready': 'hsl(var(--muted-foreground))',
};

const RISK_COLORS: Record<string, string> = {
  Low: 'hsl(var(--primary))',
  Medium: 'hsl(var(--accent-foreground))',
  High: 'hsl(var(--destructive))',
};

const CRITICALITY_COLORS: Record<string, string> = {
  'Mission Critical': 'hsl(var(--destructive))',
  High: 'hsl(var(--accent-foreground))',
  Medium: 'hsl(var(--secondary-foreground))',
};

const TALENTS: Talent[] = [
  {
    id: 'p1',
    name: 'Ishaan Kapoor',
    role: 'Head of Platform Engineering',
    department: 'Engineering',
    performance: 'High',
    potential: 'High',
    box: 'Star',
    readiness: 'Ready Now',
    flightRisk: 'Medium',
    successor: 'Aarav Mehta',
    tenure: '7 yrs',
    rating: 5,
  },
  {
    id: 'p2',
    name: 'Riya Banerjee',
    role: 'VP of Product',
    department: 'Product',
    performance: 'High',
    potential: 'High',
    box: 'Star',
    readiness: 'Ready Now',
    flightRisk: 'Low',
    successor: 'Vihaan Nair',
    tenure: '6 yrs',
    rating: 5,
  },
  {
    id: 'p3',
    name: 'Dhruv Malhotra',
    role: 'Director of Data Science',
    department: 'Data & AI',
    performance: 'High',
    potential: 'High',
    box: 'High Potential',
    readiness: 'Ready in 1-2 yrs',
    flightRisk: 'Low',
    successor: 'Ananya Iyer',
    tenure: '5 yrs',
    rating: 5,
  },
  {
    id: 'p4',
    name: 'Tanya Sethi',
    role: 'Senior Engineering Manager',
    department: 'Engineering',
    performance: 'High',
    potential: 'Medium',
    box: 'Core Player',
    readiness: 'Ready Now',
    flightRisk: 'Low',
    successor: 'Kabir Rao',
    tenure: '8 yrs',
    rating: 4,
  },
  {
    id: 'p5',
    name: 'Arjun Verma',
    role: 'Lead Product Designer',
    department: 'Design',
    performance: 'High',
    potential: 'High',
    box: 'High Potential',
    readiness: 'Ready in 1-2 yrs',
    flightRisk: 'Medium',
    successor: 'Diya Sharma',
    tenure: '4 yrs',
    rating: 5,
  },
  {
    id: 'p6',
    name: 'Meera Pillai',
    role: 'Finance Controller',
    department: 'Finance',
    performance: 'High',
    potential: 'Medium',
    box: 'Core Player',
    readiness: 'Ready in 1-2 yrs',
    flightRisk: 'Low',
    successor: null,
    tenure: '6 yrs',
    rating: 4,
  },
  {
    id: 'p7',
    name: 'Aarav Mehta',
    role: 'Staff Engineer',
    department: 'Engineering',
    performance: 'High',
    potential: 'High',
    box: 'Star',
    readiness: 'Ready Now',
    flightRisk: 'Low',
    successor: 'Reyansh Bose',
    tenure: '6 yrs',
    rating: 5,
  },
  {
    id: 'p8',
    name: 'Kavya Reddy',
    role: 'Director of Customer Success',
    department: 'Customer Success',
    performance: 'High',
    potential: 'Medium',
    box: 'Core Player',
    readiness: 'Ready Now',
    flightRisk: 'Low',
    successor: 'Vivaan Chopra',
    tenure: '5 yrs',
    rating: 4,
  },
  {
    id: 'p9',
    name: 'Rohan Joshi',
    role: 'Regional Sales Head',
    department: 'Sales',
    performance: 'Medium',
    potential: 'Medium',
    box: 'Solid Performer',
    readiness: 'Ready in 1-2 yrs',
    flightRisk: 'High',
    successor: null,
    tenure: '4 yrs',
    rating: 3,
  },
  {
    id: 'p10',
    name: 'Nisha Agarwal',
    role: 'Director of People Ops',
    department: 'People & Culture',
    performance: 'High',
    potential: 'Medium',
    box: 'Core Player',
    readiness: 'Ready in 1-2 yrs',
    flightRisk: 'Low',
    successor: 'Saanvi Bhatt',
    tenure: '7 yrs',
    rating: 4,
  },
  {
    id: 'p11',
    name: 'Vihaan Nair',
    role: 'Group Product Manager',
    department: 'Product',
    performance: 'Medium',
    potential: 'High',
    box: 'High Potential',
    readiness: 'Ready in 1-2 yrs',
    flightRisk: 'Low',
    successor: null,
    tenure: '3 yrs',
    rating: 4,
  },
  {
    id: 'p12',
    name: 'Ananya Iyer',
    role: 'Senior Data Scientist',
    department: 'Data & AI',
    performance: 'Medium',
    potential: 'Medium',
    box: 'Workhorse',
    readiness: 'Ready in 3+ yrs',
    flightRisk: 'Low',
    successor: null,
    tenure: '3 yrs',
    rating: 3,
  },
];

const CRITICAL_ROLES: CriticalRole[] = [
  {
    id: 'cr1',
    title: 'Chief Technology Officer',
    department: 'Engineering',
    incumbent: 'Ishaan Kapoor',
    criticality: 'Mission Critical',
    riskLevel: 'Medium',
    successors: [
      { name: 'Aarav Mehta', readiness: 'Ready Now', confidence: 82 },
      { name: 'Tanya Sethi', readiness: 'Ready in 1-2 yrs', confidence: 68 },
    ],
  },
  {
    id: 'cr2',
    title: 'VP of Product',
    department: 'Product',
    incumbent: 'Riya Banerjee',
    criticality: 'Mission Critical',
    riskLevel: 'Low',
    successors: [
      { name: 'Vihaan Nair', readiness: 'Ready in 1-2 yrs', confidence: 74 },
    ],
  },
  {
    id: 'cr3',
    title: 'Head of Data & AI',
    department: 'Data & AI',
    incumbent: 'Dhruv Malhotra',
    criticality: 'High',
    riskLevel: 'Low',
    successors: [
      { name: 'Ananya Iyer', readiness: 'Ready in 1-2 yrs', confidence: 66 },
    ],
  },
  {
    id: 'cr4',
    title: 'Regional Sales Head — West',
    department: 'Sales',
    incumbent: '—',
    criticality: 'High',
    riskLevel: 'High',
    successors: [],
    vacantSince: '2026-08-10',
  },
  {
    id: 'cr5',
    title: 'Director of Design',
    department: 'Design',
    incumbent: 'Arjun Verma',
    criticality: 'High',
    riskLevel: 'Medium',
    successors: [
      { name: 'Diya Sharma', readiness: 'Ready in 3+ yrs', confidence: 52 },
    ],
  },
  {
    id: 'cr6',
    title: 'Head of People & Culture',
    department: 'People & Culture',
    incumbent: 'Nisha Agarwal',
    criticality: 'Medium',
    riskLevel: 'Low',
    successors: [],
  },
];

const DEPT_DIST = [
  { name: 'Engineering', value: 3, color: 'hsl(var(--primary))' },
  { name: 'Product', value: 2, color: 'hsl(var(--accent-foreground))' },
  { name: 'Data & AI', value: 2, color: 'hsl(var(--secondary-foreground))' },
  { name: 'Design', value: 1, color: 'hsl(var(--destructive))' },
  { name: 'Finance', value: 1, color: 'hsl(var(--primary))' },
  { name: 'Customer', value: 1, color: 'hsl(var(--accent-foreground))' },
  { name: 'Sales', value: 1, color: 'hsl(var(--accent-foreground))' },
  { name: 'People', value: 1, color: 'hsl(var(--primary))' },
];

const READINESS_DIST = [
  { name: 'Ready Now', value: 6, color: 'hsl(var(--primary))' },
  {
    name: 'Ready 1-2 yrs',
    value: 5,
    color: 'hsl(var(--secondary-foreground))',
  },
  { name: 'Ready 3+ yrs', value: 2, color: 'hsl(var(--accent-foreground))' },
  { name: 'Not Ready', value: 0, color: 'hsl(var(--muted-foreground))' },
];

const COMPETENCY_AVG = [
  { subject: 'Leadership', value: 84, fullMark: 100 },
  { subject: 'Technical', value: 88, fullMark: 100 },
  { subject: 'Communication', value: 76, fullMark: 100 },
  { subject: 'Strategy', value: 74, fullMark: 100 },
  { subject: 'Execution', value: 90, fullMark: 100 },
  { subject: 'Coaching', value: 70, fullMark: 100 },
];

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
const pad = (n: number) => String(n).padStart(2, '0');
const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${pad(d)} ${MONTHS[m - 1]} ${y}`;
};
const initials = (name: string) =>
  name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const AVATAR_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--primary))',
  'hsl(var(--accent-foreground))',
  'hsl(var(--destructive))',
  'hsl(var(--secondary-foreground))',
];
const gridProps = {
  strokeDasharray: '3 3',
  stroke: 'currentColor',
  strokeOpacity: 0.1,
  vertical: false,
};
const axisTick = { fontSize: 11, fill: 'currentColor', opacity: 0.55 };
const cardCls =
  'rounded-xl border border-border bg-card p-5 dark:border-border dark:bg-card';

const PERF_LEVELS: Performance[] = ['Low', 'Medium', 'High'];
const POT_LEVELS: Potential[] = ['Low', 'Medium', 'High'];

type TooltipEntry = {
  dataKey?: string | number;
  value: number;
  color?: string;
  fill?: string;
  name?: string | number;
  payload?: { color?: string; name?: string | number };
};

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const rows = payload.filter(p => p.value > 0);
  if (!rows.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card/95 px-3 py-2 text-xs shadow-lg backdrop-blur dark:border-border dark:bg-muted/95">
      {label && (
        <div className="mb-1 font-semibold text-secondary-foreground dark:text-muted-foreground">
          {label}
        </div>
      )}
      {rows.map(p => (
        <div
          key={p.dataKey ?? p.name}
          className="flex items-center justify-between gap-6 text-secondary-foreground dark:text-muted-foreground"
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

function Avatar({
  name,
  size = 32,
  color,
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  const c = color || AVATAR_COLORS[name.length % AVATAR_COLORS.length];
  return (
    <span
      className="flex flex-shrink-0 items-center justify-center rounded-full font-semibold text-primary-foreground"
      style={{
        width: size,
        height: size,
        background: c,
        fontSize: size * 0.36,
      }}
    >
      {initials(name)}
    </span>
  );
}

function BoxChip({ box }: { box: BoxLabel }) {
  const c = BOX_COLORS[box];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{
        background: `color-mix(in srgb, ${c} 12%, transparent)`,
        color: c,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />
      {box}
    </span>
  );
}

function ReadinessChip({ readiness }: { readiness: string }) {
  const c = READINESS_COLORS[readiness] || 'hsl(var(--muted-foreground))';
  return (
    <span
      className="inline-block rounded-md px-2 py-0.5 text-xs font-semibold"
      style={{
        background: `color-mix(in srgb, ${c} 12%, transparent)`,
        color: c,
      }}
    >
      {readiness}
    </span>
  );
}

function RiskChip({ risk }: { risk: string }) {
  const c = RISK_COLORS[risk] || 'hsl(var(--muted-foreground))';
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{
        background: `color-mix(in srgb, ${c} 12%, transparent)`,
        color: c,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />
      {risk}
    </span>
  );
}

function CriticalityChip({ level }: { level: string }) {
  const c = CRITICALITY_COLORS[level] || 'hsl(var(--muted-foreground))';
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{
        background: `color-mix(in srgb, ${c} 12%, transparent)`,
        color: c,
      }}
    >
      <Shield size={11} /> {level}
    </span>
  );
}

function NineBoxGrid() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {POT_LEVELS.slice()
        .reverse()
        .map(pot =>
          PERF_LEVELS.map(perf => {
            const cell = TALENTS.filter(
              t => t.potential === pot && t.performance === perf
            );
            const box = cell[0]?.box;
            const c = box ? BOX_COLORS[box] : 'hsl(var(--muted-foreground))';
            return (
              <div
                key={`${pot}-${perf}`}
                className="flex min-h-[110px] flex-col rounded-xl border p-3 transition hover:border-primary"
                style={{
                  borderColor: `color-mix(in srgb, ${c} 33%, transparent)`,
                  background: `color-mix(in srgb, ${c} 5%, transparent)`,
                }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold" style={{ color: c }}>
                    {box || '—'}
                  </span>
                  <span className="rounded-md bg-card/70 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-secondary-foreground dark:bg-card/70 dark:text-muted-foreground">
                    {cell.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {cell.slice(0, 3).map(t => (
                    <Avatar key={t.id} name={t.name} size={22} />
                  ))}
                  {cell.length > 3 && (
                    <span className="flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-card px-1.5 text-[10px] font-semibold text-secondary-foreground dark:bg-card dark:text-muted-foreground">
                      +{cell.length - 3}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
    </div>
  );
}

function TalentProfilePanel({
  talent,
  onClose,
}: {
  talent: Talent;
  onClose: () => void;
}) {
  return (
    <div
      className={cardCls}
      role="region"
      aria-label={`Profile of ${talent.name}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-4">
          <Avatar name={talent.name} size={52} />
          <div>
            <div className="text-base font-semibold">{talent.name}</div>
            <div className="text-xs text-muted-foreground dark:text-muted-foreground">
              {talent.role} · {talent.department}
            </div>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-muted-foreground"
          aria-label="Close profile"
        >
          <X size={16} />
        </Button>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <BoxChip box={talent.box} />
        <ReadinessChip readiness={talent.readiness} />
        <RiskChip risk={talent.flightRisk} />
      </div>

      <div className="mb-3 grid grid-cols-2 gap-3 rounded-xl border border-border bg-muted p-4 dark:border-border dark:bg-muted/40 sm:grid-cols-4">
        <div>
          <div className="text-xs text-muted-foreground dark:text-muted-foreground">
            Performance
          </div>
          <div className="mt-0.5 text-sm font-semibold">
            {talent.performance}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground dark:text-muted-foreground">
            Potential
          </div>
          <div className="mt-0.5 text-sm font-semibold">{talent.potential}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground dark:text-muted-foreground">
            Rating
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-sm font-semibold">
            <Star
              size={12}
              className="text-accent-foreground"
              fill="hsl(var(--accent-foreground))"
            />{' '}
            {talent.rating}.0
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground dark:text-muted-foreground">
            Tenure
          </div>
          <div className="mt-0.5 text-sm font-semibold">{talent.tenure}</div>
        </div>
      </div>

      <div className="mb-3 rounded-xl border border-border bg-muted p-4 dark:border-border dark:bg-muted/40">
        <div className="text-xs text-muted-foreground dark:text-muted-foreground">
          Successor
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-sm font-medium">
          {talent.successor ? (
            <>
              <Avatar name={talent.successor} size={20} />
              {talent.successor}
            </>
          ) : (
            <span className="text-muted-foreground">— none identified</span>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 dark:border-primary/40 dark:bg-primary/10">
        <div className="mb-1 flex items-center gap-2 text-xs font-medium text-primary dark:text-primary">
          <TrendingUp size={13} /> Development recommendation
        </div>
        <p className="text-sm text-primary dark:text-primary">
          {talent.box === 'Star' &&
            'Fast-track leadership program. Assign a mentor from the executive team.'}
          {talent.box === 'High Potential' &&
            'Stretch assignment + leadership exposure to accelerate growth.'}
          {talent.box === 'Core Player' &&
            'Deepen expertise and start coaching junior team members.'}
          {talent.box === 'Workhorse' &&
            'Recognize contribution, explore growth interests.'}
          {talent.box === 'Solid Performer' &&
            'Continue consistent delivery, review growth path.'}
          {![
            'Star',
            'High Potential',
            'Core Player',
            'Workhorse',
            'Solid Performer',
          ].includes(talent.box) &&
            'Review with manager and set a 90-day development plan.'}
        </p>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button type="button" variant="destructive" onClick={onClose}>
          Close
        </Button>
        <Button type="button" variant="default">
          <Award size={14} /> Start IDP
        </Button>
      </div>
    </div>
  );
}

const TalentandSuccession: React.FC = () => {
  const DEFAULTS = {
    department: 'all',
    box: 'all',
    readiness: 'all',
    search: '',
  };
  const [form, setForm] = useState(DEFAULTS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const panelRef = useRef<HTMLDivElement | null>(null);

  const set = <K extends keyof typeof DEFAULTS>(
    k: K,
    v: (typeof DEFAULTS)[K]
  ) => setForm(prev => ({ ...prev, [k]: v }));

  const filtered = useMemo(() => {
    const q = form.search.trim().toLowerCase();
    return TALENTS.filter(
      t =>
        (form.department === 'all' || t.department === form.department) &&
        (form.box === 'all' || t.box === form.box) &&
        (form.readiness === 'all' || t.readiness === form.readiness) &&
        (!q ||
          t.name.toLowerCase().includes(q) ||
          t.role.toLowerCase().includes(q))
    );
  }, [form]);

  const selected = selectedId
    ? (TALENTS.find(t => t.id === selectedId) ?? null)
    : null;

  /** Select a talent and smoothly scroll the profile panel into view. */
  const openProfile = (id: string) => {
    setSelectedId(id);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        panelRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    });
  };
  const closeProfile = () => setSelectedId(null);

  const starsCount = TALENTS.filter(t => t.box === 'Star').length;
  const highPotCount = TALENTS.filter(t => t.box === 'High Potential').length;
  const readyNow = TALENTS.filter(t => t.readiness === 'Ready Now').length;
  const atRisk = TALENTS.filter(
    t => t.flightRisk === 'High' || t.flightRisk === 'Medium'
  ).length;
  const vacantCritical = CRITICAL_ROLES.filter(
    r => !r.incumbent || r.incumbent === '—'
  ).length;
  const noSuccessor = CRITICAL_ROLES.filter(
    r => r.successors.length === 0
  ).length;

  const columns = useMemo<ColumnDef<Talent>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Talent',
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <Avatar name={row.original.name} />
            <div className="leading-tight">
              <div className="text-sm font-medium">{row.original.name}</div>
              <div className="text-xs text-muted-foreground dark:text-muted-foreground">
                {row.original.role}
              </div>
            </div>
          </div>
        ),
      },
      { accessorKey: 'department', header: 'Department' },
      {
        accessorKey: 'box',
        header: '9-Box',
        cell: ({ row }) => <BoxChip box={row.original.box} />,
      },
      {
        accessorKey: 'readiness',
        header: 'Readiness',
        cell: ({ row }) => <ReadinessChip readiness={row.original.readiness} />,
      },
      {
        accessorKey: 'flightRisk',
        header: 'Flight Risk',
        cell: ({ row }) => <RiskChip risk={row.original.flightRisk} />,
      },
      {
        accessorKey: 'rating',
        header: 'Rating',
        cell: ({ row }) => (
          <span className="flex items-center gap-1 text-xs">
            <Star
              size={11}
              className="text-accent-foreground"
              fill="hsl(var(--accent-foreground))"
            />
            {row.original.rating}.0
          </span>
        ),
      },
      {
        id: 'go',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => openProfile(row.original.id)}
            className="text-muted-foreground dark:text-muted-foreground"
            aria-label="View profile"
          >
            <ChevronRight size={15} />
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <div className="min-h-screen space-y-4  p-1 text-foreground  dark:text-muted-foreground">
      <Section
        title="Talent & Succession"
        menuId="talent-succession"
        showBreadcrumbs
      >
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary dark:text-primary">
              <GraduationCap size={13} /> Performance & Growth
            </div>
            <p className="text-xs text-muted-foreground dark:text-muted-foreground">
              9-box grid, high-potential pipeline and critical role succession
              planning
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <FormField
            label="Department"
            name="department"
            type="select"
            value={form.department}
            onChange={v => set('department', v)}
            options={talentDepartmentFilterOptions}
          />
          <FormField
            label="9-Box"
            name="box"
            type="select"
            value={form.box}
            onChange={v => set('box', v)}
            options={talentBoxFilterOptions}
          />
          <FormField
            label="Readiness"
            name="readiness"
            type="select"
            value={form.readiness}
            onChange={v => set('readiness', v)}
            options={talentReadinessFilterOptions}
          />
          <FormField
            label="Search"
            name="search"
            type="text"
            value={form.search}
            onChange={v => set('search', v)}
            placeholder="Name or role..."
          />
          <div className="flex lg:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setForm(DEFAULTS)}
            >
              <RotateCcw size={14} /> Reset
            </Button>
          </div>
        </div>
      </Section>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {[
          {
            label: 'Stars',
            value: starsCount,
            hint: 'High × High performers',
            color: 'hsl(var(--primary))',
            icon: Crown,
          },
          {
            label: 'High potential',
            value: highPotCount,
            hint: 'Future leaders',
            color: 'hsl(var(--accent-foreground))',
            icon: Zap,
          },
          {
            label: 'Ready now',
            value: readyNow,
            hint: 'Promotion-ready',
            color: 'hsl(var(--primary))',
            icon: UserCheck,
          },
          {
            label: 'Flight risk',
            value: atRisk,
            hint: 'Medium + high',
            color: 'hsl(var(--destructive))',
            icon: AlertTriangle,
          },
          {
            label: 'Critical gaps',
            value: noSuccessor,
            hint: `${vacantCritical} vacant role(s)`,
            color: 'hsl(var(--accent-foreground))',
            icon: Shield,
          },
        ].map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className={cardCls}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground dark:text-muted-foreground">
                  {k.label}
                </span>
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{
                    background: `color-mix(in srgb, ${k.color} 12%, transparent)`,
                    color: k.color,
                  }}
                >
                  <Icon size={14} />
                </span>
              </div>
              <div className="mt-2 text-2xl font-semibold tabular-nums">
                {k.value}
              </div>
              <div className="mt-0.5 truncate text-xs text-muted-foreground dark:text-muted-foreground">
                {k.hint}
              </div>
            </div>
          );
        })}
      </div>

      {/* Inline profile panel — wrapped so we can smooth-scroll to it */}
      <div ref={panelRef} className="scroll-mt-6">
        {selected && (
          <TalentProfilePanel talent={selected} onClose={closeProfile} />
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className={`${cardCls} xl:col-span-2`}>
          <h3 className="text-sm font-semibold">Talent by department</h3>
          <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
            Where our high-potential talent sits
          </p>
          <div className="mt-3 text-foreground dark:text-muted-foreground">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={DEPT_DIST}
                margin={{ top: 8, right: 8, bottom: 0, left: -20 }}
              >
                <CartesianGrid {...gridProps} />
                <XAxis
                  dataKey="name"
                  tick={axisTick}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
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
                <Bar
                  dataKey="value"
                  name="Talent"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                >
                  {DEPT_DIST.map(d => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="top"
                    style={{ fontSize: 11, fill: 'currentColor', opacity: 0.7 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={cardCls}>
          <h3 className="text-sm font-semibold">Readiness pipeline</h3>
          <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
            Succession readiness
          </p>
          <div className="mt-2">
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie
                  data={READINESS_DIST}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={54}
                  outerRadius={80}
                  paddingAngle={3}
                  cornerRadius={4}
                  stroke="none"
                >
                  {READINESS_DIST.map(r => (
                    <Cell key={r.name} fill={r.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div role="list" className="mt-2 space-y-1.5">
            {READINESS_DIST.map(r => (
              <div
                key={r.name}
                role="listitem"
                className="flex items-center justify-between text-xs"
              >
                <span className="flex items-center gap-2 text-secondary-foreground dark:text-muted-foreground">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: r.color }}
                  />
                  {r.name}
                </span>
                <span className="font-medium tabular-nums">{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={cardCls}>
          <h3 className="text-sm font-semibold">Competency average</h3>
          <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
            Across all talent
          </p>
          <div className="mt-2 text-foreground dark:text-muted-foreground">
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={COMPETENCY_AVG} outerRadius="72%">
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.7 }}
                />
                <Radar
                  name="Avg score"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.28}
                />
                <Tooltip content={<ChartTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${cardCls} xl:col-span-2`}>
          <h3 className="text-sm font-semibold">9-box talent grid</h3>
          <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
            Performance (x-axis) vs potential (y-axis)
          </p>
          <div className="mt-3">
            <NineBoxGrid />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground dark:text-muted-foreground">
            <span>
              <ArrowLeft className="w-4 h-4 font-bold" />
            </span>
            <span>
              <ArrowRight className="w-4 h-4 font-bold" />
            </span>
          </div>
        </div>
      </div>

      {/* Critical roles */}
      <Section
        title="Critical roles & succession pipeline"
        menuId="talent-critical-roles"
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {CRITICAL_ROLES.map(c => {
            const critC = CRITICALITY_COLORS[c.criticality];
            return (
              <div
                key={c.id}
                className="rounded-xl border border-border bg-card p-5 transition hover:border-primary dark:border-border dark:bg-card dark:hover:border-primary"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <CriticalityChip level={c.criticality} />
                      <RiskChip risk={c.riskLevel} />
                    </div>
                    <h3 className="mt-2 text-sm font-semibold">{c.title}</h3>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                      {c.department}
                    </p>
                  </div>
                  <span
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: `color-mix(in srgb, ${critC} 12%, transparent)`,
                      color: critC,
                    }}
                  >
                    <Target size={16} />
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground dark:text-muted-foreground">
                  {c.incumbent === '—' ? (
                    <>
                      <AlertTriangle size={12} className="text-destructive" />
                      <span className="font-medium text-destructive">
                        Vacant
                      </span>
                      {c.vacantSince && (
                        <span className="opacity-60">
                          · since {fmtDate(c.vacantSince)}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <Users size={12} /> Incumbent:
                      <span className="font-medium text-secondary-foreground dark:text-muted-foreground">
                        {c.incumbent}
                      </span>
                    </>
                  )}
                </div>

                {c.successors.length > 0 ? (
                  <div className="mt-4 space-y-2 border-t border-border pt-4 dark:border-border">
                    <div className="text-xs font-medium text-muted-foreground dark:text-muted-foreground">
                      SUCCESSORS ({c.successors.length})
                    </div>
                    {c.successors.map(s => (
                      <div
                        key={s.name}
                        className="flex items-center gap-3 rounded-lg border border-border bg-muted p-2.5 dark:border-border dark:bg-muted/40"
                      >
                        <Avatar name={s.name} size={28} />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">
                            {s.name}
                          </div>
                          <div className="text-xs text-muted-foreground dark:text-muted-foreground">
                            {s.readiness}
                          </div>
                        </div>
                        <div className="w-24 text-right">
                          <div className="text-xs font-semibold tabular-nums">
                            {s.confidence}%
                          </div>
                          <div className="mt-1 h-1 rounded-full bg-muted dark:bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${s.confidence}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive dark:border-destructive/40 dark:bg-destructive/10 dark:text-destructive">
                    <AlertTriangle size={13} /> No successor identified —
                    critical gap
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* View toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">
          {filtered.length} {filtered.length === 1 ? 'person' : 'people'}
        </h3>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1 dark:border-border dark:bg-card">
          <Button
            type="button"
            variant={view === 'cards' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('cards')}
            className="text-xs"
          >
            Cards
          </Button>
          <Button
            type="button"
            variant={view === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('table')}
            className="text-xs"
          >
            Table
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          className={`${cardCls} flex flex-col items-center py-14 text-center`}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground dark:bg-muted">
            <SearchX size={22} />
          </span>
          <h3 className="mt-4 text-sm font-semibold">No talent found</h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground dark:text-muted-foreground">
            Try a different filter or clear the search.
          </p>
        </div>
      ) : view === 'cards' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(t => (
            <div
              key={t.id}
              className={`flex flex-col gap-3 rounded-xl border bg-card p-5 transition-all duration-300 dark:bg-card ${
                selectedId === t.id
                  ? 'border-primary ring-2 ring-primary/40'
                  : 'border-border hover:border-primary dark:border-border dark:hover:border-primary'
              }`}
            >
              <div className="flex items-start gap-3">
                <Avatar name={t.name} size={44} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{t.name}</div>
                  <div className="truncate text-xs text-muted-foreground dark:text-muted-foreground">
                    {t.role}
                  </div>
                </div>
                <BoxChip box={t.box} />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <ReadinessChip readiness={t.readiness} />
                <RiskChip risk={t.flightRisk} />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border bg-muted p-2.5 text-xs dark:border-border dark:bg-muted/40">
                <div className="flex items-center gap-1">
                  <Star
                    size={11}
                    className="text-accent-foreground"
                    fill="hsl(var(--accent-foreground))"
                  />
                  <span className="font-medium tabular-nums">{t.rating}.0</span>
                </div>
                <span className="text-muted-foreground dark:text-muted-foreground">
                  {t.department}
                </span>
                <span className="text-muted-foreground dark:text-muted-foreground">
                  {t.tenure}
                </span>
              </div>

              {t.successor && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-muted-foreground">
                  <Users size={12} /> Successor:{' '}
                  <span className="font-medium text-secondary-foreground dark:text-muted-foreground">
                    {t.successor}
                  </span>
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={() => openProfile(t.id)}
                className="mt-1 w-full"
              >
                View profile <ChevronRight size={14} />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <Section title="All talent">
          <TanStackTable
            showDownload={true}
            key={JSON.stringify(form)}
            data={filtered}
            columns={columns}
            searchPlaceholder="Search talent..."
            pageSize={10}
            enableColumnVisibility
            enableRowSelection={false}
          />
        </Section>
      )}
    </div>
  );
};

export default TalentandSuccession;
