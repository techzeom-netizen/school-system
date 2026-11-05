import { type ReactNode, useEffect, useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import {
  assetSettingsApprovalLimitOptions,
  assetSettingsLowStockOptions,
  assetSettingsPurchaseApproverOptions,
  assetSettingsRepairHandlerOptions,
  assetSettingsReportFormatOptions,
  assetSettingsReportRecipientOptions,
  assetSettingsRequestApproverOptions,
  assetSettingsReturnDeadlineOptions,
  assetSettingsServiceReminderOptions,
  assetSettingsTagStyleOptions,
  assetSettingsWarrantyAlertOptions,
  documentReplyOptions,
  type DropdownOption,
} from '@/data/reusableDropdownData';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface BaseSetting {
  id: string;
  title: string;
  description: string;

  label: string;

  dependsOn?: string;
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

type AssetSettings = Record<string, SettingValue>;

const settingsCards: SettingsCardConfig[] = [
  {
    id: 'my-assets',
    title: 'My Assets',
    description: 'What employees see for the items given to them.',
    settings: [
      {
        kind: 'toggle',
        id: 'confirmReceipt',
        title: 'Ask employees to confirm receipt',
        description: 'They confirm when they get an item.',
        label: 'receipt confirmation',
        defaultValue: true,
      },
      {
        kind: 'toggle',
        id: 'reportProblem',
        title: 'Employees can report a problem',
        description: 'For damaged, lost or faulty items.',
        label: 'problem reports',
        defaultValue: true,
      },
    ],
  },
  {
    id: 'assets-inventory',
    title: 'Assets Inventory',
    description: 'Your list of laptops, phones, ID cards and other items.',
    settings: [
      {
        kind: 'select',
        id: 'tagStyle',
        title: 'Asset tag numbers',
        description: 'How each item gets its number.',
        label: 'tag numbers',
        defaultValue: 'auto',
        options: assetSettingsTagStyleOptions,
      },
      {
        kind: 'select',
        id: 'lowStock',
        title: 'Warn me when stock is low',
        description: 'Alert when items left fall below this.',
        label: 'low stock level',
        defaultValue: '5',
        options: assetSettingsLowStockOptions,
      },
    ],
  },
  {
    id: 'assets-requests',
    title: 'Assets Requests',
    description: 'Employees ask for a new item.',
    settings: [
      {
        kind: 'toggle',
        id: 'allowRequests',
        title: 'Employees can request assets',
        description: 'Switch off to stop all new requests.',
        label: 'asset requests',
        defaultValue: true,
      },
      {
        kind: 'select',
        id: 'requestApprover',
        title: 'Who approves requests',
        description: 'Approves before the item is given.',
        label: 'request approver',
        dependsOn: 'allowRequests',
        defaultValue: 'manager',
        options: assetSettingsRequestApproverOptions,
      },
      {
        kind: 'select',
        id: 'requestReply',
        title: 'Reply within',
        description: 'Get an alert if a request waits longer.',
        label: 'reply time',
        dependsOn: 'allowRequests',
        defaultValue: '2',
        options: documentReplyOptions,
      },
    ],
  },
  {
    id: 'return-and-recovery',
    title: 'Return & Recovery',
    description: 'Getting items back when someone leaves or changes role.',
    settings: [
      {
        kind: 'toggle',
        id: 'exitClearance',
        title: 'Add assets to exit clearance',
        description: 'Returns are checked before the last day.',
        label: 'exit clearance',
        defaultValue: true,
      },
      {
        kind: 'select',
        id: 'returnDeadline',
        title: 'Ask for return by',
        description: 'The deadline given to the employee.',
        label: 'return deadline',
        dependsOn: 'exitClearance',
        defaultValue: 'lastDay',
        options: assetSettingsReturnDeadlineOptions,
      },
      {
        kind: 'toggle',
        id: 'recoverCost',
        title: 'Take the cost of lost items from final pay',
        description: 'Only when an item is not returned.',
        label: 'cost recovery',
        defaultValue: false,
      },
    ],
  },
  {
    id: 'maintanance-and-repairs',
    title: 'Maintanance & Repairs',
    description: 'Keeping items working.',
    settings: [
      {
        kind: 'toggle',
        id: 'allowRepairs',
        title: 'Employees can ask for a repair',
        description: 'They raise it from My Assets.',
        label: 'repair requests',
        defaultValue: true,
      },
      {
        kind: 'select',
        id: 'repairHandler',
        title: 'Who handles repairs',
        description: 'Gets the repair request first.',
        label: 'repair handler',
        dependsOn: 'allowRepairs',
        defaultValue: 'it',
        options: assetSettingsRepairHandlerOptions,
      },
      {
        kind: 'select',
        id: 'serviceReminder',
        title: 'Service reminder',
        description: 'Remind before items are due for service.',
        label: 'service reminder',
        defaultValue: '6',
        options: assetSettingsServiceReminderOptions,
      },
    ],
  },
  {
    id: 'vendor-and-purchase',
    title: 'Vendor & Purchase',
    description: 'Buying new items from your vendors.',
    settings: [
      {
        kind: 'select',
        id: 'approvalLimit',
        title: 'Purchases need approval above',
        description: 'Smaller purchases go through directly.',
        label: 'approval limit',
        defaultValue: '25000',
        options: assetSettingsApprovalLimitOptions,
      },
      {
        kind: 'select',
        id: 'purchaseApprover',
        title: 'Who approves purchases',
        description: 'Final approval for larger amounts.',
        label: 'purchase approver',
        defaultValue: 'finance',
        options: assetSettingsPurchaseApproverOptions,
      },
      {
        kind: 'select',
        id: 'warrantyAlert',
        title: 'Warn before warranty ends',
        description: 'Alert ahead of the warranty end date.',
        label: 'warranty alert',
        defaultValue: '30',
        options: assetSettingsWarrantyAlertOptions,
      },
    ],
  },
  {
    id: 'assets-reports',
    title: 'Assets Reports',
    description: 'A summary of all your assets by email.',
    settings: [
      {
        kind: 'toggle',
        id: 'monthlyReport',
        title: 'Send a monthly report',
        description: 'Sent on the 1st of every month.',
        label: 'monthly report',
        defaultValue: true,
      },
      {
        kind: 'select',
        id: 'reportRecipient',
        title: 'Send it to',
        description: 'Who gets the report.',
        label: 'report recipient',
        dependsOn: 'monthlyReport',
        defaultValue: 'hr',
        options: assetSettingsReportRecipientOptions,
      },
      {
        kind: 'select',
        id: 'reportFormat',
        title: 'Report format',
        description: 'How the file opens.',
        label: 'report format',
        dependsOn: 'monthlyReport',
        defaultValue: 'excel',
        options: assetSettingsReportFormatOptions,
      },
    ],
  },
];

const allSettings = settingsCards.flatMap(card => card.settings);

const maxChangesShown = 3;

const defaultSettings: AssetSettings = Object.fromEntries(
  allSettings.map(setting => [setting.id, setting.defaultValue])
);

const pluralize = (count: number, singular: string, plural = `${singular}s`) =>
  count === 1 ? singular : plural;

const getChanges = (saved: AssetSettings, draft: AssetSettings) =>
  allSettings
    .filter(setting => saved[setting.id] !== draft[setting.id])
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
  const name = `asset-toggle-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

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
}) => {
  const name = `asset-select-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  return (
    <FormField
      label={label}
      name={name}
      type="select"
      value={value}
      disabled={disabled}
      onChange={onChange}
      options={options}
      className="w-60 [&>label]:sr-only"
    />
  );
};

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

const AssetsSettingsPage = () => {
  const [saved, setSaved] = useState<AssetSettings>(defaultSettings);
  const [draft, setDraft] = useState<AssetSettings>(defaultSettings);

  const changes = getChanges(saved, draft);
  const hasChanges = changes.length > 0;

  // Warn before leaving the page with unsaved changes.
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
    toast.success('Assets settings saved. New asset actions will follow them.');
  };

  const handleDiscard = () => {
    setDraft(saved);
    toast.success('Unsaved changes discarded.');
  };

  const handleResetDefaults = () => {
    setDraft(defaultSettings);
    toast.success('Settings reset to default. Save to apply them.');
  };

  return (
    <>
      <Section title="Assets Settings" menuId="assets-settings" showBreadcrumbs>
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
                  const isOff =
                    setting.dependsOn !== undefined &&
                    draft[setting.dependsOn] === false;
                  const value = draft[setting.id];

                  return (
                    <SettingRow
                      key={setting.id}
                      title={setting.title}
                      description={setting.description}
                      isDimmed={isOff}
                    >
                      {setting.kind === 'toggle' ? (
                        <SettingSwitch
                          isOn={value === true}
                          label={setting.title}
                          disabled={isOff}
                          onToggle={() =>
                            updateSetting(setting.id, value !== true)
                          }
                        />
                      ) : (
                        <SettingSelect
                          label={setting.title}
                          value={String(value)}
                          options={setting.options}
                          disabled={isOff}
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

export default AssetsSettingsPage;
