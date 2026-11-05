import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Check,
  CheckCircle2,
  Minus,
  MoreHorizontal,
  Pencil,
  Plus,
  ShieldCheck,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import TanStackTable from '@/components/common/TanStackTable';
import Section from '@/components/common/Section';
import {
  allowanceOptions,
  audienceOptions,
  carryOptions,
  colorOptions,
  grantOptions,
  leaveYearOptions,
  payOptions,
  yesNoOptions,
} from '@/data/reusableDropdownData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// ---------- Types ----------

type TabId = 'general' | 'types' | 'approval' | 'reminders';

type LeaveYear = 'april' | 'january';

type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

// "alternate" is only used for Saturday (2nd and 4th Saturday of the month).
type WeekOffMode = 'none' | 'alternate' | 'all';

type AllowanceKind = 'days' | 'asEarned' | 'noLimit';

type GrantMode =
  | 'monthly'
  | 'yearStart'
  | 'onRequest'
  | 'onApproval'
  | 'notApplicable';

type CarryMode = 'none' | 'upTo' | 'expires';

type PayMode = 'paid' | 'unpaid';

type Audience = 'everyone' | 'female' | 'male';

type ColorKey =
  | 'blue'
  | 'teal'
  | 'green'
  | 'orange'
  | 'rose'
  | 'violet'
  | 'slate'
  | 'gray';

type ReminderId =
  | 'newRequest'
  | 'decision'
  | 'waiting'
  | 'lowBalance'
  | 'weeklySummary';

type ReminderChannel = 'email' | 'inApp';

interface GeneralRules {
  leaveYear: LeaveYear;
  weeklyOffs: Record<DayKey, WeekOffMode>;
  countOffsAsLeave: boolean;
  allowHalfDay: boolean;
  noticeDays: number;
  maxDays: number;
  allowPastDates: boolean;
  pastDays: number;
}

interface ApprovalRules {
  hrOverDays: number;
  escalate: boolean;
  escalateDays: number;
  medicalOverDays: number;
}

interface LeaveType {
  id: string;
  name: string;
  code: string;
  description: string;
  color: ColorKey;
  allowanceKind: AllowanceKind;
  days: number;
  grant: GrantMode;
  monthlyAmount: number;
  carry: CarryMode;
  carryDays: number;
  encashable: boolean;
  pay: PayMode;
  appliesTo: Audience;
  isOn: boolean;
}

type Reminders = Record<ReminderId, Record<ReminderChannel, boolean>>;

interface LeaveSettings {
  general: GeneralRules;
  leaveTypes: LeaveType[];
  approval: ApprovalRules;
  reminders: Reminders;
}

interface LeaveTypeForm {
  name: string;
  code: string;
  description: string;
  allowanceKind: AllowanceKind;
  days: string;
  grant: GrantMode;
  monthlyAmount: string;
  carry: CarryMode;
  carryDays: string;
  encashable: 'yes' | 'no';
  pay: PayMode;
  appliesTo: Audience;
  color: ColorKey;
}

interface MenuItem {
  label: string;
  onSelect: () => void;
  isDanger?: boolean;
}

// ---------- Dropdown options ----------

const tabOptions: { label: string; value: TabId }[] = [
  { label: 'General rules', value: 'general' },
  { label: 'Leave types', value: 'types' },
  { label: 'Approval workflow', value: 'approval' },
  { label: 'Reminders', value: 'reminders' },
];

// ---------- Constants ----------

const dayOptions: { key: DayKey; label: string }[] = [
  { key: 'mon', label: 'Mon' },
  { key: 'tue', label: 'Tue' },
  { key: 'wed', label: 'Wed' },
  { key: 'thu', label: 'Thu' },
  { key: 'fri', label: 'Fri' },
  { key: 'sat', label: 'Sat' },
  { key: 'sun', label: 'Sun' },
];

const colorClasses: Record<ColorKey, string> = {
  blue: 'bg-primary',
  teal: 'bg-secondary',
  green: 'bg-accent',
  orange: 'bg-muted-foreground',
  rose: 'bg-destructive',
  violet: 'bg-primary/70',
  slate: 'bg-secondary/80',
  gray: 'bg-muted-foreground/70',
};

const reminderRows: { id: ReminderId; title: string; description: string }[] = [
  {
    id: 'newRequest',
    title: 'New leave request',
    description: 'Sent to the manager',
  },
  {
    id: 'decision',
    title: 'Leave approved or rejected',
    description: 'Sent to the employee',
  },
  {
    id: 'waiting',
    title: 'Request waiting for approval',
    description: 'Daily reminder to approvers',
  },
  {
    id: 'lowBalance',
    title: 'Leave balance running low',
    description: 'Sent to the employee at 2 days left',
  },
  {
    id: 'weeklySummary',
    title: 'Weekly leave summary',
    description: 'Sent to HR every Monday',
  },
];

const generalLabels: Record<keyof GeneralRules, string> = {
  leaveYear: 'leave year',
  weeklyOffs: 'weekly offs',
  countOffsAsLeave: 'weekly off counting',
  allowHalfDay: 'half-day leave',
  noticeDays: 'notice period',
  maxDays: 'longest leave',
  allowPastDates: 'past-date leave',
  pastDays: 'past-date limit',
};

const approvalLabels: Record<keyof ApprovalRules, string> = {
  hrOverDays: 'HR approval limit',
  escalate: 'escalation',
  escalateDays: 'escalation time',
  medicalOverDays: 'medical certificate limit',
};

const maxLeaveDays = 365;
const minNameLength = 3;
const maxChangesShown = 3;

const emptyLeaveTypeForm: LeaveTypeForm = {
  name: '',
  code: '',
  description: '',
  allowanceKind: 'days',
  days: '10',
  grant: 'yearStart',
  monthlyAmount: '1',
  carry: 'none',
  carryDays: '30',
  encashable: 'no',
  pay: 'paid',
  appliesTo: 'everyone',
  color: 'blue',
};

const makeLeaveType = (
  leaveType: Partial<LeaveType> &
    Pick<LeaveType, 'id' | 'name' | 'code' | 'description' | 'color'>
): LeaveType => ({
  allowanceKind: 'days',
  days: 0,
  grant: 'yearStart',
  monthlyAmount: 1,
  carry: 'none',
  carryDays: 30,
  encashable: false,
  pay: 'paid',
  appliesTo: 'everyone',
  isOn: true,
  ...leaveType,
});

const defaultSettings: LeaveSettings = {
  general: {
    leaveYear: 'april',
    weeklyOffs: {
      mon: 'none',
      tue: 'none',
      wed: 'none',
      thu: 'none',
      fri: 'none',
      sat: 'alternate',
      sun: 'all',
    },
    countOffsAsLeave: false,
    allowHalfDay: true,
    noticeDays: 2,
    maxDays: 15,
    allowPastDates: true,
    pastDays: 7,
  },
  leaveTypes: [
    makeLeaveType({
      id: 'casual',
      name: 'Casual Leave',
      code: 'CL',
      description: 'Personal work and short breaks',
      color: 'blue',
      days: 12,
      grant: 'monthly',
      monthlyAmount: 1,
    }),
    makeLeaveType({
      id: 'sick',
      name: 'Sick Leave',
      code: 'SL',
      description: 'Certificate needed after 2 days',
      color: 'teal',
      days: 8,
      grant: 'yearStart',
    }),
    makeLeaveType({
      id: 'earned',
      name: 'Earned Leave',
      code: 'EL',
      description: 'Builds up with the days worked',
      color: 'green',
      days: 15,
      grant: 'monthly',
      monthlyAmount: 1.25,
      carry: 'upTo',
      carryDays: 30,
      encashable: true,
    }),

    makeLeaveType({
      id: 'paternity',
      name: 'Paternity Leave',
      code: 'PL',
      description: 'After the birth of a child',
      color: 'violet',
      days: 7,
      grant: 'onRequest',
      appliesTo: 'male',
    }),
  ],
  approval: {
    hrOverDays: 3,
    escalate: true,
    escalateDays: 2,
    medicalOverDays: 2,
  },
  reminders: {
    newRequest: { email: true, inApp: true },
    decision: { email: true, inApp: true },
    waiting: { email: true, inApp: false },
    lowBalance: { email: false, inApp: true },
    weeklySummary: { email: true, inApp: false },
  },
};

const pluralize = (count: number, singular: string, plural = `${singular}s`) =>
  count === 1 ? singular : plural;

const isEqual = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b);

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const isOption = <T extends string>(
  options: { value: string }[],
  value: string
): value is T => options.some(option => option.value === value);

const getWeekOffLabel = (
  day: { key: DayKey; label: string },
  mode: WeekOffMode
) => {
  if (day.key !== 'sat') return day.label;
  if (mode === 'alternate') return 'Sat (2nd & 4th)';
  return mode === 'all' ? 'Sat (all)' : 'Sat';
};

// Saturday cycles through three modes, other days switch on and off.
const getNextWeekOffMode = (day: DayKey, mode: WeekOffMode): WeekOffMode => {
  if (day !== 'sat') return mode === 'none' ? 'all' : 'none';
  if (mode === 'none') return 'alternate';
  return mode === 'alternate' ? 'all' : 'none';
};

const getAllowanceText = (leaveType: LeaveType) => {
  if (leaveType.allowanceKind === 'asEarned') return 'As earned';
  if (leaveType.allowanceKind === 'noLimit') return 'No limit';
  return `${leaveType.days} ${pluralize(leaveType.days, 'day')}`;
};

const getGrantText = (leaveType: LeaveType) => {
  if (leaveType.grant === 'monthly') {
    return `Monthly Ã‚Â· ${leaveType.monthlyAmount} ${pluralize(
      leaveType.monthlyAmount,
      'day'
    )}`;
  }
  return (
    grantOptions.find(option => option.value === leaveType.grant)?.label ?? ''
  );
};

const getCarryText = (leaveType: LeaveType) => {
  if (leaveType.grant === 'notApplicable') return '-';
  if (leaveType.carry === 'upTo') return `Up to ${leaveType.carryDays} days`;
  if (leaveType.carry === 'expires')
    return `Expires in ${leaveType.carryDays} days`;
  return 'No';
};

const getAudienceText = (audience: Audience) =>
  audienceOptions.find(option => option.value === audience)?.label ?? '';

const toForm = (leaveType: LeaveType): LeaveTypeForm => ({
  name: leaveType.name,
  code: leaveType.code,
  description: leaveType.description,
  allowanceKind: leaveType.allowanceKind,
  days: String(leaveType.days || 10),
  grant: leaveType.grant,
  monthlyAmount: String(leaveType.monthlyAmount),
  carry: leaveType.carry,
  carryDays: String(leaveType.carryDays),
  encashable: leaveType.encashable ? 'yes' : 'no',
  pay: leaveType.pay,
  appliesTo: leaveType.appliesTo,
  color: leaveType.color,
});

// Lists what changed since the last save, one entry per setting or leave type.
const getChanges = (saved: LeaveSettings, draft: LeaveSettings) => {
  const changes: string[] = [];

  (Object.keys(generalLabels) as (keyof GeneralRules)[]).forEach(key => {
    if (!isEqual(saved.general[key], draft.general[key]))
      changes.push(`${generalLabels[key]} updated`);
  });

  (Object.keys(approvalLabels) as (keyof ApprovalRules)[]).forEach(key => {
    if (!isEqual(saved.approval[key], draft.approval[key]))
      changes.push(`${approvalLabels[key]} updated`);
  });

  draft.leaveTypes.forEach(leaveType => {
    const original = saved.leaveTypes.find(item => item.id === leaveType.id);
    if (!original) {
      changes.push(`${leaveType.name} added`);
    } else if (!isEqual(original, leaveType)) {
      const onlyToggled = isEqual(
        { ...original, isOn: leaveType.isOn },
        leaveType
      );
      changes.push(
        onlyToggled
          ? `${leaveType.name} turned ${leaveType.isOn ? 'on' : 'off'}`
          : `${leaveType.name} edited`
      );
    }
  });

  saved.leaveTypes.forEach(leaveType => {
    if (!draft.leaveTypes.some(item => item.id === leaveType.id))
      changes.push(`${leaveType.name} deleted`);
  });

  if (!isEqual(saved.reminders, draft.reminders))
    changes.push('reminders updated');

  return changes;
};

const summarizeChanges = (changes: string[]) => {
  const shown = changes.slice(0, maxChangesShown);
  const extra = changes.length - shown.length;
  const parts = extra > 0 ? [...shown, `${extra} more`] : shown;
  const sentence =
    parts.length > 1
      ? `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`
      : (parts[0] ?? '');
  return sentence
    ? `${sentence.charAt(0).toUpperCase()}${sentence.slice(1)}.`
    : '';
};

const SettingSwitch = ({
  isOn,
  label,
  onToggle,
  disabled = false,
}: {
  isOn: boolean;
  label: string;
  onToggle: () => void;
  disabled?: boolean;
}) => {
  const name = `leave-toggle-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  return (
    <div className="flex items-center">
      <label htmlFor={name} className="sr-only">
        {label}
      </label>
      <FormField
        label={label}
        name={name}
        type="toggle"
        value={isOn}
        disabled={disabled}
        onToggleChange={onToggle}
        toggleActiveLabel="On"
        toggleInactiveLabel="Off"
      />
    </div>
  );
};

const Stepper = ({
  label,
  value,
  unit,
  min,
  max,
  disabled = false,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}) => (
  <div
    className={`flex items-center rounded-xl border border-border bg-muted/30 ${
      disabled ? 'opacity-50' : ''
    }`}
  >
    <Button
      type="button"
      variant="default"
      size="icon"
      aria-label={`Decrease ${label}`}
      disabled={disabled || value <= min}
      onClick={() => onChange(clamp(value - 1, min, max))}
    >
      <Minus className="h-4 w-4" aria-hidden="true" />
    </Button>
    <span
      className="min-w-20 bg-background py-2 text-center text-sm font-semibold text-foreground"
      aria-live="polite"
    >
      {value} {pluralize(value, unit)}
    </span>
    <Button
      type="button"
      variant="default"
      size="icon"
      aria-label={`Increase ${label}`}
      disabled={disabled || value >= max}
      onClick={() => onChange(clamp(value + 1, min, max))}
    >
      <Plus className="h-4 w-4" aria-hidden="true" />
    </Button>
  </div>
);

const SettingRow = ({
  title,
  description,
  isDimmed = false,
  children,
}: {
  title: string;
  description: string;
  isDimmed?: boolean;
  children: ReactNode;
}) => (
  <div className="flex items-center justify-between gap-6 py-4">
    <div className="space-y-0.5">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p
        className={`text-sm text-muted-foreground ${isDimmed ? 'opacity-60' : ''}`}
      >
        {description}
      </p>
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

const SectionHeading = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="space-y-1">
    <h3 className="text-xl font-semibold text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

const PayBadge = ({ pay }: { pay: PayMode }) => (
  <Badge
    className={`gap-1.5 border-transparent font-semibold ${
      pay === 'paid'
        ? 'bg-primary/10 text-primary'
        : 'bg-muted text-muted-foreground'
    }`}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
    {pay === 'paid' ? 'Paid' : 'Unpaid'}
  </Badge>
);

const RowMenu = ({
  label,
  items,
  isOpen,
  openUp,
  onToggle,
  onClose,
}: {
  label: string;
  items: MenuItem[];
  isOpen: boolean;
  openUp: boolean;
  onToggle: () => void;
  onClose: () => void;
}) => (
  <div
    className="relative"
    onKeyDown={event => event.key === 'Escape' && onClose()}
  >
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={label}
      aria-haspopup="menu"
      aria-expanded={isOpen}
      onClick={onToggle}
    >
      <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
    </Button>
    {isOpen && (
      <>
        <Button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          variant="ghost"
          className="fixed inset-0 z-10 h-full w-full cursor-default rounded-none bg-transparent p-0 hover:bg-transparent"
          onClick={onClose}
        />
        <div
          role="menu"
          className={`absolute right-0 z-20 w-44 rounded-xl border border-border bg-card p-1 shadow-lg ${
            openUp ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}
        >
          {items.map(item => (
            <Button
              key={item.label}
              type="button"
              role="menuitem"
              variant="ghost"
              className={`h-auto w-full justify-start rounded-lg px-3 py-2 text-left text-sm hover:bg-muted ${
                item.isDanger ? 'text-destructive' : 'text-foreground'
              }`}
              onClick={() => {
                onClose();
                item.onSelect();
              }}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </>
    )}
  </div>
);

const WorkflowStep = ({
  icon: Icon,
  iconClass,
  title,
  description,
  badge,
  hasLine,
}: {
  icon: LucideIcon;
  iconClass: string;
  title: string;
  description: string;
  badge?: string;
  hasLine: boolean;
}) => (
  <div className="relative flex flex-col items-center gap-2 text-center">
    {hasLine && (
      <span
        className="absolute left-1/2 top-7 h-px w-full bg-border"
        aria-hidden="true"
      />
    )}
    <span
      className={`relative flex h-14 w-14 items-center justify-center rounded-full border-2 ${iconClass}`}
    >
      <Icon className="h-6 w-6" aria-hidden="true" />
    </span>
    <p className="text-sm font-semibold text-foreground">{title}</p>
    {badge ? (
      <Badge className="border-transparent bg-accent/20 font-semibold text-accent-foreground">
        {badge}
      </Badge>
    ) : (
      <p className="max-w-[10rem] text-xs text-muted-foreground">
        {description}
      </p>
    )}
    {badge && (
      <p className="max-w-[10rem] text-xs text-muted-foreground">
        {description}
      </p>
    )}
  </div>
);

const LeaveSettingsPage = () => {
  const [saved, setSaved] = useState(defaultSettings);
  const [draft, setDraft] = useState(defaultSettings);
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [search, setSearch] = useState('');
  const [menuId, setMenuId] = useState<string | null>(null);

  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [typeForm, setTypeForm] = useState(emptyLeaveTypeForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const typeSequence = useRef(0);
  const sectionRefs = useRef<Record<TabId, HTMLDivElement | null>>({
    general: null,
    types: null,
    approval: null,
    reminders: null,
  });

  const { general, approval, reminders } = draft;

  const changes = getChanges(saved, draft);
  const hasChanges = changes.length > 0;

  const query = search.trim().toLowerCase();
  const visibleTypes = draft.leaveTypes.filter(
    leaveType =>
      !query ||
      `${leaveType.name} ${leaveType.code}`.toLowerCase().includes(query)
  );

  const deleteTarget = draft.leaveTypes.find(item => item.id === deleteId);

  // Warn before leaving the page with unsaved changes.
  useEffect(() => {
    if (!hasChanges) return undefined;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasChanges]);

  const updateGeneral = (values: Partial<GeneralRules>) =>
    setDraft(current => ({
      ...current,
      general: { ...current.general, ...values },
    }));

  const updateApproval = (values: Partial<ApprovalRules>) =>
    setDraft(current => ({
      ...current,
      approval: { ...current.approval, ...values },
    }));

  const updateReminder = (
    id: ReminderId,
    channel: ReminderChannel,
    checked: boolean
  ) =>
    setDraft(current => ({
      ...current,
      reminders: {
        ...current.reminders,
        [id]: { ...current.reminders[id], [channel]: checked },
      },
    }));

  const updateLeaveTypes = (change: (types: LeaveType[]) => LeaveType[]) =>
    setDraft(current => ({
      ...current,
      leaveTypes: change(current.leaveTypes),
    }));

  const updateTypeForm = (values: Partial<LeaveTypeForm>) =>
    setTypeForm(current => ({ ...current, ...values }));

  const handleTabClick = (tab: TabId) => {
    setActiveTab(tab);
    sectionRefs.current[tab]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleSave = () => {
    if (!hasChanges) {
      toast.info('There are no changes to save.');
      return;
    }
    if (!draft.leaveTypes.some(leaveType => leaveType.isOn)) {
      toast.error('Keep at least one leave type turned on.');
      return;
    }
    setSaved(draft);
    toast.success('Leave settings saved. New requests will follow them.');
  };

  const handleDiscard = () => {
    setDraft(saved);
    setMenuId(null);
    toast.success('Unsaved changes discarded.');
  };

  const handleToggleLeaveType = (id: string) =>
    updateLeaveTypes(types =>
      types.map(leaveType =>
        leaveType.id === id
          ? { ...leaveType, isOn: !leaveType.isOn }
          : leaveType
      )
    );

  const openAddDialog = (source?: LeaveType) => {
    setEditingId(null);
    setTypeForm(
      source
        ? { ...toForm(source), name: `${source.name} (copy)`, code: '' }
        : emptyLeaveTypeForm
    );
    setIsTypeDialogOpen(true);
  };

  const openEditDialog = (leaveType: LeaveType) => {
    setEditingId(leaveType.id);
    setTypeForm(toForm(leaveType));
    setIsTypeDialogOpen(true);
  };

  const handleSubmitType = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = typeForm.name.trim();
    const code = typeForm.code.trim().toUpperCase();
    const others = draft.leaveTypes.filter(item => item.id !== editingId);

    if (name.length < minNameLength) {
      toast.error(`Enter a name of at least ${minNameLength} characters.`);
      return;
    }
    if (others.some(item => item.name.toLowerCase() === name.toLowerCase())) {
      toast.error('A leave type with this name already exists.');
      return;
    }
    if (!/^[A-Z]{2,4}$/.test(code)) {
      toast.error('The code must be 2 to 4 letters, like CL.');
      return;
    }
    if (others.some(item => item.code === code)) {
      toast.error('Another leave type already uses this code.');
      return;
    }

    const days = Number(typeForm.days);
    if (
      typeForm.allowanceKind === 'days' &&
      (!Number.isInteger(days) || days < 1 || days > maxLeaveDays)
    ) {
      toast.error(
        `Days per year must be a whole number from 1 to ${maxLeaveDays}.`
      );
      return;
    }

    const monthlyAmount = Number(typeForm.monthlyAmount);
    if (
      typeForm.grant === 'monthly' &&
      !(monthlyAmount > 0 && monthlyAmount <= 31)
    ) {
      toast.error('Days given each month must be more than 0 and at most 31.');
      return;
    }

    const carryDays = Number(typeForm.carryDays);
    if (
      typeForm.carry !== 'none' &&
      (!Number.isInteger(carryDays) ||
        carryDays < 1 ||
        carryDays > maxLeaveDays)
    ) {
      toast.error('Carry forward days must be a whole number from 1 to 365.');
      return;
    }

    const existing = draft.leaveTypes.find(item => item.id === editingId);
    typeSequence.current += 1;
    const leaveType: LeaveType = {
      id: existing?.id ?? `custom-${typeSequence.current}`,
      name,
      code,
      description: typeForm.description.trim() || 'No description added',
      color: typeForm.color,
      allowanceKind: typeForm.allowanceKind,
      days: typeForm.allowanceKind === 'days' ? days : 0,
      grant: typeForm.grant,
      monthlyAmount: typeForm.grant === 'monthly' ? monthlyAmount : 1,
      carry: typeForm.carry,
      carryDays: typeForm.carry === 'none' ? 30 : carryDays,
      encashable: typeForm.encashable === 'yes',
      pay: typeForm.pay,
      appliesTo: typeForm.appliesTo,
      isOn: existing?.isOn ?? true,
    };

    updateLeaveTypes(types =>
      existing
        ? types.map(item => (item.id === existing.id ? leaveType : item))
        : [...types, leaveType]
    );
    setIsTypeDialogOpen(false);
    toast.success(
      existing
        ? `${name} updated. Save to apply it.`
        : `${name} added. Save to apply it.`
    );
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    updateLeaveTypes(types =>
      types.filter(item => item.id !== deleteTarget.id)
    );
    toast.success(`${deleteTarget.name} deleted. Save to apply it.`);
    setDeleteId(null);
  };

  const leaveTypeColumns: ColumnDef<LeaveType>[] = [
    {
      accessorKey: 'name',
      header: 'Leave type',
      cell: ({ row }) => {
        const leaveType = row.original;
        return (
          <div className="flex min-w-48 items-center gap-3">
            <span
              className={`h-10 w-1.5 shrink-0 rounded-full ${colorClasses[leaveType.color]} ${leaveType.isOn ? '' : 'opacity-40'}`}
              aria-hidden="true"
            />
            <div>
              <p className="flex items-center gap-2 font-semibold text-foreground">
                <span className={leaveType.isOn ? '' : 'opacity-60'}>
                  {leaveType.name}
                </span>
                <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-semibold text-muted-foreground">
                  {leaveType.code}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                {leaveType.isOn
                  ? leaveType.description
                  : 'Off, employees cannot apply'}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      id: 'allowance',
      header: 'Days / year',
      accessorFn: getAllowanceText,
      cell: ({ row }) => (
        <span className="whitespace-nowrap font-semibold text-foreground">
          {getAllowanceText(row.original)}
        </span>
      ),
    },
    {
      id: 'grant',
      header: 'How it is given',
      accessorFn: getGrantText,
      cell: ({ row }) => getGrantText(row.original),
    },
    {
      id: 'carry',
      header: 'Carry forward',
      accessorFn: getCarryText,
      cell: ({ row }) => getCarryText(row.original),
    },
    {
      accessorKey: 'encashable',
      header: 'Encashable',
      enableSorting: false,
      cell: ({ row }) => {
        const leaveType = row.original;
        if (leaveType.grant === 'notApplicable') return '-';
        return leaveType.encashable ? 'Yes' : 'No';
      },
    },
    {
      accessorKey: 'pay',
      header: 'Pay',
      cell: ({ row }) => <PayBadge pay={row.original.pay} />,
    },
    {
      accessorKey: 'appliesTo',
      header: 'Applies to',
      cell: ({ row }) => getAudienceText(row.original.appliesTo),
    },
    {
      accessorKey: 'isOn',
      header: 'Status',
      enableSorting: false,
      cell: ({ row }) => {
        const leaveType = row.original;
        return (
          <SettingSwitch
            isOn={leaveType.isOn}
            label={`${leaveType.name} status`}
            onToggle={() => handleToggleLeaveType(leaveType.id)}
          />
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: ({ row }) => {
        const leaveType = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="default"
              size="icon"
              aria-label={`Edit ${leaveType.name}`}
              onClick={() => openEditDialog(leaveType)}
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
            </Button>
            <RowMenu
              label={`More actions for ${leaveType.name}`}
              isOpen={menuId === leaveType.id}
              openUp={
                visibleTypes.length > 4 && row.index >= visibleTypes.length - 3
              }
              onToggle={() =>
                setMenuId(current =>
                  current === leaveType.id ? null : leaveType.id
                )
              }
              onClose={() => setMenuId(null)}
              items={[
                {
                  label: 'Duplicate',
                  onSelect: () => openAddDialog(leaveType),
                },
                {
                  label: 'Delete',
                  isDanger: true,
                  onSelect: () => setDeleteId(leaveType.id),
                },
              ]}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Section title="Leave Settings" menuId="leave-settings" showBreadcrumbs>
        <div className="space-y-6">
          <div
            className="flex flex-wrap gap-3"
            role="group"
            aria-label="Jump to a section"
          >
            {tabOptions.map(option => (
              <Button
                key={option.value}
                type="button"
                variant={activeTab === option.value ? 'default' : 'outline'}
                aria-pressed={activeTab === option.value}
                className="rounded-full px-5"
                onClick={() => handleTabClick(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>

          {/* General rules */}
          <div
            ref={element => {
              sectionRefs.current.general = element;
            }}
            className="scroll-mt-6"
          >
            <Card className="space-y-4 p-6 md:p-8">
              <SectionHeading
                title="General rules"
                description="Basic rules that apply to every leave type."
              />

              <div className="grid grid-cols-1 gap-x-12 lg:grid-cols-2">
                <div className="divide-y divide-border">
                  <SettingRow
                    title="Leave year"
                    description="Balances reset at the start of each leave year."
                  >
                    <FormField
                      label="Leave year"
                      name="leave-year"
                      type="select"
                      value={general.leaveYear}
                      onChange={value => {
                        if (isOption<LeaveYear>(leaveYearOptions, value))
                          updateGeneral({ leaveYear: value });
                      }}
                      options={leaveYearOptions}
                    />
                  </SettingRow>

                  <SettingRow
                    title="Weekly offs"
                    description="Days your company is closed."
                  >
                    <div
                      className="flex flex-wrap justify-end gap-2"
                      role="group"
                      aria-label="Weekly offs"
                    >
                      {dayOptions.map(day => {
                        const mode = general.weeklyOffs[day.key];
                        const isActive = mode !== 'none';
                        return (
                          <Button
                            key={day.key}
                            type="button"
                            variant="outline"
                            aria-pressed={isActive}
                            className={`rounded-full px-4 ${
                              isActive
                                ? 'border-primary bg-primary/10 font-semibold text-primary hover:bg-primary/15 hover:text-primary'
                                : ''
                            }`}
                            onClick={() =>
                              updateGeneral({
                                weeklyOffs: {
                                  ...general.weeklyOffs,
                                  [day.key]: getNextWeekOffMode(day.key, mode),
                                },
                              })
                            }
                          >
                            {getWeekOffLabel(day, mode)}
                          </Button>
                        );
                      })}
                    </div>
                  </SettingRow>

                  <SettingRow
                    title="Count weekly offs and holidays as leave"
                    description="When off, a Sunday between two leave days is not deducted."
                  >
                    <SettingSwitch
                      isOn={general.countOffsAsLeave}
                      label="Count weekly offs and holidays as leave"
                      onToggle={() =>
                        updateGeneral({
                          countOffsAsLeave: !general.countOffsAsLeave,
                        })
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    title="Allow half-day leave"
                    description="Employees can apply for the first or second half."
                  >
                    <SettingSwitch
                      isOn={general.allowHalfDay}
                      label="Allow half-day leave"
                      onToggle={() =>
                        updateGeneral({ allowHalfDay: !general.allowHalfDay })
                      }
                    />
                  </SettingRow>
                </div>

                <div className="divide-y divide-border">
                  <SettingRow
                    title="Notice needed for planned leave"
                    description="Does not apply to sick leave."
                  >
                    <Stepper
                      label="notice period"
                      value={general.noticeDays}
                      unit="day"
                      min={0}
                      max={30}
                      onChange={noticeDays => updateGeneral({ noticeDays })}
                    />
                  </SettingRow>

                  <SettingRow
                    title="Longest leave at one time"
                    description="Longer requests need a special approval."
                  >
                    <Stepper
                      label="longest leave"
                      value={general.maxDays}
                      unit="day"
                      min={1}
                      max={90}
                      onChange={maxDays => updateGeneral({ maxDays })}
                    />
                  </SettingRow>

                  <SettingRow
                    title="Allow leave for past dates"
                    description="Employees can apply for days that have already passed."
                  >
                    <SettingSwitch
                      isOn={general.allowPastDates}
                      label="Allow leave for past dates"
                      onToggle={() =>
                        updateGeneral({
                          allowPastDates: !general.allowPastDates,
                        })
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    title="Past dates allowed up to"
                    description="Counted from today."
                    isDimmed={!general.allowPastDates}
                  >
                    <Stepper
                      label="past dates limit"
                      value={general.pastDays}
                      unit="day"
                      min={1}
                      max={30}
                      disabled={!general.allowPastDates}
                      onChange={pastDays => updateGeneral({ pastDays })}
                    />
                  </SettingRow>
                </div>
              </div>
            </Card>
          </div>

          {/* Leave types */}
          <div
            ref={element => {
              sectionRefs.current.types = element;
            }}
            className="scroll-mt-6"
          >
            <Card className="overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4 p-6 md:p-8">
                <SectionHeading
                  title="Leave types"
                  description="Choose which leaves employees can take and how many days they get."
                />
                <div className="flex flex-wrap items-end gap-3">
                  <div className="w-full sm:w-72">
                    <FormField
                      label="Search"
                      name="leave-type-search"
                      value={search}
                      onChange={setSearch}
                      placeholder="Search leave types"
                    />
                  </div>
                  <Button type="button" onClick={() => openAddDialog()}>
                    <Plus /> Add leave type
                  </Button>
                </div>
              </div>

              {visibleTypes.length > 0 ? (
                <div className="min-h-[18rem] overflow-x-auto">
                  <TanStackTable
                    data={visibleTypes}
                    columns={leaveTypeColumns}
                    enableSearch={false}
                    enableSorting={false}
                    enablePagination
                    pageSize={8}
                    pageSizeOptions={[8, 10, 20]}
                    getRowId={leaveType => leaveType.id}
                    emptyMessage="No leave types found."
                    headerClassName="border-y border-border bg-muted/30 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    bodyClassName="divide-y divide-border"
                  />
                </div>
              ) : (
                <div className="space-y-3 border-t border-border px-6 py-14 text-center">
                  <p className="text-base font-semibold text-foreground">
                    No leave types found
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try a different search, or add a new leave type.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSearch('')}
                  >
                    Clear search
                  </Button>
                </div>
              )}
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
            <div
              ref={element => {
                sectionRefs.current.approval = element;
              }}
              className="scroll-mt-6 xl:col-span-3"
            >
              <Card className="h-full space-y-6 p-6 md:p-8">
                <SectionHeading
                  title="Approval workflow"
                  description="Who needs to approve a leave request, and in what order."
                />

                <div className="grid grid-cols-2 gap-y-6 md:grid-cols-4">
                  <WorkflowStep
                    hasLine
                    icon={User}
                    iconClass="border-primary/30 bg-primary/10 text-primary"
                    title="Employee applies"
                    description="Sends the request with a reason"
                  />
                  <WorkflowStep
                    hasLine
                    icon={Users}
                    iconClass="border-secondary/40 bg-secondary/20 text-secondary-foreground"
                    title="Reporting manager"
                    description={
                      approval.escalate
                        ? `Approves or rejects within ${approval.escalateDays} ${pluralize(
                            approval.escalateDays,
                            'day'
                          )}`
                        : 'Approves or rejects'
                    }
                  />
                  <WorkflowStep
                    hasLine
                    icon={ShieldCheck}
                    iconClass="border-accent/40 bg-accent/20 text-accent-foreground"
                    title="HR team"
                    badge="Only for long leave"
                    description={`Leave over ${approval.hrOverDays} ${pluralize(
                      approval.hrOverDays,
                      'day'
                    )}`}
                  />
                  <WorkflowStep
                    hasLine={false}
                    icon={CheckCircle2}
                    iconClass="border-primary/30 bg-primary/10 text-primary"
                    title="Approved"
                    description="Balance, calendar and payroll update"
                  />
                </div>

                <div className="divide-y divide-border">
                  <SettingRow
                    title="HR approval needed for leave longer than"
                    description="Shorter leave is approved by the manager alone."
                  >
                    <Stepper
                      label="HR approval limit"
                      value={approval.hrOverDays}
                      unit="day"
                      min={1}
                      max={30}
                      onChange={hrOverDays => updateApproval({ hrOverDays })}
                    />
                  </SettingRow>

                  <SettingRow
                    title="Send to HR if the manager does not reply in"
                    description="So requests never get stuck."
                  >
                    <div className="flex items-center gap-3">
                      <SettingSwitch
                        isOn={approval.escalate}
                        label="Send to HR if the manager does not reply"
                        onToggle={() =>
                          updateApproval({ escalate: !approval.escalate })
                        }
                      />
                      <Stepper
                        label="escalation time"
                        value={approval.escalateDays}
                        unit="day"
                        min={1}
                        max={14}
                        disabled={!approval.escalate}
                        onChange={escalateDays =>
                          updateApproval({ escalateDays })
                        }
                      />
                    </div>
                  </SettingRow>

                  <SettingRow
                    title="Medical certificate needed for sick leave over"
                    description="Employees upload it when they apply."
                  >
                    <Stepper
                      label="medical certificate limit"
                      value={approval.medicalOverDays}
                      unit="day"
                      min={1}
                      max={7}
                      onChange={medicalOverDays =>
                        updateApproval({ medicalOverDays })
                      }
                    />
                  </SettingRow>
                </div>
              </Card>
            </div>

            <div
              ref={element => {
                sectionRefs.current.reminders = element;
              }}
              className="scroll-mt-6 xl:col-span-2"
            >
              <Card className="h-full space-y-4 p-6 md:p-8">
                <SectionHeading
                  title="Reminders"
                  description="Choose who gets told, and how."
                />

                <div className="grid grid-cols-[1fr_4.5rem_4.5rem] items-center gap-y-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <span>When</span>
                  <span className="text-center">Email</span>
                  <span className="text-center">In-app</span>
                </div>

                <div className="divide-y divide-border">
                  {reminderRows.map(row => (
                    <div
                      key={row.id}
                      className="grid grid-cols-[1fr_4.5rem_4.5rem] items-center py-4"
                    >
                      <div className="space-y-0.5 pr-3">
                        <p className="text-sm font-semibold text-foreground">
                          {row.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {row.description}
                        </p>
                      </div>
                      {(['email', 'inApp'] as ReminderChannel[]).map(
                        channel => (
                          <div key={channel} className="flex justify-center">
                            <FormField
                              label={`${row.title} by ${channel === 'email' ? 'email' : 'in-app'}`}
                              name={`reminder-${row.id}-${channel}`}
                              type="toggle"
                              value={reminders[row.id][channel]}
                              onToggleChange={checked =>
                                updateReminder(row.id, channel, checked)
                              }
                              toggleActiveLabel="On"
                              toggleInactiveLabel="Off"
                            />
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Unsaved changes bar */}
          {hasChanges && (
            <Card
              role="status"
              className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-4 p-4 shadow-lg md:px-6"
            >
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <span className="flex items-center gap-2 font-semibold text-foreground">
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  {changes.length} unsaved {pluralize(changes.length, 'change')}
                </span>
                <span className="text-muted-foreground">
                  {summarizeChanges(changes)}
                </span>
              </p>
              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="outline" onClick={handleDiscard}>
                  Discard changes
                </Button>
                <Button type="button" onClick={handleSave}>
                  <Check /> Save changes
                </Button>
              </div>
            </Card>
          )}
        </div>
      </Section>

      {/* Add / edit leave type */}
      <Dialog open={isTypeDialogOpen} onOpenChange={setIsTypeDialogOpen}>
        <DialogContent
          className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit leave type' : 'Add leave type'}
            </DialogTitle>
            <DialogDescription>
              Changes stay as a draft until you save the settings.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitType} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-2">
              <FormField
                label="Name"
                name="leave-type-name"
                value={typeForm.name}
                onChange={name => updateTypeForm({ name })}
                placeholder="e.g. Study Leave"
                required
              />
              <FormField
                label="Code"
                name="leave-type-code"
                value={typeForm.code}
                onChange={code => updateTypeForm({ code })}
                placeholder="e.g. SDL"
                required
              />
            </div>
            <FormField
              label="Description"
              type="textarea"
              name="leave-type-description"
              value={typeForm.description}
              onChange={description => updateTypeForm({ description })}
              placeholder="When should employees use this leave?"
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <FormField
                label="Days per year"
                name="leave-type-allowance"
                type="select"
                value={typeForm.allowanceKind}
                onChange={value =>
                  isOption<AllowanceKind>(allowanceOptions, value) &&
                  updateTypeForm({ allowanceKind: value })
                }
                options={allowanceOptions}
                required
              />
              {typeForm.allowanceKind === 'days' && (
                <FormField
                  label="Number of days"
                  name="leave-type-days"
                  type="number"
                  value={typeForm.days}
                  onChange={days => updateTypeForm({ days })}
                  required
                />
              )}

              <FormField
                label="How it is given"
                name="leave-type-grant"
                type="select"
                value={typeForm.grant}
                onChange={value =>
                  isOption<GrantMode>(grantOptions, value) &&
                  updateTypeForm({ grant: value })
                }
                options={grantOptions}
                required
              />
              {typeForm.grant === 'monthly' && (
                <FormField
                  label="Days given each month"
                  name="leave-type-monthly"
                  type="number"
                  value={typeForm.monthlyAmount}
                  onChange={monthlyAmount => updateTypeForm({ monthlyAmount })}
                  required
                />
              )}

              <FormField
                label="Carry forward"
                name="leave-type-carry"
                type="select"
                value={typeForm.carry}
                onChange={value =>
                  isOption<CarryMode>(carryOptions, value) &&
                  updateTypeForm({ carry: value })
                }
                options={carryOptions}
                required
              />
              {typeForm.carry !== 'none' && (
                <FormField
                  label={
                    typeForm.carry === 'upTo'
                      ? 'Carry forward up to (days)'
                      : 'Expires after (days)'
                  }
                  name="leave-type-carry-days"
                  type="number"
                  value={typeForm.carryDays}
                  onChange={carryDays => updateTypeForm({ carryDays })}
                  required
                />
              )}

              <FormField
                label="Encashable"
                name="leave-type-encashable"
                type="select"
                value={typeForm.encashable}
                onChange={value =>
                  (value === 'yes' || value === 'no') &&
                  updateTypeForm({ encashable: value })
                }
                options={yesNoOptions}
                required
              />
              <FormField
                label="Pay"
                name="leave-type-pay"
                type="select"
                value={typeForm.pay}
                onChange={value =>
                  isOption<PayMode>(payOptions, value) &&
                  updateTypeForm({ pay: value })
                }
                options={payOptions}
                required
              />
              <FormField
                label="Applies to"
                name="leave-type-audience"
                type="select"
                value={typeForm.appliesTo}
                onChange={value =>
                  isOption<Audience>(audienceOptions, value) &&
                  updateTypeForm({ appliesTo: value })
                }
                options={audienceOptions}
                required
              />
              <FormField
                label="Colour"
                name="leave-type-color"
                type="select"
                value={typeForm.color}
                onChange={value =>
                  isOption<ColorKey>(colorOptions, value) &&
                  updateTypeForm({ color: value })
                }
                options={colorOptions}
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsTypeDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingId ? 'Save leave type' : 'Add leave type'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog
        open={deleteTarget !== undefined}
        onOpenChange={open => !open && setDeleteId(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete {deleteTarget?.name}?</DialogTitle>
            <DialogDescription>
              Employees will no longer be able to apply for it. Leave that is
              already approved stays as it is. You can still discard this change
              before saving.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleConfirmDelete}
            >
              Delete leave type
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeaveSettingsPage;
