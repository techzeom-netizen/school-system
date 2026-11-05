'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { TanStackTable } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FormField from '@/components/common/FormField';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import {
  BadgeCheck,
  FileSignature,
  Search,
  UserCheck,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { getOnboardingCandidates } from './onboardingCandidateStore';

const REQUIRED_DOCS = [
  'ID Proof',
  'Degree Certificate',
  'Address Proof',
  'Previous Payslip',
  'Passport Photo',
] as const;
type Doc = (typeof REQUIRED_DOCS)[number];
type Offer = 'Pending' | 'Accepted' | 'Declined';
type Candidate = {
  id: string;
  name: string;
  role: string;
  department: string;
  joiningDate: string;
  offerStatus: Offer;
  docs: Doc[];
};

const day = (n: number) => {
  const date = new Date();
  date.setDate(date.getDate() + n);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const dayOfMonth = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${dayOfMonth}`;
};
const SEED_CANDIDATES: Candidate[] = [
  {
    id: 'c1',
    name: 'Aarav Sharma',
    role: 'Frontend Engineer',
    department: 'Engineering',
    joiningDate: day(7),
    offerStatus: 'Accepted',
    docs: ['Address Proof', 'Passport Photo', 'Previous Payslip'],
  },
  {
    id: 'c2',
    name: 'Sneha Rao',
    role: 'Data Analyst',
    department: 'Analytics',
    joiningDate: day(14),
    offerStatus: 'Pending',
    docs: [],
  },
  {
    id: 'c3',
    name: 'Rohan Mehta',
    role: 'Product Designer',
    department: 'Design',
    joiningDate: day(5),
    offerStatus: 'Accepted',
    docs: [...REQUIRED_DOCS],
  },
  {
    id: 'c4',
    name: 'Isha Verma',
    role: 'HR Executive',
    department: 'People',
    joiningDate: day(21),
    offerStatus: 'Declined',
    docs: ['ID Proof'],
  },
];

const TONE = {
  Accepted: 'bg-success/10 text-success',
  Pending: 'bg-warning/10 text-warning',
  Declined: 'bg-destructive/10 text-destructive',
} as const;
const OFFER_COLOR = {
  Accepted: '#10b981',
  Pending: '#f59e0b',
  Declined: '#ef4444',
} as const;
const Pill = ({ s }: { s: Offer }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${TONE[s]}`}
  >
    {s}
  </span>
);

export default function PreJoiningTasks() {
  const [candidates, setCandidates] = useState(SEED_CANDIDATES);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'All' | Offer>('All');
  const [openId, setOpenId] = useState<string | null>(null);
  const active = candidates.find(c => c.id === openId);

  const count = (s: Offer) =>
    candidates.filter(c => c.offerStatus === s).length;
  const rows = useMemo(
    () =>
      candidates.filter(
        c =>
          (filter === 'All' || c.offerStatus === filter) &&
          `${c.name} ${c.role}`.toLowerCase().includes(q.toLowerCase())
      ),
    [candidates, filter, q]
  );
  const docsComplete = candidates.filter(
    c => c.docs.length === REQUIRED_DOCS.length
  ).length;
  const rate = candidates.length
    ? Math.round((count('Accepted') / candidates.length) * 100)
    : 0;
  const donut = (['Accepted', 'Pending', 'Declined'] as Offer[])
    .map(n => ({ name: n, value: count(n) }))
    .filter(d => d.value);

  const patch = (id: string, p: Partial<Candidate>) =>
    setCandidates(l => l.map(c => (c.id === id ? { ...c, ...p } : c)));
  const toggleDoc = (c: Candidate, d: Doc) =>
    patch(c.id, {
      docs: c.docs.includes(d) ? c.docs.filter(x => x !== d) : [...c.docs, d],
    });

  const sendReminders = () => {
    const n = candidates.filter(
      c =>
        c.offerStatus !== 'Declined' &&
        (c.offerStatus === 'Pending' || c.docs.length < REQUIRED_DOCS.length)
    ).length;
    if (n > 0) {
      toast.success(`Reminder sent to ${n} candidate${n > 1 ? 's' : ''}`);
    } else {
      toast.info('Nobody has pending items');
    }
  };

  useEffect(() => {
    const savedCandidates = getOnboardingCandidates();
    if (savedCandidates.length) {
      setCandidates(current => {
        const currentIds = new Set(current.map(candidate => candidate.id));
        const saved = savedCandidates
          .filter(candidate => !currentIds.has(candidate.id))
          .map(candidate => ({
            id: candidate.id,
            name: candidate.name,
            role: candidate.role,
            department: candidate.department,
            joiningDate: candidate.joiningDate,
            offerStatus: 'Pending' as const,
            docs: [],
          }));

        return [...saved, ...current];
      });
    }
  }, []);

  const columns = useMemo<ColumnDef<Candidate>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Candidate',
        cell: ({ row: { original: c } }) => (
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {c.name
                .split(' ')
                .map(w => w[0])
                .slice(0, 2)
                .join('')}
            </span>
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.role}</p>
            </div>
          </div>
        ),
      },
      { accessorKey: 'joiningDate', header: 'Joining Date' },
      {
        accessorKey: 'offerStatus',
        header: 'Offer Status',
        cell: ({ row }) => <Pill s={row.original.offerStatus} />,
      },
      {
        id: 'docs',
        header: 'Documents',
        cell: ({ row: { original: c } }) => (
          <div className="w-40 space-y-1">
            <div
              role="progressbar"
              aria-label={`${c.name} documents submitted`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={(c.docs.length / REQUIRED_DOCS.length) * 100}
              className="h-1.5 overflow-hidden rounded-full bg-muted"
            >
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${(c.docs.length / REQUIRED_DOCS.length) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {c.docs.length}/{REQUIRED_DOCS.length} submitted
            </p>
          </div>
        ),
      },
      {
        id: 'pending',
        header: 'Pending Documents',
        cell: ({ row: { original: c } }) => {
          const miss = REQUIRED_DOCS.filter(d => !c.docs.includes(d));
          return (
            <span className="text-sm">
              {miss.length === 0
                ? '—'
                : miss.length === REQUIRED_DOCS.length
                  ? 'All documents'
                  : miss.join(', ')}
            </span>
          );
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setOpenId(row.original.id)}
          >
            <UserCheck className="mr-2 h-4 w-4" /> Review Portal
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-medium">Candidate Pre-Joining Portal</h3>
          <p className="text-sm text-muted-foreground">
            Track offer acceptances and document collection.
          </p>
        </div>
        <Button onClick={sendReminders}>
          <FileSignature className="mr-2 h-4 w-4" /> Send Reminders
        </Button>
      </div>

      {/* summary */}
      <div className="grid gap-4 md:grid-cols-[1fr_1fr_260px]">
        <div className="flex items-start justify-between rounded-xl border bg-card p-5">
          <div>
            <p className="text-sm text-muted-foreground">Offer acceptance</p>
            <p className="text-3xl font-semibold tabular-nums">{rate}%</p>
            <p className="text-xs text-muted-foreground">
              {count('Accepted')} of {candidates.length} offers accepted
            </p>
          </div>
          <span className="rounded-lg bg-success/10 p-2.5 text-success">
            <BadgeCheck className="h-5 w-5" />
          </span>
        </div>
        <div className="flex items-start justify-between rounded-xl border bg-card p-5">
          <div>
            <p className="text-sm text-muted-foreground">Documents complete</p>
            <p className="text-3xl font-semibold tabular-nums">
              {docsComplete}
            </p>
            <p className="text-xs text-muted-foreground">
              {candidates.length - docsComplete} still collecting
            </p>
          </div>
          <span className="rounded-lg bg-primary/10 p-2.5 text-primary">
            <Users className="h-5 w-5" />
          </span>
        </div>
        <div className="rounded-xl border bg-card p-3">
          <ResponsiveContainer width="100%" height={110}>
            <PieChart>
              <Pie
                data={donut}
                dataKey="value"
                innerRadius={30}
                outerRadius={48}
                paddingAngle={3}
                strokeWidth={0}
              >
                {donut.map(d => (
                  <Cell key={d.name} fill={OFFER_COLOR[d.name as Offer]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-3 text-xs text-muted-foreground">
            {donut.map(d => (
              <span key={d.name} className="flex items-center gap-1">
                <i
                  className="h-2 w-2 rounded-full"
                  style={{ background: OFFER_COLOR[d.name as Offer] }}
                />
                {d.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(['All', 'Accepted', 'Pending', 'Declined'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${filter === f ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
            >
              {f}
              <span className="ml-1.5 opacity-70">
                {f === 'All' ? candidates.length : count(f)}
              </span>
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search candidate or role"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>
      </div>

      <TanStackTable columns={columns} data={rows} showDownload />

      <Dialog open={!!active} onOpenChange={o => !o && setOpenId(null)}>
        <DialogContent>
          {active && (
            <>
              <DialogHeader>
                <DialogTitle>{active.name}</DialogTitle>
                <DialogDescription>
                  {active.role} · {active.department} · joins{' '}
                  {active.joiningDate}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <p className="text-sm font-medium">Offer</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Pill s={active.offerStatus} />
                  {active.offerStatus !== 'Accepted' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        patch(active.id, { offerStatus: 'Accepted' });
                        toast.success('Offer marked as accepted');
                      }}
                    >
                      Mark accepted
                    </Button>
                  )}
                  {active.offerStatus !== 'Declined' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => {
                        patch(active.id, { offerStatus: 'Declined' });
                        toast.error('Offer marked as declined');
                      }}
                    >
                      Mark declined
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Documents received</p>
                {REQUIRED_DOCS.map(d => (
                  <div
                    key={d}
                    className="rounded-md border p-3 text-sm hover:bg-muted/50"
                  >
                    <FormField
                      label={d}
                      name={`document-${active.id}-${d.toLowerCase().replace(/\s+/g, '-')}`}
                      type="checkbox"
                      value={active.docs.includes(d)}
                      onCheckboxChange={() => toggleDoc(active, d)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
