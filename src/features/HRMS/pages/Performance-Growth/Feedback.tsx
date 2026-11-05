import React, { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import {
  Award,
  Heart,
  MessageSquare,
  RotateCcw,
  SearchX,
  ThumbsUp,
  Zap,
  Crown,
  Lightbulb,
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
  feedbackTagFilterOptions,
  feedbackTypeFilterOptions,
  feedbackTypeOptions,
} from '@/data/reusableDropdownData';

type FeedbackType =
  | 'Praise'
  | 'Constructive'
  | 'Recognition'
  | 'Peer'
  | 'Upward'
  | 'Self';
type Reaction = 'love' | 'clap' | 'fire' | 'insight';

interface Feedback {
  id: string;
  from: string;
  fromRole: string;
  to: string;
  toRole: string;
  type: FeedbackType;
  message: string;
  tags: string[];
  date: string;
  reactions: Record<Reaction, number>;
  isPublic: boolean;
  badge?: string;
}

const TYPE_COLORS: Record<FeedbackType, string> = {
  Praise: 'hsl(var(--primary))',
  Constructive: 'hsl(var(--accent-foreground))',
  Recognition: 'hsl(var(--primary))',
  Peer: 'hsl(var(--accent-foreground))',
  Upward: 'hsl(var(--secondary-foreground))',
  Self: 'hsl(var(--destructive))',
};

const TAG_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent-foreground))',
  'hsl(var(--primary))',
  'hsl(var(--accent-foreground))',
  'hsl(var(--destructive))',
  'hsl(var(--secondary-foreground))',
];

const FEEDBACK_LIST: Feedback[] = [
  {
    id: 'f1',
    from: 'Daniel Whitmore',
    fromRole: 'CTO',
    to: 'Lucas Bergström',
    toRole: 'Jr. Software Engineer',
    type: 'Praise',
    message:
      'Lucas went above and beyond on the payments retry logic. His solution handled edge cases we hadn’t even documented. Outstanding ownership.',
    tags: ['Ownership', 'Quality', 'Problem Solving'],
    date: '2026-10-24',
    reactions: { love: 8, clap: 12, fire: 4, insight: 2 },
    isPublic: true,
    badge: '🏆 Rockstar of the week',
  },
  {
    id: 'f2',
    from: 'Sophia Laurent',
    fromRole: 'CMO',
    to: 'Mateo Alvarez',
    toRole: 'Digital Marketing Executive',
    type: 'Recognition',
    message:
      'Mateo’s Q4 campaign outperformed every benchmark — 24% better CTR than target. He’s setting a new bar for the marketing team.',
    tags: ['Results', 'Creativity'],
    date: '2026-10-22',
    reactions: { love: 6, clap: 14, fire: 9, insight: 1 },
    isPublic: true,
    badge: '🎯 Above & beyond',
  },
  {
    id: 'f3',
    from: 'Isabella Rossi',
    fromRole: 'VP People',
    to: 'Olivia Chen',
    toRole: 'Business Development Manager',
    type: 'Praise',
    message:
      'Closing the largest enterprise deal this year is no small feat. Olivia’s persistence and client empathy were key. Truly inspiring.',
    tags: ['Client Impact', 'Perseverance'],
    date: '2026-10-20',
    reactions: { love: 11, clap: 8, fire: 6, insight: 3 },
    isPublic: true,
    badge: '💼 Deal of the quarter',
  },
  {
    id: 'f4',
    from: 'Daniel Whitmore',
    fromRole: 'CTO',
    to: 'Emma Lindqvist',
    toRole: 'Software Engineer',
    type: 'Constructive',
    message:
      'Great delivery under pressure this quarter. For the next one, I’d love to see more initiative on system design — you have the skill, just need the space.',
    tags: ['Growth Area', 'Design'],
    date: '2026-10-18',
    reactions: { love: 3, clap: 4, fire: 1, insight: 7 },
    isPublic: false,
  },
  {
    id: 'f5',
    from: 'Lucas Bergström',
    fromRole: 'Jr. Software Engineer',
    to: 'Aiko Tanaka',
    toRole: 'QA Engineer',
    type: 'Peer',
    message:
      'Aiko caught 3 critical bugs before release. Her attention to detail saved us a lot of firefighting. Big thanks from the team!',
    tags: ['Teamwork', 'Attention to Detail'],
    date: '2026-10-15',
    reactions: { love: 5, clap: 9, fire: 2, insight: 1 },
    isPublic: true,
  },
  {
    id: 'f6',
    from: 'Marcus Reiner',
    fromRole: 'COO',
    to: 'Daniel Whitmore',
    toRole: 'CTO',
    type: 'Upward',
    message:
      'Daniel’s leadership through the migration was exceptional — transparent comms, calm under pressure, and clear priorities. A model for the whole org.',
    tags: ['Leadership', 'Communication'],
    date: '2026-10-12',
    reactions: { love: 14, clap: 11, fire: 7, insight: 5 },
    isPublic: true,
    badge: '👏 Leadership spotlight',
  },
  {
    id: 'f7',
    from: 'Kenji Nakamura',
    fromRole: 'Jr. Software Engineer',
    to: 'Noah Fischer',
    toRole: 'Software Engineer Trainee',
    type: 'Peer',
    message:
      'Noah paired with me on the API refactor and it was smooth and productive. Great listening and clean handoff.',
    tags: ['Teamwork', 'Collaboration'],
    date: '2026-10-08',
    reactions: { love: 4, clap: 5, fire: 1, insight: 0 },
    isPublic: true,
  },
  {
    id: 'f8',
    from: 'Camila Fernández',
    fromRole: 'Product Designer',
    to: 'Amara Okonkwo',
    toRole: 'Data Analyst',
    type: 'Recognition',
    message:
      'Amara turned a messy analytics request into a clean, self-serve dashboard in a week. Execs are actually using it daily now.',
    tags: ['Impact', 'Data Craft'],
    date: '2026-10-06',
    reactions: { love: 7, clap: 10, fire: 3, insight: 4 },
    isPublic: true,
    badge: '📊 Analytics hero',
  },
];

const TYPES: FeedbackType[] = feedbackTypeOptions.map(
  option => option.value as FeedbackType
);

const WEEKLY_TREND = [
  { week: 'W1', given: 12, received: 10 },
  { week: 'W2', given: 18, received: 15 },
  { week: 'W3', given: 22, received: 19 },
  { week: 'W4', given: 28, received: 26 },
  { week: 'W5', given: 34, received: 30 },
];

const VALUE_RADAR = [
  { subject: 'Ownership', value: 88, fullMark: 100 },
  { subject: 'Teamwork', value: 92, fullMark: 100 },
  { subject: 'Quality', value: 82, fullMark: 100 },
  { subject: 'Innovation', value: 76, fullMark: 100 },
  { subject: 'Customer First', value: 90, fullMark: 100 },
  { subject: 'Integrity', value: 94, fullMark: 100 },
];

const TOP_GIVERS = [
  { name: 'Daniel Whitmore', count: 24, color: 'hsl(var(--primary))' },
  { name: 'Isabella Rossi', count: 18, color: 'hsl(var(--primary))' },
  {
    name: 'Sophia Laurent',
    count: 15,
    color: 'hsl(var(--secondary-foreground))',
  },
  { name: 'Marcus Reiner', count: 12, color: 'hsl(var(--destructive))' },
  { name: 'Hiroshi Tanaka', count: 9, color: 'hsl(var(--accent-foreground))' },
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

const REACTION_ICONS: Record<
  Reaction,
  { icon: React.ElementType; color: string; label: string }
> = {
  love: { icon: Heart, color: 'hsl(var(--destructive))', label: 'Love' },
  clap: { icon: ThumbsUp, color: 'hsl(var(--primary))', label: 'Clap' },
  fire: { icon: Zap, color: 'hsl(var(--accent-foreground))', label: 'Fire' },
  insight: {
    icon: Lightbulb,
    color: 'hsl(var(--secondary-foreground))',
    label: 'Insight',
  },
};

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
  const rows = payload.filter(p => typeof p.value === 'number' && p.value > 0);
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

function TypeChip({ type }: { type: FeedbackType }) {
  const c = TYPE_COLORS[type];
  return (
    <span
      className="inline-block rounded-md px-2 py-0.5 text-xs font-semibold"
      style={{
        background: `color-mix(in srgb, ${c} 12%, transparent)`,
        color: c,
      }}
    >
      {type}
    </span>
  );
}

function TagChip({ tag, index = 0 }: { tag: string; index?: number }) {
  const c = TAG_COLORS[index % TAG_COLORS.length];
  return (
    <span
      className="inline-block rounded-full border px-2 py-0.5 text-[11px] font-medium"
      style={{
        borderColor: `color-mix(in srgb, ${c} 33%, transparent)`,
        background: `color-mix(in srgb, ${c} 10%, transparent)`,
        color: c,
      }}
    >
      {tag}
    </span>
  );
}

function FeedbackCard({ f, onOpen }: { f: Feedback; onOpen: () => void }) {
  const [reactions, setReactions] = useState(f.reactions);
  const [picked, setPicked] = useState<Reaction | null>(null);

  const react = (r: Reaction) => {
    setReactions(prev => {
      const next = { ...prev };
      if (picked === r) {
        next[r] = Math.max(0, next[r] - 1);
        setPicked(null);
      } else {
        if (picked) next[picked] = Math.max(0, next[picked] - 1);
        next[r] = next[r] + 1;
        setPicked(r);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition hover:border-primary dark:border-border dark:bg-card dark:hover:border-primary">
      {f.badge && (
        <div className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-accent/10 to-destructive/10 px-2.5 py-1 text-xs font-semibold text-accent-foreground dark:text-accent-foreground">
          <Crown size={13} /> {f.badge}
        </div>
      )}

      <div className="flex items-start gap-3">
        <Avatar name={f.to} size={44} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{f.to}</div>
          <div className="truncate text-xs text-muted-foreground dark:text-muted-foreground">
            {f.toRole}
          </div>
        </div>
        <TypeChip type={f.type} />
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-muted-foreground">
        <span>from</span>
        <Avatar name={f.from} size={18} />
        <span className="font-medium text-secondary-foreground dark:text-muted-foreground">
          {f.from}
        </span>
        <span className="opacity-60">·</span>
        <span className="tabular-nums">{fmtDate(f.date)}</span>
        {!f.isPublic && (
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground dark:bg-muted dark:text-muted-foreground">
            Private
          </span>
        )}
      </div>

      <p className="text-sm leading-relaxed text-secondary-foreground dark:text-muted-foreground">
        {f.message}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {f.tags.map((t, i) => (
          <TagChip key={t} tag={t} index={i} />
        ))}
      </div>

      <div className="mt-1 flex items-center justify-between border-t border-border pt-3 dark:border-border">
        <div className="flex items-center gap-1">
          {(Object.keys(REACTION_ICONS) as Reaction[]).map(r => {
            const { icon: Icon, color } = REACTION_ICONS[r];
            const active = picked === r;
            return (
              <Button
                key={r}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => react(r)}
                className={`rounded-full text-xs ${
                  active
                    ? ''
                    : 'text-muted-foreground hover:bg-muted dark:text-muted-foreground dark:hover:bg-muted'
                }`}
                style={
                  active
                    ? {
                        background: `color-mix(in srgb, ${color} 12%, transparent)`,
                        color,
                      }
                    : undefined
                }
              >
                <Icon size={12} /> {reactions[r]}
              </Button>
            );
          })}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onOpen}
          className="text-xs font-medium text-primary hover:text-primary dark:text-primary"
        >
          View thread →
        </Button>
      </div>
    </div>
  );
}

const Feedback: React.FC = () => {
  const DEFAULTS = { type: 'all', tag: 'all', search: '', onlyPublic: false };
  const [form, setForm] = useState(DEFAULTS);
  const [selected, setSelected] = useState<Feedback | null>(null);
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const set = <K extends keyof typeof DEFAULTS>(
    k: K,
    v: (typeof DEFAULTS)[K]
  ) => setForm(prev => ({ ...prev, [k]: v }));

  const filtered = useMemo(() => {
    const q = form.search.trim().toLowerCase();
    return FEEDBACK_LIST.filter(
      f =>
        (form.type === 'all' || f.type === form.type) &&
        (form.tag === 'all' || f.tags.includes(form.tag)) &&
        (!form.onlyPublic || f.isPublic) &&
        (!q ||
          f.to.toLowerCase().includes(q) ||
          f.from.toLowerCase().includes(q) ||
          f.message.toLowerCase().includes(q))
    );
  }, [form]);

  const typeDist = useMemo(
    () =>
      TYPES.map(t => ({
        name: t,
        value: FEEDBACK_LIST.filter(f => f.type === t).length,
        color: TYPE_COLORS[t],
      })).filter(x => x.value > 0),
    []
  );

  const totalReactions = FEEDBACK_LIST.reduce(
    (s, f) => s + Object.values(f.reactions).reduce((a, b) => a + b, 0),
    0
  );

  const columns = useMemo<ColumnDef<Feedback>[]>(
    () => [
      {
        accessorKey: 'to',
        header: 'To',
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <Avatar name={row.original.to} />
            <div className="leading-tight">
              <div className="text-sm font-medium">{row.original.to}</div>
              <div className="text-xs text-muted-foreground dark:text-muted-foreground">
                {row.original.toRole}
              </div>
            </div>
          </div>
        ),
      },
      { accessorKey: 'from', header: 'From' },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => <TypeChip type={row.original.type} />,
      },
      {
        accessorKey: 'message',
        header: 'Message',
        cell: ({ row }) => (
          <div className="line-clamp-2 max-w-md text-xs text-secondary-foreground dark:text-muted-foreground">
            {row.original.message}
          </div>
        ),
      },
      {
        id: 'tags',
        header: 'Tags',
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.tags.slice(0, 2).map((t, i) => (
              <TagChip key={t} tag={t} index={i} />
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => (
          <span className="text-xs tabular-nums">
            {fmtDate(row.original.date)}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="min-h-screen space-y-4  p-1 text-foreground  dark:text-muted-foreground">
      <Section title="Feedback & Recognition" menuId="feedback" showBreadcrumbs>
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary dark:text-primary">
              <MessageSquare size={13} /> Performance & Growth
            </div>
            <p className="text-xs text-muted-foreground dark:text-muted-foreground">
              Praise, constructive feedback and recognition across teams
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <FormField
            label="Type"
            name="type"
            type="select"
            value={form.type}
            onChange={v => set('type', v)}
            options={feedbackTypeFilterOptions}
          />
          <FormField
            label="Tag"
            name="tag"
            type="select"
            value={form.tag}
            onChange={v => set('tag', v)}
            options={feedbackTagFilterOptions}
          />
          <FormField
            label="Search"
            name="search"
            type="text"
            value={form.search}
            onChange={v => set('search', v)}
            placeholder="Person or message..."
          />
          <FormField
            label="Only public"
            name="only-public"
            type="checkbox"
            value={form.onlyPublic}
            onCheckboxChange={value => set('onlyPublic', value)}
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
            label: 'Total feedback',
            value: FEEDBACK_LIST.length,
            hint: 'This period',
            color: 'hsl(var(--primary))',
            icon: MessageSquare,
          },
          {
            label: 'Praise',
            value: typeDist.find(t => t.name === 'Praise')?.value || 0,
            hint: 'Positive messages',
            color: 'hsl(var(--primary))',
            icon: ThumbsUp,
          },
          {
            label: 'Recognition',
            value: typeDist.find(t => t.name === 'Recognition')?.value || 0,
            hint: 'With badges',
            color: 'hsl(var(--accent-foreground))',
            icon: Award,
          },
          {
            label: 'Reactions',
            value: totalReactions,
            hint: 'Total empathy',
            color: 'hsl(var(--accent-foreground))',
            icon: Heart,
          },
          {
            label: 'Top giver',
            value: TOP_GIVERS[0].name.split(' ')[0],
            hint: `${TOP_GIVERS[0].count} messages`,
            color: 'hsl(var(--destructive))',
            icon: Crown,
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

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className={`${cardCls} xl:col-span-2`}>
          <h3 className="text-sm font-semibold">Feedback given vs received</h3>
          <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
            Weekly trend across the org
          </p>
          <div className="mt-3 text-foreground dark:text-muted-foreground">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart
                data={WEEKLY_TREND}
                margin={{ top: 8, right: 8, bottom: 0, left: -20 }}
              >
                <CartesianGrid {...gridProps} />
                <XAxis
                  dataKey="week"
                  tick={axisTick}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis tick={axisTick} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 11 }}
                  iconType="circle"
                  iconSize={8}
                />
                <Line
                  type="monotone"
                  dataKey="given"
                  name="Given"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="received"
                  name="Received"
                  stroke="hsl(var(--accent-foreground))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={cardCls}>
          <h3 className="text-sm font-semibold">Feedback types</h3>
          <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
            Distribution by category
          </p>
          <div className="mt-2">
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie
                  data={typeDist}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={54}
                  outerRadius={80}
                  paddingAngle={3}
                  cornerRadius={4}
                  stroke="none"
                >
                  {typeDist.map(t => (
                    <Cell key={t.name} fill={t.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div role="list" className="mt-2 space-y-1.5">
            {typeDist.map(t => (
              <div
                key={t.name}
                role="listitem"
                className="flex items-center justify-between text-xs"
              >
                <span className="flex items-center gap-2 text-secondary-foreground dark:text-muted-foreground">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: t.color }}
                  />
                  {t.name}
                </span>
                <span className="font-medium tabular-nums">{t.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`${cardCls} xl:col-span-2`}>
          <h3 className="text-sm font-semibold">Top feedback givers</h3>
          <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
            Most active voices this period
          </p>
          <div role="list" className="mt-4 space-y-3">
            {TOP_GIVERS.map((g, i) => {
              const max = TOP_GIVERS[0].count;
              return (
                <div
                  key={g.name}
                  role="listitem"
                  className="flex items-center gap-3"
                >
                  <span className="w-5 text-xs font-semibold text-muted-foreground dark:text-muted-foreground">
                    #{i + 1}
                  </span>
                  <Avatar name={g.name} color={g.color} size={28} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">{g.name}</span>
                      <span className="tabular-nums text-muted-foreground dark:text-muted-foreground">
                        {g.count}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-muted dark:bg-muted">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(g.count / max) * 100}%`,
                          background: g.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={cardCls}>
          <h3 className="text-sm font-semibold">Values radar</h3>
          <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
            Company-wide feedback by value
          </p>
          <div className="mt-2 text-foreground dark:text-muted-foreground">
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={VALUE_RADAR} outerRadius="72%">
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.7 }}
                />
                <Radar
                  name="Score"
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
      </div>

      {/* View toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">
          {filtered.length} {filtered.length === 1 ? 'message' : 'messages'}
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
          <h3 className="mt-4 text-sm font-semibold">No feedback found</h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground dark:text-muted-foreground">
            Try a different type, tag, or clear the search.
          </p>
        </div>
      ) : view === 'cards' ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filtered.map(f => (
            <FeedbackCard key={f.id} f={f} onOpen={() => setSelected(f)} />
          ))}
        </div>
      ) : (
        <Section title="All feedback">
          <TanStackTable
            showDownload={true}
            key={JSON.stringify(form)}
            data={filtered}
            columns={columns}
            searchPlaceholder="Search feedback..."
            pageSize={10}
            enableColumnVisibility
            enableRowSelection={false}
          />
        </Section>
      )}

      {/* Detail modal */}
      {selected && (
        <Dialog open onOpenChange={open => !open && setSelected(null)}>
          <DialogContent
            className="max-h-[90vh] max-w-2xl overflow-y-auto"
            onInteractOutside={event => event.preventDefault()}
          >
            <div className="mb-5 flex items-start gap-4 pr-8">
              <div className="flex items-center gap-4">
                <Avatar name={selected.to} size={52} />
                <DialogHeader>
                  <DialogTitle>{selected.to}</DialogTitle>
                  <DialogDescription>{selected.toRole}</DialogDescription>
                </DialogHeader>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <TypeChip type={selected.type} />
              {!selected.isPublic && (
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground dark:bg-muted dark:text-muted-foreground">
                  Private
                </span>
              )}
              <span className="text-xs text-muted-foreground dark:text-muted-foreground">
                {fmtDate(selected.date)}
              </span>
            </div>

            {selected.badge && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-gradient-to-r from-accent/10 to-destructive/10 px-3 py-2 text-sm font-semibold text-accent-foreground dark:text-accent-foreground">
                <Crown size={14} /> {selected.badge}
              </div>
            )}

            <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground dark:text-muted-foreground">
              <span>from</span>
              <Avatar name={selected.from} size={20} />
              <span className="font-medium text-secondary-foreground dark:text-muted-foreground">
                {selected.from}
              </span>
              <span className="opacity-60">·</span>
              <span>{selected.fromRole}</span>
            </div>

            <div className="mb-4 rounded-xl border border-border bg-muted p-4 dark:border-border dark:bg-muted/40">
              <p className="text-sm leading-relaxed">{selected.message}</p>
            </div>

            <div className="mb-4 flex flex-wrap gap-1.5">
              {selected.tags.map((t, i) => (
                <TagChip key={t} tag={t} index={i} />
              ))}
            </div>

            <div className="mb-4 grid grid-cols-4 gap-2 rounded-xl border border-border bg-muted p-3 dark:border-border dark:bg-muted/40">
              {(Object.keys(REACTION_ICONS) as Reaction[]).map(r => {
                const { icon: Icon, color, label } = REACTION_ICONS[r];
                return (
                  <div key={r} className="flex flex-col items-center gap-1">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full"
                      style={{
                        background: `color-mix(in srgb, ${color} 12%, transparent)`,
                        color,
                      }}
                    >
                      <Icon size={14} />
                    </span>
                    <span className="text-xs font-semibold tabular-nums">
                      {selected.reactions[r]}
                    </span>
                    <span className="text-[10px] text-muted-foreground dark:text-muted-foreground">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Only Close button — Reply removed */}
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelected(null)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Feedback;
