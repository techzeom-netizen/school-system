import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertTriangle,
  Award,
  Calculator,
  CheckCircle2,
  Coins,
  Lock,
  Unlock,
  RotateCcw,
  SearchX,
  Send,
  Sliders,
  Star,
  TrendingUp,
  Users,
  Wallet,
  Wand2,
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { TanStackTable } from '@/components/common';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  calibrationBulkModeOptions,
  calibrationBandFilterOptions,
  calibrationBandOptions,
  calibrationDepartmentFilterOptions,
  calibrationSortOptions,
  calibrationStatusFilterOptions,
  calibrationStatusOptions,
} from '@/data/reusableDropdownData';

const cardCls =
  'rounded-2xl border border-border bg-card p-5 shadow-sm dark:border-border dark:bg-card';

const iconBtn =
  'rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-40 dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-primary-foreground';

const gridProps = {
  strokeDasharray: '3 3',
  stroke: 'currentColor',
  strokeOpacity: 0.1,
  vertical: false,
};

const axisTick = { fontSize: 11, fill: 'currentColor', opacity: 0.55 };

const initials = (n: string) =>
  n
    .split(' ')
    .map(x => x[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

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
      aria-hidden
      className="flex flex-shrink-0 items-center justify-center rounded-full font-semibold text-primary-foreground"
      style={{
        width: size,
        height: size,
        background: AVATAR_COLORS[name.length % AVATAR_COLORS.length],
        fontSize: size * 0.38,
      }}
    >
      {initials(name)}
    </span>
  );
}

function Chip({
  label,
  color,
  icon,
  dot,
}: {
  label: string;
  color: string;
  icon?: React.ReactNode;
  dot?: boolean;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium"
      style={{
        background: `color-mix(in srgb, ${color} 10%, transparent)`,
        color,
      }}
    >
      {dot && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: color }}
        />
      )}
      {icon}
      {label}
    </span>
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
          {subtitle && <DialogDescription>{subtitle}</DialogDescription>}
        </DialogHeader>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <DialogFooter className="flex-wrap border-t px-5 py-3">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

type Status = 'Not Started' | 'In Review' | 'Calibrated' | 'Locked';
type Band = '0%' | '3%' | '5%' | '8%' | '12%' | '15%+' | 'Promotion';
interface Emp {
  id: string;
  name: string;
  role: string;
  department: string;
  manager: string;
  currentCtc: number;
  performance: number;
  potential: number;
  proposed: number;
  pct: number;
  promoted: boolean;
  promotedTo: string;
  bonusPct: number;
  status: Status;
  notes: string;
}
interface EmpView extends Emp {
  increase: number;
  newCtc: number;
  bonus: number;
  band: Band;
  guide: number;
}

const STATUS_COLORS: Record<Status, string> = {
  'Not Started': 'hsl(var(--muted-foreground))',
  'In Review': 'hsl(var(--secondary-foreground))',
  Calibrated: 'hsl(var(--primary))',
  Locked: 'hsl(var(--primary))',
};
const BAND_COLORS: Record<Band, string> = {
  '0%': 'hsl(var(--muted-foreground))',
  '3%': 'hsl(var(--secondary-foreground))',
  '5%': 'hsl(var(--primary))',
  '8%': 'hsl(var(--primary))',
  '12%': 'hsl(var(--accent-foreground))',
  '15%+': 'hsl(var(--destructive))',
  Promotion: 'hsl(var(--accent-foreground))',
};
const STATUSES = calibrationStatusOptions.map(option => option.value as Status);
const BANDS = calibrationBandOptions.map(option => option.value as Band);
const GUIDELINE: Record<number, number> = { 5: 15, 4: 10, 3: 6, 2: 2, 1: 0 };
const TARGET_DIST: Record<number, number> = {
  5: 10,
  4: 30,
  3: 45,
  2: 12,
  1: 3,
};
const DEVIATION_LIMIT = 5;
const BOX_NAMES: Record<string, string> = {
  'H-L': 'Rough diamonds',
  'H-M': 'Future stars',
  'H-H': 'Stars',
  'M-L': 'Inconsistent',
  'M-M': 'Core players',
  'M-H': 'High performers',
  'L-L': 'Risk',
  'L-M': 'Effective',
  'L-H': 'Trusted pros',
};

const E = (
  id: string,
  name: string,
  role: string,
  department: string,
  manager: string,
  lakh: number,
  performance: number,
  potential: number,
  pct: number,
  status: Status,
  notes: string,
  extra: Partial<Emp> = {}
): Emp => ({
  id,
  name,
  role,
  department,
  manager,
  currentCtc: Math.round(lakh * 100000),
  performance,
  potential,
  proposed: performance,
  pct,
  promoted: false,
  promotedTo: '',
  bonusPct: GUIDELINE[performance] + 5,
  status,
  notes,
  ...extra,
});

const SEED: Emp[] = [
  E(
    'e1',
    'Olivia Chen',
    'Business Development Manager',
    'Business Growth',
    'Hiroshi Tanaka',
    18,
    5,
    5,
    18,
    'Calibrated',
    'Closed the largest enterprise deal; promoted.',
    { promoted: true, promotedTo: 'Senior BDM' }
  ),
  E(
    'e2',
    'Daniel Whitmore',
    'VP Engineering',
    'Engineering',
    'Marcus Reiner',
    48,
    5,
    5,
    15,
    'Calibrated',
    'Led the v3 platform programme; retention priority.'
  ),
  E(
    'e3',
    'Mateo Alvarez',
    'Digital Marketing Executive',
    'Marketing',
    'Sophia Laurent',
    9.5,
    4,
    5,
    12,
    'In Review',
    'Strong campaigns; moving to a lead role.'
  ),
  E(
    'e4',
    'Emma Lindqvist',
    'Software Engineer',
    'Engineering',
    'Daniel Whitmore',
    14,
    4,
    3,
    8,
    'In Review',
    'Consistent delivery; growth area is system design.'
  ),
  E(
    'e5',
    'Lucas Bergström',
    'Jr. Software Engineer',
    'Engineering',
    'Daniel Whitmore',
    7,
    4,
    5,
    12,
    'In Review',
    'High potential; on a certification path.'
  ),
  E(
    'e6',
    'Kenji Nakamura',
    'Jr. Software Engineer',
    'Engineering',
    'Daniel Whitmore',
    6.8,
    3,
    3,
    5,
    'Not Started',
    'Steady; code review depth is the next focus.'
  ),
  E(
    'e7',
    'Sophia Laurent',
    'Head of Marketing',
    'Marketing',
    'Marcus Reiner',
    28,
    5,
    4,
    14,
    'Calibrated',
    'Inbound pipeline target exceeded.'
  ),
  E(
    'e8',
    'Hiroshi Tanaka',
    'VP Sales',
    'Business Growth',
    'Marcus Reiner',
    38,
    3,
    3,
    5,
    'In Review',
    'Flight risk; retention conversation planned.'
  ),
  E(
    'e9',
    'Isabella Rossi',
    'VP People',
    'People & Culture',
    'Marcus Reiner',
    26,
    4,
    4,
    8,
    'Locked',
    'Improved eNPS by 6 points.'
  ),
  E(
    'e10',
    'Imran Sheikh',
    'Chief Financial Officer',
    'Finance',
    'Marcus Reiner',
    45,
    4,
    3,
    9,
    'Not Started',
    'Closed audits on time; receivables need work.'
  ),
  E(
    'e11',
    'Camila Fernández',
    'Finance Analyst',
    'Finance',
    'Imran Sheikh',
    8,
    2,
    3,
    2,
    'In Review',
    'Needs a development plan; below expectations.'
  ),
  E(
    'e12',
    'Amara Okonkwo',
    'Data Analyst',
    'Data & AI',
    'Marcus Reiner',
    11,
    4,
    4,
    8,
    'In Review',
    'Shipped exec dashboards; deeper SQL is next.'
  ),
];

const SEED_BUDGET: Record<string, number> = {
  Engineering: 1000000,
  Marketing: 550000,
  'Business Growth': 550000,
  'People & Culture': 250000,
  Finance: 450000,
  'Data & AI': 350000,
};

const fmtINR = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const fmtLakh = (n: number) =>
  `₹${(n / 100000).toFixed(2).replace(/\.?0+$/, '')}L`;
const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, n));
const bandOf = (promoted: boolean, pct: number): Band => {
  if (promoted) return 'Promotion';
  if (pct <= 0) return '0%';
  if (pct <= 3) return '3%';
  if (pct <= 5) return '5%';
  if (pct <= 8) return '8%';
  if (pct <= 12) return '12%';
  return '15%+';
};
const level = (n: number) => (n >= 4 ? 'H' : n === 3 ? 'M' : 'L');
const boxOf = (e: Emp) => `${level(e.potential)}-${level(e.performance)}`;
const enrich = (e: Emp): EmpView => {
  const increase = Math.round((e.currentCtc * e.pct) / 100);
  const newCtc = e.currentCtc + increase;
  return {
    ...e,
    increase,
    newCtc,
    bonus: Math.round((newCtc * e.bonusPct) / 100),
    band: bandOf(e.promoted, e.pct),
    guide: GUIDELINE[e.proposed],
  };
};
const StatusChip = ({ s }: { s: Status }) => (
  <Chip label={s} color={STATUS_COLORS[s]} dot />
);
const BandChip = ({ b }: { b: Band }) => (
  <Chip label={b} color={BAND_COLORS[b]} />
);

function Stars({ value, size = 12 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex gap-px" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          className={
            i <= value
              ? 'text-accent-foreground'
              : 'text-muted-foreground dark:text-secondary-foreground'
          }
          fill={i <= value ? 'hsl(var(--accent-foreground))' : 'transparent'}
        />
      ))}
    </span>
  );
}
function RatingInput({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className="flex gap-0.5"
      role="radiogroup"
      aria-label="Calibrated rating"
    >
      {[1, 2, 3, 4, 5].map(i => (
        <Button
          key={i}
          type="button"
          variant="ghost"
          size="icon"
          role="radio"
          aria-checked={value === i}
          aria-label={`${i} out of 5`}
          disabled={disabled}
          onClick={() => onChange(i)}
          className="rounded p-0.5"
        >
          <Star
            size={20}
            className={
              i <= value
                ? 'text-accent-foreground'
                : 'text-muted-foreground dark:text-secondary-foreground'
            }
            fill={i <= value ? 'hsl(var(--accent-foreground))' : 'transparent'}
          />
        </Button>
      ))}
    </div>
  );
}

function CalibrationModal({
  emp,
  deptUsed,
  deptBudget,
  onSave,
  onUnlock,
  onClose,
}: {
  emp: EmpView;
  deptUsed: number;
  deptBudget: number;
  onClose: () => void;
  onUnlock: () => void;
  onSave: (patch: Partial<Emp>, status: Status) => void;
}) {
  const locked = emp.status === 'Locked';
  const [d, setD] = useState({
    proposed: emp.proposed,
    pct: String(emp.pct),
    promoted: emp.promoted,
    promotedTo: emp.promotedTo,
    bonusPct: String(emp.bonusPct),
    notes: emp.notes,
  });
  const [error, setError] = useState('');
  const up = <K extends keyof typeof d>(k: K, v: (typeof d)[K]) =>
    setD(p => ({ ...p, [k]: v }));
  const pct = clamp(Number(d.pct) || 0, 0, 40);
  const increase = Math.round((emp.currentCtc * pct) / 100);
  const guide = GUIDELINE[d.proposed];
  const gap = Math.round((pct - guide) * 10) / 10;
  const remaining = deptBudget - (deptUsed - emp.increase + increase);

  const save = (status: Status) => {
    if (Math.abs(gap) > DEVIATION_LIMIT && d.notes.trim().length < 15)
      return setError(
        `This is ${Math.abs(gap)} pts ${gap > 0 ? 'above' : 'below'} the guideline. Add a short justification in the notes.`
      );
    if (d.promoted && !d.promotedTo.trim())
      return setError('Enter the new title for the promotion.');
    setError('');
    onSave(
      {
        proposed: d.proposed,
        pct,
        promoted: d.promoted,
        promotedTo: d.promoted ? d.promotedTo.trim() : '',
        bonusPct: clamp(Number(d.bonusPct) || 0, 0, 100),
        notes: d.notes.trim(),
      },
      status
    );
  };

  return (
    <Modal
      wide
      title={locked ? 'Locked decision' : 'Calibrate'}
      subtitle={`${emp.name}, ${emp.role} · ${emp.department}`}
      onClose={onClose}
      footer={
        locked ? (
          <>
            <Button type="button" variant="destructive" onClick={onClose}>
              Close
            </Button>
            <Button type="button" variant="default" onClick={onUnlock}>
              <Unlock size={14} /> Unlock to edit
            </Button>
          </>
        ) : (
          <>
            <Button type="button" variant="destructive" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => save('In Review')}
            >
              Save as draft
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={() => save('Calibrated')}
            >
              <CheckCircle2 size={14} /> Mark calibrated
            </Button>
          </>
        )
      }
    >
      <div className="flex flex-wrap items-center gap-3">
        <Avatar name={emp.name} size={48} />
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip s={emp.status} />
          <span className="text-xs text-muted-foreground dark:text-muted-foreground">
            Reports to {emp.manager}
          </span>
        </div>
        <div className="ml-auto grid grid-cols-2 gap-4 text-center text-xs">
          <div>
            <div className="mb-1 text-muted-foreground">Performance</div>
            <Stars value={emp.performance} />
          </div>
          <div>
            <div className="mb-1 text-muted-foreground">Potential</div>
            <Stars value={emp.potential} />
          </div>
        </div>
      </div>

      <fieldset disabled={locked} className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-1 text-xs font-medium text-secondary-foreground dark:text-muted-foreground">
            Calibrated rating
          </div>
          <RatingInput
            value={d.proposed}
            onChange={v => up('proposed', v)}
            disabled={locked}
          />
          <p className="mt-1 text-xs text-muted-foreground dark:text-muted-foreground">
            Guideline increment for {d.proposed} stars: <b>{guide}%</b>
          </p>
        </div>
        <div>
          <div className="grid grid-cols-[6rem_minmax(0,1fr)_2.25rem] items-end gap-2">
            <FormField
              label="Increment %"
              name="increment-percent"
              type="number"
              min="0"
              max="40"
              step="0.5"
              className="w-24"
              value={d.pct}
              onChange={value => up('pct', value)}
            />
            <Input
              aria-label="Adjust increment percentage"
              name="increment-slider"
              type="range"
              min={0}
              max={30}
              step={0.5}
              value={clamp(pct, 0, 30)}
              onChange={event => up('pct', event.target.value)}
              className="h-2 min-w-0 cursor-pointer accent-primary"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className={`${iconBtn} border border-border dark:border-border`}
              title="Apply guideline"
              aria-label="Apply guideline"
              onClick={() => up('pct', String(guide))}
            >
              <Wand2 size={14} />
            </Button>
          </div>
        </div>
        <div>
          <FormField
            label="Promotion"
            name="promotion"
            type="checkbox"
            value={d.promoted}
            onCheckboxChange={value => up('promoted', value)}
          />
          {d.promoted && (
            <FormField
              label="New title"
              name="new-title"
              type="text"
              className="mt-2"
              value={d.promotedTo}
              onChange={value => up('promotedTo', value)}
              placeholder="New title, e.g. Senior BDM"
            />
          )}
        </div>
        <div>
          <FormField
            label="Target bonus (% of new CTC)"
            name="target-bonus"
            type="number"
            min="0"
            max="100"
            value={d.bonusPct}
            onChange={value => up('bonusPct', value)}
          />
        </div>
      </fieldset>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-primary/10 p-4 text-xs dark:bg-primary/10 sm:grid-cols-4">
        <div>
          <div className="text-primary dark:text-primary">New CTC</div>
          <div className="mt-0.5 text-base font-semibold tabular-nums">
            {fmtINR(emp.currentCtc + increase)}
          </div>
        </div>
        <div>
          <div className="text-primary dark:text-primary">Increase</div>
          <div className="mt-0.5 text-base font-semibold tabular-nums">
            +{fmtINR(increase)}
          </div>
        </div>
        <div>
          <div className="text-primary dark:text-primary">Bonus</div>
          <div className="mt-0.5 text-base font-semibold tabular-nums">
            {fmtINR(
              ((emp.currentCtc + increase) * (Number(d.bonusPct) || 0)) / 100
            )}
          </div>
        </div>
        <div>
          <div className="text-primary dark:text-primary">
            {emp.department} budget left
          </div>
          <div
            className={`mt-0.5 text-base font-semibold tabular-nums ${remaining < 0 ? 'text-destructive' : ''}`}
          >
            {remaining < 0 ? '-' : ''}
            {fmtLakh(Math.abs(remaining))}
          </div>
        </div>
      </div>
      {remaining < 0 && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
          <AlertTriangle size={13} /> This puts {emp.department} over its
          budget.
        </p>
      )}
      {Math.abs(gap) > DEVIATION_LIMIT && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-accent-foreground">
          <AlertTriangle size={13} /> {Math.abs(gap)} pts{' '}
          {gap > 0 ? 'above' : 'below'} the guideline for this rating. A
          justification is required.
        </p>
      )}

      <FormField
        label="Calibration notes"
        name="calibration-notes"
        type="textarea"
        rows={3}
        disabled={locked}
        className="mt-4"
        value={d.notes}
        onChange={value => up('notes', value)}
      />
      {error && (
        <p className="mt-2 text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </Modal>
  );
}

function BulkModal({
  targets,
  onApply,
  onClose,
}: {
  targets: EmpView[];
  onApply: (fn: (e: EmpView) => number) => void;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<'guideline' | 'set' | 'add'>('guideline');
  const [value, setValue] = useState('0');
  const v = Number(value) || 0;
  const calc = (e: EmpView) =>
    clamp(
      mode === 'guideline' ? e.guide : mode === 'set' ? v : e.pct + v,
      0,
      40
    );
  const avg = targets.length
    ? targets.reduce((s, e) => s + calc(e), 0) / targets.length
    : 0;
  return (
    <Modal
      title="Bulk adjust increments"
      subtitle={`Applies to ${targets.length} unlocked ${targets.length === 1 ? 'employee' : 'employees'} in the current view`}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-primary hover:bg-primary"
            disabled={!targets.length}
            onClick={() => onApply(calc)}
          >
            Apply to {targets.length}
          </Button>
        </>
      }
    >
      <div className="space-y-2 text-sm">
        <FormField
          label="Adjustment method"
          name="bulk-adjustment-mode"
          type="radio"
          value={mode}
          onChange={value => setMode(value as typeof mode)}
          options={calibrationBulkModeOptions}
        />
        {mode !== 'guideline' && (
          <FormField
            label="Value (%)"
            name="bulk-value"
            type="number"
            step="0.5"
            className="w-32"
            value={value}
            onChange={setValue}
          />
        )}
      </div>
      <p className="mt-4 rounded-xl bg-muted p-3 text-xs text-secondary-foreground dark:bg-muted/50 dark:text-muted-foreground">
        The average increment would become <b>{avg.toFixed(1)}%</b>. Values stay
        between 0% and 40%, and locked employees are skipped.
      </p>
    </Modal>
  );
}

function BudgetModal({
  budgets,
  onSave,
  onClose,
}: {
  budgets: Record<string, number>;
  onSave: (b: Record<string, number>) => void;
  onClose: () => void;
}) {
  const [vals, setVals] = useState(
    Object.fromEntries(
      Object.entries(budgets).map(([k, v]) => [k, String(v / 100000)])
    )
  );
  return (
    <Modal
      title="Department budgets"
      subtitle="Total increment budget per department, in ₹ lakh"
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="destructive" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={() =>
              onSave(
                Object.fromEntries(
                  Object.entries(vals).map(([k, v]) => [
                    k,
                    Math.max(0, Number(v) || 0) * 100000,
                  ])
                )
              )
            }
          >
            Save budgets
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        {Object.keys(vals).map(k => (
          <div key={k} className="flex items-center justify-between gap-3">
            <FormField
              label={k}
              name={`budget-${k}`}
              type="number"
              min="0"
              step="0.1"
              className="w-32"
              value={vals[k]}
              onChange={value => setVals(p => ({ ...p, [k]: value }))}
            />
          </div>
        ))}
      </div>
    </Modal>
  );
}

const CalibrationandIncrement: React.FC = () => {
  const DEFAULTS = {
    department: 'all',
    status: 'all',
    band: 'all',
    box: 'all',
    search: '',
    sort: 'name',
  };
  const [emps, setEmps] = useState<Emp[]>(SEED);
  const [budgets, setBudgets] = useState(SEED_BUDGET);
  const [form, setForm] = useState(DEFAULTS);
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const [openId, setOpenId] = useState<string | null>(null);
  const [modal, setModal] = useState<'bulk' | 'budget' | 'approve' | null>(
    null
  );
  const set = (k: keyof typeof DEFAULTS, v: string) =>
    setForm(p => ({ ...p, [k]: v }));

  const views = useMemo(() => emps.map(enrich), [emps]);
  const departments = useMemo(() => Object.keys(budgets), [budgets]);
  const deptScope = useMemo(
    () =>
      views.filter(
        e => form.department === 'all' || e.department === form.department
      ),
    [views, form.department]
  );

  const filtered = useMemo(() => {
    const q = form.search.trim().toLowerCase();
    const list = deptScope.filter(
      e =>
        (form.status === 'all' || e.status === form.status) &&
        (form.band === 'all' || e.band === form.band) &&
        (form.box === 'all' || boxOf(e) === form.box) &&
        (!q ||
          e.name.toLowerCase().includes(q) ||
          e.role.toLowerCase().includes(q))
    );
    return [...list].sort((a, b) =>
      form.sort === 'pct'
        ? b.pct - a.pct
        : form.sort === 'ctc'
          ? b.newCtc - a.newCtc
          : form.sort === 'status'
            ? STATUSES.indexOf(a.status) - STATUSES.indexOf(b.status)
            : a.name.localeCompare(b.name)
    );
  }, [deptScope, form]);

  /* analytics */
  const used = useMemo(
    () =>
      Object.fromEntries(
        departments.map(d => [
          d,
          views
            .filter(e => e.department === d)
            .reduce((s, e) => s + e.increase, 0),
        ])
      ),
    [views, departments]
  );
  const over = departments.filter(d => used[d] > budgets[d]);
  const totalBudget = Object.values(budgets).reduce((s, v) => s + v, 0);
  const totalUsed = Object.values(used).reduce((s, v) => s + v, 0);
  const avgPct = filtered.length
    ? filtered.reduce((s, e) => s + e.pct, 0) / filtered.length
    : 0;
  const doneShare = Math.round(
    (views.filter(e => e.status === 'Calibrated' || e.status === 'Locked')
      .length /
      Math.max(1, views.length)) *
      100
  );
  const budgetData = departments.map(d => ({
    name: d,
    Allocated: +(budgets[d] / 100000).toFixed(2),
    Used: +(used[d] / 100000).toFixed(2),
    over: used[d] > budgets[d],
  }));
  const bandData = BANDS.map(b => ({
    name: b,
    value: deptScope.filter(e => e.band === b).length,
    color: BAND_COLORS[b],
  })).filter(x => x.value);
  const distData = [5, 4, 3, 2, 1].map(r => ({
    name: `${r} star${r > 1 ? 's' : ''}`,
    Actual: deptScope.length
      ? Math.round(
          (deptScope.filter(e => e.proposed === r).length / deptScope.length) *
            100
        )
      : 0,
    Target: TARGET_DIST[r],
  }));
  const boxes = ['H', 'M', 'L'].flatMap(p =>
    ['L', 'M', 'H'].map(f => ({
      key: `${p}-${f}`,
      count: deptScope.filter(e => boxOf(e) === `${p}-${f}`).length,
    }))
  );

  /* handlers */
  const patchEmp = (id: string, patch: Partial<Emp>) =>
    setEmps(p => p.map(e => (e.id === id ? { ...e, ...patch } : e)));
  const saveEmp = (id: string, patch: Partial<Emp>, status: Status) => {
    patchEmp(id, { ...patch, status });
    setOpenId(null);
    toast.success(
      status === 'Calibrated' ? 'Marked as calibrated' : 'Draft saved'
    );
  };
  const bulkApply = (fn: (e: EmpView) => number) => {
    const ids = new Set(
      filtered.filter(e => e.status !== 'Locked').map(e => e.id)
    );
    const byId = new Map(views.map(v => [v.id, v]));
    setEmps(p =>
      p.map(e =>
        ids.has(e.id)
          ? {
              ...e,
              pct: Math.round(fn(byId.get(e.id)!) * 10) / 10,
              status: e.status === 'Not Started' ? 'In Review' : e.status,
            }
          : e
      )
    );
    setModal(null);
    toast.success(`Updated ${ids.size} increments`);
  };
  const sendForApproval = () => {
    const n = views.filter(e => e.status === 'Calibrated').length;
    setEmps(p =>
      p.map(e => (e.status === 'Calibrated' ? { ...e, status: 'Locked' } : e))
    );
    setModal(null);
    toast.success(`${n} decisions locked and sent for approval`);
  };
  const filtersActive = JSON.stringify(form) !== JSON.stringify(DEFAULTS);
  const open = views.find(e => e.id === openId);
  const lockedOut = (e: EmpView) => e.status === 'Locked';
  const calibratedCount = views.filter(e => e.status === 'Calibrated').length;

  const columns = useMemo<ColumnDef<EmpView>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Employee',
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
        accessorKey: 'proposed',
        header: 'Rating',
        cell: ({ row }) => <Stars value={row.original.proposed} />,
      },
      {
        accessorKey: 'band',
        header: 'Band',
        cell: ({ row }) => <BandChip b={row.original.band} />,
      },
      {
        accessorKey: 'newCtc',
        header: 'New CTC',
        cell: ({ row }) => (
          <div className="text-sm">
            <div className="font-medium tabular-nums">
              {fmtLakh(row.original.newCtc)}
            </div>
            <div className="text-xs text-primary">+{row.original.pct}%</div>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusChip s={row.original.status} />,
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
            className={iconBtn}
            aria-label={lockedOut(row.original) ? 'View decision' : 'Calibrate'}
            onClick={() => setOpenId(row.original.id)}
          >
            {lockedOut(row.original) ? (
              <Lock size={15} />
            ) : (
              <Sliders size={15} />
            )}
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <div className="min-h-screen space-y-4  p-1 text-foreground  dark:text-muted-foreground">
      <Section
        title="Calibration & Increment"
        menuId="calibration-increment"
        showBreadcrumbs
      >
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm font-medium ">
              <Calculator size={14} /> Performance & Growth
            </div>
            <p className="text-xs text-muted-foreground dark:text-muted-foreground">
              Calibrate ratings across teams, then finalise increments within
              each department&apos;s budget.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModal('budget')}
            >
              <Wallet size={14} /> Budgets
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setModal('bulk')}
            >
              <Sliders size={14} /> Bulk adjust
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <FormField
            label="Department"
            name="department"
            type="select"
            value={form.department}
            onChange={v => set('department', v)}
            options={calibrationDepartmentFilterOptions}
          />
          <FormField
            label="Status"
            name="status"
            type="select"
            value={form.status}
            onChange={v => set('status', v)}
            options={calibrationStatusFilterOptions}
          />
          <FormField
            label="Increment band"
            name="band"
            type="select"
            value={form.band}
            onChange={v => set('band', v)}
            options={calibrationBandFilterOptions}
          />
          <FormField
            label="Sort by"
            name="sort"
            type="select"
            value={form.sort}
            onChange={v => set('sort', v)}
            options={calibrationSortOptions}
          />
          <FormField
            label="Search"
            name="search"
            type="text"
            value={form.search}
            onChange={v => set('search', v)}
            placeholder="Employee or role"
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

      {over.length > 0 && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive dark:border-destructive/50 dark:bg-destructive/10 dark:text-destructive"
        >
          <span className="flex items-center gap-2">
            <AlertTriangle size={16} />{' '}
            {over
              .map(d => `${d} is ${fmtLakh(used[d] - budgets[d])} over budget`)
              .join(' · ')}
          </span>
          <Button
            type="button"
            variant="outline"
            onClick={() => set('department', over[0])}
          >
            Review {over[0]}
          </Button>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {[
          {
            label: 'In view',
            value: filtered.length,
            hint: `of ${views.length} employees`,
            color: 'hsl(var(--primary))',
            icon: Users,
          },
          {
            label: 'Average increment',
            value: `${avgPct.toFixed(1)}%`,
            hint: 'Across the current view',
            color: 'hsl(var(--primary))',
            icon: TrendingUp,
          },
          {
            label: 'Promotions',
            value: filtered.filter(e => e.promoted).length,
            hint: 'In the current view',
            color: 'hsl(var(--accent-foreground))',
            icon: Award,
          },
          {
            label: 'Budget used',
            value: fmtLakh(totalUsed),
            hint: `of ${fmtLakh(totalBudget)} · ${totalBudget ? Math.round((totalUsed / totalBudget) * 100) : 0}%`,
            color:
              totalUsed > totalBudget
                ? 'hsl(var(--destructive))'
                : 'hsl(var(--accent-foreground))',
            icon: Wallet,
          },
          {
            label: 'Calibrated',
            value: `${doneShare}%`,
            hint: 'Calibrated or locked',
            color: 'hsl(var(--secondary-foreground))',
            icon: CheckCircle2,
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
                    background: `color-mix(in srgb, ${k.color} 10%, transparent)`,
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
          <h3 className="text-sm font-semibold">Budget by department</h3>
          <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
            Increments allocated to employees vs the budget, in ₹ lakh. Select a
            bar to filter.
          </p>
          <div className="mt-3 text-foreground dark:text-muted-foreground">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={budgetData}
                margin={{ top: 8, right: 8, bottom: 0, left: -12 }}
              >
                <CartesianGrid {...gridProps} />
                <XAxis
                  dataKey="name"
                  tick={axisTick}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                />
                <YAxis tick={axisTick} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'currentColor', fillOpacity: 0.05 }}
                  content={<ChartTooltip />}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11 }}
                  iconType="circle"
                  iconSize={8}
                />
                <Bar
                  dataKey="Allocated"
                  name="Budget"
                  fill="hsl(var(--muted-foreground))"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={30}
                />
                <Bar
                  dataKey="Used"
                  name="Used"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={30}
                  cursor="pointer"
                  onClick={datum => {
                    if (typeof datum.name !== 'string') return;
                    set(
                      'department',
                      form.department === datum.name ? 'all' : datum.name
                    );
                  }}
                >
                  {budgetData.map(d => (
                    <Cell
                      key={d.name}
                      fill={
                        d.over
                          ? 'hsl(var(--destructive))'
                          : 'hsl(var(--primary))'
                      }
                      fillOpacity={
                        form.department === 'all' || form.department === d.name
                          ? 1
                          : 0.35
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className={cardCls}>
          <h3 className="text-sm font-semibold">Increment bands</h3>
          <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
            Select a slice to filter
          </p>
          {bandData.length === 0 ? (
            <p className="py-16 text-center text-xs text-muted-foreground">
              No employees in scope.
            </p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={bandData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={46}
                    outerRadius={70}
                    paddingAngle={3}
                    cornerRadius={4}
                    stroke="none"
                    cursor="pointer"
                    onClick={datum => {
                      if (typeof datum.name !== 'string') return;
                      set(
                        'band',
                        form.band === datum.name ? 'all' : (datum.name as Band)
                      );
                    }}
                  >
                    {bandData.map(b => (
                      <Cell
                        key={b.name}
                        fill={b.color}
                        fillOpacity={
                          form.band === 'all' || form.band === b.name ? 1 : 0.3
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div
                role="list"
                className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1.5"
              >
                {bandData.map(b => (
                  <div
                    key={b.name}
                    role="listitem"
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="flex items-center gap-2 text-secondary-foreground dark:text-muted-foreground">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: b.color }}
                      />
                      {b.name}
                    </span>
                    <span className="font-medium tabular-nums">{b.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className={`${cardCls} xl:col-span-2`}>
          <h3 className="text-sm font-semibold">
            Rating distribution vs target
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
            Share of employees at each calibrated rating. Large gaps are worth
            discussing.
          </p>
          <div className="mt-3 text-foreground dark:text-muted-foreground">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={distData}
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
                  unit="%"
                />
                <Tooltip
                  cursor={{ fill: 'currentColor', fillOpacity: 0.05 }}
                  content={<ChartTooltip />}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11 }}
                  iconType="circle"
                  iconSize={8}
                />
                <Bar
                  dataKey="Actual"
                  fill="hsl(var(--primary))"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={30}
                />
                <Bar
                  dataKey="Target"
                  fill="hsl(var(--muted-foreground))"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className={cardCls}>
          <h3 className="text-sm font-semibold">Performance and potential</h3>
          <p className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground">
            Select a box to filter. Potential runs top to bottom.
          </p>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {boxes.map(b => {
              const active = form.box === b.key;
              return (
                <Button
                  key={b.key}
                  type="button"
                  variant="ghost"
                  aria-pressed={active}
                  onClick={() => set('box', active ? 'all' : b.key)}
                  className={`h-auto w-full flex-col items-stretch rounded-lg border p-2 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${active ? 'border-primary bg-primary/10 dark:bg-primary/10' : 'border-border hover:border-border dark:border-border'}`}
                >
                  <div className="text-lg font-semibold tabular-nums">
                    {b.count}
                  </div>
                  <div className="text-[11px] leading-tight text-muted-foreground dark:text-muted-foreground">
                    {BOX_NAMES[b.key]}
                  </div>
                </Button>
              );
            })}
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
            <span>Lower performance</span>
            <span>Higher performance</span>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex flex-wrap items-center gap-2 text-sm font-semibold">
          {filtered.length} {filtered.length === 1 ? 'employee' : 'employees'}
          {form.box !== 'all' && (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => set('box', 'all')}
              className="rounded-full  px-2 py-0.5 text-xs font-medium "
            >
              {BOX_NAMES[form.box]} ✕
            </Button>
          )}
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
            No employees match these filters
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground dark:text-muted-foreground">
            Clear the filters to see everyone in this cycle.
          </p>
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setForm(DEFAULTS)}
            >
              <RotateCcw size={14} /> Clear filters
            </Button>
          </div>
        </div>
      ) : view === 'cards' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(e => (
            <div key={e.id} className={`${cardCls} flex flex-col gap-3`}>
              <div className="flex items-start gap-3">
                <Avatar name={e.name} size={44} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{e.name}</div>
                  <div className="truncate text-xs text-muted-foreground dark:text-muted-foreground">
                    {e.role}
                  </div>
                </div>
                <StatusChip s={e.status} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <BandChip b={e.band} />
                {e.promoted && (
                  <Chip
                    label={`Promoted to ${e.promotedTo}`}
                    color="hsl(var(--accent-foreground))"
                    icon={<Award size={11} />}
                  />
                )}
                {Math.abs(e.pct - e.guide) > DEVIATION_LIMIT && (
                  <Chip
                    label="Off guideline"
                    color="hsl(var(--destructive))"
                    icon={<AlertTriangle size={11} />}
                  />
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted p-2.5 text-center text-xs dark:bg-muted/40">
                <div>
                  <div className="text-muted-foreground dark:text-muted-foreground">
                    Current
                  </div>
                  <div className="mt-0.5 font-semibold tabular-nums">
                    {fmtLakh(e.currentCtc)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground dark:text-muted-foreground">
                    New
                  </div>
                  <div className="mt-0.5 font-semibold tabular-nums">
                    {fmtLakh(e.newCtc)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground dark:text-muted-foreground">
                    Increase
                  </div>
                  <div className="mt-0.5 font-semibold tabular-nums text-primary">
                    +{e.pct}%
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground dark:text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  Rating <Stars value={e.proposed} size={11} />
                </span>
                <span className="flex items-center gap-1">
                  <Coins size={11} /> Bonus {fmtLakh(e.bonus)}
                </span>
              </div>
              <Button
                type="button"
                variant={lockedOut(e) ? 'default' : undefined}
                onClick={() => setOpenId(e.id)}
              >
                {lockedOut(e) ? (
                  <>
                    <Lock size={14} /> View locked decision
                  </>
                ) : (
                  <>
                    <Sliders size={14} /> Calibrate
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <Section title="All employees">
          <TanStackTable
            showDownload={true}
            key={JSON.stringify(form)}
            data={filtered}
            columns={columns}
            searchPlaceholder="Search employees..."
            pageSize={10}
            enableColumnVisibility
            enableRowSelection={false}
          />
        </Section>
      )}

      {/* Modals */}
      {open && (
        <CalibrationModal
          key={open.id + open.status}
          emp={open}
          deptUsed={used[open.department] ?? 0}
          deptBudget={budgets[open.department] ?? 0}
          onClose={() => setOpenId(null)}
          onSave={(patch, status) => saveEmp(open.id, patch, status)}
          onUnlock={() => {
            patchEmp(open.id, { status: 'Calibrated' });
            toast.success('Unlocked for editing');
          }}
        />
      )}
      {modal === 'bulk' && (
        <BulkModal
          targets={filtered.filter(e => e.status !== 'Locked')}
          onApply={bulkApply}
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'budget' && (
        <BudgetModal
          budgets={budgets}
          onSave={b => {
            setBudgets(b);
            setModal(null);
            toast.success('Budgets updated');
          }}
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'approve' && (
        <Modal
          title="Send for approval"
          subtitle="Calibrated decisions are locked so they can no longer be edited."
          onClose={() => setModal(null)}
          footer={
            <>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setModal(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="default"
                disabled={!calibratedCount || over.length > 0}
                onClick={sendForApproval}
              >
                <Send size={14} /> Lock {calibratedCount} decisions
              </Button>
            </>
          }
        >
          <div role="list" className="space-y-2 text-sm">
            <div role="listitem" className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-primary" />{' '}
              {calibratedCount} calibrated decisions will be locked
            </div>
            <div role="listitem" className="flex items-center gap-2">
              <AlertTriangle size={15} className="text-accent-foreground" />{' '}
              {
                views.filter(
                  e => e.status === 'Not Started' || e.status === 'In Review'
                ).length
              }{' '}
              employees are not calibrated yet and will stay open
            </div>
            {over.length > 0 ? (
              <div
                role="listitem"
                className="flex items-start gap-2 text-destructive-foreground"
              >
                <AlertTriangle size={15} className="mt-0.5 flex-shrink-0" /> Fix
                the budget first:{' '}
                {over
                  .map(d => `${d} (${fmtLakh(used[d] - budgets[d])} over)`)
                  .join(', ')}
              </div>
            ) : (
              <div role="listitem" className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-primary" /> Every
                department is within budget
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CalibrationandIncrement;
