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
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertCircle,
  CheckCircle2,
  CircleDashed,
  Clock,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';

const TEAMS = ['HR Team', 'IT Team', 'Finance', 'Admin'] as const;
type Team = (typeof TEAMS)[number];
type Status = 'Pending' | 'In Progress' | 'Completed';
type Bucket = Status | 'Overdue';
type Task = {
  id: string;
  taskName: string;
  employee: string;
  assignedTo: Team;
  dueDate: string;
  status: Status;
};

const day = (n: number) => {
  const date = new Date();
  date.setDate(date.getDate() + n);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const dayOfMonth = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${dayOfMonth}`;
};
const TODAY = () => day(0);
const bucket = (t: Task): Bucket =>
  t.status !== 'Completed' && t.dueDate < TODAY() ? 'Overdue' : t.status;

const SEED: Task[] = [
  {
    id: 't1',
    taskName: 'IT equipment setup',
    employee: 'Aarav Sharma',
    assignedTo: 'IT Team',
    dueDate: day(2),
    status: 'In Progress',
  },
  {
    id: 't2',
    taskName: 'Create email account',
    employee: 'Aarav Sharma',
    assignedTo: 'IT Team',
    dueDate: day(-1),
    status: 'Completed',
  },
  {
    id: 't3',
    taskName: 'Assign onboarding buddy',
    employee: 'Aarav Sharma',
    assignedTo: 'HR Team',
    dueDate: day(-3),
    status: 'Pending',
  },
  {
    id: 't4',
    taskName: 'Payroll & PF registration',
    employee: 'Rohan Mehta',
    assignedTo: 'Finance',
    dueDate: day(3),
    status: 'Pending',
  },
  {
    id: 't5',
    taskName: 'Access card & desk allocation',
    employee: 'Rohan Mehta',
    assignedTo: 'Admin',
    dueDate: day(1),
    status: 'In Progress',
  },
  {
    id: 't6',
    taskName: 'Send welcome kit',
    employee: 'Rohan Mehta',
    assignedTo: 'HR Team',
    dueDate: day(-2),
    status: 'Completed',
  },
];

const BUCKETS: Bucket[] = ['Completed', 'In Progress', 'Pending', 'Overdue'];
const COLOR: Record<Bucket, string> = {
  Completed: '#10b981',
  'In Progress': '#6366f1',
  Pending: '#94a3b8',
  Overdue: '#ef4444',
};
const ICON = {
  Completed: [CheckCircle2, 'text-success'],
  'In Progress': [Clock, 'text-primary'],
  Pending: [CircleDashed, 'text-muted-foreground'],
  Overdue: [AlertCircle, 'text-destructive'],
} as const;
const SELECT =
  'h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring';

export default function OnboardingTasks() {
  const [tasks, setTasks] = useState<Task[]>(SEED);
  const [filter, setFilter] = useState<'All' | Bucket>('All');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    taskName: '',
    employee: '',
    assignedTo: 'HR Team' as Team,
    dueDate: day(3),
  });

  const setStatus = useCallback(
    (id: string, status: Status) =>
      setTasks(l => l.map(t => (t.id === id ? { ...t, status } : t))),
    []
  );
  const rows = useMemo(
    () => tasks.filter(t => filter === 'All' || bucket(t) === filter),
    [tasks, filter]
  );
  const counts = (b: Bucket) => tasks.filter(t => bucket(t) === b).length;
  const chart = useMemo(
    () =>
      TEAMS.map(team => {
        const r: Record<string, string | number> = { team };
        BUCKETS.forEach(
          b =>
            (r[b] = tasks.filter(
              t => t.assignedTo === team && bucket(t) === b
            ).length)
        );
        return r;
      }),
    [tasks]
  );

  const submit = () => {
    if (!form.taskName.trim() || !form.employee.trim())
      return toast.error('Enter a task name and employee');
    setTasks(l => [
      {
        id: `t${Date.now()}`,
        ...form,
        taskName: form.taskName.trim(),
        employee: form.employee.trim(),
        status: 'Pending',
      },
      ...l,
    ]);
    toast.success(`Task "${form.taskName.trim()}" added`);
    setForm({ ...form, taskName: '', employee: '' });
    setOpen(false);
  };

  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      { accessorKey: 'taskName', header: 'Task Name' },
      { accessorKey: 'employee', header: 'Employee' },
      { accessorKey: 'assignedTo', header: 'Assigned To' },
      {
        accessorKey: 'dueDate',
        header: 'Due Date',
        cell: ({ row }) => {
          const d = Math.round(
            (+new Date(row.original.dueDate) - +new Date(TODAY())) / 864e5
          );
          return (
            <div>
              <p>{row.original.dueDate}</p>
              <p className="text-xs text-muted-foreground">
                {d === 0 ? 'Today' : d > 0 ? `in ${d}d` : `${-d}d ago`}
              </p>
            </div>
          );
        },
      },
      {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const b = bucket(row.original);
          const [Icon, cls] = ICON[b];
          return (
            <span className={`flex items-center text-sm ${cls}`}>
              <Icon className="mr-1 h-4 w-4" />
              {b}
            </span>
          );
        },
      },
      {
        id: 'actions',
        cell: ({ row: { original: t } }) => (
          <div className="flex gap-2">
            {t.status === 'Pending' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setStatus(t.id, 'In Progress')}
              >
                Start
              </Button>
            )}
            {t.status !== 'Completed' ? (
              <Button
                size="sm"
                onClick={() => {
                  setStatus(t.id, 'Completed');
                  toast.success(`"${t.taskName}" completed`);
                }}
              >
                Complete
              </Button>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setStatus(t.id, 'Pending')}
              >
                Reopen
              </Button>
            )}
          </div>
        ),
      },
    ],
    [setStatus]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-medium">Onboarding Tasks</h3>
          <p className="text-sm text-muted-foreground">
            Manage cross-functional tasks for incoming employees.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <div className="rounded-xl border bg-card p-5">
        <h4 className="font-medium">Workload by team</h4>
        <p className="mb-3 text-xs text-muted-foreground">
          {counts('Overdue')
            ? `${counts('Overdue')} overdue task${counts('Overdue') > 1 ? 's' : ''} need attention`
            : 'Everything is on track'}
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chart} margin={{ left: -20 }}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              opacity={0.4}
            />
            <XAxis
              dataKey="team"
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <Tooltip cursor={{ fill: 'rgba(148,163,184,.12)' }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            {BUCKETS.map(b => (
              <Bar
                key={b}
                dataKey={b}
                stackId="a"
                fill={COLOR[b]}
                radius={b === 'Overdue' ? [4, 4, 0, 0] : 0}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['All', ...BUCKETS] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${filter === f ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
          >
            {f}
            <span className="ml-1.5 opacity-70">
              {f === 'All' ? tasks.length : counts(f)}
            </span>
          </button>
        ))}
      </div>

      <TanStackTable columns={columns} data={rows} showDownload />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add onboarding task</DialogTitle>
            <DialogDescription>
              Assign a task to a team for an incoming employee.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Task name</Label>
              <Input
                value={form.taskName}
                onChange={e => setForm({ ...form, taskName: e.target.value })}
                placeholder="e.g. Issue laptop"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Employee</Label>
              <Input
                value={form.employee}
                onChange={e => setForm({ ...form, employee: e.target.value })}
                placeholder="e.g. Sneha Rao"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Assign to</Label>
                <select
                  className={SELECT}
                  value={form.assignedTo}
                  onChange={e =>
                    setForm({ ...form, assignedTo: e.target.value as Team })
                  }
                >
                  {TEAMS.map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Due date</Label>
                <Input
                  type="date"
                  value={form.dueDate}
                  onChange={e => setForm({ ...form, dueDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit}>Add task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
