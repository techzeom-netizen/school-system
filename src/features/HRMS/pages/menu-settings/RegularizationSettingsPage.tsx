import { type ReactNode, useEffect, useState } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Minus,
  Plus,
  ShieldCheck,
  User,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type ApprovalMode = 'manager' | 'managerHr' | 'auto';

type RequestTypeId = 'checkIn' | 'checkOut' | 'wrongTime' | 'outside';

type NotificationId = 'manager' | 'employee' | 'reminder';

interface RequestRules {
  allowRequests: boolean;
  daysBack: number;
  perMonth: number;
  requireReason: boolean;
}

interface ApprovalRules {
  mode: ApprovalMode;
  escalateDays: number;
}

interface MoreOptions {
  lockAfterPayroll: boolean;
  allowOnOffDays: boolean;
  allowCancel: boolean;
}

interface RegularizationSettings {
  rules: RequestRules;
  requestTypes: Record<RequestTypeId, boolean>;
  approval: ApprovalRules;
  notifications: Record<NotificationId, boolean>;
  more: MoreOptions;
}

interface WorkflowStepData {
  id: string;
  icon: LucideIcon;
  iconClass: string;
  title: string;
  description: string;
}

const requestTypeRows: {
  id: RequestTypeId;
  title: string;
  description: string;
}[] = [
  {
    id: 'checkIn',
    title: 'Forgot to check in',
    description: 'The punch was missed at the start of the day.',
  },
  {
    id: 'checkOut',
    title: 'Forgot to check out',
    description: 'The punch was missed at the end of the day.',
  },
  {
    id: 'wrongTime',
    title: 'Wrong time recorded',
    description: 'The punch is there but the time is not right.',
  },
  {
    id: 'outside',
    title: 'Worked from home or outside',
    description: 'Work from home, client visit or other duty.',
  },
];

const approvalOptions: {
  value: ApprovalMode;
  title: string;
  description: string;
  isRecommended?: boolean;
}[] = [
  {
    value: 'manager',
    title: 'Manager only',
    description: 'The reporting manager approves or rejects.',
    isRecommended: true,
  },
  {
    value: 'managerHr',
    title: 'Manager, then HR',
    description: 'HR gives the final approval after the manager.',
  },
  {
    value: 'auto',
    title: 'Approve automatically',
    description: 'Requests are approved without anyone reviewing them.',
  },
];

const notificationRows: {
  id: NotificationId;
  title: string;
  description: string;
}[] = [
  {
    id: 'manager',
    title: 'Tell the manager about new requests',
    description: 'By email and in the app.',
  },
  {
    id: 'employee',
    title: 'Tell the employee when it is approved or rejected',
    description: 'By email and in the app.',
  },
  {
    id: 'reminder',
    title: 'Remind approvers every day about waiting requests',
    description: 'Sent once a day until they reply.',
  },
];

const moreOptionRows: {
  id: keyof MoreOptions;
  title: string;
  description: string;
}[] = [
  {
    id: 'lockAfterPayroll',
    title: 'Lock after payroll is processed',
    description: 'Attendance for a closed month cannot be changed.',
  },
  {
    id: 'allowOnOffDays',
    title: 'Allow on weekly offs and holidays',
    description: 'For people who worked on a day off.',
  },
  {
    id: 'allowCancel',
    title: 'Employees can cancel pending requests',
    description: 'Only until the manager takes action.',
  },
];

const ruleLabels: Record<keyof RequestRules, string> = {
  allowRequests: 'fix requests',
  daysBack: 'days back limit',
  perMonth: 'monthly request limit',
  requireReason: 'reason requirement',
};

const approvalLabels: Record<keyof ApprovalRules, string> = {
  mode: 'approval method',
  escalateDays: 'escalation time',
};

const notificationLabels: Record<NotificationId, string> = {
  manager: 'manager alerts',
  employee: 'employee alerts',
  reminder: 'daily reminder',
};

const moreLabels: Record<keyof MoreOptions, string> = {
  lockAfterPayroll: 'payroll lock',
  allowOnOffDays: 'day-off requests',
  allowCancel: 'cancelling requests',
};

const maxChangesShown = 3;

const defaultSettings: RegularizationSettings = {
  rules: {
    allowRequests: true,
    daysBack: 7,
    perMonth: 5,
    requireReason: true,
  },
  requestTypes: {
    checkIn: true,
    checkOut: true,
    wrongTime: true,
    outside: true,
  },
  approval: {
    mode: 'manager',
    escalateDays: 2,
  },
  notifications: {
    manager: true,
    employee: true,
    reminder: false,
  },
  more: {
    lockAfterPayroll: true,
    allowOnOffDays: false,
    allowCancel: true,
  },
};

const pluralize = (count: number, singular: string, plural = `${singular}s`) =>
  count === 1 ? singular : plural;

const isEqual = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b);

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const collectChanges = <T extends object>(
  saved: T,
  draft: T,
  labels: Record<keyof T, string>
) =>
  (Object.keys(labels) as (keyof T)[])
    .filter(key => !isEqual(saved[key], draft[key]))
    .map(key => `${labels[key]} updated`);

const getChanges = (
  saved: RegularizationSettings,
  draft: RegularizationSettings
) => [
  ...collectChanges(saved.rules, draft.rules, ruleLabels),
  ...requestTypeRows
    .filter(row => saved.requestTypes[row.id] !== draft.requestTypes[row.id])
    .map(
      row => `${row.title} turned ${draft.requestTypes[row.id] ? 'on' : 'off'}`
    ),
  ...collectChanges(saved.approval, draft.approval, approvalLabels),
  ...collectChanges(
    saved.notifications,
    draft.notifications,
    notificationLabels
  ),
  ...collectChanges(saved.more, draft.more, moreLabels),
];

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

const getWorkflowSteps = (approval: ApprovalRules): WorkflowStepData[] => {
  const employeeStep: WorkflowStepData = {
    id: 'employee',
    icon: User,
    iconClass: 'border-primary/30 bg-primary/10 text-primary',
    title: 'Employee asks',
    description: 'Picks the day, reason and times',
  };
  const doneStep: WorkflowStepData = {
    id: 'done',
    icon: CheckCircle2,
    iconClass: 'border-primary/30 bg-primary/10 text-primary',
    title: 'Attendance updated',
    description: 'Hours and payroll update',
  };

  if (approval.mode === 'auto') {
    return [
      employeeStep,
      {
        id: 'auto',
        icon: Zap,
        iconClass: 'border-accent/40 bg-accent/20 text-accent-foreground',
        title: 'Approved automatically',
        description: 'No one needs to review it',
      },
      doneStep,
    ];
  }

  const managerStep: WorkflowStepData = {
    id: 'manager',
    icon: Users,
    iconClass: 'border-secondary/40 bg-secondary/20 text-secondary-foreground',
    title: 'Reporting manager',
    description:
      approval.mode === 'manager'
        ? `Goes to HR after ${approval.escalateDays} ${pluralize(
            approval.escalateDays,
            'day'
          )} without a reply`
        : 'Approves or rejects',
  };

  if (approval.mode === 'managerHr') {
    return [
      employeeStep,
      managerStep,
      {
        id: 'hr',
        icon: ShieldCheck,
        iconClass: 'border-accent/40 bg-accent/20 text-accent-foreground',
        title: 'HR team',
        description: 'Gives the final approval',
      },
      doneStep,
    ];
  }

  return [employeeStep, managerStep, doneStep];
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
  const name = `regularization-toggle-${label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')}`;

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
      className="min-w-24 bg-background py-2 text-center text-sm font-semibold text-foreground"
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

const StepHeading = ({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description?: string;
}) => (
  <div className="space-y-1">
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
        {number}
      </span>
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
    </div>
    {description && (
      <p className="text-sm text-muted-foreground">{description}</p>
    )}
  </div>
);

const WorkflowStep = ({
  step,
  hasLine,
}: {
  step: WorkflowStepData;
  hasLine: boolean;
}) => {
  const Icon = step.icon;

  return (
    <div className="relative flex flex-col items-center gap-2 text-center">
      {hasLine && (
        <span
          className="absolute left-1/2 top-7 h-px w-full bg-border"
          aria-hidden="true"
        />
      )}
      <span
        className={`relative flex h-14 w-14 items-center justify-center rounded-full border-2 ${step.iconClass}`}
      >
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <p className="text-sm font-semibold text-foreground">{step.title}</p>
      <p className="max-w-[11rem] text-xs text-muted-foreground">
        {step.description}
      </p>
    </div>
  );
};

const ApprovalCard = ({
  title,
  description,
  isRecommended,
  isSelected,
  onSelect,
}: {
  title: string;
  description: string;
  isRecommended: boolean;
  isSelected: boolean;
  onSelect: () => void;
}) => (
  <Button
    type="button"
    variant="ghost"
    aria-pressed={isSelected}
    onClick={onSelect}
    className={`relative h-auto w-full flex-col items-start justify-start gap-2 whitespace-normal rounded-2xl border-2 p-5 text-left font-normal transition-colors hover:text-inherit focus-visible:ring-2 focus-visible:ring-primary ${
      isSelected
        ? 'border-primary bg-primary/5 hover:bg-primary/10'
        : 'border-border bg-card hover:bg-muted/40'
    }`}
  >
    {isRecommended && (
      <Badge className="absolute -top-3 right-4 border-transparent bg-primary text-primary-foreground">
        Recommended
      </Badge>
    )}
    <span className="flex items-center gap-3">
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          isSelected
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border'
        }`}
        aria-hidden="true"
      >
        {isSelected && <Check className="h-3 w-3" />}
      </span>
      <span className="text-base font-semibold text-foreground">{title}</span>
    </span>
    <span className="block text-sm text-muted-foreground">{description}</span>
  </Button>
);

const RegularizationSettingsPage = () => {
  const [saved, setSaved] = useState(defaultSettings);
  const [draft, setDraft] = useState(defaultSettings);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const { rules, requestTypes, approval, notifications, more } = draft;

  const changes = getChanges(saved, draft);
  const hasChanges = changes.length > 0;

  const workflowSteps = getWorkflowSteps(approval);
  const isRequestsOff = !rules.allowRequests;

  // Warn before leaving the page with unsaved changes.
  useEffect(() => {
    if (!hasChanges) return undefined;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasChanges]);

  const updateRules = (values: Partial<RequestRules>) =>
    setDraft(current => ({
      ...current,
      rules: { ...current.rules, ...values },
    }));

  const updateApproval = (values: Partial<ApprovalRules>) =>
    setDraft(current => ({
      ...current,
      approval: { ...current.approval, ...values },
    }));

  const toggleRequestType = (id: RequestTypeId) =>
    setDraft(current => ({
      ...current,
      requestTypes: {
        ...current.requestTypes,
        [id]: !current.requestTypes[id],
      },
    }));

  const toggleNotification = (id: NotificationId) =>
    setDraft(current => ({
      ...current,
      notifications: {
        ...current.notifications,
        [id]: !current.notifications[id],
      },
    }));

  const toggleMoreOption = (id: keyof MoreOptions) =>
    setDraft(current => ({
      ...current,
      more: { ...current.more, [id]: !current.more[id] },
    }));

  const handleSave = () => {
    if (!hasChanges) {
      toast.info('There are no changes to save.');
      return;
    }
    if (
      draft.rules.allowRequests &&
      !Object.values(draft.requestTypes).some(Boolean)
    ) {
      toast.error('Turn on at least one thing employees can fix.');
      return;
    }
    setSaved(draft);
    toast.success(
      'Regularization settings saved. New requests will follow them.'
    );
  };

  const handleDiscard = () => {
    setDraft(saved);
    toast.success('Unsaved changes discarded.');
  };

  return (
    <>
      <Section
        title="Regularization Settings"
        menuId="regularization-settings"
        showBreadcrumbs
      >
        <div className="space-y-6">
          {/* 1. When can employees ask? */}
          <Card className="space-y-2 p-6 md:p-8">
            <StepHeading number={1} title="When can employees ask?" />
            <div className="divide-y divide-border">
              <SettingRow
                title="Allow attendance fix requests"
                description="Turn off to stop all new requests."
              >
                <SettingSwitch
                  isOn={rules.allowRequests}
                  label="Allow attendance fix requests"
                  onToggle={() =>
                    updateRules({ allowRequests: !rules.allowRequests })
                  }
                />
              </SettingRow>

              <SettingRow
                title="How many days back?"
                description="Employees can fix days within this time."
                isDimmed={isRequestsOff}
              >
                <Stepper
                  label="days back"
                  value={rules.daysBack}
                  unit="day"
                  min={1}
                  max={30}
                  disabled={isRequestsOff}
                  onChange={daysBack => updateRules({ daysBack })}
                />
              </SettingRow>

              <SettingRow
                title="How many requests a month?"
                description="Starts again on the 1st of every month."
                isDimmed={isRequestsOff}
              >
                <Stepper
                  label="requests a month"
                  value={rules.perMonth}
                  unit="request"
                  min={1}
                  max={31}
                  disabled={isRequestsOff}
                  onChange={perMonth => updateRules({ perMonth })}
                />
              </SettingRow>

              <SettingRow
                title="Ask for a reason"
                description="Employees write why they need the fix."
                isDimmed={isRequestsOff}
              >
                <SettingSwitch
                  isOn={rules.requireReason}
                  label="Ask for a reason"
                  disabled={isRequestsOff}
                  onToggle={() =>
                    updateRules({ requireReason: !rules.requireReason })
                  }
                />
              </SettingRow>
            </div>
          </Card>

          <Card className="space-y-2 p-6 md:p-8">
            <StepHeading
              number={2}
              title="What can they fix?"
              description="Turn on everything employees are allowed to ask for."
            />
            <div className="divide-y divide-border">
              {requestTypeRows.map(row => (
                <SettingRow
                  key={row.id}
                  title={row.title}
                  description={row.description}
                  isDimmed={isRequestsOff}
                >
                  <SettingSwitch
                    isOn={requestTypes[row.id]}
                    label={row.title}
                    disabled={isRequestsOff}
                    onToggle={() => toggleRequestType(row.id)}
                  />
                </SettingRow>
              ))}
            </div>
          </Card>

          {/* 3. Who approves? */}
          <Card className="space-y-6 p-6 md:p-8">
            <StepHeading
              number={3}
              title="Who approves?"
              description="Pick one. You can change it any time."
            />

            <div
              className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-3"
              role="group"
              aria-label="Who approves"
            >
              {approvalOptions.map(option => (
                <ApprovalCard
                  key={option.value}
                  title={option.title}
                  description={option.description}
                  isRecommended={Boolean(option.isRecommended)}
                  isSelected={approval.mode === option.value}
                  onSelect={() => updateApproval({ mode: option.value })}
                />
              ))}
            </div>

            <div
              className="grid gap-y-6 rounded-2xl bg-muted/30 p-6"
              style={{
                gridTemplateColumns: `repeat(${workflowSteps.length}, minmax(0, 1fr))`,
              }}
            >
              {workflowSteps.map((step, index) => (
                <WorkflowStep
                  key={step.id}
                  step={step}
                  hasLine={index < workflowSteps.length - 1}
                />
              ))}
            </div>

            <div className="divide-y divide-border">
              <SettingRow
                title="If the manager does not reply, send to HR after"
                description="So no request gets stuck."
                isDimmed={approval.mode !== 'manager'}
              >
                <Stepper
                  label="escalation time"
                  value={approval.escalateDays}
                  unit="day"
                  min={1}
                  max={14}
                  disabled={approval.mode !== 'manager'}
                  onChange={escalateDays => updateApproval({ escalateDays })}
                />
              </SettingRow>
            </div>
          </Card>

          <Card className="space-y-2 p-6 md:p-8">
            <StepHeading number={4} title="Who should be told?" />
            <div className="divide-y divide-border">
              {notificationRows.map(row => (
                <SettingRow
                  key={row.id}
                  title={row.title}
                  description={row.description}
                >
                  <SettingSwitch
                    isOn={notifications[row.id]}
                    label={row.title}
                    onToggle={() => toggleNotification(row.id)}
                  />
                </SettingRow>
              ))}
            </div>
          </Card>

          <Card className="space-y-2 p-6 md:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h3 className="text-base font-semibold text-foreground">
                  More options
                </h3>
                <p className="text-sm text-muted-foreground">
                  Payroll lock, weekly offs, cancel requests
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                aria-expanded={isMoreOpen}
                onClick={() => setIsMoreOpen(current => !current)}
              >
                {isMoreOpen ? 'Hide' : 'Show'}
                <ChevronDown
                  className={`transition-transform ${
                    isMoreOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </Button>
            </div>

            {isMoreOpen && (
              <div className="divide-y divide-border border-t border-border">
                {moreOptionRows.map(row => (
                  <SettingRow
                    key={row.id}
                    title={row.title}
                    description={row.description}
                  >
                    <SettingSwitch
                      isOn={more[row.id]}
                      label={row.title}
                      onToggle={() => toggleMoreOption(row.id)}
                    />
                  </SettingRow>
                ))}
              </div>
            )}
          </Card>

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
    </>
  );
};

export default RegularizationSettingsPage;
