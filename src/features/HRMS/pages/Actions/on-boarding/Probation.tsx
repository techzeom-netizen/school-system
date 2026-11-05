'use client';

import { useCallback, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { TanStackTable } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ClipboardCheck, ThumbsDown, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';

type Decision = 'In Probation' | 'Extended' | 'Confirmed';
type ProbationData = {
  id: string;
  name: string;
  role: string;
  start: string;
  end: string;
  managerReview: 'Pending' | 'Completed';
  decision: Decision;
  extendedDays: number;
};

const DAY = 864e5;
const day = (n: number) => {
  const date = new Date();
  date.setDate(date.getDate() + n);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const dayOfMonth = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${dayOfMonth}`;
};
const diff = (a: string, b: string) =>
  Math.round((+new Date(b) - +new Date(a)) / DAY);

const SEED: ProbationData[] = [
  {
    id: '1',
    name: 'Karan Gupta',
    role: 'Sales Executive',
    start: day(-80),
    end: day(10),
    managerReview: 'Completed',
    decision: 'In Probation',
    extendedDays: 0,
  },
  {
    id: '2',
    name: 'Pooja Desai',
    role: 'QA Engineer',
    start: day(-75),
    end: day(15),
    managerReview: 'Pending',
    decision: 'In Probation',
    extendedDays: 0,
  },
  {
    id: '3',
    name: 'Vikram Nair',
    role: 'Backend Engineer',
    start: day(-20),
    end: day(70),
    managerReview: 'Pending',
    decision: 'In Probation',
    extendedDays: 0,
  },
  {
    id: '4',
    name: 'Nisha Kapoor',
    role: 'Support Lead',
    start: day(-95),
    end: day(-5),
    managerReview: 'Completed',
    decision: 'Confirmed',
    extendedDays: 0,
  },
];

const COLOR: Record<Decision, string> = {
  'In Probation': '#6366f1',
  Extended: '#f59e0b',
  Confirmed: '#10b981',
};
const TONE: Record<Decision | 'Pending' | 'Completed', string> = {
  'In Probation': 'bg-primary/10 text-primary',
  Extended: 'bg-warning/10 text-warning',
  Confirmed: 'bg-success/10 text-success',
  Pending: 'bg-warning/10 text-warning',
  Completed: 'bg-success/10 text-success',
};
const Pill = ({ s }: { s: keyof typeof TONE }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${TONE[s]}`}
  >
    {s}
  </span>
);
const SELECT =
  'h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring';

export default function Probation() {
  const [rows, setRows] = useState(SEED);
  const [extendId, setExtendId] = useState<string | null>(null);
  const [days, setDays] = useState('30');
  const [reason, setReason] = useState('');
  const target = rows.find(r => r.id === extendId);

  const patch = useCallback(
    (id: string, p: Partial<ProbationData>) =>
      setRows(l => l.map(r => (r.id === id ? { ...r, ...p } : r))),
    []
  );
  const chart = (Object.keys(COLOR) as Decision[])
    .map(d => ({ name: d, value: rows.filter(r => r.decision === d).length }))
    .filter(d => d.value);
  const dueSoon = rows.filter(r => {
    const daysUntilEnd = diff(day(0), r.end);
    return (
      r.decision !== 'Confirmed' && daysUntilEnd >= 0 && daysUntilEnd <= 14
    );
  }).length;

  const confirm = useCallback(
    (p: ProbationData) => {
      if (p.managerReview !== 'Completed')
        return toast.error(
          `Complete ${p.name}'s manager review before confirming`
        );
      patch(p.id, { decision: 'Confirmed' });
      toast.success(`${p.name} confirmed`);
    },
    [patch]
  );
  const extend = () => {
    if (!target) return;
    const n = Number(days);
    const end = new Date(+new Date(target.end) + n * DAY)
      .toISOString()
      .slice(0, 10);
    patch(target.id, {
      end,
      decision: 'Extended',
      extendedDays: target.extendedDays + n,
      managerReview: 'Pending',
    });
    toast.warning(`Probation for ${target.name} extended by ${n} days`);
    setExtendId(null);
    setReason('');
  };

  const columns = useMemo<ColumnDef<ProbationData>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Employee',
        cell: ({ row: { original: p } }) => (
          <div>
            <p className="font-medium">{p.name}</p>
            <p className="text-xs text-muted-foreground">{p.role}</p>
          </div>
        ),
      },
      {
        id: 'progress',
        header: 'Probation Progress',
        cell: ({ row: { original: p } }) => {
          const pct = Math.min(
            100,
            Math.max(0, (diff(p.start, day(0)) / diff(p.start, p.end)) * 100)
          );
          const left = diff(day(0), p.end);
          const progress = p.decision === 'Confirmed' ? 100 : pct;
          return (
            <div className="w-44 space-y-1">
              <div
                role="progressbar"
                aria-label={`${p.name} probation progress`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                className="h-1.5 overflow-hidden rounded-full bg-muted"
              >
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {p.decision === 'Confirmed'
                  ? 'Completed'
                  : left < 0
                    ? `${-left}d past end date`
                    : `${left}d left`}
                {p.extendedDays > 0 && ` · +${p.extendedDays}d extended`}
              </p>
            </div>
          );
        },
      },
      { accessorKey: 'end', header: 'Probation End Date' },
      {
        accessorKey: 'managerReview',
        header: 'Manager Review',
        cell: ({ row }) => <Pill s={row.original.managerReview} />,
      },
      {
        accessorKey: 'decision',
        header: 'Decision',
        cell: ({ row }) => <Pill s={row.original.decision} />,
      },
      {
        id: 'actions',
        cell: ({ row: { original: p } }) => {
          if (p.decision === 'Confirmed')
            return (
              <span className="text-sm text-muted-foreground">
                No action needed
              </span>
            );
          return (
            <div className="flex flex-wrap gap-2">
              {p.managerReview === 'Pending' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    patch(p.id, { managerReview: 'Completed' });
                    toast.success(`Review recorded for ${p.name}`);
                  }}
                >
                  <ClipboardCheck className="mr-2 h-4 w-4" /> Mark review done
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="text-success hover:bg-success/10"
                onClick={() => confirm(p)}
              >
                <ThumbsUp className="mr-2 h-4 w-4" /> Confirm
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => setExtendId(p.id)}
              >
                <ThumbsDown className="mr-2 h-4 w-4" /> Extend
              </Button>
            </div>
          );
        },
      },
    ],
    [confirm, patch]
  );

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-medium">
          Probation Tracking & Confirmation
        </h3>
        <p className="text-sm text-muted-foreground">
          Review employee performance and confirm employment.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-[280px_1fr]">
        <div className="rounded-xl border bg-card p-5">
          <h4 className="font-medium">Probation outcomes</h4>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={chart}
                dataKey="value"
                innerRadius={44}
                outerRadius={68}
                paddingAngle={3}
                strokeWidth={0}
              >
                {chart.map(d => (
                  <Cell key={d.name} fill={COLOR[d.name as Decision]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
            {chart.map(d => (
              <span key={d.name} className="flex items-center gap-1.5">
                <i
                  className="h-2 w-2 rounded-full"
                  style={{ background: COLOR[d.name as Decision] }}
                />
                {d.name} ({d.value})
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center rounded-xl border bg-card p-5">
          <p className="text-3xl font-semibold tabular-nums">{dueSoon}</p>
          <p className="text-sm text-muted-foreground">
            {dueSoon === 0
              ? 'No probation periods end in the next 14 days.'
              : `employee${dueSoon > 1 ? 's' : ''} reach the end of probation within 14 days. Complete their manager reviews and decide on confirmation.`}
          </p>
        </div>
      </div>

      <TanStackTable columns={columns} data={rows} showDownload />

      <Dialog open={!!target} onOpenChange={o => !o && setExtendId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extend probation</DialogTitle>
            <DialogDescription>
              {target?.name} · currently ends {target?.end}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Extension</Label>
              <select
                className={SELECT}
                value={days}
                onChange={e => setDays(e.target.value)}
              >
                {['30', '60', '90'].map(d => (
                  <option key={d} value={d}>
                    {d} days
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Reason (shared with the employee)</Label>
              <Input
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="e.g. Needs more time on client handling"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExtendId(null)}>
              Cancel
            </Button>
            <Button disabled={!reason.trim()} onClick={extend}>
              Extend probation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
