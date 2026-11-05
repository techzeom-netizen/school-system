import { type FormEvent, useMemo, useRef, useState } from 'react';
import {
  CalendarClock,
  CheckCircle2,
  Info,
  ListChecks,
  LogOut,
  Mail,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import {
  offboardingDepartmentOptions,
  offboardingReasonOptions,
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

type OffboardingGroup =
  | 'interview'
  | 'handover'
  | 'assets'
  | 'access'
  | 'documents';

type OffboardingStatus = 'active' | 'completed';

interface OffboardingTask {
  id: string;
  key: string;
  group: OffboardingGroup;
  title: string;
  owner: string;
  dueOn: string; // YYYY-MM-DD
  done: boolean;
}

interface OffboardingRecord {
  id: string;
  name: string;
  department: string;
  position: string;
  reason: string;
  lastWorkingDay: string; // YYYY-MM-DD
  status: OffboardingStatus;
  interviewOn: string | null; // YYYY-MM-DD
  completedOn: string | null; // YYYY-MM-DD
  tasks: OffboardingTask[];
}

const offboardingGroups: { key: OffboardingGroup; label: string }[] = [
  { key: 'interview', label: 'Exit interview' },
  { key: 'handover', label: 'Handover' },
  { key: 'assets', label: 'Company assets' },
  { key: 'access', label: 'Access' },
  { key: 'documents', label: 'Documents' },
];

// Every new offboarding starts with these tasks.
// daysBefore = how many days before the last working day the task is due.
const offboardingTaskTemplates: {
  key: string;
  group: OffboardingGroup;
  title: string;
  owner: string;
  daysBefore: number;
}[] = [
  {
    key: 'scheduleInterview',
    group: 'interview',
    title: 'Schedule the exit interview',
    owner: 'HR',
    daysBefore: 7,
  },
  {
    key: 'holdInterview',
    group: 'interview',
    title: 'Complete the exit interview',
    owner: 'HR',
    daysBefore: 3,
  },
  {
    key: 'handoverDoc',
    group: 'handover',
    title: 'Share the handover document',
    owner: 'Reporting manager',
    daysBefore: 5,
  },
  {
    key: 'handoverWork',
    group: 'handover',
    title: 'Hand over ongoing work',
    owner: 'Reporting manager',
    daysBefore: 2,
  },
  {
    key: 'laptop',
    group: 'assets',
    title: 'Return laptop and accessories',
    owner: 'IT',
    daysBefore: 1,
  },
  {
    key: 'idCard',
    group: 'assets',
    title: 'Return ID card',
    owner: 'Admin',
    daysBefore: 0,
  },
  {
    key: 'emailAccess',
    group: 'access',
    title: 'Turn off email and tools',
    owner: 'IT',
    daysBefore: 0,
  },
  {
    key: 'systemAccess',
    group: 'access',
    title: 'Remove attendance and payroll access',
    owner: 'HR',
    daysBefore: 0,
  },
  {
    key: 'relieving',
    group: 'documents',
    title: 'Issue relieving letter',
    owner: 'HR',
    daysBefore: 0,
  },
  {
    key: 'experience',
    group: 'documents',
    title: 'Issue experience letter',
    owner: 'HR',
    daysBefore: 0,
  },
  {
    key: 'payslip',
    group: 'documents',
    title: 'Share the final payslip',
    owner: 'Finance',
    daysBefore: 0,
  },
];

const addDays = (iso: string, days: number) => {
  const date = new Date(`${iso}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString('en-CA');
};

const createOffboardingTasks = (
  recordId: string,
  lastWorkingDay: string,
  doneKeys: string[] = []
): OffboardingTask[] =>
  offboardingTaskTemplates.map(template => ({
    id: `${recordId}-${template.key}`,
    key: template.key,
    group: template.group,
    title: template.title,
    owner: template.owner,
    dueOn: addDays(lastWorkingDay, -template.daysBefore),
    done: doneKeys.includes(template.key),
  }));

// Sample data. Replace with your API response when it is ready.
const initialOffboardingRecords: OffboardingRecord[] = [
  {
    id: 'OFF-0001',
    name: 'Aman Gupta',
    department: 'Sales',
    position: 'Sales Executive',
    reason: 'Relocation',
    lastWorkingDay: '2026-10-26',
    status: 'active',
    interviewOn: null,
    completedOn: null,
    tasks: createOffboardingTasks('OFF-0001', '2026-10-26', ['handoverWork']),
  },
  {
    id: 'OFF-0002',
    name: 'Lakshmi Iyer',
    department: 'Finance',
    position: 'Accountant',
    reason: 'Personal reasons',
    lastWorkingDay: '2026-10-28',
    status: 'active',
    interviewOn: '2026-10-20',
    completedOn: null,
    tasks: createOffboardingTasks('OFF-0002', '2026-10-28', [
      'scheduleInterview',
      'holdInterview',
      'handoverDoc',
      'handoverWork',
      'laptop',
      'idCard',
      'emailAccess',
      'systemAccess',
    ]),
  },
  {
    id: 'OFF-0003',
    name: 'Pooja Singh',
    department: 'Marketing',
    position: 'Marketing Lead',
    reason: 'Higher studies',
    lastWorkingDay: '2026-10-30',
    status: 'active',
    interviewOn: '2026-10-22',
    completedOn: null,
    tasks: createOffboardingTasks('OFF-0003', '2026-10-30', [
      'scheduleInterview',
      'holdInterview',
      'handoverDoc',
      'handoverWork',
      'laptop',
    ]),
  },
  {
    id: 'OFF-0004',
    name: 'Rohan Desai',
    department: 'Engineering',
    position: 'Senior Developer',
    reason: 'Better opportunity',
    lastWorkingDay: '2026-11-06',
    status: 'active',
    interviewOn: '2026-10-29',
    completedOn: null,
    tasks: createOffboardingTasks('OFF-0004', '2026-11-06', [
      'scheduleInterview',
      'handoverDoc',
    ]),
  },
  {
    id: 'OFF-0005',
    name: 'Farhan Ali',
    department: 'Support',
    position: 'Team Lead',
    reason: 'Better opportunity',
    lastWorkingDay: '2026-12-05',
    status: 'active',
    interviewOn: null,
    completedOn: null,
    tasks: createOffboardingTasks('OFF-0005', '2026-12-05'),
  },
  {
    id: 'OFF-0006',
    name: 'Tanvi Shah',
    department: 'Design',
    position: 'UX Designer',
    reason: 'Relocation',
    lastWorkingDay: '2026-09-30',
    status: 'completed',
    interviewOn: '2026-09-24',
    completedOn: '2026-10-01',
    tasks: createOffboardingTasks(
      'OFF-0006',
      '2026-09-30',
      offboardingTaskTemplates.map(template => template.key)
    ),
  },
  {
    id: 'OFF-0007',
    name: 'Ritesh Kumar',
    department: 'Engineering',
    position: 'Developer',
    reason: 'Contract ended',
    lastWorkingDay: '2026-09-15',
    status: 'completed',
    interviewOn: '2026-09-10',
    completedOn: '2026-09-16',
    tasks: createOffboardingTasks(
      'OFF-0007',
      '2026-09-15',
      offboardingTaskTemplates.map(template => template.key)
    ),
  },
];

type HubTab = OffboardingStatus;

interface AddForm extends Record<string, string> {
  name: string;
  department: string;
  position: string;
  reason: string;
  lastWorkingDay: string;
}

const tabs: { key: HubTab; label: string }[] = [
  { key: 'active', label: 'Leaving' },
  { key: 'completed', label: 'Completed' },
];

const avatarTones = [
  'bg-primary/10 text-primary',
  'bg-secondary text-secondary-foreground',
  'bg-accent text-accent-foreground',
  'bg-muted text-muted-foreground',
  'bg-destructive/10 text-destructive',
  'bg-card text-card-foreground',
];

const leavingSoonDays = 30;

const todayIso = () => new Date().toLocaleDateString('en-CA');

const toDate = (iso: string) => new Date(`${iso}T00:00:00`);

const formatDate = (iso: string | null) =>
  iso
    ? toDate(iso).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';

const getDaysLeft = (iso: string) =>
  Math.round((toDate(iso).getTime() - toDate(todayIso()).getTime()) / 86400000);

const describeDaysLeft = (iso: string) => {
  const days = getDaysLeft(iso);
  if (days === 0) return 'Last day is today';
  if (days === 1) return '1 day left';
  if (days > 1) return `${days} days left`;
  return `Last day was ${Math.abs(days)} ${Math.abs(days) === 1 ? 'day' : 'days'} ago`;
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .map(part => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

const getTone = (id: string) =>
  avatarTones[Number(id.replace(/\D/g, '')) % avatarTones.length];

const pluralize = (count: number, singular: string, plural = `${singular}s`) =>
  count === 1 ? singular : plural;

const getPendingTasks = (record: OffboardingRecord) =>
  record.tasks.filter(task => !task.done);

const getProgress = (record: OffboardingRecord) => {
  const done = record.tasks.filter(task => task.done).length;
  const total = record.tasks.length;
  return {
    done,
    total,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
  };
};

const isTaskLate = (record: OffboardingRecord, dueOn: string, done: boolean) =>
  record.status === 'active' && !done && getDaysLeft(dueOn) < 0;

const emptyAddForm: AddForm = {
  name: '',
  department: '',
  position: '',
  reason: '',
  lastWorkingDay: '',
};

const Avatar = ({ record }: { record: OffboardingRecord }) => (
  <span
    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${getTone(record.id)}`}
    aria-hidden="true"
  >
    {getInitials(record.name)}
  </span>
);

const ProgressBar = ({ percent }: { percent: number }) => (
  <div
    role="progressbar"
    aria-valuenow={percent}
    aria-valuemin={0}
    aria-valuemax={100}
    className="h-2 w-full overflow-hidden rounded-full bg-muted"
  >
    <div
      className="h-full rounded-full bg-primary transition-all"
      style={{ width: `${percent}%` }}
    />
  </div>
);

const StatCard = ({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Info;
  label: string;
  value: number;
  tone: string;
}) => (
  <Card className="flex items-center gap-4 p-4">
    <span
      className={`flex h-11 w-11 items-center justify-center rounded-lg ${tone}`}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
    <div>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  </Card>
);

const EmployeeListItem = ({
  record,
  isSelected,
  onSelect,
}: {
  record: OffboardingRecord;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const progress = getProgress(record);

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`flex h-auto w-full flex-col items-stretch justify-start space-y-3 whitespace-normal rounded-lg border p-4 text-left transition-colors ${
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-border bg-card hover:bg-muted/50'
      }`}
    >
      <div className="flex items-center gap-3">
        <Avatar record={record} />
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{record.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {record.department} · {record.position}
          </p>
        </div>
      </div>
      <div className="space-y-1.5">
        <ProgressBar percent={progress.percent} />
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="min-w-0 text-right">
            {progress.done} of {progress.total} done
          </span>
          <span>
            {record.status === 'completed'
              ? `Left on ${formatDate(record.lastWorkingDay)}`
              : describeDaysLeft(record.lastWorkingDay)}
          </span>
        </div>
      </div>
    </Button>
  );
};

const InfoBlock = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-sm font-semibold text-foreground">{value}</p>
  </div>
);

const OffBoardingHub = () => {
  const [records, setRecords] = useState<OffboardingRecord[]>(
    initialOffboardingRecords
  );
  const [tab, setTab] = useState<HubTab>('active');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [isInterviewOpen, setIsInterviewOpen] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<AddForm>(emptyAddForm);
  const nextId = useRef(initialOffboardingRecords.length);

  const active = records.filter(record => record.status === 'active');
  const completed = records.filter(record => record.status === 'completed');

  const leavingSoon = active.filter(record => {
    const days = getDaysLeft(record.lastWorkingDay);
    return days >= 0 && days <= leavingSoonDays;
  }).length;
  const pendingTaskCount = active.reduce(
    (sum, record) => sum + getPendingTasks(record).length,
    0
  );
  const lateTaskCount = active.reduce(
    (sum, record) =>
      sum +
      record.tasks.filter(task => isTaskLate(record, task.dueOn, task.done))
        .length,
    0
  );
  const interviewsToSchedule = active.filter(
    record => record.interviewOn === null
  ).length;

  const visibleRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    return records
      .filter(record => record.status === tab)
      .filter(
        record =>
          !query ||
          [record.name, record.department, record.position]
            .join(' ')
            .toLowerCase()
            .includes(query)
      );
  }, [records, tab, search]);

  const selected =
    visibleRecords.find(record => record.id === selectedId) ??
    visibleRecords[0] ??
    null;

  const counts: Record<HubTab, number> = {
    active: active.length,
    completed: completed.length,
  };

  const updateRecord = (
    id: string,
    change: (record: OffboardingRecord) => OffboardingRecord
  ) =>
    setRecords(current =>
      current.map(record => (record.id === id ? change(record) : record))
    );

  const handleToggleTask = (record: OffboardingRecord, taskId: string) => {
    if (record.status === 'completed') return;
    updateRecord(record.id, current => ({
      ...current,
      tasks: current.tasks.map(task =>
        task.id === taskId ? { ...task, done: !task.done } : task
      ),
    }));
  };

  const handleSendReminder = (record: OffboardingRecord) => {
    const pending = getPendingTasks(record);
    if (pending.length === 0) {
      toast.info('Nothing is pending, so there is no one to remind.');
      return;
    }
    const owners = Array.from(new Set(pending.map(task => task.owner)));
    toast.success(
      `Reminder sent to ${owners.join(', ')} for ${record.name}'s ${pending.length} pending ${pluralize(pending.length, 'task')}.`
    );
  };

  const openInterview = (record: OffboardingRecord) => {
    setInterviewDate(record.interviewOn ?? '');
    setIsInterviewOpen(true);
  };

  const handleSaveInterview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) return;

    if (!interviewDate) {
      toast.error('Choose the date of the exit interview.');
      return;
    }
    if (interviewDate < todayIso()) {
      toast.error('The exit interview cannot be in the past.');
      return;
    }
    if (interviewDate > selected.lastWorkingDay) {
      toast.error('The exit interview must be on or before the last day.');
      return;
    }
    updateRecord(selected.id, current => ({
      ...current,
      interviewOn: interviewDate,
      tasks: current.tasks.map(task =>
        task.key === 'scheduleInterview' ? { ...task, done: true } : task
      ),
    }));
    toast.success(
      `Exit interview with ${selected.name} set for ${formatDate(interviewDate)}.`
    );
    setIsInterviewOpen(false);
  };

  const handleComplete = (record: OffboardingRecord) => {
    const pending = getPendingTasks(record);
    if (pending.length > 0) {
      toast.error(
        `${pending.length} ${pluralize(pending.length, 'task')} still pending. Finish them to complete offboarding.`
      );
      return;
    }
    updateRecord(record.id, current => ({
      ...current,
      status: 'completed',
      completedOn: todayIso(),
    }));
    toast.success(`Offboarding completed for ${record.name}.`);
  };

  const updateAddForm = (name: keyof AddForm, value: string) =>
    setAddForm(current => ({ ...current, [name]: value }));

  const handleAdd = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = addForm.name.trim().replace(/\s+/g, ' ');

    if (!name || !addForm.department || !addForm.reason) {
      toast.error('Enter the name, department and reason.');
      return;
    }
    if (!addForm.lastWorkingDay) {
      toast.error('Choose the last working day.');
      return;
    }
    if (addForm.lastWorkingDay < todayIso()) {
      toast.error('The last working day cannot be in the past.');
      return;
    }
    const alreadyLeaving = records.some(
      record =>
        record.status === 'active' &&
        record.name.toLowerCase() === name.toLowerCase()
    );
    if (alreadyLeaving) {
      toast.error(`${name} is already being offboarded.`);
      return;
    }

    nextId.current += 1;
    const id = `OFF-${String(nextId.current).padStart(4, '0')}`;
    const newRecord: OffboardingRecord = {
      id,
      name,
      department: addForm.department,
      position: addForm.position.trim() || 'Employee',
      reason: addForm.reason,
      lastWorkingDay: addForm.lastWorkingDay,
      status: 'active',
      interviewOn: null,
      completedOn: null,
      tasks: createOffboardingTasks(id, addForm.lastWorkingDay),
    };
    setRecords(current => [newRecord, ...current]);
    setTab('active');
    setSearch('');
    setSelectedId(id);
    setAddForm(emptyAddForm);
    setIsAddOpen(false);
    toast.success(`Offboarding started for ${name}.`);
  };

  const selectedProgress = selected ? getProgress(selected) : null;

  return (
    <>
      <div className="flex justify-end gap-3">
        <Button variant="default" onClick={() => setIsAddOpen(true)}>
          <Plus className="w-4 h-4" /> Start offboarding
        </Button>
      </div>
      <Section title="Offboarding Hub" menuId="offboarding-hub" showBreadcrumbs>
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={LogOut}
              label={`Leaving in ${leavingSoonDays} days`}
              value={leavingSoon}
              tone="bg-primary/10 text-primary"
            />
            <StatCard
              icon={ListChecks}
              label="Tasks pending"
              value={pendingTaskCount}
              tone="bg-secondary text-secondary-foreground"
            />
            <StatCard
              icon={CalendarClock}
              label="Running late"
              value={lateTaskCount}
              tone="bg-destructive/10 text-destructive"
            />
            <StatCard
              icon={Mail}
              label="Exit interviews to schedule"
              value={interviewsToSchedule}
              tone="bg-accent text-accent-foreground"
            />
          </div>

          <div className="grid min-w-0 gap-6 xl:grid-cols-2">
            <Card className="min-w-0 space-y-4 p-3 sm:p-4">
              <div
                role="tablist"
                aria-label="Offboarding status"
                className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1"
              >
                {tabs.map(item => {
                  const isActive = tab === item.key;
                  return (
                    <Button
                      key={item.key}
                      type="button"
                      variant={isActive ? 'secondary' : 'ghost'}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => {
                        setTab(item.key);
                        setSelectedId(null);
                      }}
                      className={`h-auto min-w-0 w-full justify-between gap-2 whitespace-normal px-3 py-2.5 text-sm font-semibold ${
                        isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:bg-transparent hover:text-foreground'
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                          isActive
                            ? 'bg-background text-foreground'
                            : 'bg-background/70 text-muted-foreground'
                        }`}
                      >
                        {counts[item.key]}
                      </span>
                    </Button>
                  );
                })}
              </div>
              <FormField
                label="Search"
                name="offboarding-search"
                value={search}
                onChange={setSearch}
                placeholder="Search by name or department"
              />
              <div className="space-y-2">
                {visibleRecords.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border px-4 py-8 text-center">
                    <CheckCircle2
                      className="h-5 w-5 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <p className="text-sm font-medium text-foreground">
                      {records.some(record => record.status === tab)
                        ? 'No matching employees'
                        : tab === 'active'
                          ? 'No one is leaving right now'
                          : 'No offboarding is completed yet'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {records.some(record => record.status === tab)
                        ? 'Try a different name, department or position.'
                        : 'Employees in this group will appear here.'}
                    </p>
                  </div>
                ) : (
                  visibleRecords.map(record => (
                    <EmployeeListItem
                      key={record.id}
                      record={record}
                      isSelected={selected?.id === record.id}
                      onSelect={() => setSelectedId(record.id)}
                    />
                  ))
                )}
              </div>
            </Card>

            <Card className="min-w-0 space-y-6 p-4 sm:p-6">
              {!selected || !selectedProgress ? (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  Choose a person on the left to see their offboarding tasks.
                </p>
              ) : (
                <>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar record={selected} />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-card-foreground">
                            {selected.name}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={
                              selected.status === 'completed'
                                ? 'bg-muted text-muted-foreground'
                                : 'bg-primary/10 text-primary'
                            }
                          >
                            {selected.status === 'completed'
                              ? 'Completed'
                              : 'Leaving'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selected.department} · {selected.position}
                        </p>
                      </div>
                    </div>
                    {selected.status === 'active' && (
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => openInterview(selected)}
                        >
                          <CalendarClock className="h-4 w-4" />{' '}
                          {selected.interviewOn
                            ? 'Change interview'
                            : 'Schedule interview'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleSendReminder(selected)}
                        >
                          <Mail className="h-4 w-4" /> Send reminder
                        </Button>
                        <Button
                          type="button"
                          variant={
                            selectedProgress.percent === 100
                              ? 'default'
                              : 'outline'
                          }
                          onClick={() => handleComplete(selected)}
                        >
                          <CheckCircle2 className="h-4 w-4" /> Complete
                          offboarding
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4 rounded-md border border-border p-4 sm:grid-cols-2 xl:grid-cols-4">
                    <InfoBlock
                      label="Last working day"
                      value={formatDate(selected.lastWorkingDay)}
                    />
                    <InfoBlock label="Reason" value={selected.reason} />
                    <InfoBlock
                      label="Exit interview"
                      value={
                        selected.interviewOn
                          ? formatDate(selected.interviewOn)
                          : 'Not scheduled'
                      }
                    />
                    <div className="space-y-1.5">
                      <p className="text-xs text-muted-foreground">Progress</p>
                      <ProgressBar percent={selectedProgress.percent} />
                      <p className="text-xs font-semibold text-foreground">
                        {selectedProgress.done} of {selectedProgress.total} done
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {offboardingGroups.map(group => {
                      const groupTasks = selected.tasks.filter(
                        task => task.group === group.key
                      );
                      const doneCount = groupTasks.filter(
                        task => task.done
                      ).length;

                      return (
                        <div key={group.key}>
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                              {group.label}
                            </h4>
                            <span className="text-xs text-muted-foreground">
                              {doneCount} of {groupTasks.length} done
                            </span>
                          </div>
                          <div className="divide-y divide-border">
                            {groupTasks.map(task => {
                              const isLate = isTaskLate(
                                selected,
                                task.dueOn,
                                task.done
                              );
                              return (
                                <div
                                  key={task.id}
                                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                                >
                                  <div>
                                    <p
                                      className={`text-sm font-semibold ${
                                        task.done
                                          ? 'text-muted-foreground line-through'
                                          : 'text-foreground'
                                      }`}
                                    >
                                      {task.title}
                                    </p>
                                    <p
                                      className={`text-xs ${
                                        isLate
                                          ? 'font-semibold text-destructive'
                                          : 'text-muted-foreground'
                                      }`}
                                    >
                                      {task.owner} ·{' '}
                                      {task.done
                                        ? 'Done'
                                        : `${isLate ? 'Late, was due' : 'Due'} ${formatDate(task.dueOn)}`}
                                    </p>
                                  </div>
                                  <FormField
                                    label={task.title}
                                    name={`offboarding-task-${task.id}`}
                                    type="toggle"
                                    value={task.done}
                                    disabled={selected.status === 'completed'}
                                    onToggleChange={() =>
                                      handleToggleTask(selected, task.id)
                                    }
                                    toggleActiveLabel="Done"
                                    toggleInactiveLabel="Pending"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </Section>

      <Dialog open={isInterviewOpen} onOpenChange={setIsInterviewOpen}>
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Exit interview</DialogTitle>
            <DialogDescription>
              {selected
                ? `${selected.name} · last working day ${formatDate(selected.lastWorkingDay)}`
                : ''}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveInterview} className="space-y-4">
            <FormField
              label="Interview date"
              name="offboarding-interview-date"
              type="date"
              value={interviewDate}
              onChange={setInterviewDate}
              hint="Pick a day on or before the last working day."
              required
            />
            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsInterviewOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save date</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent
          className="sm:max-w-xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Start offboarding</DialogTitle>
            <DialogDescription>
              A checklist for the exit interview, handover, assets, access and
              documents is created for you.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Employee name"
                name="offboarding-add-name"
                value={addForm.name}
                onChange={value => updateAddForm('name', value)}
                placeholder="Full name"
                required
              />
              <FormField
                label="Department"
                name="offboarding-add-department"
                type="select"
                value={addForm.department}
                onChange={value => updateAddForm('department', value)}
                options={offboardingDepartmentOptions}
                placeholder="Select department"
                required
              />
              <FormField
                label="Position"
                name="offboarding-add-position"
                value={addForm.position}
                onChange={value => updateAddForm('position', value)}
                placeholder="Job title"
              />
              <FormField
                label="Reason"
                name="offboarding-add-reason"
                type="select"
                value={addForm.reason}
                onChange={value => updateAddForm('reason', value)}
                options={offboardingReasonOptions}
                placeholder="Select reason"
                required
              />
              <FormField
                label="Last working day"
                name="offboarding-add-last-day"
                type="date"
                value={addForm.lastWorkingDay}
                onChange={value => updateAddForm('lastWorkingDay', value)}
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsAddOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Start offboarding</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OffBoardingHub;
