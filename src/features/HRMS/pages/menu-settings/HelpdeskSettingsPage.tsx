import { type ReactNode, useEffect, useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import {
  helpdeskDefaultPriorityOptions,
  helpdeskFirstResponseTimeOptions,
  helpdeskReportFrequencyOptions,
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

type SettingConfig = ToggleSetting | SelectSetting;

interface SettingsCardConfig {
  id: string;
  title: string;
  description: string;
  settings: SettingConfig[];
}

type SettingValue = boolean | string;
type HelpdeskSettings = Record<string, SettingValue>;

const helpdeskSettingsCards: SettingsCardConfig[] = [
  {
    id: 'ticket-management',
    title: 'Ticket management',
    description: 'Set how employers raise and track support requests.',
    settings: [
      {
        kind: 'toggle',
        id: 'allowTicketCreation',
        title: 'Allow employers to raise tickets',
        description: 'Show the Raise Ticket option in the Helpdesk menu.',
        label: 'ticket creation',
        defaultValue: true,
      },
      {
        kind: 'select',
        id: 'defaultPriority',
        title: 'Default ticket priority',
        description: 'Applied when an employer does not choose a priority.',
        label: 'default ticket priority',
        defaultValue: 'normal',
        options: helpdeskDefaultPriorityOptions,
      },
    ],
  },
  {
    id: 'response-times',
    title: 'Response times',
    description: 'Choose a clear target for the support team.',
    settings: [
      {
        kind: 'select',
        id: 'firstResponseTime',
        title: 'First response target',
        description: 'Time allowed for the first reply to a new ticket.',
        label: 'first response target',
        defaultValue: '8',
        options: helpdeskFirstResponseTimeOptions,
      },
      {
        kind: 'toggle',
        id: 'notifyOverdue',
        title: 'Notify the team about overdue tickets',
        description:
          'Send a reminder when a ticket passes its response target.',
        label: 'overdue ticket notifications',
        defaultValue: true,
      },
    ],
  },
  {
    id: 'knowledge-base',
    title: 'FAQs',
    description: 'Help employers find answers before they contact support.',
    settings: [
      {
        kind: 'toggle',
        id: 'showFaqs',
        title: 'Show FAQs to employers',
        description: 'Display FAQs in the Helpdesk menu.',
        label: 'FAQs visibility',
        defaultValue: true,
      },
      {
        kind: 'toggle',
        id: 'suggestFaqs',
        title: 'Suggest FAQs when raising a ticket',
        description:
          'Show relevant answers while an employer describes an issue.',
        label: 'FAQ suggestions',
        dependsOn: ['showFaqs'],
        defaultValue: true,
      },
    ],
  },
  {
    id: 'reports-and-updates',
    title: 'Reports and updates',
    description: 'Keep employers informed and make support activity visible.',
    settings: [
      {
        kind: 'toggle',
        id: 'ticketEmailUpdates',
        title: 'Email ticket status updates',
        description: 'Send an email when a ticket is updated or resolved.',
        label: 'ticket email updates',
        defaultValue: true,
      },
      {
        kind: 'select',
        id: 'reportFrequency',
        title: 'Helpdesk report frequency',
        description: 'How often to prepare the Helpdesk Reports summary.',
        label: 'report frequency',
        defaultValue: 'weekly',
        options: helpdeskReportFrequencyOptions,
      },
    ],
  },
];

const allSettings = helpdeskSettingsCards.flatMap(card => card.settings);
const defaultSettings: HelpdeskSettings = Object.fromEntries(
  allSettings.map(setting => [setting.id, setting.defaultValue])
);

const toFieldName = (prefix: string, label: string) =>
  `${prefix}-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

const SettingSwitch = ({
  isOn,
  label,
  disabled,
  onToggle,
}: {
  isOn: boolean;
  label: string;
  disabled: boolean;
  onToggle: () => void;
}) => (
  <FormField
    label={label}
    name={toFieldName('helpdesk-toggle', label)}
    type="toggle"
    value={isOn}
    disabled={disabled}
    onToggleChange={onToggle}
    toggleActiveLabel="On"
    toggleInactiveLabel="Off"
  />
);

const SettingSelect = ({
  label,
  value,
  options,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  options: DropdownOption[];
  disabled: boolean;
  onChange: (next: string) => void;
}) => (
  <FormField
    label={label}
    name={toFieldName('helpdesk-select', label)}
    type="select"
    value={value}
    options={options}
    disabled={disabled}
    onChange={onChange}
    className="w-60 [&>label]:sr-only"
  />
);

const SettingRow = ({
  title,
  description,
  disabled,
  children,
}: {
  title: string;
  description: string;
  disabled: boolean;
  children: ReactNode;
}) => (
  <div className="flex flex-wrap items-center justify-between gap-4 py-4 sm:gap-6">
    <div className="space-y-0.5">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p
        className={`text-sm text-muted-foreground ${disabled ? 'opacity-60' : ''}`}
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
  description: string;
}) => (
  <div className="space-y-1">
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
        {number}
      </span>
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
    </div>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

const HelpdeskSettingsPage = () => {
  const [saved, setSaved] = useState<HelpdeskSettings>(defaultSettings);
  const [draft, setDraft] = useState<HelpdeskSettings>(defaultSettings);
  const changes = allSettings.filter(
    setting => saved[setting.id] !== draft[setting.id]
  );
  const hasChanges = changes.length > 0;

  useEffect(() => {
    if (!hasChanges) return undefined;
    const warnBeforeLeaving = (event: BeforeUnloadEvent) =>
      event.preventDefault();
    window.addEventListener('beforeunload', warnBeforeLeaving);
    return () => window.removeEventListener('beforeunload', warnBeforeLeaving);
  }, [hasChanges]);

  const updateSetting = (id: string, value: SettingValue) =>
    setDraft(current => ({ ...current, [id]: value }));

  const handleSave = () => {
    if (!hasChanges) {
      toast.info('There are no changes to save.');
      return;
    }
    setSaved(draft);
    toast.success('Helpdesk settings saved.');
  };

  const handleDiscard = () => {
    setDraft(saved);
    toast.success('Unsaved changes discarded.');
  };

  const handleReset = () => {
    setDraft(defaultSettings);
    toast.success('Settings reset to default. Save to apply them.');
  };

  return (
    <>
      <Section
        title="Helpdesk Settings"
        menuId="helpdesk-settings"
        showBreadcrumbs
      >
        <div className="space-y-6">
          {helpdeskSettingsCards.map((card, index) => (
            <Card key={card.id} className="space-y-2 p-6 md:p-8">
              <StepHeading
                number={index + 1}
                title={card.title}
                description={card.description}
              />
              <div className="divide-y divide-border">
                {card.settings.map(setting => {
                  const isDisabled =
                    setting.dependsOn?.every(id => draft[id] === false) ??
                    false;
                  const value = draft[setting.id];

                  return (
                    <SettingRow
                      key={setting.id}
                      title={setting.title}
                      description={setting.description}
                      disabled={isDisabled}
                    >
                      {setting.kind === 'toggle' ? (
                        <SettingSwitch
                          isOn={value === true}
                          label={setting.title}
                          disabled={isDisabled}
                          onToggle={() =>
                            updateSetting(setting.id, value !== true)
                          }
                        />
                      ) : (
                        <SettingSelect
                          label={setting.title}
                          value={String(value)}
                          options={setting.options}
                          disabled={isDisabled}
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
            <Button type="button" variant="outline" onClick={handleReset}>
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
              <p className="text-sm text-muted-foreground">
                {changes.length} unsaved{' '}
                {changes.length === 1 ? 'change' : 'changes'}
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

export default HelpdeskSettingsPage;
