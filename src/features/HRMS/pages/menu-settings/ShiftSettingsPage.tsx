import { type ReactNode, useEffect, useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import {
  shiftSettingsChangeNoticeOptions,
  shiftSettingsDefaultShiftOptions,
  shiftSettingsGraceTimeOptions,
  shiftSettingsHalfDayOptions,
  shiftSettingsOvertimeLimitOptions,
  shiftSettingsOvertimeStartOptions,
  shiftSettingsReportRecipientOptions,
  shiftSettingsSwapApproverOptions,
  shiftSettingsWeekDays,
  type DropdownOption,
} from '@/data/reusableDropdownData';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface BaseSetting {
  id: string;
  title: string;
  description: string;

  label: string;

  dependsOn?: string[];
}

interface ToggleSetting extends BaseSetting {
  kind: 'toggle';
  defaultValue: boolean;
}

interface SelectSetting extends BaseSetting {
  kind: 'select';
  options: DropdownOption[];
  defaultValue: string;
}

interface DaysSetting extends BaseSetting {
  kind: 'days';
  defaultValue: string[];
}

type SettingConfig = ToggleSetting | SelectSetting | DaysSetting;

interface SettingsCardConfig {
  id: string;
  title: string;
  description: string;
  settings: SettingConfig[];
}

type SettingValue = boolean | string | string[];

type ShiftSettings = Record<string, SettingValue>;

const settingsCards: SettingsCardConfig[] = [
  {
    id: 'shift-master',
    title: 'Shift Master',
    description: 'Defaults used when you add people or create shifts.',
    settings: [
      {
        kind: 'select',
        id: 'defaultShift',
        title: 'Default shift for new employees',
        description: 'Used when you add someone without choosing a shift.',
        label: 'default shift',
        defaultValue: 'general',
        options: shiftSettingsDefaultShiftOptions,
      },
      {
        kind: 'days',
        id: 'weeklyOffs',
        title: 'Weekly offs',
        description: 'These days are never counted as working days.',
        label: 'weekly offs',
        defaultValue: ['Sat', 'Sun'],
      },
    ],
  },
  {
    id: 'shift-rules-and-schedules',
    title: 'Shift Rules & Schedules',
    description: 'How late arrivals, short days and shift changes are handled.',
    settings: [
      {
        kind: 'select',
        id: 'graceTime',
        title: 'Grace time',
        description:
          'Employees can arrive this late without being marked late.',
        label: 'grace time',
        defaultValue: '10',
        options: shiftSettingsGraceTimeOptions,
      },
      {
        kind: 'select',
        id: 'halfDay',
        title: 'Count as half day when worked',
        description: 'Hours in a day below which it counts as a half day.',
        label: 'half day rule',
        defaultValue: '4',
        options: shiftSettingsHalfDayOptions,
      },
      {
        kind: 'select',
        id: 'changeNotice',
        title: 'Tell employees about a shift change',
        description: 'Managers must give this much notice.',
        label: 'shift change notice',
        defaultValue: '2',
        options: shiftSettingsChangeNoticeOptions,
      },
      {
        kind: 'toggle',
        id: 'allowSwap',
        title: 'Employees can swap shifts',
        description: 'Two employees can exchange shifts with approval.',
        label: 'shift swaps',
        defaultValue: true,
      },
      {
        kind: 'select',
        id: 'swapApprover',
        title: 'Who approves a swap',
        description: 'Approves before the swap happens.',
        label: 'swap approver',
        dependsOn: ['allowSwap'],
        defaultValue: 'manager',
        options: shiftSettingsSwapApproverOptions,
      },
    ],
  },
  {
    id: 'overtime',
    title: 'Overtime',
    description: 'Extra hours worked after the shift ends.',
    settings: [
      {
        kind: 'toggle',
        id: 'countOvertime',
        title: 'Count overtime',
        description: 'Switch off if you do not track overtime.',
        label: 'overtime tracking',
        defaultValue: true,
      },
      {
        kind: 'select',
        id: 'overtimeStart',
        title: 'Overtime starts',
        description: 'Time after the shift end before it counts.',
        label: 'overtime start',
        dependsOn: ['countOvertime'],
        defaultValue: '30',
        options: shiftSettingsOvertimeStartOptions,
      },
      {
        kind: 'select',
        id: 'overtimeLimit',
        title: 'Most overtime allowed',
        description: 'Anything above this needs HR approval.',
        label: 'overtime limit',
        dependsOn: ['countOvertime'],
        defaultValue: '3',
        options: shiftSettingsOvertimeLimitOptions,
      },
      {
        kind: 'toggle',
        id: 'overtimeApproval',
        title: 'Manager approves overtime',
        description: 'Overtime is added only after the manager says yes.',
        label: 'overtime approval',
        dependsOn: ['countOvertime'],
        defaultValue: true,
      },
    ],
  },
  {
    id: 'reports',
    title: 'Reports',
    description: 'Get Shift Wise Attendance and Overtime reports by email.',
    settings: [
      {
        kind: 'toggle',
        id: 'emailAttendance',
        title: 'Email Shift Wise Attendance report',
        description: 'Sent every Monday morning.',
        label: 'attendance report',
        defaultValue: true,
      },
      {
        kind: 'toggle',
        id: 'emailOvertime',
        title: 'Email Overtime report',
        description: 'Sent on the 1st of every month.',
        label: 'overtime report',
        defaultValue: false,
      },
      {
        kind: 'select',
        id: 'reportRecipient',
        title: 'Send reports to',
        description: 'Who gets the emails.',
        label: 'report recipient',
        dependsOn: ['emailAttendance', 'emailOvertime'],
        defaultValue: 'hr',
        options: shiftSettingsReportRecipientOptions,
      },
    ],
  },
];

const allSettings = settingsCards.flatMap(card => card.settings);

const maxChangesShown = 3;

const defaultSettings: ShiftSettings = Object.fromEntries(
  allSettings.map(setting => [setting.id, setting.defaultValue])
);

const pluralize = (count: number, singular: string, plural = `${singular}s`) =>
  count === 1 ? singular : plural;

const isSameValue = (first: SettingValue, second: SettingValue) =>
  Array.isArray(first) && Array.isArray(second)
    ? first.length === second.length &&
      first.every(item => second.includes(item))
    : first === second;

const getChanges = (saved: ShiftSettings, draft: ShiftSettings) =>
  allSettings
    .filter(setting => !isSameValue(saved[setting.id], draft[setting.id]))
    .map(setting => `${setting.label} updated`);

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

const toName = (prefix: string, label: string) =>
  `${prefix}-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

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
  const name = toName('shift-toggle', label);

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

const SettingSelect = ({
  label,
  value,
  options,
  disabled = false,
  onChange,
}: {
  label: string;
  value: string;
  options: DropdownOption[];
  disabled?: boolean;
  onChange: (value: string) => void;
}) => (
  <FormField
    label={label}
    name={toName('shift-select', label)}
    type="select"
    value={value}
    disabled={disabled}
    onChange={onChange}
    options={options}
    className="w-60 [&>label]:sr-only"
  />
);

const WeekDayPicker = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
}) => (
  <div role="group" aria-label={label} className="flex flex-wrap gap-2">
    {shiftSettingsWeekDays.map(day => {
      const isSelected = value.includes(day.value);
      return (
        <Button
          key={day.value}
          type="button"
          size="sm"
          variant={isSelected ? 'default' : 'outline'}
          aria-pressed={isSelected}
          aria-label={day.label}
          title={day.label}
          onClick={() => {
            if (isSelected) {
              onChange(value.filter(item => item !== day.value));
              return;
            }
            // At least one day must stay a working day.
            if (value.length >= shiftSettingsWeekDays.length - 1) {
              toast.error('At least one day must be a working day.');
              return;
            }
            onChange([...value, day.value]);
          }}
        >
          {day.value}
        </Button>
      );
    })}
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
  <div className="flex flex-wrap items-center justify-between gap-4 py-4 sm:gap-6">
    <div className="space-y-0.5">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p
        className={`text-sm text-muted-foreground ${isDimmed ? 'opacity-60' : ''}`}
      >
        {description}
      </p>
    </div>
    <div className="max-w-full shrink-0">{children}</div>
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

const ShiftSettingsPage = () => {
  const [saved, setSaved] = useState<ShiftSettings>(defaultSettings);
  const [draft, setDraft] = useState<ShiftSettings>(defaultSettings);

  const changes = getChanges(saved, draft);
  const hasChanges = changes.length > 0;

  useEffect(() => {
    if (!hasChanges) return undefined;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasChanges]);

  const updateSetting = (id: string, value: SettingValue) =>
    setDraft(current => ({ ...current, [id]: value }));

  const handleSave = () => {
    if (!hasChanges) {
      toast.info('There are no changes to save.');
      return;
    }
    setSaved(draft);
    toast.success('Shift settings saved. New shift actions will follow them.');
  };

  const handleDiscard = () => {
    setDraft(saved);
    toast.success('Unsaved changes discarded.');
  };

  const handleResetDefaults = () => {
    setDraft(defaultSettings);
    toast.success('Settings reset to default. Save to apply them.');
  };

  const isSettingOff = (setting: SettingConfig) =>
    setting.dependsOn !== undefined &&
    setting.dependsOn.every(id => draft[id] === false);

  return (
    <>
      <Section title="Shift Settings" menuId="shift-settings" showBreadcrumbs>
        <div className="space-y-6">
          {settingsCards.map((card, index) => (
            <Card key={card.id} className="space-y-2 p-6 md:p-8">
              <StepHeading
                number={index + 1}
                title={card.title}
                description={card.description}
              />
              <div className="divide-y divide-border">
                {card.settings.map(setting => {
                  const isOff = isSettingOff(setting);
                  const value = draft[setting.id];

                  return (
                    <SettingRow
                      key={setting.id}
                      title={setting.title}
                      description={setting.description}
                      isDimmed={isOff}
                    >
                      {setting.kind === 'toggle' && (
                        <SettingSwitch
                          isOn={value === true}
                          label={setting.title}
                          disabled={isOff}
                          onToggle={() =>
                            updateSetting(setting.id, value !== true)
                          }
                        />
                      )}
                      {setting.kind === 'select' && (
                        <SettingSelect
                          label={setting.title}
                          value={String(value)}
                          options={setting.options}
                          disabled={isOff}
                          onChange={next => updateSetting(setting.id, next)}
                        />
                      )}
                      {setting.kind === 'days' && (
                        <WeekDayPicker
                          label={setting.title}
                          value={Array.isArray(value) ? value : []}
                          onChange={next => updateSetting(setting.id, next)}
                        />
                      )}
                    </SettingRow>
                  );
                })}
              </div>
            </Card>
          ))}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleResetDefaults}
            >
              <RotateCcw className="w-4 h4" /> Reset to default
            </Button>
            <Button type="button" variant="default" onClick={handleSave}>
              <Check className="w-4 h-4" />
              Save changes
            </Button>
          </div>

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

export default ShiftSettingsPage;
