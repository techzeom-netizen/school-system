import { type FormEvent, type ReactNode, useMemo, useState } from 'react';
import {
  Camera,
  Check,
  Fingerprint,
  Minus,
  Monitor,
  Plus,
  Smartphone,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  attendanceSettingsGracePeriodOptions,
  attendanceSettingsOfficeRadiusOptions,
} from '@/data/reusableDropdownData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export {
  attendanceSettingsGracePeriodOptions,
  attendanceSettingsOfficeRadiusOptions,
} from '@/data/reusableDropdownData';

type CheckInMethod = 'mobile' | 'web' | 'location' | 'selfie' | 'biometric';
type Tone = 'good' | 'warn' | 'bad';

interface AttendanceRules {
  workStart: string;
  workEnd: string;
  workDays: string[];
  fullDayHours: number;
  halfDayHours: number;
  graceMinutes: number;
  cutHalfDay: boolean;
  lateMarksAllowed: number;
  methods: Record<CheckInMethod, boolean>;
  allowCorrections: boolean;
  correctionsPerMonth: number;
  correctionDays: number;
  remindCheckIn: boolean;
  remindCheckOut: boolean;
  alertAbsent: boolean;
}

interface Office {
  name: string;
  address: string;
  radius: number;
}

interface ExampleItem {
  title: string;
  detail: string;
  result: string;
  tone: Tone;
}

const companySize = 120;
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const departmentSizes: Record<string, number> = {
  Engineering: 20,
  Finance: 8,
  Marketing: 6,
  Operations: 10,
  Sales: 12,
  HR: 4,
};

const steps = [
  { id: 'hours', label: 'Work hours', next: 'Late arrival' },
  { id: 'late', label: 'Late arrival', next: 'Check-in' },
  { id: 'checkin', label: 'Check-in', next: 'Corrections & reminders' },
  { id: 'fixes', label: 'Corrections & reminders', next: '' },
];

const defaultRules: AttendanceRules = {
  workStart: '09:00',
  workEnd: '18:00',
  workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  fullDayHours: 8,
  halfDayHours: 4,
  graceMinutes: 10,
  cutHalfDay: true,
  lateMarksAllowed: 3,
  methods: {
    mobile: true,
    web: true,
    location: true,
    selfie: false,
    biometric: false,
  },
  allowCorrections: true,
  correctionsPerMonth: 3,
  correctionDays: 7,
  remindCheckIn: true,
  remindCheckOut: true,
  alertAbsent: true,
};

const graceQuickPicks = attendanceSettingsGracePeriodOptions.map(option =>
  Number(option.value)
);

const toneStyles: Record<Tone, string> = {
  good: 'bg-primary/10 text-primary',
  warn: 'bg-muted text-foreground',
  bad: 'bg-destructive/10 text-destructive',
};

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
};

const formatTime = (time: string) => {
  const total = toMinutes(time) % (24 * 60);
  const hours = Math.floor(total / 60);
  const minutes = String(total % 60).padStart(2, '0');

  return `${hours % 12 === 0 ? 12 : hours % 12}:${minutes} ${hours < 12 ? 'AM' : 'PM'}`;
};

const addMinutes = (time: string, minutes: number) => {
  const total = (toMinutes(time) + minutes + 24 * 60) % (24 * 60);

  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

const getWorkHours = (rules: AttendanceRules) =>
  Math.max(
    Math.round(
      ((toMinutes(rules.workEnd) - toMinutes(rules.workStart)) / 60) * 10
    ) / 10,
    0
  );

const getDayResult = (hours: number, rules: AttendanceRules) => {
  if (hours >= rules.fullDayHours) {
    return { result: 'Present', tone: 'good' as Tone };
  }

  if (hours >= rules.halfDayHours) {
    return { result: 'Half day', tone: 'warn' as Tone };
  }

  return { result: 'Absent', tone: 'bad' as Tone };
};

const countChanges = (draft: AttendanceRules, saved: AttendanceRules) =>
  (Object.keys(draft) as (keyof AttendanceRules)[]).filter(
    key => JSON.stringify(draft[key]) !== JSON.stringify(saved[key])
  ).length;

interface StepperProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  step?: number;
  onChange: (value: number) => void;
}

const Stepper = ({
  label,
  value,
  min,
  max,
  unit,
  step = 1,
  onChange,
}: StepperProps) => (
  <div
    role="group"
    aria-label={label}
    className="flex w-max items-center overflow-hidden rounded-lg border border-border bg-card"
  >
    <Button
      type="button"
      variant="default"
      size="icon"
      className="h-9 w-9 rounded-none"
      aria-label={`Decrease ${label}`}
      disabled={value <= min}
      onClick={() => onChange(Math.max(value - step, min))}
    >
      <Minus className="h-4 w-4" aria-hidden="true" />
    </Button>
    <span className="min-w-25 px-3 text-center text-xs font-semibold text-foreground">
      {value} {unit}
    </span>
    <Button
      type="button"
      variant="default"
      size="icon"
      className="h-9 w-9 rounded-none"
      aria-label={`Increase ${label}`}
      disabled={value >= max}
      onClick={() => onChange(Math.min(value + step, max))}
    >
      <Plus className="h-4 w-4" aria-hidden="true" />
    </Button>
  </div>
);

interface SettingRowProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: ReactNode;
  action?: ReactNode;
}

const SettingRow = ({
  title,
  description,
  checked,
  onChange,
  icon,
  action,
}: SettingRowProps) => (
  <div className="flex items-center justify-between gap-4 py-3.5">
    <div className="flex min-w-0 items-center gap-3">
      {icon && (
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
            checked
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {icon}
        </span>
      )}
      <div className="min-w-0">
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
        {action}
      </div>
    </div>
    <FormField
      label={title}
      name={`setting-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
      type="toggle"
      value={checked}
      onToggleChange={onChange}
      toggleActiveLabel="On"
      toggleInactiveLabel="Off"
    />
  </div>
);

const FieldBlock = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div className="space-y-2">
    <p className="text-sm font-semibold text-foreground">{title}</p>
    {children}
  </div>
);

const ExampleCard = ({
  items,
  children,
}: {
  items: ExampleItem[];
  children?: ReactNode;
}) => (
  <Card className="border-border bg-muted/30 p-4 sm:p-5">
    <h2 className="text-lg font-semibold text-foreground">How it will work</h2>
    <p className="mb-2 text-sm text-muted-foreground">
      These examples change as you change the settings.
    </p>
    <div className="divide-y divide-border">
      {items.map(item => (
        <div
          key={item.title}
          className="flex items-center justify-between gap-3 py-3 text-sm"
        >
          <div className="min-w-0">
            <p className="font-medium text-foreground">{item.title}</p>
            <p className="text-xs text-muted-foreground">{item.detail}</p>
          </div>
          <Badge
            variant="secondary"
            className={cn(
              'shrink-0 whitespace-nowrap border-transparent',
              toneStyles[item.tone]
            )}
          >
            {item.result}
          </Badge>
        </div>
      ))}
    </div>
    {children}
  </Card>
);

const AttendanceSettingPage = () => {
  const [saved, setSaved] = useState<Record<string, AttendanceRules>>({
    all: defaultRules,
  });
  const [draft, setDraft] = useState<Record<string, AttendanceRules>>({
    all: defaultRules,
  });
  const [scope, setScope] = useState('all');
  const [stepIndex, setStepIndex] = useState(0);
  const [testHours, setTestHours] = useState(5);
  const [office, setOffice] = useState<Office>({
    name: 'Head office',
    address: '123 Business Park, Main Road',
    radius: 200,
  });
  const [biometricDevice, setBiometricDevice] = useState('');

  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [teamDepartment, setTeamDepartment] = useState('');
  const [teamStartsOn, setTeamStartsOn] = useState('');
  const [teamHoursDiffer, setTeamHoursDiffer] = useState(true);
  const [teamGraceDiffers, setTeamGraceDiffers] = useState(true);
  const [teamDaysDiffer, setTeamDaysDiffer] = useState(false);
  const [teamMethodsDiffer, setTeamMethodsDiffer] = useState(false);
  const [teamStart, setTeamStart] = useState('10:00');
  const [teamEnd, setTeamEnd] = useState('19:00');
  const [teamGrace, setTeamGrace] = useState('15');

  const [isOfficeOpen, setIsOfficeOpen] = useState(false);
  const [officeName, setOfficeName] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  const [officeRadius, setOfficeRadius] = useState('200');

  const [isDeviceOpen, setIsDeviceOpen] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [deviceId, setDeviceId] = useState('');

  const rules = draft[scope];
  const savedRules = saved[scope];
  const changeCount = countChanges(rules, savedRules);
  const step = steps[stepIndex];
  const scopeLabel = scope === 'all' ? 'everyone' : scope;

  const scopeOptions = useMemo(
    () => [
      { value: 'all', label: `Everyone (${companySize} people)` },
      ...Object.keys(saved)
        .filter(key => key !== 'all')
        .map(key => ({
          value: key,
          label: `${key} only (${departmentSizes[key] ?? 0} people)`,
        })),
    ],
    [saved]
  );

  const availableTeams = Object.keys(departmentSizes)
    .filter(department => !(department in saved))
    .map(department => ({
      value: department,
      label: `${department} (${departmentSizes[department]} people)`,
    }));

  const update = (changes: Partial<AttendanceRules>) => {
    setDraft(current => ({
      ...current,
      [scope]: { ...current[scope], ...changes },
    }));
  };

  const toggleMethod = (method: CheckInMethod, checked: boolean) => {
    update({ methods: { ...rules.methods, [method]: checked } });
  };

  const toggleDay = (day: string) => {
    const nextDays = rules.workDays.includes(day)
      ? rules.workDays.filter(item => item !== day)
      : [...rules.workDays, day];

    if (nextDays.length === 0) {
      toast.error('Keep at least one working day.');
      return;
    }

    update({
      workDays: weekDays.filter(item => nextDays.includes(item)),
    });
  };

  const handleSave = () => {
    if (toMinutes(rules.workEnd) <= toMinutes(rules.workStart)) {
      toast.error('Work should end after it starts.');
      setStepIndex(0);
      return;
    }

    if (rules.halfDayHours >= rules.fullDayHours) {
      toast.error('A half day must be shorter than a full day.');
      setStepIndex(0);
      return;
    }

    // TODO: send the saved rules to your API.
    setSaved(current => ({ ...current, [scope]: rules }));
    toast.success(
      `Attendance rules saved for ${scopeLabel}. They apply from tomorrow.`
    );
  };

  const handleDiscard = () => {
    setDraft(current => ({ ...current, [scope]: savedRules }));
    toast.success('Your changes were discarded.');
  };

  const removeTeamRules = () => {
    const team = scope;

    setScope('all');
    setSaved(current => {
      const next = { ...current };
      delete next[team];
      return next;
    });
    setDraft(current => {
      const next = { ...current };
      delete next[team];
      return next;
    });
    toast.success(`${team} now follows the company rules.`);
  };

  const openTeamDialog = () => {
    setTeamDepartment(availableTeams[0]?.value ?? '');
    setTeamStartsOn('');
    setTeamHoursDiffer(true);
    setTeamGraceDiffers(true);
    setTeamDaysDiffer(false);
    setTeamMethodsDiffer(false);
    setTeamStart('10:00');
    setTeamEnd('19:00');
    setTeamGrace('15');
    setIsTeamOpen(true);
  };

  const handleSaveTeamRules = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!teamDepartment) {
      toast.error('Every team already has its own rules.');
      return;
    }

    if (
      !teamHoursDiffer &&
      !teamGraceDiffers &&
      !teamDaysDiffer &&
      !teamMethodsDiffer
    ) {
      toast.error('Choose at least one rule that is different.');
      return;
    }

    if (teamHoursDiffer && toMinutes(teamEnd) <= toMinutes(teamStart)) {
      toast.error('Work should end after it starts.');
      return;
    }

    // TODO: send teamStartsOn and the team rules to your API.
    const base = saved.all;
    const teamRules: AttendanceRules = {
      ...base,
      workStart: teamHoursDiffer ? teamStart : base.workStart,
      workEnd: teamHoursDiffer ? teamEnd : base.workEnd,
      graceMinutes: teamGraceDiffers ? Number(teamGrace) : base.graceMinutes,
      workDays: teamDaysDiffer
        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        : base.workDays,
      methods: teamMethodsDiffer
        ? { ...base.methods, selfie: true }
        : base.methods,
    };

    setSaved(current => ({ ...current, [teamDepartment]: teamRules }));
    setDraft(current => ({ ...current, [teamDepartment]: teamRules }));
    setScope(teamDepartment);
    setStepIndex(0);
    setIsTeamOpen(false);
    toast.success(
      `${teamDepartment} now has its own rules. You can fine-tune them below.`
    );
  };

  const openOfficeDialog = () => {
    setOfficeName(office.name);
    setOfficeAddress(office.address);
    setOfficeRadius(String(office.radius));
    setIsOfficeOpen(true);
  };

  const fillCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Location is not available in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        setOfficeAddress(
          `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)} (current location)`
        );
        toast.success('Your current location was added.');
      },
      () => toast.error('Could not get your location. Please allow access.')
    );
  };

  const handleSaveOffice = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!officeName.trim() || !officeAddress.trim()) {
      toast.error('Add the office name and address.');
      return;
    }

    // TODO: send the office location to your API.
    setOffice({
      name: officeName.trim(),
      address: officeAddress.trim(),
      radius: Number(officeRadius),
    });
    setIsOfficeOpen(false);
    toast.success('Office location saved.');
  };

  const handleConnectDevice = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!deviceName.trim() || !deviceId.trim()) {
      toast.error('Add the device name and its ID.');
      return;
    }

    setBiometricDevice(deviceName.trim());
    toggleMethod('biometric', true);
    setIsDeviceOpen(false);
    setDeviceName('');
    setDeviceId('');
    toast.success('Device connected. Remember to save your changes.');
  };

  const workHours = getWorkHours(rules);
  const testResult = getDayResult(testHours, rules);
  const graceEnd = formatTime(addMinutes(rules.workStart, rules.graceMinutes));

  const hoursExamples: ExampleItem[] = [
    {
      title: `Priya works ${formatTime(rules.workStart)} – ${formatTime(rules.workEnd)}`,
      detail: `${workHours} hours`,
      ...getDayResult(workHours, rules),
    },
    {
      title: `Arjun works ${Math.max(rules.fullDayHours - 3, 0)} hours`,
      detail: `A full day needs ${rules.fullDayHours} hours`,
      ...getDayResult(Math.max(rules.fullDayHours - 3, 0), rules),
    },
    {
      title: `Neha works ${Math.max(rules.halfDayHours - 1, 0)} hours`,
      detail: `A half day needs ${rules.halfDayHours} hours`,
      ...getDayResult(Math.max(rules.halfDayHours - 1, 0), rules),
    },
  ];

  const lateExamples: ExampleItem[] = [
    {
      title: `Checks in at ${formatTime(addMinutes(rules.workStart, Math.max(rules.graceMinutes - 5, 0)))}`,
      detail: `Inside the ${rules.graceMinutes}-minute grace period`,
      result: 'On time',
      tone: 'good',
    },
    {
      title: `Checks in at ${formatTime(addMinutes(rules.workStart, rules.graceMinutes + 5))}`,
      detail: `After ${graceEnd}`,
      result: 'Late',
      tone: 'warn',
    },
    {
      title: `Late for the ${rules.lateMarksAllowed + 1}th time this month`,
      detail: `More than ${rules.lateMarksAllowed} late marks`,
      result: rules.cutHalfDay ? 'Half day cut' : 'No pay cut',
      tone: rules.cutHalfDay ? 'bad' : 'good',
    },
  ];

  const hasPhoneOrWeb = rules.methods.mobile || rules.methods.web;
  const checkInExamples: ExampleItem[] = [
    {
      title: 'Priya taps Check in at the office',
      detail: `Inside the ${office.radius} m area`,
      result: rules.methods.mobile ? 'Works' : 'App is off',
      tone: rules.methods.mobile ? 'good' : 'bad',
    },
    {
      title: 'Arjun tries from home',
      detail: '3 km from the office',
      result: !hasPhoneOrWeb
        ? 'No method on'
        : rules.methods.location
          ? 'Blocked'
          : 'Works',
      tone: hasPhoneOrWeb && !rules.methods.location ? 'good' : 'bad',
    },
    {
      title: 'Neha uses her laptop at the office',
      detail: 'Web browser',
      result: rules.methods.web ? 'Works' : 'Web is off',
      tone: rules.methods.web ? 'good' : 'bad',
    },
  ];

  const fixExamples: ExampleItem[] = [
    {
      title: 'Priya forgot to check out yesterday',
      detail: '1 day ago',
      result:
        rules.allowCorrections && rules.correctionDays >= 1
          ? 'Can ask'
          : 'Not allowed',
      tone: rules.allowCorrections ? 'good' : 'bad',
    },
    {
      title: 'Arjun asks to fix a day 10 days ago',
      detail: `Corrections allowed for ${rules.correctionDays} days`,
      result:
        rules.allowCorrections && rules.correctionDays >= 10
          ? 'Can ask'
          : 'Blocked',
      tone:
        rules.allowCorrections && rules.correctionDays >= 10 ? 'good' : 'bad',
    },
  ];

  const stepTitle: Record<string, string> = {
    hours: 'When does work start and end?',
    late: 'What if someone is late?',
    checkin: 'How can employees check in?',
    fixes: 'Fixing mistakes',
  };

  return (
    <>
      <Section
        title="Attendance setting"
        menuId="attendance-settings"
        showBreadcrumbs
      >
        <div className="space-y-5">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-64">
              <FormField
                label="These rules apply to"
                name="attendance-scope"
                type="select"
                value={scope}
                onChange={setScope}
                options={scopeOptions}
              />
            </div>
            {scope !== 'all' && (
              <Button type="button" variant="outline" onClick={removeTeamRules}>
                Use company rules for {scope}
              </Button>
            )}
            {availableTeams.length > 0 && (
              <Button
                type="button"
                variant="default"
                className="sm:ml-auto"
                onClick={openTeamDialog}
              >
                Different rules for one team? <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>

          {scope !== 'all' && (
            <p className="rounded-lg bg-primary/10 p-3 text-sm text-foreground">
              You are editing the rules for <strong>{scope}</strong> only.
              Everyone else follows the company rules.
            </p>
          )}

          <div
            role="tablist"
            aria-label="Attendance setting steps"
            className="flex gap-1 overflow-x-auto border-b border-border"
          >
            {steps.map((item, index) => (
              <Button
                key={item.id}
                type="button"
                variant="ghost"
                role="tab"
                aria-selected={stepIndex === index}
                onClick={() => setStepIndex(index)}
                className={cn(
                  'h-auto -mb-px whitespace-nowrap rounded-none border-b-[3px] px-4 py-3 text-sm transition-colors hover:bg-transparent',
                  stepIndex === index
                    ? 'border-primary font-bold text-primary'
                    : 'border-transparent font-medium text-muted-foreground hover:text-foreground'
                )}
              >
                {index + 1} {item.label}
              </Button>
            ))}
          </div>

          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <Card className="space-y-5 border-border p-4 sm:p-5">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {stepTitle[step.id]}
                </h2>
              </div>

              {step.id === 'hours' && (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      label="Work starts"
                      name="work-start"
                      type="time"
                      value={rules.workStart}
                      onChange={value => update({ workStart: value })}
                      className="w-full min-w-0"
                    />
                    <FormField
                      label="Work ends"
                      name="work-end"
                      type="time"
                      value={rules.workEnd}
                      onChange={value => update({ workEnd: value })}
                      className="w-full min-w-0"
                    />
                  </div>

                  <FieldBlock title="Which days do people work?">
                    <div className="flex flex-wrap gap-2">
                      {weekDays.map(day => (
                        <Button
                          key={day}
                          type="button"
                          variant={
                            rules.workDays.includes(day) ? 'default' : 'outline'
                          }
                          className="w-10"
                          aria-pressed={rules.workDays.includes(day)}
                          onClick={() => toggleDay(day)}
                        >
                          {day}
                        </Button>
                      ))}
                    </div>
                  </FieldBlock>

                  <FieldBlock title="A full day means working at least">
                    <Stepper
                      label="full day hours"
                      value={rules.fullDayHours}
                      min={2}
                      max={12}
                      unit="hours"
                      onChange={value => update({ fullDayHours: value })}
                    />
                  </FieldBlock>

                  <FieldBlock title="A half day means working at least">
                    <Stepper
                      label="half day hours"
                      value={rules.halfDayHours}
                      min={1}
                      max={11}
                      unit="hours"
                      onChange={value => update({ halfDayHours: value })}
                    />
                  </FieldBlock>
                </>
              )}

              {step.id === 'late' && (
                <>
                  <FieldBlock title="Grace period: how many minutes can they be late?">
                    <Stepper
                      label="grace period"
                      value={rules.graceMinutes}
                      min={0}
                      max={60}
                      step={5}
                      unit="minutes"
                      onChange={value => update({ graceMinutes: value })}
                    />
                    <div className="flex flex-wrap gap-2 pt-1">
                      {graceQuickPicks.map(minutes => (
                        <Button
                          key={minutes}
                          type="button"
                          size="sm"
                          className="rounded-full"
                          variant={
                            rules.graceMinutes === minutes
                              ? 'default'
                              : 'outline'
                          }
                          aria-pressed={rules.graceMinutes === minutes}
                          onClick={() => update({ graceMinutes: minutes })}
                        >
                          {minutes} min
                        </Button>
                      ))}
                    </div>
                  </FieldBlock>

                  <div className="divide-y divide-border">
                    <SettingRow
                      title="Cut half a day after too many late marks"
                      description="Turn this off if you do not want any pay cut."
                      checked={rules.cutHalfDay}
                      onChange={checked => update({ cutHalfDay: checked })}
                    />
                  </div>

                  <FieldBlock title="How many late marks are allowed each month?">
                    <Stepper
                      label="late marks"
                      value={rules.lateMarksAllowed}
                      min={1}
                      max={10}
                      unit="late marks"
                      onChange={value => update({ lateMarksAllowed: value })}
                    />
                  </FieldBlock>

                  <p className="rounded-lg bg-primary/10 p-3 text-sm text-foreground">
                    Anyone who checks in after <strong>{graceEnd}</strong> is
                    marked <strong>late</strong>.
                    {rules.cutHalfDay
                      ? ` After ${rules.lateMarksAllowed} late marks in a month, half a day of pay is cut.`
                      : ' There is no pay cut for late marks.'}
                  </p>
                </>
              )}

              {step.id === 'checkin' && (
                <div className="divide-y divide-border">
                  <SettingRow
                    title="Mobile app"
                    description="Tap Check in on the phone"
                    icon={<Smartphone className="h-5 w-5" aria-hidden="true" />}
                    checked={rules.methods.mobile}
                    onChange={checked => toggleMethod('mobile', checked)}
                  />
                  <SettingRow
                    title="Web browser"
                    description="Check in from a computer"
                    icon={<Monitor className="h-5 w-5" aria-hidden="true" />}
                    checked={rules.methods.web}
                    onChange={checked => toggleMethod('web', checked)}
                  />
                  <SettingRow
                    title="Office location only"
                    description={`Check in only within ${office.radius} m of ${office.name}`}
                    icon={<MapPin className="h-5 w-5" aria-hidden="true" />}
                    checked={rules.methods.location}
                    onChange={checked => toggleMethod('location', checked)}
                    action={
                      <Button
                        type="button"
                        variant="link"
                        className="h-auto p-0 text-sm"
                        onClick={openOfficeDialog}
                      >
                        Edit location
                      </Button>
                    }
                  />
                  <SettingRow
                    title="Selfie photo"
                    description="Ask for a photo when checking in"
                    icon={<Camera className="h-5 w-5" aria-hidden="true" />}
                    checked={rules.methods.selfie}
                    onChange={checked => toggleMethod('selfie', checked)}
                  />
                  <SettingRow
                    title="Biometric device"
                    description={
                      biometricDevice
                        ? `Connected: ${biometricDevice}`
                        : 'Connect a fingerprint or face machine'
                    }
                    icon={
                      <Fingerprint className="h-5 w-5" aria-hidden="true" />
                    }
                    checked={rules.methods.biometric}
                    onChange={checked => {
                      if (checked && !biometricDevice) {
                        setIsDeviceOpen(true);
                        return;
                      }

                      toggleMethod('biometric', checked);
                    }}
                    action={
                      <Button
                        type="button"
                        variant="link"
                        className="h-auto p-0 text-sm"
                        onClick={() => setIsDeviceOpen(true)}
                      >
                        {biometricDevice ? 'Change device' : 'Set up'}
                      </Button>
                    }
                  />
                </div>
              )}

              {step.id === 'fixes' && (
                <>
                  <SettingRow
                    title="Let employees ask for a correction"
                    description="They send a request and you approve it."
                    checked={rules.allowCorrections}
                    onChange={checked => update({ allowCorrections: checked })}
                  />

                  {rules.allowCorrections && (
                    <>
                      <FieldBlock title="How many requests each month?">
                        <Stepper
                          label="requests each month"
                          value={rules.correctionsPerMonth}
                          min={1}
                          max={10}
                          unit="requests"
                          onChange={value =>
                            update({ correctionsPerMonth: value })
                          }
                        />
                      </FieldBlock>
                      <FieldBlock title="How many days back can they ask?">
                        <Stepper
                          label="days back"
                          value={rules.correctionDays}
                          min={1}
                          max={30}
                          unit="days"
                          onChange={value => update({ correctionDays: value })}
                        />
                      </FieldBlock>
                    </>
                  )}

                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      Reminders
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Gentle nudges so nobody forgets.
                    </p>
                    <div className="divide-y divide-border">
                      <SettingRow
                        title="Check-in reminder"
                        description={`Sent at ${formatTime(rules.workStart)}`}
                        checked={rules.remindCheckIn}
                        onChange={checked => update({ remindCheckIn: checked })}
                      />
                      <SettingRow
                        title="Check-out reminder"
                        description={`Sent at ${formatTime(rules.workEnd)}`}
                        checked={rules.remindCheckOut}
                        onChange={checked =>
                          update({ remindCheckOut: checked })
                        }
                      />
                      <SettingRow
                        title="Tell managers about absences"
                        description={`Sent at ${formatTime(addMinutes(rules.workStart, 90))}`}
                        checked={rules.alertAbsent}
                        onChange={checked => update({ alertAbsent: checked })}
                      />
                    </div>
                  </div>
                </>
              )}
            </Card>

            <div>
              {step.id === 'hours' && (
                <ExampleCard
                  items={[
                    ...hoursExamples,
                    {
                      title: `Try it: someone works ${testHours} hours`,
                      detail: 'Use the buttons to test any number',
                      ...testResult,
                    },
                  ]}
                >
                  <div className="pt-3">
                    <Stepper
                      label="test hours"
                      value={testHours}
                      min={0}
                      max={12}
                      unit="hours"
                      onChange={setTestHours}
                    />
                  </div>
                </ExampleCard>
              )}
              {step.id === 'late' && <ExampleCard items={lateExamples} />}
              {step.id === 'checkin' && <ExampleCard items={checkInExamples} />}
              {step.id === 'fixes' && (
                <ExampleCard items={fixExamples}>
                  {rules.remindCheckIn && (
                    <div className="mt-3 flex items-start gap-3 rounded-xl bg-muted p-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                        H
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Demo School
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Good morning! Do not forget to check in. It is{' '}
                          {formatTime(rules.workStart)}.
                        </p>
                      </div>
                    </div>
                  )}
                </ExampleCard>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted p-4 text-foreground">
            <span className="text-sm">
              {changeCount > 0 ? (
                <>
                  <strong>
                    You have {changeCount} unsaved{' '}
                    {changeCount === 1 ? 'change' : 'changes'}.
                  </strong>{' '}
                  They will apply from tomorrow.
                </>
              ) : (
                'All changes are saved. They apply from tomorrow.'
              )}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {stepIndex > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStepIndex(index => index - 1)}
                >
                  Back
                </Button>
              )}
              {changeCount > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  className="text-foreground"
                  onClick={handleDiscard}
                >
                  Discard
                </Button>
              )}
              <Button
                type="button"
                disabled={changeCount === 0}
                onClick={handleSave}
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                Save changes
              </Button>
              {step.next && (
                <Button
                  type="button"
                  variant="outline"
                  className="text-foreground"
                  onClick={() => setStepIndex(index => index + 1)}
                >
                  Next: {step.next} →
                </Button>
              )}
            </div>
          </div>
        </div>
      </Section>

      <Dialog
        open={isTeamOpen}
        onOpenChange={open => !open && setIsTeamOpen(false)}
      >
        <DialogContent
          className="max-h-[92vh] overflow-y-auto sm:max-w-xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Different rules for a team</DialogTitle>
            <DialogDescription>
              Pick a team, then choose which rules are different.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveTeamRules} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Team"
                name="team-department"
                type="select"
                value={teamDepartment}
                onChange={setTeamDepartment}
                options={availableTeams}
                required
              />
              <FormField
                label="Starts from"
                name="team-starts"
                type="date"
                value={teamStartsOn}
                onChange={setTeamStartsOn}
                className="w-full min-w-0"
              />
            </div>

            <FieldBlock title="What is different for this team?">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 ">
                <FormField
                  label="Work hours"
                  name="team-hours"
                  type="checkbox"
                  value={teamHoursDiffer}
                  onCheckboxChange={setTeamHoursDiffer}
                  className="rounded-lg border border-border bg-muted/40 p-3"
                />
                <FormField
                  label="Grace period"
                  name="team-grace-check"
                  type="checkbox"
                  value={teamGraceDiffers}
                  onCheckboxChange={setTeamGraceDiffers}
                  className="rounded-lg border border-border bg-muted/40 p-3"
                />
                <FormField
                  label="Working days"
                  name="team-days"
                  type="checkbox"
                  value={teamDaysDiffer}
                  onCheckboxChange={setTeamDaysDiffer}
                  className="rounded-lg border border-border bg-muted/40 p-3"
                />
                <FormField
                  label="Check-in methods"
                  name="team-methods"
                  type="checkbox"
                  value={teamMethodsDiffer}
                  onCheckboxChange={setTeamMethodsDiffer}
                  className="rounded-lg border border-border bg-muted/40 p-3"
                />
              </div>
            </FieldBlock>

            {(teamHoursDiffer || teamGraceDiffers) && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {teamHoursDiffer && (
                  <>
                    <FormField
                      label="Work starts"
                      name="team-start"
                      type="time"
                      value={teamStart}
                      onChange={setTeamStart}
                      className="w-full min-w-0"
                    />
                    <FormField
                      label="Work ends"
                      name="team-end"
                      type="time"
                      value={teamEnd}
                      onChange={setTeamEnd}
                      className="w-full min-w-0"
                    />
                  </>
                )}
                {teamGraceDiffers && (
                  <FormField
                    label="Grace period"
                    name="team-grace"
                    type="select"
                    value={teamGrace}
                    onChange={setTeamGrace}
                    options={attendanceSettingsGracePeriodOptions}
                  />
                )}
              </div>
            )}

            <p className="rounded-lg bg-primary/10 p-3 text-sm text-foreground">
              {teamDepartment || 'This team'} will follow these rules instead of
              the company rules. Everyone else stays the same.
            </p>

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsTeamOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save team rules</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isOfficeOpen}
        onOpenChange={open => !open && setIsOfficeOpen(false)}
      >
        <DialogContent
          className="max-h-[92vh] overflow-y-auto sm:max-w-xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Office location</DialogTitle>
            <DialogDescription>
              Employees can check in only when they are inside this area.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveOffice} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Office name"
                name="office-name"
                value={officeName}
                onChange={setOfficeName}
                required
              />
              <FormField
                label="Address"
                name="office-address"
                value={officeAddress}
                onChange={setOfficeAddress}
                required
              />
            </div>

            <div className="space-y-2">
              <div
                className="relative flex h-40 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/50"
                role="img"
                aria-label={`Map area of ${officeRadius} metres around the office`}
              >
                <span
                  className="rounded-full border-2 border-dashed border-primary bg-primary/15 transition-all"
                  style={{
                    width: `${40 + (Number(officeRadius) / 1000) * 100}px`,
                    height: `${40 + (Number(officeRadius) / 1000) * 100}px`,
                  }}
                />
                <MapPin
                  className="absolute h-7 w-7 text-primary"
                  aria-hidden="true"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0"
                  onClick={fillCurrentLocation}
                >
                  Use my current location
                </Button>
                <span className="text-xs text-muted-foreground">
                  The circle is where check-in works.
                </span>
              </div>
            </div>

            <FormField
              label="How close must they be?"
              name="office-radius"
              type="radio"
              value={officeRadius}
              onChange={setOfficeRadius}
              options={attendanceSettingsOfficeRadiusOptions}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsOfficeOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save location</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeviceOpen}
        onOpenChange={open => !open && setIsDeviceOpen(false)}
      >
        <DialogContent
          className="sm:max-w-lg"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Connect a biometric device</DialogTitle>
            <DialogDescription>
              Add your fingerprint or face machine.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConnectDevice} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Device name"
                name="device-name"
                value={deviceName}
                onChange={setDeviceName}
                placeholder="e.g. Main gate scanner"
                required
              />
              <FormField
                label="Device ID"
                name="device-id"
                value={deviceId}
                onChange={setDeviceId}
                placeholder="e.g. BIO-1024"
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsDeviceOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Connect device</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AttendanceSettingPage;
