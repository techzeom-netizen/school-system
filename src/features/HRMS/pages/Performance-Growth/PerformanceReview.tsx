import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  LabelList,
  PolarAngleAxis,
  PolarGrid,
  Pie,
  PieChart,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Bell,
  CheckCircle2,
  ClipboardList,
  Clock,
  Eye,
  History,
  Plus,
  RotateCcw,
  SearchX,
  Star,
  Users,
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
  performanceReviewCycleOptions,
  performanceReviewDepartmentFilterOptions,
  performanceReviewSortOptions,
  performanceReviewStageOptions,
  performanceReviewStatusFilterOptions,
  performanceReviewStatusOptions,
} from '@/data/reusableDropdownData';

type Stage =
  | 'Draft'
  | 'Pending Self'
  | 'Pending Manager'
  | 'Pending Calibration'
  | 'Completed';
type ReviewStatus = Stage | 'Overdue';
const STAGES: Stage[] = performanceReviewStageOptions.map(
  option => option.value as Stage
);
const STATUSES: ReviewStatus[] = performanceReviewStatusOptions.map(
  option => option.value as ReviewStatus
);

const COMPETENCIES = [
  'Delivery',
  'Quality',
  'Collaboration',
  'Ownership',
  'Communication',
  'Innovation',
] as const;
type Comp = (typeof COMPETENCIES)[number];
type Ratings = Record<Comp, number>;

interface Assessment {
  ratings: Ratings;
  strengths: string;
  improvements: string;
  submittedOn: string;
}
interface LogEntry {
  id: string;
  date: string;
  text: string;
}
interface Employee {
  id: string;
  name: string;
  role: string;
  dept: string;
  manager: string;
}
interface Review {
  id: string;
  employeeId: string;
  employee: string;
  role: string;
  department: string;
  manager: string;
  cycle: string;
  stage: Stage;
  dueDate: string;
  selfAssessment: Assessment | null;
  managerAssessment: Assessment | null;
  finalRating: number | null;
  calibrationNote: string;
  activity: LogEntry[];
}
interface ReviewView extends Review {
  status: ReviewStatus;
  selfScore: number | null;
  mgrScore: number | null;
  daysLeft: number;
}

const STATUS_COLORS: Record<ReviewStatus, string> = {
  Draft: 'hsl(var(--muted-foreground))',
  'Pending Self': 'hsl(var(--accent-foreground))',
  'Pending Manager': 'hsl(var(--secondary-foreground))',
  'Pending Calibration': 'hsl(var(--accent-foreground))',
  Completed: 'hsl(var(--primary))',
  Overdue: 'hsl(var(--destructive))',
};
const RATING_META: Record<number, { label: string; color: string }> = {
  5: { label: 'Outstanding', color: 'hsl(var(--primary))' },
  4: { label: 'Exceeds', color: 'hsl(var(--primary))' },
  3: { label: 'Meets', color: 'hsl(var(--secondary-foreground))' },
  2: { label: 'Below', color: 'hsl(var(--accent-foreground))' },
  1: { label: 'Poor', color: 'hsl(var(--destructive))' },
};

const ROSTER: Employee[] = [
  {
    id: 'e1',
    name: 'Abhishek Chaurasiya',
    role: 'Software Engineer Trainee',
    dept: 'Engineering & Delivery',
    manager: 'Rohan Kulkarni',
  },
  {
    id: 'e2',
    name: 'Aman Gaur',
    role: 'Digital Marketing Executive',
    dept: 'Digital Strategy & Marketing',
    manager: 'Meera Joshi',
  },
  {
    id: 'e3',
    name: 'Anju Lata',
    role: 'Business Development Manager',
    dept: 'Business Growth',
    manager: 'Omkar Sahani',
  },
  {
    id: 'e4',
    name: 'Ashutosh Patil',
    role: 'Jr. Software Engineer',
    dept: 'Engineering & Delivery',
    manager: 'Rohan Kulkarni',
  },
  {
    id: 'e5',
    name: 'Sparshi Jain',
    role: 'Software Engineer',
    dept: 'Engineering & Delivery',
    manager: 'Rohan Kulkarni',
  },
  {
    id: 'e6',
    name: 'Navneet Kumar Rai',
    role: 'Jr. Software Engineer',
    dept: 'Engineering & Delivery',
    manager: 'Rohan Kulkarni',
  },
  {
    id: 'e7',
    name: 'Kavita Rao',
    role: 'Customer Success Lead',
    dept: 'Customer Success',
    manager: 'Anita Deshmukh',
  },
  {
    id: 'e8',
    name: 'Pooja Nair',
    role: 'Finance Analyst',
    dept: 'Finance',
    manager: 'Imran Sheikh',
  },
  {
    id: 'e9',
    name: 'Farhan Ali',
    role: 'HR Executive',
    dept: 'People & Culture',
    manager: 'Sneha Reddy',
  },
  {
    id: 'e10',
    name: 'Divya Menon',
    role: 'Content Strategist',
    dept: 'Digital Strategy & Marketing',
    manager: 'Meera Joshi',
  },
  {
    id: 'e11',
    name: 'Tushar Wankhede',
    role: 'QA Engineer',
    dept: 'Engineering & Delivery',
    manager: 'Rohan Kulkarni',
  },
  {
    id: 'e12',
    name: 'Rhea Kapoor',
    role: 'Account Executive',
    dept: 'Business Growth',
    manager: 'Omkar Sahani',
  },
];
const emp = (id: string) => ROSTER.find(e => e.id === id)!;
const A = (
  r: number[],
  strengths: string,
  improvements: string,
  submittedOn: string
): Assessment => ({
  ratings: Object.fromEntries(COMPETENCIES.map((c, i) => [c, r[i]])) as Ratings,
  strengths,
  improvements,
  submittedOn,
});
const mk = (
  id: string,
  eid: string,
  cycle: string,
  stage: Stage,
  dueDate: string,
  s: Assessment | null = null,
  m: Assessment | null = null,
  finalRating: number | null = null,
  calibrationNote = ''
): Review => {
  const e = emp(eid);
  const activity: LogEntry[] = [
    {
      id: `${id}-l`,
      date: dueDate.slice(0, 5) + '10-01',
      text: 'Review launched',
    },
  ];
  if (s)
    activity.push({
      id: `${id}-s`,
      date: s.submittedOn,
      text: `${e.name} submitted a self-assessment`,
    });
  if (m)
    activity.push({
      id: `${id}-m`,
      date: m.submittedOn,
      text: `${e.manager} submitted the manager review`,
    });
  if (finalRating)
    activity.push({
      id: `${id}-f`,
      date: m?.submittedOn ?? dueDate,
      text: `Final rating set to ${finalRating}`,
    });
  return {
    id,
    employeeId: eid,
    employee: e.name,
    role: e.role,
    department: e.dept,
    manager: e.manager,
    cycle,
    stage,
    dueDate,
    selfAssessment: s,
    managerAssessment: m,
    finalRating,
    calibrationNote,
    activity: activity.reverse(),
  };
};

const SEED: Review[] = [
  mk(
    'r1',
    'e1',
    'Q4 2026',
    'Pending Manager',
    '2026-11-15',
    A(
      [4, 3, 4, 4, 3, 4],
      'Took ownership of the payments module and unblocked two teammates.',
      'Estimates are optimistic; break work into smaller pieces.',
      '2026-10-08'
    )
  ),
  mk(
    'r2',
    'e2',
    'Q4 2026',
    'Completed',
    '2026-11-12',
    A(
      [4, 4, 4, 4, 4, 3],
      'Led three campaigns that beat lead targets.',
      'Go deeper on attribution analytics.',
      '2026-10-05'
    ),
    A(
      [4, 4, 5, 4, 4, 3],
      'Reliable, creative and great with partners.',
      'Own the reporting cadence end to end.',
      '2026-10-12'
    ),
    4,
    'Agreed with manager rating.'
  ),
  mk(
    'r3',
    'e3',
    'Q4 2026',
    'Pending Calibration',
    '2026-11-20',
    A(
      [5, 4, 5, 5, 4, 4],
      'Closed the largest enterprise deal of the year.',
      'Delegate more of the early-stage prospecting.',
      '2026-10-06'
    ),
    A(
      [5, 4, 4, 5, 4, 4],
      'Exceptional deal craft and client trust.',
      'Mentor newer account executives.',
      '2026-10-13'
    )
  ),
  mk('r4', 'e4', 'Q4 2026', 'Pending Self', '2026-11-18'),
  mk('r5', 'e5', 'Q4 2026', 'Pending Self', '2026-10-09'),
  mk(
    'r6',
    'e7',
    'Q4 2026',
    'Pending Manager',
    '2026-11-10',
    A(
      [4, 4, 5, 4, 4, 3],
      'Cut onboarding time by a third.',
      'Document the playbook for the wider team.',
      '2026-10-10'
    )
  ),
  mk('r7', 'e8', 'Q4 2026', 'Draft', '2026-11-25'),
  mk(
    'r8',
    'e9',
    'Q4 2026',
    'Completed',
    '2026-10-31',
    A(
      [3, 4, 4, 3, 4, 3],
      'Smooth hiring coordination.',
      'Proactively flag risks earlier.',
      '2026-10-02'
    ),
    A(
      [3, 3, 4, 3, 4, 3],
      'Dependable and well liked.',
      'Take the lead on a process improvement.',
      '2026-10-09'
    ),
    3,
    'Steady contributor; growth plan agreed.'
  ),
  mk('r9', 'e10', 'Q4 2026', 'Pending Self', '2026-11-14'),
  mk(
    'r10',
    'e11',
    'Q4 2026',
    'Pending Manager',
    '2026-10-12',
    A(
      [4, 4, 3, 4, 3, 3],
      'Caught critical regressions before release.',
      'Share test knowledge across the team.',
      '2026-10-07'
    )
  ),
  mk(
    'r11',
    'e12',
    'Q4 2026',
    'Pending Calibration',
    '2026-11-22',
    A(
      [4, 3, 4, 4, 4, 4],
      'Strong pipeline growth in the west region.',
      'Improve forecast accuracy.',
      '2026-10-07'
    ),
    A(
      [3, 3, 4, 3, 4, 3],
      'Good relationships; forecasts missed by wide margins.',
      'Tighten deal qualification.',
      '2026-10-14'
    )
  ),
  mk(
    'r12',
    'e1',
    'Q3 2026',
    'Completed',
    '2026-08-15',
    A(
      [4, 4, 4, 4, 3, 3],
      'Shipped two major features.',
      'Improve code reviews.',
      '2026-08-05'
    ),
    A(
      [4, 4, 4, 4, 4, 3],
      'Rapid learner.',
      'Be more vocal in design discussions.',
      '2026-08-10'
    ),
    4
  ),
  mk(
    'r13',
    'e3',
    'Q3 2026',
    'Completed',
    '2026-08-15',
    A(
      [5, 5, 4, 5, 5, 4],
      'Record quarter for new logos.',
      'Protect time for strategy.',
      '2026-08-04'
    ),
    A(
      [5, 5, 5, 5, 5, 4],
      'Top performer across the board.',
      'Prepare for a leadership role.',
      '2026-08-09'
    ),
    5,
    'Promotion track.'
  ),
  mk(
    'r14',
    'e5',
    'Q3 2026',
    'Completed',
    '2026-08-15',
    A(
      [3, 3, 3, 3, 4, 3],
      'Consistent delivery.',
      'Take more ownership of design.',
      '2026-08-06'
    ),
    A(
      [2, 3, 3, 2, 3, 2],
      'Reliable on routine tasks.',
      'Missed two committed deadlines.',
      '2026-08-11'
    ),
    3,
    'Support plan in place.'
  ),
  mk(
    'r15',
    'e6',
    'Q3 2026',
    'Completed',
    '2026-08-15',
    A(
      [4, 3, 4, 4, 4, 3],
      'Good pace on tickets.',
      'Write more tests.',
      '2026-08-05'
    ),
    A(
      [4, 4, 4, 4, 4, 3],
      'Positive attitude.',
      'Deepen domain knowledge.',
      '2026-08-10'
    ),
    4
  ),
  mk(
    'r16',
    'e7',
    'Q3 2026',
    'Completed',
    '2026-08-15',
    A(
      [4, 4, 5, 4, 5, 4],
      'Customer favourite.',
      'Delegate escalations.',
      '2026-08-04'
    ),
    A(
      [5, 4, 5, 4, 5, 4],
      'Outstanding customer outcomes.',
      'Coach newer team members.',
      '2026-08-09'
    ),
    5
  ),
  mk(
    'r17',
    'e8',
    'Q3 2026',
    'Completed',
    '2026-08-15',
    A(
      [3, 3, 3, 3, 3, 2],
      'Accurate reporting.',
      'Speak up in reviews.',
      '2026-08-06'
    ),
    A(
      [2, 3, 3, 2, 3, 2],
      'Needs more initiative.',
      'Own month-end close.',
      '2026-08-11'
    ),
    2,
    'Development plan agreed.'
  ),
  mk(
    'r18',
    'e2',
    'Q2 2026',
    'Completed',
    '2026-05-15',
    A(
      [4, 3, 4, 4, 4, 3],
      'Strong content output.',
      'Measure impact.',
      '2026-05-04'
    ),
    A(
      [4, 4, 4, 4, 4, 3],
      'Consistent and creative.',
      'Own channel strategy.',
      '2026-05-10'
    ),
    4
  ),
  mk(
    'r19',
    'e9',
    'Q2 2026',
    'Completed',
    '2026-05-15',
    A(
      [3, 3, 4, 3, 4, 3],
      'Good with candidates.',
      'Speed up offers.',
      '2026-05-05'
    ),
    A([3, 3, 4, 3, 4, 3], 'Reliable.', 'More initiative.', '2026-05-11'),
    3
  ),
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
const toDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).getTime();
};
const daysBetween = (a: string, b: string) =>
  Math.round((toDate(b) - toDate(a)) / 86400000);
const initials = (n: string) =>
  n
    .split(' ')
    .map(x => x[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
const avg = (xs: number[]) =>
  xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0;
const overall = (a: Assessment | null) =>
  a ? Math.round(avg(Object.values(a.ratings)) * 10) / 10 : null;
const blankRatings = (): Ratings =>
  Object.fromEntries(COMPETENCIES.map(c => [c, 0])) as Ratings;
const stageIdx = (s: Stage) => STAGES.indexOf(s);

const enrich = (r: Review): ReviewView => {
  const daysLeft = daysBetween(todayISO(), r.dueDate);
  const overdue =
    r.stage !== 'Completed' && r.stage !== 'Draft' && daysLeft < 0;
  return {
    ...r,
    status: overdue ? 'Overdue' : r.stage,
    selfScore: overall(r.selfAssessment),
    mgrScore: overall(r.managerAssessment),
    daysLeft,
  };
};
const dueLabel = (r: ReviewView) => {
  if (r.stage === 'Completed') return 'Completed';
  if (r.daysLeft < 0)
    return `Overdue by ${-r.daysLeft} ${-r.daysLeft === 1 ? 'day' : 'days'}`;
  if (r.daysLeft === 0) return 'Due today';
  return `Due in ${r.daysLeft} ${r.daysLeft === 1 ? 'day' : 'days'}`;
};
const actionLabel: Record<Stage, string> = {
  Draft: 'Launch review',
  'Pending Self': 'Open self-review',
  'Pending Manager': 'Write manager review',
  'Pending Calibration': 'Set final rating',
  Completed: 'View review',
};
const reminderTarget = (r: Review) =>
  r.stage === 'Pending Self' ? r.employee : r.manager;
const remindable = (r: ReviewView) =>
  r.stage === 'Pending Self' ||
  r.stage === 'Pending Manager' ||
  r.stage === 'Pending Calibration';

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
  'rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-40 dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-primary-foreground';

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
              style={{ background: p.color || p.fill || p.payload?.color }}
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
  return (
    <span
      className="flex flex-shrink-0 items-center justify-center rounded-full font-semibold text-primary-foreground"
      style={{
        width: size,
        height: size,
        background: AVATAR_COLORS[name.length % AVATAR_COLORS.length],
        fontSize: size * 0.38,
      }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}

function StatusChip({ status }: { status: ReviewStatus }) {
  const c = STATUS_COLORS[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium"
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

function Score({ value, size = 12 }: { value: number | null; size?: number }) {
  if (value === null)
    return <span className="text-xs text-muted-foreground">Not yet</span>;
  const r = Math.round(value);
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="flex gap-px">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            size={size}
            className={
              i <= r
                ? 'text-accent-foreground'
                : 'text-muted-foreground dark:text-secondary-foreground'
            }
            fill={i <= r ? 'hsl(var(--accent-foreground))' : 'transparent'}
          />
        ))}
      </span>
      <span className="text-xs font-semibold tabular-nums">
        {Number.isInteger(value) ? value : value.toFixed(1)}
      </span>
    </span>
  );
}

function RatingInput({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  return (
    <div className="flex gap-0.5" role="radiogroup" aria-label={label}>
      {[1, 2, 3, 4, 5].map(i => (
        <Button
          key={i}
          type="button"
          variant="ghost"
          size="icon"
          role="radio"
          aria-checked={value === i}
          aria-label={`${i} out of 5`}
          onClick={() => onChange(i)}
          className="rounded p-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Star
            size={18}
            className={
              i <= value
                ? 'text-accent-foreground'
                : 'text-muted-foreground hover:text-accent-foreground dark:text-secondary-foreground'
            }
            fill={i <= value ? 'hsl(var(--accent-foreground))' : 'transparent'}
          />
        </Button>
      ))}
    </div>
  );
}

function StageTrack({ stage, overdue }: { stage: Stage; overdue: boolean }) {
  const idx = stageIdx(stage);
  return (
    <div
      className="flex gap-1"
      role="img"
      aria-label={`Stage ${idx + 1} of ${STAGES.length}: ${stage}`}
    >
      {STAGES.map((s, i) => (
        <span
          key={s}
          title={s}
          className="h-1.5 flex-1 rounded-full"
          style={{
            background:
              i < idx || stage === 'Completed'
                ? STATUS_COLORS.Completed
                : i === idx
                  ? overdue
                    ? STATUS_COLORS.Overdue
                    : STATUS_COLORS[stage]
                  : 'rgba(148,163,184,0.25)',
          }}
        />
      ))}
    </div>
  );
}

function ProgressRing({
  value,
  size = 84,
  stroke = 8,
  color = 'hsl(var(--primary))',
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${value}% complete`}
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
          strokeDashoffset={c - (value / 100) * c}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold tabular-nums">
        {value}%
      </div>
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
        className={`flex max-h-[92vh] w-full flex-col overflow-hidden p-0 ${wide ? 'sm:max-w-3xl' : 'sm:max-w-md'}`}
        onInteractOutside={event => event.preventDefault()}
      >
        <DialogHeader className="border-b px-5 py-4">
          <DialogTitle>{title}</DialogTitle>
          {subtitle && (
            <DialogDescription className="truncate">
              {subtitle}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <DialogFooter className="border-t px-5 py-3">{footer}</DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface ReviewActions {
  onLaunch: (id: string) => void;
  onSelf: (id: string, a: Assessment) => void;
  onManager: (id: string, a: Assessment) => void;
  onCalibrate: (id: string, final: number, note: string) => void;
  onReopen: (id: string) => void;
  onRemind: (ids: string[]) => void;
}

function ReviewModal({
  r,
  onClose,
  actions,
}: {
  r: ReviewView;
  onClose: () => void;
  actions: ReviewActions;
}) {
  const editingSelf = r.stage === 'Pending Self';
  const editingMgr = r.stage === 'Pending Manager';
  const [ratings, setRatings] = useState<Ratings>(blankRatings());
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [final, setFinal] = useState<number>(
    r.finalRating ?? Math.round(r.mgrScore ?? r.selfScore ?? 0)
  );
  const [note, setNote] = useState(r.calibrationNote);
  const [error, setError] = useState('');

  const submit = () => {
    if (COMPETENCIES.some(c => !ratings[c]))
      return setError('Rate every competency before submitting.');
    if (!strengths.trim() || !improvements.trim())
      return setError('Add both strengths and areas to improve.');
    const a: Assessment = {
      ratings,
      strengths: strengths.trim(),
      improvements: improvements.trim(),
      submittedOn: todayISO(),
    };
    if (editingSelf) {
      actions.onSelf(r.id, a);
    } else {
      actions.onManager(r.id, a);
    }
  };
  const gap =
    r.selfScore !== null && r.mgrScore !== null
      ? Math.round((r.mgrScore - r.selfScore) * 10) / 10
      : null;
  const canRemind =
    r.stage === 'Pending Self' ||
    r.stage === 'Pending Manager' ||
    r.stage === 'Pending Calibration';
  const competencyColumns = useMemo<ColumnDef<Comp>[]>(
    () => [
      {
        id: 'competency',
        accessorFn: competency => competency,
        header: 'Competency',
      },
      {
        id: 'self',
        header: 'Self',
        cell: ({ row }) =>
          editingSelf ? (
            <RatingInput
              label={`Self ${row.original}`}
              value={ratings[row.original]}
              onChange={value =>
                setRatings(current => ({ ...current, [row.original]: value }))
              }
            />
          ) : r.selfAssessment ? (
            <Score value={r.selfAssessment.ratings[row.original]} />
          ) : (
            <span className="text-xs text-muted-foreground">Waiting</span>
          ),
      },
      {
        id: 'manager',
        header: 'Manager',
        cell: ({ row }) =>
          editingMgr ? (
            <RatingInput
              label={`Manager ${row.original}`}
              value={ratings[row.original]}
              onChange={value =>
                setRatings(current => ({ ...current, [row.original]: value }))
              }
            />
          ) : r.managerAssessment ? (
            <Score value={r.managerAssessment.ratings[row.original]} />
          ) : (
            <span className="text-xs text-muted-foreground">Waiting</span>
          ),
      },
    ],
    [editingMgr, editingSelf, r.managerAssessment, r.selfAssessment, ratings]
  );

  return (
    <Modal
      wide
      title={`${r.cycle} review`}
      subtitle={`${r.employee}, ${r.role}`}
      onClose={onClose}
      footer={
        <>
          {canRemind && (
            <Button
              type="button"
              variant="outline"
              onClick={() => actions.onRemind([r.id])}
            >
              <Bell size={14} /> Remind {reminderTarget(r).split(' ')[0]}
            </Button>
          )}
          <Button type="button" variant="destructive" onClick={onClose}>
            Close
          </Button>
          {r.stage === 'Draft' && (
            <Button
              type="button"
              variant="default"
              onClick={() => actions.onLaunch(r.id)}
            >
              Launch review
            </Button>
          )}
          {(editingSelf || editingMgr) && (
            <Button type="button" variant="default" onClick={submit}>
              {editingSelf ? 'Submit self-assessment' : 'Submit manager review'}
            </Button>
          )}
          {r.stage === 'Pending Calibration' && (
            <Button
              type="button"
              variant="default"
              disabled={!final}
              onClick={() => actions.onCalibrate(r.id, final, note.trim())}
            >
              Finalise rating
            </Button>
          )}
          {r.stage === 'Completed' && (
            <Button
              type="button"
              variant="outline"
              onClick={() => actions.onReopen(r.id)}
            >
              Reopen for calibration
            </Button>
          )}
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-3">
        <Avatar name={r.employee} size={48} />
        <div className="min-w-[180px] flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusChip status={r.status} />
            <span className="text-xs text-muted-foreground">
              {dueLabel(r)} · {fmtDate(r.dueDate)}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground dark:text-muted-foreground">
            <Users size={12} /> Manager:{' '}
            <span className="font-medium text-secondary-foreground dark:text-muted-foreground">
              {r.manager}
            </span>{' '}
            · {r.department}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center text-xs">
          <div>
            <div className="mb-1 text-muted-foreground">Self</div>
            <Score value={r.selfScore} />
          </div>
          <div>
            <div className="mb-1 text-muted-foreground">Manager</div>
            <Score value={r.mgrScore} />
          </div>
          <div>
            <div className="mb-1 text-muted-foreground">Final</div>
            <Score value={r.finalRating} />
          </div>
        </div>
      </div>
      <div className="mt-3">
        <StageTrack stage={r.stage} overdue={r.status === 'Overdue'} />
      </div>

      {r.stage === 'Draft' ? (
        <p className="mt-5 rounded-xl bg-muted p-4 text-sm text-secondary-foreground dark:bg-muted/50 dark:text-muted-foreground">
          This review is still a draft. Launching it notifies {r.employee} to
          complete a self-assessment.
        </p>
      ) : (
        <>
          <div className="mt-5 overflow-x-auto rounded-xl border border-border dark:border-border">
            <TanStackTable
              showDownload={true}
              data={[...COMPETENCIES]}
              columns={competencyColumns}
              enableSearch={false}
              enableSorting={false}
              enablePagination={false}
              hideFooter
              className="text-sm"
            />
          </div>

          {(editingSelf || editingMgr) && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <FormField
                label="Strengths"
                name="strengths"
                type="textarea"
                rows={3}
                value={strengths}
                onChange={setStrengths}
                placeholder="What went well, with examples"
              />
              <FormField
                label="Areas to improve"
                name="improvements"
                type="textarea"
                rows={3}
                value={improvements}
                onChange={setImprovements}
                placeholder="Specific, actionable focus areas"
              />
            </div>
          )}
          {error && (
            <p className="mt-2 text-xs text-destructive" role="alert">
              {error}
            </p>
          )}

          {(
            [
              ['Self-assessment', r.selfAssessment],
              ['Manager review', r.managerAssessment],
            ] as const
          ).map(
            ([t, a]) =>
              a && (
                <div
                  key={t}
                  className="mt-4 rounded-xl bg-muted p-4 text-sm dark:bg-muted/40"
                >
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-semibold">{t}</span>
                    <span className="text-muted-foreground">
                      Submitted {fmtDate(a.submittedOn)}
                    </span>
                  </div>
                  <p>
                    <span className="font-medium text-primary dark:text-primary">
                      Strengths:{' '}
                    </span>
                    {a.strengths}
                  </p>
                  <p className="mt-1">
                    <span className="font-medium text-accent-foreground dark:text-accent-foreground">
                      To improve:{' '}
                    </span>
                    {a.improvements}
                  </p>
                </div>
              )
          )}

          {r.stage === 'Pending Calibration' && (
            <div className="mt-4 rounded-xl border border-primary/30 bg-primary/60 p-4 dark:border-primary/30 dark:bg-primary/10">
              <div className="text-sm font-semibold">Final rating</div>
              {gap !== null && (
                <p className="mt-0.5 text-xs text-secondary-foreground dark:text-muted-foreground">
                  {gap === 0
                    ? 'Self and manager scores match.'
                    : `Manager scored ${Math.abs(gap)} ${gap < 0 ? 'lower' : 'higher'} than the employee.`}
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <RatingInput
                  label="Final rating"
                  value={final}
                  onChange={setFinal}
                />
                {final > 0 && (
                  <span
                    className="text-sm font-medium"
                    style={{ color: RATING_META[final].color }}
                  >
                    {RATING_META[final].label}
                  </span>
                )}
              </div>
              <FormField
                label="Calibration note"
                name="calibration-note"
                type="textarea"
                rows={2}
                value={note}
                onChange={setNote}
                placeholder="Why this rating? Visible to HR and managers"
              />
            </div>
          )}
          {r.stage === 'Completed' && r.calibrationNote && (
            <p className="mt-4 rounded-xl bg-muted p-4 text-sm dark:bg-muted/40">
              <span className="font-medium">Calibration note: </span>
              {r.calibrationNote}
            </p>
          )}
        </>
      )}

      <div className="mt-5">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold">
          <History size={13} /> Activity
        </div>
        <div
          role="list"
          className="space-y-2 border-l border-border pl-4 text-xs dark:border-border"
        >
          {r.activity.map(a => (
            <div key={a.id} role="listitem" className="relative">
              <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-primary" />
              <span className="text-secondary-foreground dark:text-muted-foreground">
                {a.text}
              </span>{' '}
              <span className="text-muted-foreground">· {fmtDate(a.date)}</span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

function NewCycleModal({
  reviews,
  onCreate,
  onClose,
}: {
  reviews: Review[];
  onCreate: (name: string, due: string, dept: string, launch: boolean) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [due, setDue] = useState('');
  const [dept, setDept] = useState('all');
  const [launch, setLaunch] = useState(true);
  const [error, setError] = useState('');
  const missing = ROSTER.filter(
    e =>
      (dept === 'all' || e.dept === dept) &&
      !reviews.some(r => r.cycle === name.trim() && r.employeeId === e.id)
  );
  const submit = () => {
    if (!name.trim())
      return setError('Name the cycle, for example "Annual 2026".');
    if (!due) return setError('Pick a due date for submissions.');
    if (!missing.length)
      return setError(
        'Everyone in this scope already has a review in this cycle.'
      );
    onCreate(name.trim(), due, dept, launch);
  };
  return (
    <Modal
      title="Start a review cycle"
      subtitle="Creates a review for each employee in scope."
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="destructive" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="default" onClick={submit}>
            Create {missing.length}{' '}
            {missing.length === 1 ? 'review' : 'reviews'}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <FormField
          label="Cycle name"
          name="cycle-name"
          type="text"
          value={name}
          onChange={value => {
            setName(value);
            setError('');
          }}
          placeholder="e.g. Annual 2026"
        />
        <FormField
          label="Submission due date"
          name="cycle-due-date"
          type="date"
          value={due}
          onChange={value => {
            setDue(value);
            setError('');
          }}
        />
        <FormField
          label="Scope"
          name="cycle-scope"
          type="select"
          value={dept}
          onChange={setDept}
          options={performanceReviewDepartmentFilterOptions}
        />
        <FormField
          label="Launch immediately and ask employees for self-assessments"
          name="launch-cycle"
          type="checkbox"
          value={launch}
          onCheckboxChange={setLaunch}
        />
        {error && (
          <p className="text-xs text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    </Modal>
  );
}

const PerformanceReview: React.FC = () => {
  const DEFAULTS = {
    cycle: 'Q4 2026',
    status: 'all',
    department: 'all',
    search: '',
    sort: 'due',
  };
  const [reviews, setReviews] = useState<Review[]>(SEED);
  const [cycles, setCycles] = useState<string[]>(
    performanceReviewCycleOptions.map(option => option.value)
  );
  const [form, setForm] = useState(DEFAULTS);
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const [openId, setOpenId] = useState<string | null>(null);
  const [newCycle, setNewCycle] = useState(false);
  const set = <K extends keyof typeof DEFAULTS>(
    k: K,
    v: (typeof DEFAULTS)[K]
  ) => setForm(p => ({ ...p, [k]: v }));

  const views = useMemo(() => reviews.map(enrich), [reviews]);
  const inCycle = useMemo(
    () => views.filter(r => r.cycle === form.cycle),
    [views, form.cycle]
  );
  const departments = useMemo(
    () => Array.from(new Set(ROSTER.map(e => e.dept))),
    []
  );

  const filtered = useMemo(() => {
    const q = form.search.trim().toLowerCase();
    const list = inCycle.filter(
      r =>
        (form.status === 'all' || r.status === form.status) &&
        (form.department === 'all' || r.department === form.department) &&
        (!q ||
          r.employee.toLowerCase().includes(q) ||
          r.manager.toLowerCase().includes(q))
    );
    const urgency = (r: ReviewView) =>
      r.status === 'Overdue' ? 0 : r.stage === 'Completed' ? 9 : r.daysLeft;
    return [...list].sort((a, b) => {
      if (form.sort === 'attention') return urgency(a) - urgency(b);
      if (form.sort === 'rating')
        return (
          (b.finalRating ?? b.mgrScore ?? 0) -
          (a.finalRating ?? a.mgrScore ?? 0)
        );
      if (form.sort === 'name') return a.employee.localeCompare(b.employee);
      return a.dueDate.localeCompare(b.dueDate);
    });
  }, [inCycle, form]);

  /* analytics (computed from the selected cycle) */
  const done = inCycle.filter(r => r.stage === 'Completed');
  const completion = inCycle.length
    ? Math.round((done.length / inCycle.length) * 100)
    : 0;
  const finals = done.map(r => r.finalRating!).filter(Boolean);
  const avgFinal = finals.length ? avg(finals) : null;
  const both = inCycle.filter(r => r.selfScore !== null && r.mgrScore !== null);
  const calGap = both.length
    ? avg(both.map(r => r.mgrScore! - r.selfScore!))
    : null;
  const count = (s: ReviewStatus) => inCycle.filter(r => r.status === s).length;
  const overdue = inCycle.filter(r => r.status === 'Overdue');

  const statusDist = useMemo(
    () =>
      STATUSES.map(s => ({
        name: s,
        value: inCycle.filter(r => r.status === s).length,
        color: STATUS_COLORS[s],
      })).filter(x => x.value > 0),
    [inCycle]
  );
  const ratingDist = useMemo(
    () =>
      [5, 4, 3, 2, 1]
        .map(n => ({
          name: `${RATING_META[n].label} (${n})`,
          value: inCycle.filter(
            r => r.stage === 'Completed' && r.finalRating === n
          ).length,
          color: RATING_META[n].color,
        }))
        .filter(x => x.value > 0),
    [inCycle]
  );
  const radar = useMemo(
    () =>
      COMPETENCIES.map(c => ({
        subject: c,
        Self: +avg(
          inCycle
            .filter(r => r.selfAssessment)
            .map(r => r.selfAssessment!.ratings[c])
        ).toFixed(2),
        Manager: +avg(
          inCycle
            .filter(r => r.managerAssessment)
            .map(r => r.managerAssessment!.ratings[c])
        ).toFixed(2),
      })),
    [inCycle]
  );
  const deptDist = useMemo(
    () =>
      departments
        .map(d => {
          const rs = inCycle.filter(r => r.department === d);
          return {
            name: d,
            value: rs.length
              ? Math.round(
                  (rs.filter(r => r.stage === 'Completed').length / rs.length) *
                    100
                )
              : 0,
            total: rs.length,
          };
        })
        .filter(d => d.total > 0),
    [inCycle, departments]
  );

  const actions: ReviewActions = useMemo(() => {
    const patch = (id: string, fn: (r: Review) => Review) =>
      setReviews(p => p.map(r => (r.id === id ? fn(r) : r)));
    const log = (r: Review, text: string): LogEntry[] => [
      { id: `${r.id}-${Date.now()}`, date: todayISO(), text },
      ...r.activity,
    ];

    return {
      onLaunch: id => {
        patch(id, r => ({
          ...r,
          stage: 'Pending Self',
          activity: log(r, 'Review launched'),
        }));
        toast.success('Review launched');
        setOpenId(null);
      },
      onSelf: (id, a) => {
        patch(id, r => ({
          ...r,
          stage: 'Pending Manager',
          selfAssessment: a,
          activity: log(r, `${r.employee} submitted a self-assessment`),
        }));
        toast.success('Self-assessment submitted');
        setOpenId(null);
      },
      onManager: (id, a) => {
        patch(id, r => ({
          ...r,
          stage: 'Pending Calibration',
          managerAssessment: a,
          activity: log(r, `${r.manager} submitted the manager review`),
        }));
        toast.success('Manager review submitted');
        setOpenId(null);
      },
      onCalibrate: (id, final, note) => {
        patch(id, r => ({
          ...r,
          stage: 'Completed',
          finalRating: final,
          calibrationNote: note,
          activity: log(r, `Final rating set to ${final}`),
        }));
        toast.success('Final rating saved');
        setOpenId(null);
      },
      onReopen: id => {
        patch(id, r => ({
          ...r,
          stage: 'Pending Calibration',
          finalRating: null,
          activity: log(r, 'Reopened for calibration'),
        }));
        toast.success('Review reopened');
      },
      onRemind: ids => {
        setReviews(p =>
          p.map(r =>
            ids.includes(r.id)
              ? {
                  ...r,
                  activity: log(r, `Reminder sent to ${reminderTarget(r)}`),
                }
              : r
          )
        );
        const first = reviews.find(r => r.id === ids[0]);
        toast.success(
          ids.length === 1 && first
            ? `Reminder sent to ${reminderTarget(first)}`
            : `${ids.length} reminders sent`
        );
      },
    };
  }, [reviews]);
  const createCycle = (
    name: string,
    due: string,
    dept: string,
    launch: boolean
  ) => {
    const fresh = ROSTER.filter(
      e =>
        (dept === 'all' || e.dept === dept) &&
        !reviews.some(r => r.cycle === name && r.employeeId === e.id)
    ).map((e, i) =>
      mk(
        `r${Date.now()}-${i}`,
        e.id,
        name,
        launch ? 'Pending Self' : 'Draft',
        due
      )
    );
    setReviews(p => [...fresh, ...p]);
    setCycles(p => (p.includes(name) ? p : [...p, name]));
    setForm({ ...DEFAULTS, cycle: name });
    setNewCycle(false);
    toast.success(`${fresh.length} reviews created in ${name}`);
  };

  const filtersActive =
    form.status !== 'all' ||
    form.department !== 'all' ||
    form.search !== '' ||
    form.cycle !== DEFAULTS.cycle ||
    form.sort !== 'due';
  const openReview = views.find(r => r.id === openId);
  const columns = useMemo<ColumnDef<ReviewView>[]>(
    () => [
      {
        accessorKey: 'employee',
        header: 'Employee',
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <Avatar name={row.original.employee} />
            <div className="leading-tight">
              <div className="text-sm font-medium">{row.original.employee}</div>
              <div className="text-xs text-muted-foreground dark:text-muted-foreground">
                {row.original.role}
              </div>
            </div>
          </div>
        ),
      },
      { accessorKey: 'department', header: 'Department' },
      { accessorKey: 'manager', header: 'Manager' },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusChip status={row.original.status} />,
      },
      {
        accessorKey: 'selfScore',
        header: 'Self',
        cell: ({ row }) => <Score value={row.original.selfScore} />,
      },
      {
        accessorKey: 'mgrScore',
        header: 'Manager',
        cell: ({ row }) => <Score value={row.original.mgrScore} />,
      },
      {
        accessorKey: 'finalRating',
        header: 'Final',
        cell: ({ row }) => <Score value={row.original.finalRating} />,
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
            {remindable(row.original) && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={iconBtn}
                aria-label="Send reminder"
                onClick={() => actions.onRemind([row.original.id])}
              >
                <Bell size={15} />
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={iconBtn}
              aria-label="Open review"
              onClick={() => setOpenId(row.original.id)}
            >
              <Eye size={15} />
            </Button>
          </div>
        ),
      },
    ],
    [actions]
  );

  const tiles: { status: ReviewStatus; label: string; hint: string }[] = [
    {
      status: 'Pending Self',
      label: 'Awaiting self-review',
      hint: 'With employees',
    },
    {
      status: 'Pending Manager',
      label: 'Awaiting manager',
      hint: 'With managers',
    },
    { status: 'Pending Calibration', label: 'To calibrate', hint: 'With HR' },
    { status: 'Overdue', label: 'Overdue', hint: 'Past due date' },
  ];

  return (
    <div className="min-h-screen space-y-4 p-1 text-foreground dark:text-muted-foreground">
      <Section
        title="Performance Reviews"
        menuId="performance-reviews"
        showBreadcrumbs
      >
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm font-medium text-primary">
              <ClipboardList size={14} /> Performance & Growth
            </div>
            <p className="text-xs text-muted-foreground dark:text-muted-foreground">
              Run review cycles from self-assessment to calibrated final
              ratings.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={!overdue.length}
              onClick={() => actions.onRemind(overdue.map(r => r.id))}
            >
              <Bell size={14} /> Remind overdue ({overdue.length})
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={() => setNewCycle(true)}
            >
              <Plus className="w-4 h-4" /> New cycle
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <FormField
            label="Cycle"
            name="cycle"
            type="select"
            value={form.cycle}
            onChange={v => set('cycle', v)}
            options={[
              ...performanceReviewCycleOptions,
              ...cycles
                .filter(
                  cycle =>
                    !performanceReviewCycleOptions.some(
                      option => option.value === cycle
                    )
                )
                .map(value => ({ value, label: value })),
            ]}
          />
          <FormField
            label="Status"
            name="status"
            type="select"
            value={form.status}
            onChange={v => set('status', v)}
            options={performanceReviewStatusFilterOptions}
          />
          <FormField
            label="Department"
            name="department"
            type="select"
            value={form.department}
            onChange={v => set('department', v)}
            options={performanceReviewDepartmentFilterOptions}
          />
          <FormField
            label="Sort by"
            name="sort"
            type="select"
            value={form.sort}
            onChange={v => set('sort', v)}
            options={performanceReviewSortOptions}
          />
          <FormField
            label="Search"
            name="search"
            type="text"
            value={form.search}
            onChange={v => set('search', v)}
            placeholder="Employee or manager"
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

      {/* Hero + clickable status tiles */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        <div
          className={`${cardCls} col-span-2 flex items-center gap-4 bg-gradient-to-br from-primary/10 to-card dark:from-primary/40 dark:to-muted`}
        >
          <ProgressRing value={completion} color="hsl(var(--primary))" />
          <div className="min-w-0">
            <div className="text-xs font-medium text-muted-foreground dark:text-muted-foreground">
              {form.cycle} completion
            </div>
            <div className="mt-0.5 text-sm font-semibold">
              {done.length} of {inCycle.length} reviews complete
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground dark:text-muted-foreground">
              <Star
                size={12}
                className="text-accent-foreground"
                fill="hsl(var(--accent-foreground))"
              />
              {avgFinal !== null
                ? `${avgFinal.toFixed(1)} average final rating`
                : 'No final ratings yet'}
            </div>
            {calGap !== null && (
              <div className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
                {Math.abs(calGap) < 0.05
                  ? 'Managers and employees agree on average.'
                  : `Managers rate ${Math.abs(calGap).toFixed(1)} ${calGap < 0 ? 'lower' : 'higher'} than employees.`}
              </div>
            )}
          </div>
        </div>
        {tiles.map(t => {
          const c = STATUS_COLORS[t.status];
          const active = form.status === t.status;
          return (
            <Button
              key={t.status}
              type="button"
              variant="ghost"
              aria-pressed={active}
              onClick={() => set('status', active ? 'all' : t.status)}
              className={`${cardCls} h-auto w-full flex-col items-stretch text-left transition hover:border-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary dark:hover:border-border`}
              style={
                active
                  ? { borderColor: c, boxShadow: `0 0 0 1px ${c}` }
                  : undefined
              }
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground dark:text-muted-foreground">
                  {t.label}
                </span>
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{
                    background: `color-mix(in srgb, ${c} 10%, transparent)`,
                    color: c,
                  }}
                >
                  <Clock size={14} />
                </span>
              </div>
              <div className="mt-2 text-2xl font-semibold tabular-nums">
                {count(t.status)}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
                {active ? 'Filter applied' : t.hint}
              </div>
            </Button>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className={`${cardCls} xl:col-span-2`}>
          <h3 className="text-sm font-semibold">Where reviews are stuck</h3>
          <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
            Select a bar to filter the list
          </p>
          <div className="mt-3 text-foreground dark:text-muted-foreground">
            {statusDist.length === 0 ? (
              <p className="py-16 text-center text-xs text-muted-foreground">
                No reviews in {form.cycle}.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={230}>
                <BarChart
                  data={statusDist}
                  margin={{ top: 16, right: 8, bottom: 0, left: -20 }}
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
                    name="Reviews"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={52}
                    cursor="pointer"
                    onClick={datum => {
                      if (typeof datum.name !== 'string') return;
                      set(
                        'status',
                        form.status === datum.name
                          ? 'all'
                          : (datum.name as ReviewStatus)
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
            )}
          </div>
        </div>

        <div className={cardCls}>
          <h3 className="text-sm font-semibold">Final rating distribution</h3>
          <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
            Completed reviews in {form.cycle}
          </p>
          {ratingDist.length === 0 ? (
            <p className="py-16 text-center text-xs text-muted-foreground dark:text-muted-foreground">
              Ratings appear once calibration finishes.
            </p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie
                    data={ratingDist}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={76}
                    paddingAngle={3}
                    cornerRadius={4}
                    stroke="none"
                  >
                    {ratingDist.map(r => (
                      <Cell key={r.name} fill={r.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div role="list" className="mt-1 space-y-1.5">
                {ratingDist.map(r => (
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
            </>
          )}
        </div>

        <div className={cardCls}>
          <h3 className="text-sm font-semibold">
            Self vs manager by competency
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
            Average score out of 5
          </p>
          <div className="text-foreground dark:text-muted-foreground">
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radar} outerRadius="68%">
                <PolarGrid stroke="currentColor" strokeOpacity={0.15} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.7 }}
                />
                <Radar
                  name="Self"
                  dataKey="Self"
                  stroke="hsl(var(--accent-foreground))"
                  fill="hsl(var(--accent-foreground))"
                  fillOpacity={0.15}
                />
                <Radar
                  name="Manager"
                  dataKey="Manager"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.25}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11 }}
                  iconType="circle"
                  iconSize={8}
                />
                <Tooltip content={<ChartTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${cardCls} xl:col-span-2`}>
          <h3 className="text-sm font-semibold">Completion by department</h3>
          <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
            Share of reviews finished in {form.cycle}
          </p>
          <div className="mt-3 text-foreground dark:text-muted-foreground">
            {deptDist.length === 0 ? (
              <p className="py-16 text-center text-xs text-muted-foreground">
                Nothing to compare yet.
              </p>
            ) : (
              <ResponsiveContainer
                width="100%"
                height={Math.max(160, deptDist.length * 44)}
              >
                <BarChart
                  data={deptDist}
                  layout="vertical"
                  margin={{ top: 0, right: 28, bottom: 0, left: 8 }}
                >
                  <CartesianGrid {...gridProps} horizontal={false} vertical />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={axisTick}
                    tickLine={false}
                    axisLine={false}
                    unit="%"
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={150}
                    tick={axisTick}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'currentColor', fillOpacity: 0.05 }}
                    content={<ChartTooltip />}
                  />
                  <Bar
                    dataKey="value"
                    name="Completed %"
                    fill="hsl(var(--primary))"
                    radius={[0, 8, 8, 0]}
                    maxBarSize={22}
                    cursor="pointer"
                    onClick={datum => {
                      if (typeof datum.name !== 'string') return;
                      set(
                        'department',
                        form.department === datum.name ? 'all' : datum.name
                      );
                    }}
                  >
                    <LabelList
                      dataKey="value"
                      position="right"
                      formatter={value => `${value}%`}
                      style={{
                        fontSize: 11,
                        fill: 'currentColor',
                        opacity: 0.7,
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">
          {filtered.length} {filtered.length === 1 ? 'review' : 'reviews'}
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
              size="sm"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className="capitalize"
            >
              {v}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          className={`${cardCls} flex flex-col items-center py-14 text-center`}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground dark:bg-muted">
            <SearchX size={22} />
          </span>
          <h3 className="mt-4 text-sm font-semibold">
            {inCycle.length === 0
              ? `No reviews in ${form.cycle} yet`
              : 'No reviews match these filters'}
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground dark:text-muted-foreground">
            {inCycle.length === 0
              ? 'Start the cycle to create a review for each employee.'
              : 'Clear the filters to see everyone in this cycle.'}
          </p>
          <div className="mt-4">
            {inCycle.length === 0 ? (
              <Button
                type="button"
                className="bg-primary hover:bg-primary"
                onClick={() => setNewCycle(true)}
              >
                <Plus size={14} /> Start cycle
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => setForm({ ...DEFAULTS, cycle: form.cycle })}
              >
                <RotateCcw size={14} /> Clear filters
              </Button>
            )}
          </div>
        </div>
      ) : view === 'cards' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(r => (
            <div key={r.id} className={`${cardCls} flex flex-col gap-3`}>
              <div className="flex items-start gap-3">
                <Avatar name={r.employee} size={44} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">
                    {r.employee}
                  </div>
                  <div className="truncate text-xs text-muted-foreground dark:text-muted-foreground">
                    {r.role}
                  </div>
                </div>
                <StatusChip status={r.status} />
              </div>
              <StageTrack stage={r.stage} overdue={r.status === 'Overdue'} />
              <div className="flex items-center justify-between text-xs text-muted-foreground dark:text-muted-foreground">
                <span className="flex items-center gap-1.5 truncate">
                  <Users size={12} /> {r.manager}
                </span>
                <span
                  className={`flex items-center gap-1.5 whitespace-nowrap ${r.status === 'Overdue' ? 'font-medium text-destructive' : ''}`}
                >
                  {r.stage === 'Completed' ? (
                    <CheckCircle2 size={12} className="text-primary" />
                  ) : (
                    <Clock size={12} />
                  )}{' '}
                  {dueLabel(r)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted p-2.5 text-center text-xs dark:bg-muted/40">
                {(
                  [
                    ['Self', r.selfScore],
                    ['Manager', r.mgrScore],
                    ['Final', r.finalRating],
                  ] as const
                ).map(([l, v]) => (
                  <div key={l}>
                    <div className="mb-1 text-muted-foreground dark:text-muted-foreground">
                      {l}
                    </div>
                    <div className="flex justify-center">
                      {v === null ? (
                        <span className="text-muted-foreground">Not yet</span>
                      ) : (
                        <span className="text-base font-semibold tabular-nums">
                          {Number.isInteger(v) ? v : v.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-auto flex gap-2">
                <Button
                  type="button"
                  className="flex flex-1 justify-center"
                  variant={r.stage === 'Completed' ? 'default' : undefined}
                  onClick={() => setOpenId(r.id)}
                >
                  {actionLabel[r.stage]}
                </Button>
                {remindable(r) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label={`Remind ${reminderTarget(r)}`}
                    title={`Remind ${reminderTarget(r)}`}
                    onClick={() => actions.onRemind([r.id])}
                  >
                    <Bell size={15} />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Section title="All reviews">
          <TanStackTable
            showDownload={true}
            key={JSON.stringify(form)}
            data={filtered}
            columns={columns}
            searchPlaceholder="Search reviews..."
            pageSize={10}
            enableColumnVisibility
            enableRowSelection={false}
          />
        </Section>
      )}

      {openReview && (
        <ReviewModal
          key={openReview.id + openReview.stage}
          r={openReview}
          onClose={() => setOpenId(null)}
          actions={actions}
        />
      )}
      {newCycle && (
        <NewCycleModal
          reviews={reviews}
          onCreate={createCycle}
          onClose={() => setNewCycle(false)}
        />
      )}
    </div>
  );
};

export default PerformanceReview;
