'use client';

import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { TanStackTable } from '@/components/common';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from 'recharts';
import { FileText, HelpCircle, PlayCircle, Video } from 'lucide-react';
import { toast } from 'sonner';

type InductionData = {
  id: string;
  module: string;
  type: 'Video' | 'Document' | 'Quiz';
  duration: string;
  status: 'Watched' | 'Pending';
};

const SEED: InductionData[] = [
  {
    id: '1',
    module: 'Company Culture & Values',
    type: 'Video',
    duration: '15 mins',
    status: 'Watched',
  },
  {
    id: '2',
    module: 'HR Policies Overview',
    type: 'Document',
    duration: '10 mins',
    status: 'Pending',
  },
  {
    id: '3',
    module: 'Security & Compliance',
    type: 'Video',
    duration: '20 mins',
    status: 'Pending',
  },
  {
    id: '4',
    module: 'Code of Conduct Quiz',
    type: 'Quiz',
    duration: '10 mins',
    status: 'Pending',
  },
  {
    id: '5',
    module: 'Tools & Systems Walkthrough',
    type: 'Video',
    duration: '25 mins',
    status: 'Watched',
  },
];
const TYPE_ICON = { Video, Document: FileText, Quiz: HelpCircle };

export default function Induction() {
  const [modules, setModules] = useState(SEED);
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = modules.find(m => m.id === activeId);

  const setStatus = (id: string, status: InductionData['status']) =>
    setModules(l => l.map(m => (m.id === id ? { ...m, status } : m)));

  const done = modules.filter(m => m.status === 'Watched').length;
  const pct = modules.length ? Math.round((done / modules.length) * 100) : 0;
  const minsLeft = modules
    .filter(m => m.status === 'Pending')
    .reduce((s, m) => s + parseInt(m.duration), 0);

  const columns = useMemo<ColumnDef<InductionData>[]>(
    () => [
      { accessorKey: 'module', header: 'Induction Module' },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
          const I = TYPE_ICON[row.original.type];
          return (
            <span className="flex items-center gap-2 text-sm">
              <I className="h-4 w-4 text-muted-foreground" />
              {row.original.type}
            </span>
          );
        },
      },
      { accessorKey: 'duration', header: 'Duration' },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${row.original.status === 'Watched' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}
          >
            {row.original.status === 'Watched' ? 'Completed' : 'Pending'}
          </span>
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <Button
            size="sm"
            variant={row.original.status === 'Watched' ? 'ghost' : 'default'}
            onClick={() => setActiveId(row.original.id)}
          >
            <PlayCircle className="mr-2 h-4 w-4" />
            {row.original.status === 'Watched' ? 'Review again' : 'Start'}
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-medium">Induction & Welcome</h3>
        <p className="text-sm text-muted-foreground">
          Track completion of welcome videos, culture docs and policy quizzes.
        </p>
      </div>

      <div className="flex items-center gap-6 rounded-xl border bg-card p-5">
        <div className="relative h-28 w-28 shrink-0">
          <ResponsiveContainer>
            <RadialBarChart
              innerRadius="72%"
              outerRadius="100%"
              data={[{ v: pct }]}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar
                dataKey="v"
                fill={pct === 100 ? '#10b981' : '#6366f1'}
                background
                cornerRadius={12}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <span className="absolute inset-0 flex items-center justify-center text-xl font-semibold tabular-nums">
            {pct}%
          </span>
        </div>
        <div>
          <p className="font-medium">
            {done} of {modules.length} modules completed
          </p>
          <p className="text-sm text-muted-foreground">
            {minsLeft === 0
              ? 'Induction complete. Welcome aboard!'
              : `About ${minsLeft} minutes of content left.`}
          </p>
        </div>
      </div>

      <TanStackTable columns={columns} data={modules} showDownload />

      <Dialog open={!!active} onOpenChange={o => !o && setActiveId(null)}>
        <DialogContent>
          {active && (
            <>
              <DialogHeader>
                <DialogTitle>{active.module}</DialogTitle>
                <DialogDescription>
                  {active.type} · {active.duration}
                </DialogDescription>
              </DialogHeader>
              <div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
                <PlayCircle className="h-12 w-12 text-muted-foreground" />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setActiveId(null)}>
                  Close
                </Button>
                {active.status === 'Pending' ? (
                  <Button
                    onClick={() => {
                      setStatus(active.id, 'Watched');
                      toast.success(`${active.module} completed`);
                      setActiveId(null);
                    }}
                  >
                    Mark as completed
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStatus(active.id, 'Pending');
                      toast.info('Module reset to pending');
                      setActiveId(null);
                    }}
                  >
                    Reset progress
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
