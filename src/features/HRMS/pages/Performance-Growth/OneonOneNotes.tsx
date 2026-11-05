import React, { useCallback, useMemo, useState } from 'react';
import {
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
  LabelList,
} from 'recharts';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Heart,
  MessageSquare,
  RotateCcw,
  SearchX,
  Send,
  Smile,
  Sparkles,
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { TanStackTable } from '@/components/common';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  oneOnOneCategoryFilterOptions,
  oneOnOneCategoryOptions,
  oneOnOneEmployeeFilterOptions,
  oneOnOneSentimentFilterOptions,
  oneOnOneSentimentOptions,
} from '@/data/reusableDropdownData';

type Sentiment = 'Positive' | 'Neutral' | 'Needs Attention';
type ActionStatus = 'Open' | 'In Progress' | 'Completed' | 'Overdue';
type Category =
  | 'Career'
  | 'Performance'
  | 'Wellbeing'
  | 'Feedback'
  | 'Growth'
  | 'Blockers';

interface ActionItem {
  id: string;
  text: string;
  owner: string;
  status: ActionStatus;
  dueDate: string;
}

interface Meeting {
  id: string;
  manager: string;
  employee: string;
  employeeRole: string;
  date: string;
  duration: number;
  sentiment: Sentiment;
  category: Category;
  agenda: string[];
  notes: string;
  wins: string[];
  blockers: string[];
  actionItems: ActionItem[];
}

const SENTIMENT_COLORS: Record<Sentiment, string> = {
  Positive: 'hsl(var(--primary))',
  Neutral: 'hsl(var(--secondary-foreground))',
  'Needs Attention': 'hsl(var(--accent-foreground))',
};

const ACTION_COLORS: Record<ActionStatus, string> = {
  Open: 'hsl(var(--primary))',
  'In Progress': 'hsl(var(--secondary-foreground))',
  Completed: 'hsl(var(--primary))',
  Overdue: 'hsl(var(--destructive))',
};

const CATEGORY_COLORS: Record<Category, string> = {
  Career: 'hsl(var(--primary))',
  Performance: 'hsl(var(--accent-foreground))',
  Wellbeing: 'hsl(var(--destructive))',
  Feedback: 'hsl(var(--accent-foreground))',
  Growth: 'hsl(var(--primary))',
  Blockers: 'hsl(var(--destructive))',
};

const MEETINGS: Meeting[] = [
  {
    id: 'm1',
    manager: 'Daniel Whitmore',
    employee: 'Lucas Bergström',
    employeeRole: 'Junior Software Engineer',
    date: '2026-10-24',
    duration: 30,
    sentiment: 'Positive',
    category: 'Growth',
    agenda: ['Career path', 'AWS certification progress', 'Project feedback'],
    notes:
      'Lucas has made great progress on the payments module. Discussed the AWS Solutions Architect certification path and recommended a study plan. Team feedback is very positive overall.',
    wins: ['Shipped payments retry logic', 'Helped onboard 2 new joiners'],
    blockers: ['Needs focused study time for certification'],
    actionItems: [
      {
        id: 'a1',
        text: 'Block 4 hours/week for study',
        owner: 'Lucas Bergström',
        status: 'In Progress',
        dueDate: '2026-11-05',
      },
      {
        id: 'a2',
        text: 'Share study resources doc',
        owner: 'Daniel Whitmore',
        status: 'Completed',
        dueDate: '2026-10-28',
      },
    ],
  },
  {
    id: 'm2',
    manager: 'Sophia Laurent',
    employee: 'Mateo Alvarez',
    employeeRole: 'Digital Marketing Executive',
    date: '2026-10-22',
    duration: 45,
    sentiment: 'Positive',
    category: 'Performance',
    agenda: [
      'Q4 campaign results',
      'Next quarter planning',
      'Skill development',
    ],
    notes:
      'Mateo led 3 successful campaigns this quarter. Numbers are strong. Discussed moving him to a lead role in Q1 2026 with more ownership over strategy.',
    wins: ['3 campaigns delivered above target', 'Improved CTR by 24%'],
    blockers: [],
    actionItems: [
      {
        id: 'a3',
        text: 'Draft Q1 campaign plan',
        owner: 'Mateo Alvarez',
        status: 'Open',
        dueDate: '2026-11-15',
      },
    ],
  },
  {
    id: 'm3',
    manager: 'Daniel Whitmore',
    employee: 'Emma Lindqvist',
    employeeRole: 'Software Engineer',
    date: '2026-10-20',
    duration: 30,
    sentiment: 'Needs Attention',
    category: 'Blockers',
    agenda: ['Workload concerns', 'Design ownership', 'Team collaboration'],
    notes:
      'Emma has expressed feeling stretched across too many projects. Discussed prioritization with the team lead. Also talked about taking more ownership on system design.',
    wins: ['Handled critical bug fix under pressure'],
    blockers: ['Split across 3 concurrent projects', 'Limited design exposure'],
    actionItems: [
      {
        id: 'a4',
        text: 'Rebalance project allocation',
        owner: 'Daniel Whitmore',
        status: 'In Progress',
        dueDate: '2026-11-01',
      },
      {
        id: 'a5',
        text: 'Pair with senior engineer on design',
        owner: 'Emma Lindqvist',
        status: 'Open',
        dueDate: '2026-11-20',
      },
      {
        id: 'a6',
        text: 'Weekly sync on workload',
        owner: 'Daniel Whitmore',
        status: 'Completed',
        dueDate: '2026-10-25',
      },
    ],
  },
  {
    id: 'm4',
    manager: 'Isabella Rossi',
    employee: 'Olivia Chen',
    employeeRole: 'Business Development Manager',
    date: '2026-10-18',
    duration: 60,
    sentiment: 'Positive',
    category: 'Career',
    agenda: ['Promotion readiness', 'Team building', 'Delegation skills'],
    notes:
      'Olivia closed the largest enterprise deal this year. Discussed promotion readiness — strong on delivery, needs more delegation. Set up a mentorship plan with the VP.',
    wins: ['Closed $2.4M enterprise deal', 'Mentored 2 juniors'],
    blockers: ['Tendency to over-own execution'],
    actionItems: [
      {
        id: 'a7',
        text: 'Pair with VP on delegation',
        owner: 'Olivia Chen',
        status: 'Open',
        dueDate: '2026-11-10',
      },
      {
        id: 'a8',
        text: 'Prepare promotion case doc',
        owner: 'Isabella Rossi',
        status: 'In Progress',
        dueDate: '2026-11-30',
      },
    ],
  },
  {
    id: 'm5',
    manager: 'Hiroshi Tanaka',
    employee: 'Kenji Nakamura',
    employeeRole: 'Junior Software Engineer',
    date: '2026-10-15',
    duration: 30,
    sentiment: 'Neutral',
    category: 'Feedback',
    agenda: ['Q3 review debrief', 'Code review feedback', 'Next quarter goals'],
    notes:
      'Reviewed Q3 outcomes. Strong delivery, but code reviews need more depth. Set 2 clear goals for Q4 around code quality and design participation.',
    wins: ['Shipped two major features'],
    blockers: ['Code review depth'],
    actionItems: [
      {
        id: 'a9',
        text: 'Complete code review workshop',
        owner: 'Kenji Nakamura',
        status: 'Open',
        dueDate: '2026-11-12',
      },
    ],
  },
  {
    id: 'm6',
    manager: 'Daniel Whitmore',
    employee: 'Noah Fischer',
    employeeRole: 'Software Engineer Trainee',
    date: '2026-10-12',
    duration: 30,
    sentiment: 'Positive',
    category: 'Wellbeing',
    agenda: ['Onboarding feedback', 'Wellbeing check-in', 'Learning plan'],
    notes:
      'Noah is settling in well. No wellbeing concerns. Discussed a structured learning plan for the next 3 months.',
    wins: ['Ramped up quickly on the codebase'],
    blockers: [],
    actionItems: [
      {
        id: 'a10',
        text: 'Share learning plan',
        owner: 'Daniel Whitmore',
        status: 'Completed',
        dueDate: '2026-10-15',
      },
    ],
  },
  {
    id: 'm7',
    manager: 'Isabella Rossi',
    employee: 'Camila Fernández',
    employeeRole: 'Product Designer',
    date: '2026-10-10',
    duration: 30,
    sentiment: 'Positive',
    category: 'Feedback',
    agenda: ['Design system rollout', 'Peer feedback', 'Goals for Q4'],
    notes:
      'Camila led the design-system rollout smoothly. Peer feedback is glowing. Next step is mentoring juniors on the new system.',
    wins: ['Led design-system rollout', 'Delivered 5 marketing pages'],
    blockers: [],
    actionItems: [
      {
        id: 'a11',
        text: 'Plan design-system mentoring',
        owner: 'Camila Fernández',
        status: 'In Progress',
        dueDate: '2026-11-08',
      },
    ],
  },
  {
    id: 'm8',
    manager: 'Hiroshi Tanaka',
    employee: 'Amara Okonkwo',
    employeeRole: 'Data Analyst',
    date: '2026-10-08',
    duration: 45,
    sentiment: 'Neutral',
    category: 'Performance',
    agenda: ['Q3 report quality', 'SQL depth', 'Growth plan'],
    notes:
      'Amara delivered her Q3 dashboards on time. SQL needs more depth. Set a learning plan and paired her with a senior analyst.',
    wins: ['Shipped Q3 exec dashboards'],
    blockers: ['Advanced SQL confidence'],
    actionItems: [
      {
        id: 'a12',
        text: 'Pair with senior analyst on SQL',
        owner: 'Hiroshi Tanaka',
        status: 'Open',
        dueDate: '2026-11-15',
      },
    ],
  },
];

const SENTIMENTS: Sentiment[] = oneOnOneSentimentOptions.map(
  option => option.value as Sentiment
);
const CATEGORIES: Category[] = oneOnOneCategoryOptions.map(
  option => option.value as Category
);
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
  size = 28,
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
        fontSize: size * 0.38,
      }}
    >
      {initials(name)}
    </span>
  );
}

function SentimentChip({ sentiment }: { sentiment: Sentiment }) {
  const c = SENTIMENT_COLORS[sentiment];
  const Icon =
    sentiment === 'Positive'
      ? Smile
      : sentiment === 'Neutral'
        ? Heart
        : AlertCircle;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{
        background: `color-mix(in srgb, ${c} 12%, transparent)`,
        color: c,
      }}
    >
      <Icon size={12} /> {sentiment}
    </span>
  );
}

function CategoryChip({ category }: { category: Category }) {
  const c = CATEGORY_COLORS[category];
  return (
    <span
      className="inline-block rounded-md px-2 py-0.5 text-xs font-semibold"
      style={{
        background: `color-mix(in srgb, ${c} 12%, transparent)`,
        color: c,
      }}
    >
      {category}
    </span>
  );
}

function ActionStatusChip({ status }: { status: ActionStatus }) {
  const c = ACTION_COLORS[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{
        background: `color-mix(in srgb, ${c} 12%, transparent)`,
        color: c,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />
      {status}
    </span>
  );
}

function MeetingDetailPanel({
  meeting,
  onClose,
}: {
  meeting: Meeting;
  onClose: () => void;
}) {
  return (
    <div
      className={cardCls}
      role="region"
      aria-label={`1:1 with ${meeting.employee}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-4">
          <Avatar name={meeting.employee} size={52} />
          <div>
            <div className="text-base font-semibold">{meeting.employee}</div>
            <div className="text-xs text-muted-foreground dark:text-muted-foreground">
              {meeting.employeeRole} · with {meeting.manager}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 rounded-md border border-border px-2 py-0.5 text-xs dark:border-border">
          <Calendar size={12} /> {fmtDate(meeting.date)}
        </span>
        <span className="flex items-center gap-1 rounded-md border border-border px-2 py-0.5 text-xs dark:border-border">
          <Clock size={12} /> {meeting.duration} min
        </span>
        <SentimentChip sentiment={meeting.sentiment} />
        <CategoryChip category={meeting.category} />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground dark:text-muted-foreground">
            Agenda
          </div>
          <div role="list" className="space-y-1.5">
            {meeting.agenda.map(a => (
              <div
                key={a}
                role="listitem"
                className="flex items-start gap-2 text-sm"
              >
                <CheckCircle2
                  size={14}
                  className="mt-0.5 flex-shrink-0 text-primary"
                />
                {a}
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-border bg-muted p-4 dark:border-border dark:bg-muted/40">
            <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground dark:text-muted-foreground">
              <FileText size={12} /> Notes
            </div>
            <p className="text-sm leading-relaxed">{meeting.notes}</p>
          </div>
        </div>

        <div>
          {meeting.wins.length > 0 && (
            <div className="mb-3 rounded-xl border border-primary/30 bg-primary/10 p-4 dark:border-primary/40 dark:bg-primary/10">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-primary dark:text-primary">
                <Sparkles size={13} /> Wins
              </div>
              <div role="list" className="space-y-1">
                {meeting.wins.map(w => (
                  <div
                    key={w}
                    role="listitem"
                    className="text-sm text-primary dark:text-primary"
                  >
                    • {w}
                  </div>
                ))}
              </div>
            </div>
          )}

          {meeting.blockers.length > 0 && (
            <div className="rounded-xl border border-accent/30 bg-accent/10 p-4 dark:border-accent/40 dark:bg-accent/10">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-accent-foreground dark:text-accent-foreground">
                <AlertCircle size={13} /> Blockers
              </div>
              <div role="list" className="space-y-1">
                {meeting.blockers.map(b => (
                  <div
                    key={b}
                    role="listitem"
                    className="text-sm text-accent-foreground dark:text-accent-foreground"
                  >
                    • {b}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground dark:text-muted-foreground">
        Action items ({meeting.actionItems.length})
      </div>
      <div className="mb-4 grid grid-cols-1 gap-2 lg:grid-cols-2">
        {meeting.actionItems.map(a => (
          <div
            key={a.id}
            className="flex items-start justify-between gap-3 rounded-lg border border-border bg-muted p-3 dark:border-border dark:bg-muted/40"
          >
            <div className="flex items-start gap-2">
              <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 " />
              <div>
                <div className="text-sm">{a.text}</div>
                <div className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
                  {a.owner} · due {fmtDate(a.dueDate)}
                </div>
              </div>
            </div>
            <ActionStatusChip status={a.status} />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="destructive" onClick={onClose}>
          Close
        </Button>
        <Button type="button" variant="default">
          <Send className="w-4 h-4" /> Share summary
        </Button>
      </div>
    </div>
  );
}

const OneonOneNotes: React.FC = () => {
  const DEFAULTS = {
    sentiment: 'all',
    category: 'all',
    employee: 'all',
    search: '',
  };
  const [form, setForm] = useState(DEFAULTS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<'cards' | 'table'>('cards');

  const set = <K extends keyof typeof DEFAULTS>(
    k: K,
    v: (typeof DEFAULTS)[K]
  ) => setForm(prev => ({ ...prev, [k]: v }));

  const filtered = useMemo(() => {
    const q = form.search.trim().toLowerCase();
    return MEETINGS.filter(
      m =>
        (form.sentiment === 'all' || m.sentiment === form.sentiment) &&
        (form.category === 'all' || m.category === form.category) &&
        (form.employee === 'all' || m.employee === form.employee) &&
        (!q ||
          m.employee.toLowerCase().includes(q) ||
          m.manager.toLowerCase().includes(q) ||
          m.notes.toLowerCase().includes(q))
    );
  }, [form]);

  const selected = selectedId
    ? (MEETINGS.find(m => m.id === selectedId) ?? null)
    : null;

  const openMeeting = useCallback((id: string) => setSelectedId(id), []);

  const closeMeeting = () => setSelectedId(null);

  const sentimentDist = useMemo(
    () =>
      SENTIMENTS.map(s => ({
        name: s,
        value: MEETINGS.filter(m => m.sentiment === s).length,
        color: SENTIMENT_COLORS[s],
      })),
    []
  );

  const categoryDist = useMemo(
    () =>
      CATEGORIES.map(c => ({
        name: c,
        value: MEETINGS.filter(m => m.category === c).length,
        color: CATEGORY_COLORS[c],
      })).filter(x => x.value > 0),
    []
  );

  const allActions = MEETINGS.flatMap(m => m.actionItems);
  const openActions = allActions.filter(
    a => a.status === 'Open' || a.status === 'In Progress'
  ).length;
  const overdueActions = allActions.filter(a => a.status === 'Overdue').length;
  const completedActions = allActions.filter(
    a => a.status === 'Completed'
  ).length;
  const totalMinutes = MEETINGS.reduce((s, m) => s + m.duration, 0);

  const columns = useMemo<ColumnDef<Meeting>[]>(
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
                {row.original.employeeRole}
              </div>
            </div>
          </div>
        ),
      },
      { accessorKey: 'manager', header: 'Manager' },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => (
          <span className="text-xs tabular-nums">
            {fmtDate(row.original.date)}
          </span>
        ),
      },
      {
        accessorKey: 'duration',
        header: 'Duration',
        cell: ({ row }) => (
          <span className="text-xs">{row.original.duration} min</span>
        ),
      },
      {
        accessorKey: 'sentiment',
        header: 'Sentiment',
        cell: ({ row }) => <SentimentChip sentiment={row.original.sentiment} />,
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => <CategoryChip category={row.original.category} />,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex flex-wrap items-center gap-1">
            {row.original.actionItems.slice(0, 2).map(a => (
              <ActionStatusChip key={a.id} status={a.status} />
            ))}
            {row.original.actionItems.length > 2 && (
              <span className="text-xs text-muted-foreground">
                +{row.original.actionItems.length - 2}
              </span>
            )}
          </div>
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
            onClick={() => openMeeting(row.original.id)}
            className="text-muted-foreground dark:text-muted-foreground"
            aria-label="View notes"
          >
            <ChevronRight size={15} />
          </Button>
        ),
      },
    ],
    [openMeeting]
  );

  return (
    <div className="min-h-screen space-y-4  p-1 text-foreground dark:text-muted-foreground">
      <Section
        title="One-on-One Notes"
        menuId="one-on-one-notes"
        showBreadcrumbs
      >
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary dark:text-primary">
              <MessageSquare size={13} /> Performance & Growth
            </div>
            <p className="text-xs text-muted-foreground dark:text-muted-foreground">
              Capture notes, wins, blockers and action items from every 1:1
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <FormField
            label="Employee"
            name="employee"
            type="select"
            value={form.employee}
            onChange={v => set('employee', v)}
            options={oneOnOneEmployeeFilterOptions}
          />
          <FormField
            label="Sentiment"
            name="sentiment"
            type="select"
            value={form.sentiment}
            onChange={v => set('sentiment', v)}
            options={oneOnOneSentimentFilterOptions}
          />
          <FormField
            label="Category"
            name="category"
            type="select"
            value={form.category}
            onChange={v => set('category', v)}
            options={oneOnOneCategoryFilterOptions}
          />
          <FormField
            label="Search"
            name="search"
            type="text"
            value={form.search}
            onChange={v => set('search', v)}
            placeholder="Employee, manager or notes..."
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
            label: 'Total 1:1s',
            value: MEETINGS.length,
            hint: `${totalMinutes} min total`,
            color: 'hsl(var(--primary))',
            icon: MessageSquare,
          },
          {
            label: 'Open actions',
            value: openActions,
            hint: 'Awaiting action',
            color: 'hsl(var(--secondary-foreground))',
            icon: Clock,
          },
          {
            label: 'Completed',
            value: completedActions,
            hint: 'Actions closed',
            color: 'hsl(var(--primary))',
            icon: CheckCircle2,
          },
          {
            label: 'Overdue',
            value: overdueActions,
            hint: 'Past due',
            color: 'hsl(var(--destructive))',
            icon: AlertCircle,
          },
          {
            label: 'Positive',
            value: sentimentDist.find(s => s.name === 'Positive')?.value || 0,
            hint: 'Good sentiment',
            color: 'hsl(var(--accent-foreground))',
            icon: Smile,
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

      {selected && (
        <Dialog open onOpenChange={open => !open && closeMeeting()}>
          <DialogContent
            className="max-h-[90vh] overflow-y-auto sm:max-w-3xl"
            onInteractOutside={event => event.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>One-on-one notes</DialogTitle>
              <DialogDescription>
                {selected.employee} with {selected.manager}
              </DialogDescription>
            </DialogHeader>
            <MeetingDetailPanel meeting={selected} onClose={closeMeeting} />
          </DialogContent>
        </Dialog>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className={`${cardCls} xl:col-span-2`}>
          <h3 className="text-sm font-semibold">Sentiment over time</h3>
          <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
            Meeting sentiment distribution
          </p>
          <div className="mt-3 text-foreground dark:text-muted-foreground">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={[
                  {
                    name: 'Positive',
                    value:
                      sentimentDist.find(s => s.name === 'Positive')?.value ||
                      0,
                    color: SENTIMENT_COLORS.Positive,
                  },
                  {
                    name: 'Neutral',
                    value:
                      sentimentDist.find(s => s.name === 'Neutral')?.value || 0,
                    color: SENTIMENT_COLORS.Neutral,
                  },
                  {
                    name: 'Needs Attn',
                    value:
                      sentimentDist.find(s => s.name === 'Needs Attention')
                        ?.value || 0,
                    color: SENTIMENT_COLORS['Needs Attention'],
                  },
                ]}
                margin={{ top: 8, right: 8, bottom: 0, left: -20 }}
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
                  name="Meetings"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={50}
                >
                  {[
                    { c: SENTIMENT_COLORS.Positive },
                    { c: SENTIMENT_COLORS.Neutral },
                    { c: SENTIMENT_COLORS['Needs Attention'] },
                  ].map((x, i) => (
                    <Cell key={i} fill={x.c} />
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
          <h3 className="text-sm font-semibold">By category</h3>
          <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
            Topics discussed
          </p>
          <div className="mt-2">
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie
                  data={categoryDist}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={54}
                  outerRadius={80}
                  paddingAngle={3}
                  cornerRadius={4}
                  stroke="none"
                >
                  {categoryDist.map(c => (
                    <Cell key={c.name} fill={c.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div role="list" className="mt-2 space-y-1.5">
            {categoryDist.map(c => (
              <div
                key={c.name}
                role="listitem"
                className="flex items-center justify-between text-xs"
              >
                <span className="flex items-center gap-2 text-secondary-foreground dark:text-muted-foreground">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: c.color }}
                  />
                  {c.name}
                </span>
                <span className="font-medium tabular-nums">{c.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`${cardCls} xl:col-span-3`}>
          <h3 className="text-sm font-semibold">Action item status</h3>
          <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
            Every action across all 1:1s
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            {(
              ['Open', 'In Progress', 'Completed', 'Overdue'] as ActionStatus[]
            ).map(s => {
              const count = allActions.filter(a => a.status === s).length;
              const pct = allActions.length
                ? Math.round((count / allActions.length) * 100)
                : 0;
              const c = ACTION_COLORS[s];
              return (
                <div
                  key={s}
                  className="rounded-xl border border-border bg-muted p-4 dark:border-border dark:bg-muted/40"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: c }}
                    />
                    <span className="text-xs font-medium text-secondary-foreground dark:text-muted-foreground">
                      {s}
                    </span>
                  </div>
                  <div className="mt-2 text-2xl font-semibold tabular-nums">
                    {count}
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-muted dark:bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: c }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground dark:text-muted-foreground">
                    {pct}% of total
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">
          {filtered.length} {filtered.length === 1 ? 'meeting' : 'meetings'}
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
          <h3 className="mt-4 text-sm font-semibold">No 1:1s found</h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground dark:text-muted-foreground">
            Try a different filter or clear the search.
          </p>
        </div>
      ) : view === 'cards' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(m => {
            const doneCount = m.actionItems.filter(
              a => a.status === 'Completed'
            ).length;
            const isActive = selectedId === m.id;
            return (
              <div
                key={m.id}
                className={`flex flex-col gap-3 rounded-xl border bg-card p-5 transition-all duration-300 dark:bg-card ${
                  isActive
                    ? 'border-primary ring-2 ring-primary/40'
                    : 'border-border hover:border-primary dark:border-border dark:hover:border-primary'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar name={m.employee} size={44} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">
                      {m.employee}
                    </div>
                    <div className="truncate text-xs text-muted-foreground dark:text-muted-foreground">
                      with {m.manager}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <SentimentChip sentiment={m.sentiment} />
                  <CategoryChip category={m.category} />
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground dark:text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {fmtDate(m.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {m.duration} min
                  </span>
                </div>

                <p className="line-clamp-2 text-xs text-secondary-foreground dark:text-muted-foreground">
                  {m.notes}
                </p>

                <div className="grid grid-cols-3 gap-2 rounded-lg border border-border bg-muted p-2.5 text-center text-xs dark:border-border dark:bg-muted/40">
                  <div>
                    <div className="text-muted-foreground dark:text-muted-foreground">
                      Wins
                    </div>
                    <div className="mt-0.5 font-semibold text-primary dark:text-primary">
                      {m.wins.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground dark:text-muted-foreground">
                      Blockers
                    </div>
                    <div className="mt-0.5 font-semibold text-accent-foreground dark:text-accent-foreground">
                      {m.blockers.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground dark:text-muted-foreground">
                      Actions
                    </div>
                    <div className="mt-0.5 font-semibold text-primary dark:text-primary">
                      {doneCount}/{m.actionItems.length}
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openMeeting(m.id)}
                  className="mt-1 w-full"
                >
                  <FileText size={14} /> View notes <ChevronRight size={14} />
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <Section title="All meetings">
          <TanStackTable
            showDownload={true}
            key={JSON.stringify(form)}
            data={filtered}
            columns={columns}
            searchPlaceholder="Search 1:1 notes..."
            pageSize={10}
            enableColumnVisibility
            enableRowSelection={false}
          />
        </Section>
      )}
    </div>
  );
};

export default OneonOneNotes;
