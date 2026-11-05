import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
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
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock,
  Flag,
  History,
  Pencil,
  Plus,
  RotateCcw,
  SearchX,
  Target,
  Trash2,
  Zap,
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { toast } from 'sonner';
import { TanStackTable } from '@/components/common';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  goalsOkrsLevelFilterOptions,
  goalsOkrsLevelOptions,
  goalsOkrsQuarterOptions,
  goalsOkrsSortOptions,
  goalsOkrsStatusFilterOptions,
  goalsOkrsStatusOptions,
} from '@/data/reusableDropdownData';

type OKRStatus =
  | 'On Track'
  | 'At Risk'
  | 'Off Track'
  | 'Completed'
  | 'Not Started';
type GoalType = 'Company' | 'Department' | 'Team' | 'Individual';
type Quarter = string; // e.g. "Q4 2026"

interface KeyResult {
  id: string;
  title: string;
  start: number;
  target: number;
  current: number;
  unit: string;
}

interface CheckIn {
  id: string;
  date: string;
  note: string;
  author: string;
  progress: number;
  status: OKRStatus;
}

interface Objective {
  id: string;
  title: string;
  owner: string;
  ownerRole: string;
  type: GoalType;
  quarter: Quarter;
  status: OKRStatus;
  dueDate: string;
  keyResults: KeyResult[];
  checkIns: CheckIn[];
}

interface KRView extends KeyResult {
  pct: number;
}
interface ObjectiveView extends Omit<Objective, 'keyResults'> {
  keyResults: KRView[];
  progress: number;
  expected: number;
}

const STATUS_COLORS: Record<OKRStatus, string> = {
  'On Track': 'hsl(var(--primary))',
  'At Risk': 'hsl(var(--accent-foreground))',
  'Off Track': 'hsl(var(--destructive))',
  Completed: 'hsl(var(--primary))',
  'Not Started': 'hsl(var(--muted-foreground))',
};
const TYPE_COLORS: Record<GoalType, string> = {
  Company: 'hsl(var(--primary))',
  Department: 'hsl(var(--accent-foreground))',
  Team: 'hsl(var(--secondary-foreground))',
  Individual: 'hsl(var(--destructive))',
};
const STATUSES = goalsOkrsStatusOptions.map(
  option => option.value as OKRStatus
);
const TYPES = goalsOkrsLevelOptions.map(option => option.value as GoalType);
const QUARTERS = goalsOkrsQuarterOptions.map(option => option.value as Quarter);
const RISK_ORDER: Record<OKRStatus, number> = {
  'Off Track': 0,
  'At Risk': 1,
  'Not Started': 2,
  'On Track': 3,
  Completed: 4,
};

const SEED: Objective[] = [
  {
    id: 'o1',
    title: 'Reach ₹85 Cr annual recurring revenue by year end',
    owner: 'Anita Deshmukh',
    ownerRole: 'Chief Executive Officer',
    type: 'Company',
    quarter: 'Q4 2026',
    status: 'On Track',
    dueDate: '2026-12-31',
    keyResults: [
      {
        id: 'k1',
        title: 'Close new enterprise accounts',
        start: 0,
        target: 24,
        current: 7,
        unit: 'accounts',
      },
      {
        id: 'k2',
        title: 'Net revenue retention',
        start: 104,
        target: 118,
        current: 109,
        unit: '%',
      },
      {
        id: 'k3',
        title: 'Operate in additional states',
        start: 6,
        target: 9,
        current: 7,
        unit: 'states',
      },
    ],
    checkIns: [
      {
        id: 'c1',
        date: '2026-10-09',
        author: 'Anita Deshmukh',
        note: 'Three enterprise contracts signed in Pune and Indore. Pipeline for November looks healthy.',
        progress: 25,
        status: 'On Track',
      },
      {
        id: 'c2',
        date: '2026-10-02',
        author: 'Anita Deshmukh',
        note: 'Quarter kicked off with renewals of the top 10 accounts.',
        progress: 14,
        status: 'On Track',
      },
    ],
  },
  {
    id: 'o2',
    title: 'Ship the v3 platform with 99.95% reliability',
    owner: 'Rohan Kulkarni',
    ownerRole: 'VP Engineering',
    type: 'Department',
    quarter: 'Q4 2026',
    status: 'At Risk',
    dueDate: '2026-12-15',
    keyResults: [
      {
        id: 'k1',
        title: 'v3 general availability release',
        start: 0,
        target: 1,
        current: 0,
        unit: 'release',
      },
      {
        id: 'k2',
        title: 'Open P1 bugs',
        start: 18,
        target: 3,
        current: 11,
        unit: 'bugs',
      },
      {
        id: 'k3',
        title: 'API uptime',
        start: 99.5,
        target: 99.95,
        current: 99.82,
        unit: '%',
      },
    ],
    checkIns: [
      {
        id: 'c3',
        date: '2026-10-12',
        author: 'Rohan Kulkarni',
        note: 'Payments service migration slipped by a week. Adding two engineers to the bug burn-down.',
        progress: 39,
        status: 'At Risk',
      },
    ],
  },
  {
    id: 'o3',
    title: 'Build a predictable inbound pipeline',
    owner: 'Meera Joshi',
    ownerRole: 'Head of Marketing',
    type: 'Department',
    quarter: 'Q4 2026',
    status: 'On Track',
    dueDate: '2026-12-20',
    keyResults: [
      {
        id: 'k1',
        title: 'Marketing-qualified leads per month',
        start: 900,
        target: 1800,
        current: 1120,
        unit: 'leads',
      },
      {
        id: 'k2',
        title: 'Cost per qualified lead',
        start: 1450,
        target: 950,
        current: 1380,
        unit: '₹',
      },
      {
        id: 'k3',
        title: 'Webinar registrations',
        start: 0,
        target: 3000,
        current: 840,
        unit: 'signups',
      },
    ],
    checkIns: [],
  },
  {
    id: 'o4',
    title: 'Reduce attrition and lift engineering engagement',
    owner: 'Sneha Reddy',
    ownerRole: 'HR Head',
    type: 'Team',
    quarter: 'Q4 2026',
    status: 'At Risk',
    dueDate: '2026-12-31',
    keyResults: [
      {
        id: 'k1',
        title: 'Annualised attrition',
        start: 16,
        target: 9,
        current: 14,
        unit: '%',
      },
      {
        id: 'k2',
        title: 'Employee NPS',
        start: 22,
        target: 45,
        current: 28,
        unit: 'pts',
      },
      {
        id: 'k3',
        title: 'Internal promotions',
        start: 0,
        target: 10,
        current: 2,
        unit: 'people',
      },
    ],
    checkIns: [
      {
        id: 'c4',
        date: '2026-10-05',
        author: 'Sneha Reddy',
        note: 'Pulse survey launched. Stay interviews scheduled for senior engineers.',
        progress: 24,
        status: 'At Risk',
      },
    ],
  },
  {
    id: 'o5',
    title: 'Grow into a system design lead',
    owner: 'Ashutosh Patil',
    ownerRole: 'Jr. Software Engineer',
    type: 'Individual',
    quarter: 'Q4 2026',
    status: 'On Track',
    dueDate: '2026-12-31',
    keyResults: [
      {
        id: 'k1',
        title: 'Finish system design course',
        start: 0,
        target: 100,
        current: 34,
        unit: '%',
      },
      {
        id: 'k2',
        title: 'Lead design reviews',
        start: 0,
        target: 3,
        current: 1,
        unit: 'reviews',
      },
      {
        id: 'k3',
        title: 'AWS Solutions Architect certification',
        start: 0,
        target: 1,
        current: 0,
        unit: 'cert',
      },
    ],
    checkIns: [],
  },
  {
    id: 'o6',
    title: 'Raise customer satisfaction and cut churn',
    owner: 'Kavita Rao',
    ownerRole: 'Customer Success Lead',
    type: 'Team',
    quarter: 'Q4 2026',
    status: 'On Track',
    dueDate: '2026-12-18',
    keyResults: [
      {
        id: 'k1',
        title: 'Customer satisfaction (CSAT)',
        start: 4.1,
        target: 4.6,
        current: 4.3,
        unit: '/ 5',
      },
      {
        id: 'k2',
        title: 'Churned accounts',
        start: 14,
        target: 6,
        current: 12,
        unit: 'accounts',
      },
      {
        id: 'k3',
        title: 'Average onboarding time',
        start: 21,
        target: 10,
        current: 17,
        unit: 'days',
      },
    ],
    checkIns: [],
  },
  {
    id: 'o7',
    title: 'Tighten cash discipline across receivables',
    owner: 'Imran Sheikh',
    ownerRole: 'Chief Financial Officer',
    type: 'Department',
    quarter: 'Q4 2026',
    status: 'Off Track',
    dueDate: '2026-12-22',
    keyResults: [
      {
        id: 'k1',
        title: 'Days sales outstanding',
        start: 68,
        target: 45,
        current: 66,
        unit: 'days',
      },
      {
        id: 'k2',
        title: 'Overdue receivables',
        start: 4.2,
        target: 1.5,
        current: 4.0,
        unit: '₹ Cr',
      },
      {
        id: 'k3',
        title: 'Budget variance',
        start: 12,
        target: 3,
        current: 11,
        unit: '%',
      },
    ],
    checkIns: [
      {
        id: 'c5',
        date: '2026-10-10',
        author: 'Imran Sheikh',
        note: 'Two large customers delayed payment cycles. Escalation plan agreed with sales.',
        progress: 9,
        status: 'Off Track',
      },
    ],
  },
  {
    id: 'o8',
    title: 'Expand into Pune and Hyderabad',
    owner: 'Anita Deshmukh',
    ownerRole: 'Chief Executive Officer',
    type: 'Company',
    quarter: 'Q3 2026',
    status: 'Completed',
    dueDate: '2026-09-30',
    keyResults: [
      {
        id: 'k1',
        title: 'Offices opened',
        start: 0,
        target: 2,
        current: 2,
        unit: 'offices',
      },
      {
        id: 'k2',
        title: 'Local hires onboarded',
        start: 0,
        target: 40,
        current: 43,
        unit: 'people',
      },
    ],
    checkIns: [],
  },
  {
    id: 'o9',
    title: 'Cut cloud cost per customer without hurting performance',
    owner: 'Rohan Kulkarni',
    ownerRole: 'VP Engineering',
    type: 'Department',
    quarter: 'Q3 2026',
    status: 'At Risk',
    dueDate: '2026-09-30',
    keyResults: [
      {
        id: 'k1',
        title: 'Monthly cloud cost per customer',
        start: 4200,
        target: 3000,
        current: 3350,
        unit: '₹',
      },
      {
        id: 'k2',
        title: 'p95 API latency',
        start: 480,
        target: 350,
        current: 372,
        unit: 'ms',
      },
    ],
    checkIns: [],
  },
  {
    id: 'o10',
    title: 'Establish thought leadership in logistics tech',
    owner: 'Meera Joshi',
    ownerRole: 'Head of Marketing',
    type: 'Department',
    quarter: 'Q2 2026',
    status: 'Completed',
    dueDate: '2026-06-30',
    keyResults: [
      {
        id: 'k1',
        title: 'Published research reports',
        start: 0,
        target: 3,
        current: 3,
        unit: 'reports',
      },
      {
        id: 'k2',
        title: 'Speaking slots at industry events',
        start: 0,
        target: 4,
        current: 5,
        unit: 'events',
      },
    ],
    checkIns: [],
  },
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
const todayISO = () => {
  const t = new Date();
  return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
};
const initials = (name: string) =>
  name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
const fmtNum = (n: number) =>
  Number.isInteger(n) ? n.toLocaleString('en-IN') : String(+n.toFixed(2));
const clamp = (n: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, n));

const krPct = (k: KeyResult) => {
  const span = k.target - k.start;
  return span === 0
    ? 0
    : Math.round(clamp(((k.current - k.start) / span) * 100));
};

const expectedPace = (q: Quarter) => {
  const [qs, ys] = q.split(' ');
  const n = Number(qs.slice(1));
  const y = Number(ys);
  const start = new Date(y, (n - 1) * 3, 1).getTime();
  const end = new Date(y, n * 3, 1).getTime();
  return Math.round(clamp(((Date.now() - start) / (end - start)) * 100));
};

const currentQuarter = (): Quarter => {
  const t = new Date();
  const q = `Q${Math.floor(t.getMonth() / 3) + 1} ${t.getFullYear()}`;
  return QUARTERS.includes(q) ? q : 'Q4 2026';
};

const suggestStatus = (progress: number, expected: number): OKRStatus => {
  if (progress >= 100) return 'Completed';
  if (progress === 0 && expected < 5) return 'Not Started';
  const ratio = expected === 0 ? 1 : progress / expected;
  return ratio >= 0.9 ? 'On Track' : ratio >= 0.6 ? 'At Risk' : 'Off Track';
};

const enrich = (o: Objective): ObjectiveView => {
  const keyResults = o.keyResults.map(k => ({ ...k, pct: krPct(k) }));
  const progress = keyResults.length
    ? Math.round(keyResults.reduce((s, k) => s + k.pct, 0) / keyResults.length)
    : 0;
  return { ...o, keyResults, progress, expected: expectedPace(o.quarter) };
};

const gridProps = {
  strokeDasharray: '3 3',
  stroke: 'currentColor',
  strokeOpacity: 0.1,
  vertical: false,
};
const axisTick = { fontSize: 11, fill: 'currentColor', opacity: 0.55 };
const cardCls =
  'rounded-2xl border border-border bg-card p-5 shadow-sm dark:border-border dark:bg-card';
const iconBtn =
  'rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-primary-foreground';

type TooltipEntry = {
  dataKey?: string | number;
  value: number;
  color?: string;
  fill?: string;
  name?: string | number;
  payload?: { color?: string; fill?: string; name?: string | number };
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
  return (
    <div className="rounded-lg border border-border bg-card/95 px-3 py-2 text-xs shadow-lg backdrop-blur dark:border-border dark:bg-muted/95">
      {label && (
        <div className="mb-1 font-semibold text-secondary-foreground dark:text-muted-foreground">
          {label}
        </div>
      )}
      {payload.map(p => (
        <div
          key={p.dataKey ?? p.name}
          className="flex items-center justify-between gap-6 text-secondary-foreground dark:text-muted-foreground"
        >
          <span className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{
                background:
                  p.color || p.fill || p.payload?.color || p.payload?.fill,
              }}
            />
            {p.name ?? p.payload?.name}
          </span>
          <span className="font-semibold tabular-nums text-foreground dark:text-primary-foreground">
            {p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

const AVATAR_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--primary))',
  'hsl(var(--accent-foreground))',
  'hsl(var(--destructive))',
  'hsl(var(--secondary-foreground))',
  'hsl(var(--accent-foreground))',
];
function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  const bg = AVATAR_COLORS[name.length % AVATAR_COLORS.length];
  return (
    <span
      className="flex flex-shrink-0 items-center justify-center rounded-full font-semibold text-primary-foreground"
      style={{
        width: size,
        height: size,
        background: bg,
        fontSize: size * 0.38,
      }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}

function StatusChip({ status }: { status: OKRStatus }) {
  const c = STATUS_COLORS[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{
        background: `color-mix(in srgb, ${c} 10%, transparent)`,
        color: c,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />
      {status}
    </span>
  );
}

function TypeChip({ type }: { type: GoalType }) {
  const c = TYPE_COLORS[type];
  return (
    <span
      className="inline-block rounded-md px-2 py-0.5 text-xs font-semibold"
      style={{
        background: `color-mix(in srgb, ${c} 10%, transparent)`,
        color: c,
      }}
    >
      {type}
    </span>
  );
}

function ProgressRing({
  value,
  size = 64,
  stroke = 6,
  color = 'hsl(var(--primary))',
  label,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (clamp(value) / 100) * c;
  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label ?? 'Progress'} ${value}%`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="currentColor"
          strokeOpacity={0.1}
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center font-semibold tabular-nums"
        style={{ fontSize: size * 0.24 }}
      >
        {value}%
      </div>
    </div>
  );
}

function PaceBar({
  pct,
  expected,
  color,
}: {
  pct: number;
  expected: number;
  color: string;
}) {
  return (
    <div className="relative mt-1.5 h-2 rounded-full bg-muted dark:bg-muted">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: color }}
      />
      <span
        className="absolute -top-0.5 h-3 w-0.5 rounded bg-card/60 dark:bg-card/70"
        style={{ left: `${expected}%` }}
        title={`Expected pace: ${expected}%`}
      />
    </div>
  );
}

function Modal({
  title,
  subtitle,
  onClose,
  children,
  footer,
  wide,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <Dialog open onOpenChange={open => !open && onClose()}>
      <DialogContent
        className={`flex max-h-[92vh] w-full flex-col overflow-hidden p-0 ${wide ? 'sm:max-w-2xl' : 'sm:max-w-md'}`}
        onInteractOutside={event => event.preventDefault()}
      >
        <DialogHeader className="border-b px-5 py-4">
          <DialogTitle>{title}</DialogTitle>
          {subtitle && <DialogDescription>{subtitle}</DialogDescription>}
        </DialogHeader>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <DialogFooter className="border-t px-5 py-3">{footer}</DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface KRDraft {
  id: string;
  title: string;
  start: string;
  current: string;
  target: string;
  unit: string;
}
const blankKR = (): KRDraft => ({
  id: `k${Math.random().toString(36).slice(2, 8)}`,
  title: '',
  start: '0',
  current: '0',
  target: '',
  unit: '',
});

function ObjectiveFormModal({
  initial,
  defaultQuarter,
  onSave,
  onClose,
}: {
  initial: Objective | null;
  defaultQuarter: Quarter;
  onSave: (o: Objective) => void;
  onClose: () => void;
}) {
  const [d, setD] = useState({
    title: initial?.title ?? '',
    owner: initial?.owner ?? '',
    ownerRole: initial?.ownerRole ?? '',
    type: (initial?.type ?? 'Team') as GoalType,
    quarter: initial?.quarter ?? defaultQuarter,
    dueDate: initial?.dueDate ?? '',
    status: (initial?.status ?? 'Not Started') as OKRStatus,
  });
  const [krs, setKrs] = useState<KRDraft[]>(
    initial
      ? initial.keyResults.map(k => ({
          id: k.id,
          title: k.title,
          start: String(k.start),
          current: String(k.current),
          target: String(k.target),
          unit: k.unit,
        }))
      : [blankKR()]
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const up = (k: keyof typeof d, v: string) => setD(p => ({ ...p, [k]: v }));
  const upKR = (id: string, k: keyof KRDraft, v: string) =>
    setKrs(p => p.map(x => (x.id === id ? { ...x, [k]: v } : x)));

  const submit = () => {
    const e: Record<string, string> = {};
    if (!d.title.trim()) e.title = 'Describe what you want to achieve.';
    if (!d.owner.trim()) e.owner = 'Add an owner.';
    if (!d.dueDate) e.dueDate = 'Pick a due date.';
    if (!krs.length) e.krs = 'Add at least one key result.';
    krs.forEach(k => {
      if (!k.title.trim()) e[`t${k.id}`] = 'Name this key result.';
      if (k.target === '' || isNaN(Number(k.target)))
        e[`g${k.id}`] = 'Set a target.';
      else if (Number(k.target) === Number(k.start || 0))
        e[`g${k.id}`] = 'Target must differ from start.';
    });
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave({
      id: initial?.id ?? `o${Date.now()}`,
      title: d.title.trim(),
      owner: d.owner.trim(),
      ownerRole: d.ownerRole.trim() || 'Team member',
      type: d.type,
      quarter: d.quarter,
      dueDate: d.dueDate,
      status: d.status,
      checkIns: initial?.checkIns ?? [],
      keyResults: krs.map(k => ({
        id: k.id,
        title: k.title.trim(),
        start: Number(k.start || 0),
        current: Number(k.current || 0),
        target: Number(k.target),
        unit: k.unit.trim(),
      })),
    });
  };

  const err = (key: string) =>
    errors[key] && (
      <p className="mt-1 text-xs text-destructive">{errors[key]}</p>
    );

  return (
    <Modal
      wide
      title={initial ? 'Edit objective' : 'New objective'}
      subtitle="An objective says what you want; key results prove you got there."
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="destructive" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="default" onClick={submit}>
            {initial ? 'Save changes' : 'Create objective'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField
          label="Objective"
          name="objective-title"
          value={d.title}
          onChange={value => up('title', value)}
          placeholder="e.g. Reduce support response time for enterprise customers"
          error={errors.title}
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <FormField
            label="Owner"
            name="objective-owner"
            value={d.owner}
            onChange={value => up('owner', value)}
            placeholder="Full name"
            error={errors.owner}
          />
          <FormField
            label="Role"
            name="objective-role"
            value={d.ownerRole}
            onChange={value => up('ownerRole', value)}
            placeholder="e.g. Product Manager"
          />
          <FormField
            label="Level"
            name="objective-level"
            type="select"
            value={d.type}
            onChange={value => up('type', value as GoalType)}
            options={goalsOkrsLevelOptions}
          />
          <FormField
            label="Quarter"
            name="objective-quarter"
            type="select"
            value={d.quarter}
            onChange={value => up('quarter', value)}
            options={goalsOkrsQuarterOptions}
          />
          <FormField
            label="Due date"
            name="objective-due-date"
            type="date"
            value={d.dueDate}
            onChange={value => up('dueDate', value)}
            error={errors.dueDate}
          />
          <FormField
            label="Status"
            name="objective-status"
            type="select"
            value={d.status}
            onChange={value => up('status', value as OKRStatus)}
            options={goalsOkrsStatusOptions}
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold">Key results</span>
            <Button
              type="button"
              variant="default"
              onClick={() => setKrs(p => [...p, blankKR()])}
              className="text-xs font-medium "
            >
              <Plus className="h-4 w-4" /> Add key result
            </Button>
          </div>
          {err('krs')}
          <div className="space-y-3">
            {krs.map((k, i) => (
              <div
                key={k.id}
                className="rounded-xl border border-border p-3 dark:border-border"
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <FormField
                      label={`Key result ${i + 1}`}
                      name={`key-result-${k.id}-title`}
                      value={k.title}
                      onChange={value => upKR(k.id, 'title', value)}
                      placeholder="Measurable outcome, e.g. Reduce first response time"
                      error={errors[`t${k.id}`]}
                    />
                  </div>
                  {krs.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={iconBtn}
                      aria-label="Remove key result"
                      onClick={() => setKrs(p => p.filter(x => x.id !== k.id))}
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {(['start', 'current', 'target'] as const).map(f => (
                    <div key={f}>
                      <FormField
                        label={
                          f === 'start'
                            ? 'Starts at'
                            : f === 'current'
                              ? 'Now'
                              : 'Target'
                        }
                        name={`key-result-${k.id}-${f}`}
                        type="number"
                        step="any"
                        value={k[f]}
                        onChange={value => upKR(k.id, f, value)}
                      />
                    </div>
                  ))}
                  <div>
                    <FormField
                      label="Unit"
                      name={`key-result-${k.id}-unit`}
                      value={k.unit}
                      onChange={value => upKR(k.id, 'unit', value)}
                      placeholder="%, days…"
                    />
                  </div>
                </div>
                {err(`g${k.id}`)}
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground dark:text-muted-foreground">
            Lower-is-better goals work too: set the target below the starting
            value.
          </p>
        </div>
      </div>
    </Modal>
  );
}

function CheckInModal({
  obj,
  onSave,
  onClose,
}: {
  obj: ObjectiveView;
  onSave: (
    id: string,
    values: Record<string, number>,
    status: OKRStatus,
    note: string
  ) => void;
  onClose: () => void;
}) {
  const [vals, setVals] = useState<Record<string, string>>(
    Object.fromEntries(obj.keyResults.map(k => [k.id, String(k.current)]))
  );
  const [note, setNote] = useState('');
  const numeric = Object.fromEntries(
    obj.keyResults.map(k => [
      k.id,
      vals[k.id] === '' || isNaN(Number(vals[k.id]))
        ? k.current
        : Number(vals[k.id]),
    ])
  );
  const progress = Math.round(
    obj.keyResults.reduce(
      (s, k) => s + krPct({ ...k, current: numeric[k.id] }),
      0
    ) / Math.max(1, obj.keyResults.length)
  );
  const suggested = suggestStatus(progress, obj.expected);
  const [status, setStatus] = useState<OKRStatus>(obj.status);
  const [touched, setTouched] = useState(false);
  const effective = touched ? status : suggested;

  return (
    <Modal
      wide
      title="Weekly check-in"
      subtitle={obj.title}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="destructive" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={() => onSave(obj.id, numeric, effective, note.trim())}
          >
            Save check-in
          </Button>
        </>
      }
    >
      <div className="flex items-center gap-4 rounded-xl bg-muted p-3 dark:bg-muted/50">
        <ProgressRing
          value={progress}
          size={56}
          color={STATUS_COLORS[effective]}
        />
        <div className="text-xs text-secondary-foreground dark:text-muted-foreground">
          <div className="text-sm font-semibold text-foreground dark:text-muted-foreground">
            {progress >= obj.expected ? 'Ahead of pace' : 'Behind pace'} ·{' '}
            {Math.abs(progress - obj.expected)} pts
          </div>
          Progress is {progress}% and the quarter is {obj.expected}% elapsed.
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {obj.keyResults.map(k => {
          const pct = krPct({ ...k, current: numeric[k.id] });
          const lo = Math.min(k.start, k.target);
          const hi = Math.max(k.start, k.target);
          return (
            <div key={k.id}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium">{k.title}</span>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {pct}%
                </span>
              </div>
              <FormField
                label={`${k.title} progress`}
                name={`check-in-${k.id}`}
                type="number"
                min={String(lo)}
                max={String(hi)}
                step="any"
                value={vals[k.id]}
                onChange={value => setVals(p => ({ ...p, [k.id]: value }))}
                hint={`Target ${fmtNum(k.target)} ${k.unit}`}
              />
            </div>
          );
        })}
        <div>
          <FormField
            label="Status"
            name="check-in-status"
            type="select"
            value={effective}
            onChange={value => {
              setTouched(true);
              setStatus(value as OKRStatus);
            }}
            options={goalsOkrsStatusOptions}
            hint={!touched ? 'Suggested from your progress' : undefined}
          />
        </div>
        <div className="sm:col-span-2">
          <FormField
            label="What changed since the last check-in?"
            name="check-in-note"
            type="textarea"
            rows={3}
            value={note}
            onChange={setNote}
            placeholder="Wins, blockers, and what you need from others"
          />
        </div>
      </div>
    </Modal>
  );
}

function ObjectiveCard({
  obj,
  expanded,
  onToggle,
  onEdit,
  onCheckIn,
  onDelete,
}: {
  obj: ObjectiveView;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onCheckIn: () => void;
  onDelete: () => void;
}) {
  const color = STATUS_COLORS[obj.status];
  const overdue = obj.status !== 'Completed' && obj.dueDate < todayISO();
  return (
    <div className={`${cardCls} flex flex-col`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <ProgressRing value={obj.progress} color={color} label={obj.title} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <TypeChip type={obj.type} />
              <StatusChip status={obj.status} />
            </div>
            <h3 className="mt-2 text-sm font-semibold leading-snug">
              {obj.title}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground dark:text-muted-foreground">
              <Avatar name={obj.owner} size={18} />
              <span className="truncate">
                {obj.owner}, {obj.ownerRole}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={iconBtn}
            onClick={onCheckIn}
            aria-label="Check in"
            title="Check in"
          >
            <ClipboardCheck size={15} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={iconBtn}
            onClick={onEdit}
            aria-label="Edit objective"
            title="Edit"
          >
            <Pencil size={15} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`${iconBtn} hover:!text-destructive`}
            onClick={onDelete}
            aria-label="Delete objective"
            title="Delete"
          >
            <Trash2 size={15} />
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground dark:text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar size={12} /> {obj.quarter}
        </span>
        <span
          className={`flex items-center gap-1 ${overdue ? 'font-medium text-destructive' : ''}`}
        >
          <Clock size={12} /> {overdue ? 'Overdue since' : 'Due'}{' '}
          {fmtDate(obj.dueDate)}
        </span>
        <span className="flex items-center gap-1">
          <Target size={12} /> {obj.keyResults.length} key results
        </span>
      </div>

      <div className="mt-4 space-y-3.5 border-t border-border pt-4 dark:border-border">
        {obj.keyResults.map(k => (
          <div key={k.id}>
            <div className="flex items-baseline justify-between gap-3 text-xs">
              <span className="flex min-w-0 items-center gap-1.5 font-medium">
                {k.pct >= 100 && (
                  <CheckCircle2
                    size={12}
                    className="flex-shrink-0 text-primary"
                  />
                )}
                <span className="truncate">{k.title}</span>
              </span>
              <span className="flex-shrink-0 tabular-nums text-muted-foreground dark:text-muted-foreground">
                {fmtNum(k.current)} → {fmtNum(k.target)} {k.unit}
              </span>
            </div>
            <PaceBar
              pct={k.pct}
              expected={obj.expected}
              color={k.pct >= 100 ? STATUS_COLORS.Completed : color}
            />
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={onToggle}
        aria-expanded={expanded}
        className="mt-4 h-auto gap-1 self-start p-0 text-xs font-medium text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-primary-foreground"
      >
        <History size={12} /> Check-in history ({obj.checkIns.length})
        <ChevronDown
          size={12}
          className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </Button>
      {expanded && (
        <div className="mt-3 space-y-3 rounded-xl bg-muted p-3 text-xs dark:bg-muted/40">
          {obj.checkIns.length === 0 ? (
            <p className="text-muted-foreground dark:text-muted-foreground">
              No check-ins yet. Use the check-in button to record the first
              update.
            </p>
          ) : (
            obj.checkIns.map(c => (
              <div key={c.id} className="flex gap-2.5">
                <Avatar name={c.author} size={22} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="font-medium">{c.author}</span>
                    <span className="text-muted-foreground">
                      {fmtDate(c.date)}
                    </span>
                    <StatusChip status={c.status} />
                    <span className="tabular-nums text-muted-foreground">
                      {c.progress}%
                    </span>
                  </div>
                  {c.note && (
                    <p className="mt-1 text-secondary-foreground dark:text-muted-foreground">
                      {c.note}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const GoalsandOKRs: React.FC = () => {
  const DEFAULTS = {
    quarter: currentQuarter(),
    type: 'all',
    status: 'all',
    search: '',
    sort: 'due',
  };
  const [objectives, setObjectives] = useState<Objective[]>(SEED);
  const [form, setForm] = useState(DEFAULTS);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const [editing, setEditing] = useState<Objective | 'new' | null>(null);
  const [checkInId, setCheckInId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const set = <K extends keyof typeof DEFAULTS>(
    k: K,
    v: (typeof DEFAULTS)[K]
  ) => setForm(p => ({ ...p, [k]: v }));

  const views = useMemo(() => objectives.map(enrich), [objectives]);
  const inQuarter = useMemo(
    () => views.filter(o => o.quarter === form.quarter),
    [views, form.quarter]
  );

  const filtered = useMemo(() => {
    const q = form.search.trim().toLowerCase();
    const list = inQuarter.filter(
      o =>
        (form.type === 'all' || o.type === form.type) &&
        (form.status === 'all' || o.status === form.status) &&
        (!q ||
          o.title.toLowerCase().includes(q) ||
          o.owner.toLowerCase().includes(q))
    );
    return [...list].sort((a, b) => {
      switch (form.sort) {
        case 'progress-desc':
          return b.progress - a.progress;
        case 'progress-asc':
          return a.progress - b.progress;
        case 'risk':
          return (
            RISK_ORDER[a.status] - RISK_ORDER[b.status] ||
            a.progress - b.progress
          );
        default:
          return a.dueDate.localeCompare(b.dueDate);
      }
    });
  }, [inQuarter, form]);

  const expected = expectedPace(form.quarter);
  const avgProgress = filtered.length
    ? Math.round(filtered.reduce((s, o) => s + o.progress, 0) / filtered.length)
    : 0;
  const allKRs = filtered.flatMap(o => o.keyResults);
  const krOnPace = allKRs.length
    ? Math.round(
        (allKRs.filter(k => k.pct >= expected).length / allKRs.length) * 100
      )
    : 0;
  const count = (s: OKRStatus) => filtered.filter(o => o.status === s).length;
  const delta = avgProgress - expected;

  const statusDist = useMemo(
    () =>
      STATUSES.map(s => ({
        name: s,
        value: inQuarter.filter(o => o.status === s).length,
        color: STATUS_COLORS[s],
      })).filter(x => x.value > 0),
    [inQuarter]
  );
  const typeDist = useMemo(
    () =>
      TYPES.map(t => ({
        name: t,
        value: inQuarter.filter(o => o.type === t).length,
        color: TYPE_COLORS[t],
      })),
    [inQuarter]
  );
  const healthData = [
    { name: 'Avg progress', value: avgProgress, fill: 'hsl(var(--primary))' },
    {
      name: 'Quarter elapsed',
      value: expected,
      fill: 'hsl(var(--muted-foreground))',
    },
    {
      name: 'Key results on pace',
      value: krOnPace,
      fill: 'hsl(var(--primary))',
    },
  ];
  const activity = useMemo(
    () =>
      filtered
        .flatMap(o => o.checkIns.map(c => ({ ...c, objective: o.title })))
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 5),
    [filtered]
  );

  /* actions */
  const saveObjective = (o: Objective) => {
    const exists = objectives.some(x => x.id === o.id);
    setObjectives(p =>
      exists ? p.map(x => (x.id === o.id ? o : x)) : [o, ...p]
    );
    if (o.quarter !== form.quarter) set('quarter', o.quarter);
    setEditing(null);
    toast.success(exists ? 'Objective saved' : 'Objective created');
  };
  const saveCheckIn = (
    id: string,
    values: Record<string, number>,
    status: OKRStatus,
    note: string
  ) => {
    setObjectives(p =>
      p.map(o => {
        if (o.id !== id) return o;
        const keyResults = o.keyResults.map(k => ({
          ...k,
          current: values[k.id] ?? k.current,
        }));
        const progress = Math.round(
          keyResults.reduce((s, k) => s + krPct(k), 0) /
            Math.max(1, keyResults.length)
        );
        const entry: CheckIn = {
          id: `c${Date.now()}`,
          date: todayISO(),
          note,
          author: o.owner,
          progress,
          status,
        };
        return { ...o, keyResults, status, checkIns: [entry, ...o.checkIns] };
      })
    );
    setCheckInId(null);
    setExpanded(id);
    toast.success('Check-in saved');
  };
  const confirmDelete = () => {
    setObjectives(p => p.filter(o => o.id !== deleteId));
    setDeleteId(null);
    toast.success('Objective deleted');
  };

  const filtersActive =
    form.type !== 'all' ||
    form.status !== 'all' ||
    form.search !== '' ||
    form.quarter !== DEFAULTS.quarter ||
    form.sort !== 'due';
  const checkInObj = views.find(o => o.id === checkInId);
  const deleteObj = views.find(o => o.id === deleteId);

  const columns = useMemo<ColumnDef<ObjectiveView>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Objective',
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <Avatar name={row.original.owner} size={26} />
            <div className="min-w-0">
              <div className="text-sm font-medium">{row.original.title}</div>
              <div className="text-xs text-muted-foreground dark:text-muted-foreground">
                {row.original.owner}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Level',
        cell: ({ row }) => <TypeChip type={row.original.type} />,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusChip status={row.original.status} />,
      },
      {
        accessorKey: 'progress',
        header: 'Progress',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="w-24">
              <PaceBar
                pct={row.original.progress}
                expected={row.original.expected}
                color={STATUS_COLORS[row.original.status]}
              />
            </div>
            <span className="text-xs tabular-nums">
              {row.original.progress}%
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'dueDate',
        header: 'Due',
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-xs">
            {fmtDate(row.original.dueDate)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={iconBtn}
              aria-label="Check in"
              onClick={() => setCheckInId(row.original.id)}
            >
              <ClipboardCheck size={15} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={iconBtn}
              aria-label="Edit"
              onClick={() =>
                setEditing(
                  objectives.find(o => o.id === row.original.id) ?? null
                )
              }
            >
              <Pencil size={15} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`${iconBtn} hover:!text-destructive`}
              aria-label="Delete"
              onClick={() => setDeleteId(row.original.id)}
            >
              <Trash2 size={15} />
            </Button>
          </div>
        ),
      },
    ],
    [objectives]
  );

  const kpis: {
    label: string;
    status: OKRStatus;
    icon: typeof Target;
    hint: string;
  }[] = [
    {
      label: 'On track',
      status: 'On Track',
      icon: CheckCircle2,
      hint: 'Healthy',
    },
    { label: 'At risk', status: 'At Risk', icon: Zap, hint: 'Needs attention' },
    {
      label: 'Off track',
      status: 'Off Track',
      icon: AlertCircle,
      hint: 'Needs help',
    },
    { label: 'Completed', status: 'Completed', icon: Flag, hint: 'Delivered' },
  ];

  return (
    <div className="min-h-screen space-y-4  p-1 text-foreground  dark:text-muted-foreground">
      <Section title="Goals & OKRs" menuId="goals-okrs" showBreadcrumbs>
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm font-medium text-primary dark:text-primary">
              <Target size={14} /> Performance & Growth
            </div>
            <p className="text-xs text-muted-foreground dark:text-muted-foreground">
              Set objectives, check in on key results, and keep every team
              pointed at the same outcomes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <FormField
            label="Quarter"
            name="quarter"
            type="select"
            value={form.quarter}
            onChange={v => set('quarter', v)}
            options={goalsOkrsQuarterOptions}
          />
          <FormField
            label="Level"
            name="type"
            type="select"
            value={form.type}
            onChange={v => set('type', v)}
            options={goalsOkrsLevelFilterOptions}
          />
          <FormField
            label="Status"
            name="status"
            type="select"
            value={form.status}
            onChange={v => set('status', v)}
            options={goalsOkrsStatusFilterOptions}
          />
          <FormField
            label="Sort by"
            name="sort"
            type="select"
            value={form.sort}
            onChange={v => set('sort', v)}
            options={goalsOkrsSortOptions}
          />
          <FormField
            label="Search"
            name="search"
            type="text"
            value={form.search}
            onChange={v => set('search', v)}
            placeholder="Objective or owner"
          />
          <div className="flex lg:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={!filtersActive}
              onClick={() => setForm(DEFAULTS)}
            >
              <RotateCcw size={14} /> Reset
            </Button>
          </div>
        </div>
      </Section>

      {/* Pace + status tiles (tiles filter the list) */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        <div
          className={`${cardCls} col-span-2 flex items-center gap-4 bg-gradient-to-br from-primary/10 to-card dark:from-primary/40 dark:to-muted`}
        >
          <ProgressRing
            value={avgProgress}
            size={84}
            stroke={8}
            color="hsl(var(--primary))"
            label="Average progress"
          />
          <div>
            <div className="text-xs font-medium text-muted-foreground dark:text-muted-foreground">
              {form.quarter} progress
            </div>
            <div className="mt-0.5 text-sm font-semibold">
              {filtered.length === 0
                ? 'No objectives to measure'
                : delta >= 0
                  ? `${delta} pts ahead of pace`
                  : `${Math.abs(delta)} pts behind pace`}
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
              {expected}% of the quarter has passed, across {filtered.length}{' '}
              {filtered.length === 1 ? 'objective' : 'objectives'}.
            </div>
          </div>
        </div>
        {kpis.map(k => {
          const Icon = k.icon;
          const c = STATUS_COLORS[k.status];
          const active = form.status === k.status;
          return (
            <Button
              key={k.label}
              type="button"
              variant="ghost"
              onClick={() => set('status', active ? 'all' : k.status)}
              aria-pressed={active}
              className={`${cardCls} h-auto w-full flex-col items-stretch whitespace-normal text-left transition hover:border-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary dark:hover:border-border`}
              style={
                active
                  ? { borderColor: c, boxShadow: `0 0 0 1px ${c}` }
                  : undefined
              }
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground dark:text-muted-foreground">
                  {k.label}
                </span>
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{
                    background: `color-mix(in srgb, ${c} 10%, transparent)`,
                    color: c,
                  }}
                >
                  <Icon size={14} />
                </span>
              </div>
              <div className="mt-2 text-2xl font-semibold tabular-nums">
                {count(k.status)}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
                {active ? 'Filter applied' : k.hint}
              </div>
            </Button>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className={`${cardCls} xl:col-span-2`}>
          <h3 className="text-sm font-semibold">Objectives by level</h3>
          <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
            How {form.quarter} goals are spread across the organisation
          </p>
          <div className="mt-3 text-foreground dark:text-muted-foreground">
            <ResponsiveContainer width="100%" height={230}>
              <BarChart
                data={typeDist}
                margin={{ top: 16, right: 8, bottom: 0, left: -20 }}
              >
                <CartesianGrid {...gridProps} />
                <XAxis
                  dataKey="name"
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
                <Bar
                  dataKey="value"
                  name="Objectives"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={48}
                  cursor="pointer"
                  onClick={datum => {
                    if (typeof datum.name !== 'string') return;
                    set(
                      'type',
                      form.type === datum.name
                        ? 'all'
                        : (datum.name as GoalType)
                    );
                  }}
                >
                  {typeDist.map(t => (
                    <Cell
                      key={t.name}
                      fill={t.color}
                      fillOpacity={
                        form.type === 'all' || form.type === t.name ? 1 : 0.3
                      }
                    />
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
          <h3 className="text-sm font-semibold">Status breakdown</h3>
          <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
            Select a slice to filter the list
          </p>
          {statusDist.length === 0 ? (
            <p className="py-16 text-center text-xs text-muted-foreground">
              No objectives in {form.quarter}.
            </p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie
                    data={statusDist}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={76}
                    paddingAngle={3}
                    cornerRadius={4}
                    stroke="none"
                    cursor="pointer"
                    onClick={datum => {
                      if (typeof datum.name !== 'string') return;
                      set(
                        'status',
                        form.status === datum.name
                          ? 'all'
                          : (datum.name as OKRStatus)
                      );
                    }}
                  >
                    {statusDist.map(s => (
                      <Cell
                        key={s.name}
                        fill={s.color}
                        fillOpacity={
                          form.status === 'all' || form.status === s.name
                            ? 1
                            : 0.3
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div role="list" className="mt-1 space-y-1.5">
                {statusDist.map(s => (
                  <div
                    key={s.name}
                    role="listitem"
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="flex items-center gap-2 text-secondary-foreground dark:text-muted-foreground">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: s.color }}
                      />
                      {s.name}
                    </span>
                    <span className="font-medium tabular-nums">{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className={cardCls}>
          <h3 className="text-sm font-semibold">Quarter health</h3>
          <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
            Progress compared with time elapsed
          </p>
          <div className="text-foreground dark:text-muted-foreground">
            <ResponsiveContainer width="100%" height={190}>
              <RadialBarChart
                data={healthData}
                innerRadius="25%"
                outerRadius="100%"
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar
                  dataKey="value"
                  cornerRadius={6}
                  background={{ fill: 'currentColor', fillOpacity: 0.06 }}
                />
                <Tooltip content={<ChartTooltip />} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div role="list" className="space-y-1.5">
            {healthData.map(h => (
              <div
                key={h.name}
                role="listitem"
                className="flex items-center justify-between text-xs"
              >
                <span className="flex items-center gap-2 text-secondary-foreground dark:text-muted-foreground">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: h.fill }}
                  />
                  {h.name}
                </span>
                <span className="font-medium tabular-nums">{h.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`${cardCls} xl:col-span-2`}>
          <h3 className="text-sm font-semibold">Recent check-ins</h3>
          <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
            Latest updates from the objectives you are viewing
          </p>
          {activity.length === 0 ? (
            <p className="py-12 text-center text-xs text-muted-foreground dark:text-muted-foreground">
              No check-ins yet. Open an objective and record the first one.
            </p>
          ) : (
            <div
              role="list"
              className="mt-3 divide-y divide-gray-100 dark:divide-gray-800"
            >
              {activity.map(a => (
                <div key={a.id} role="listitem" className="flex gap-3 py-3">
                  <Avatar name={a.author} size={30} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                      <span className="font-semibold">{a.author}</span>
                      <span className="text-muted-foreground">
                        {fmtDate(a.date)}
                      </span>
                      <StatusChip status={a.status} />
                    </div>
                    <div className="mt-0.5 truncate text-xs text-muted-foreground dark:text-muted-foreground">
                      {a.objective}
                    </div>
                    {a.note && (
                      <p className="mt-1 text-xs text-secondary-foreground dark:text-muted-foreground">
                        {a.note}
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-semibold tabular-nums">
                    {a.progress}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* View toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">
          {filtered.length} {filtered.length === 1 ? 'objective' : 'objectives'}
        </h3>
        <div
          className="flex items-center gap-1 rounded-lg border border-border bg-card p-1 dark:border-border dark:bg-card"
          role="group"
          aria-label="View mode"
        >
          {(['cards', 'table'] as const).map(v => (
            <Button
              key={v}
              type="button"
              variant={view === v ? 'default' : 'ghost'}
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className="h-auto rounded-md px-3 py-1 text-xs font-medium capitalize"
            >
              {v}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div
          className={`${cardCls} flex flex-col items-center py-14 text-center`}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground dark:bg-muted">
            <SearchX size={22} />
          </span>
          <h3 className="mt-4 text-sm font-semibold">
            {inQuarter.length === 0
              ? `No objectives in ${form.quarter} yet`
              : 'No objectives match these filters'}
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground dark:text-muted-foreground">
            {inQuarter.length === 0
              ? 'Create the first objective for this quarter to start tracking progress.'
              : 'Clear the filters to see everything in this quarter.'}
          </p>
          <div className="mt-4">
            {inQuarter.length === 0 ? (
              <Button
                type="button"
                className="bg-primary hover:bg-primary"
                onClick={() => setEditing('new')}
              >
                <Plus size={14} /> New objective
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => setForm({ ...DEFAULTS, quarter: form.quarter })}
              >
                <RotateCcw size={14} /> Clear filters
              </Button>
            )}
          </div>
        </div>
      ) : view === 'cards' ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map(o => (
            <ObjectiveCard
              key={o.id}
              obj={o}
              expanded={expanded === o.id}
              onToggle={() => setExpanded(expanded === o.id ? null : o.id)}
              onEdit={() =>
                setEditing(objectives.find(x => x.id === o.id) ?? null)
              }
              onCheckIn={() => setCheckInId(o.id)}
              onDelete={() => setDeleteId(o.id)}
            />
          ))}
        </div>
      ) : (
        <Section title="All objectives">
          <TanStackTable
            showDownload={true}
            key={JSON.stringify(form)}
            data={filtered}
            columns={columns}
            searchPlaceholder="Search objectives..."
            pageSize={10}
            enableColumnVisibility
            enableRowSelection={false}
          />
        </Section>
      )}

      {/* Modals */}
      {editing && (
        <ObjectiveFormModal
          initial={editing === 'new' ? null : editing}
          defaultQuarter={form.quarter}
          onSave={saveObjective}
          onClose={() => setEditing(null)}
        />
      )}
      {checkInObj && (
        <CheckInModal
          obj={checkInObj}
          onSave={saveCheckIn}
          onClose={() => setCheckInId(null)}
        />
      )}
      {deleteObj && (
        <Modal
          title="Delete this objective?"
          subtitle={deleteObj.title}
          onClose={() => setDeleteId(null)}
          footer={
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteId(null)}
              >
                Keep objective
              </Button>
              <Button
                type="button"
                className="bg-destructive hover:bg-destructive"
                onClick={confirmDelete}
              >
                Delete objective
              </Button>
            </>
          }
        >
          <p className="text-sm text-secondary-foreground dark:text-muted-foreground">
            This removes the objective, its {deleteObj.keyResults.length} key
            results and {deleteObj.checkIns.length} check-ins. This can&apos;t
            be undone.
          </p>
        </Modal>
      )}
    </div>
  );
};

export default GoalsandOKRs;
