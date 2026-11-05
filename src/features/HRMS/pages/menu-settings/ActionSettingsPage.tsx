import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import TanStackTable from '@/components/common/TanStackTable';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type TabId = 'onboarding' | 'offboarding';

interface StepConfig {
  id: string;
  title: string;
  description: string;
  settingLabel: string;
  options: string[];
  defaultEnabled: boolean;
}

interface StepRule {
  enabled: boolean;
  value: string;
}

interface ActionStepRow {
  step: StepConfig;
  rule: StepRule;
}

type ActionSettings = Record<string, StepRule>;

const tabs: { id: TabId; title: string; subtitle: string }[] = [
  {
    id: 'onboarding',
    title: 'Onboarding',
    subtitle: 'For new joiners, from offer acceptance to confirmation.',
  },
  {
    id: 'offboarding',
    title: 'Offboarding',
    subtitle:
      'For employees who are leaving, from resignation to relieving letter.',
  },
];

const stepConfig: Record<TabId, StepConfig[]> = {
  onboarding: [
    {
      id: 'candidate-pre-joining-portal',
      title: 'Candidate Pre-Joining Portal',
      description:
        'Candidates fill in details and upload documents before day one.',
      settingLabel: 'Open the portal',
      options: [
        '7 days before joining',
        '14 days before joining',
        '3 days before joining',
      ],
      defaultEnabled: true,
    },
    {
      id: 'my-onboarding-tasks',
      title: 'My Onboarding Tasks',
      description: 'Give new joiners and their teams a simple task checklist.',
      settingLabel: 'Send task reminders',
      options: ['Every day', 'Every 3 days', 'Every week'],
      defaultEnabled: true,
    },
    {
      id: 'induction-and-welcome',
      title: 'Induction & Welcome',
      description: 'Send a welcome message and the first-week schedule.',
      settingLabel: 'Send welcome message',
      options: [
        'On the joining day',
        '1 day before joining',
        'On offer acceptance',
      ],
      defaultEnabled: true,
    },
    {
      id: 'assets-and-asset-requests',
      title: 'Assets & Asset Requests',
      description: 'Let new joiners ask for a laptop, ID card and other items.',
      settingLabel: 'Who approves',
      options: ['IT team', 'Reporting manager', 'HR team'],
      defaultEnabled: true,
    },
    {
      id: 'policy-and-esign',
      title: 'Policy Center & E-Sign',
      description: 'New joiners read and sign company policies online.',
      settingLabel: 'Sign within',
      options: ['3 days', '7 days', '1 day'],
      defaultEnabled: true,
    },
    {
      id: 'probation-and-confirmation',
      title: 'Probation Tracking & Confirmation',
      description: 'Track probation and confirm employees on time.',
      settingLabel: 'Probation period',
      options: ['6 months', '3 months', '1 year'],
      defaultEnabled: true,
    },
  ],
  offboarding: [
    {
      id: 'resignation-and-approvals',
      title: 'Resignation & Approvals',
      description:
        'Employees submit resignation and the right people approve it.',
      settingLabel: 'Who approves',
      options: ['Manager, then HR', 'Manager only', 'HR only'],
      defaultEnabled: true,
    },
    {
      id: 'notice-period-tracker',
      title: 'Notice Period Tracker',
      description: 'Track the notice period and last working day.',
      settingLabel: 'Default notice period',
      options: ['60 days', '30 days', '90 days'],
      defaultEnabled: true,
    },
    {
      id: 'exit-clearance',
      title: 'Exit Clearance',
      description: 'Each team confirms returns and dues before the last day.',
      settingLabel: 'Clearance needed from',
      options: ['All teams', 'IT and Finance', 'HR only'],
      defaultEnabled: true,
    },
    {
      id: 'exit-interview',
      title: 'Exit Interview & Feedback Form',
      description: 'Collect honest feedback from people who are leaving.',
      settingLabel: 'Send the form',
      options: ['In the last week', 'On resignation', 'On the last day'],
      defaultEnabled: false,
    },
    {
      id: 'full-and-final-settlement',
      title: 'Full & Final Settlement',
      description: 'Calculate and release the final payment.',
      settingLabel: 'Settle within',
      options: ['45 days', '30 days', '60 days'],
      defaultEnabled: true,
    },
    {
      id: 'relieving-letter-and-doc',
      title: 'Relieving Letter & Doc',
      description: 'Issue the relieving letter and experience documents.',
      settingLabel: 'Issue the letter',
      options: [
        'After clearance is done',
        'On the last day',
        'After settlement',
      ],
      defaultEnabled: true,
    },
  ],
};

const allSteps = [...stepConfig.onboarding, ...stepConfig.offboarding];

const maxChangesShown = 3;

const defaultSettings: ActionSettings = Object.fromEntries(
  allSteps.map(step => [
    step.id,
    { enabled: step.defaultEnabled, value: step.options[0] },
  ])
);

const pluralize = (count: number, singular: string, plural = `${singular}s`) =>
  count === 1 ? singular : plural;

const isEqual = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b);

const getChanges = (saved: ActionSettings, draft: ActionSettings) =>
  allSteps
    .filter(step => !isEqual(saved[step.id], draft[step.id]))
    .map(step => {
      const before = saved[step.id];
      const after = draft[step.id];
      if (before.enabled !== after.enabled) {
        return `${step.title} turned ${after.enabled ? 'on' : 'off'}`;
      }
      return `${step.title} updated`;
    });

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
  const name = `action-toggle-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

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

const ActionSettingsPage = () => {
  const [saved, setSaved] = useState<ActionSettings>(defaultSettings);
  const [draft, setDraft] = useState<ActionSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<TabId>('onboarding');

  const changes = getChanges(saved, draft);
  const hasChanges = changes.length > 0;

  const activeInfo = tabs.find(tab => tab.id === activeTab) ?? tabs[0];
  const activeSteps = stepConfig[activeTab];
  const countOn = (tab: TabId) =>
    stepConfig[tab].filter(step => draft[step.id].enabled).length;
  const allOn = countOn(activeTab) === activeSteps.length;
  const tableData: ActionStepRow[] = activeSteps.map(step => ({
    step,
    rule: draft[step.id],
  }));

  const columns: ColumnDef<ActionStepRow>[] = [
    {
      id: 'step',
      header: 'Step',
      size: 420,
      cell: ({ row }) => (
        <div className="min-w-56 space-y-0.5 py-1">
          <p className="text-sm font-semibold text-foreground">
            {row.original.step.title}
          </p>
          <p className="text-sm text-muted-foreground">
            {row.original.step.description}
          </p>
        </div>
      ),
    },
    {
      id: 'setting',
      header: 'Setting',
      size: 280,
      enableSorting: false,
      cell: ({ row }) => {
        const { step, rule } = row.original;
        return (
          <div className="w-60 max-w-full">
            <FormField
              label={step.settingLabel}
              name={`action-setting-${step.id}`}
              type="select"
              value={rule.value}
              disabled={!rule.enabled}
              onChange={value => updateStep(step.id, { value })}
              options={step.options.map(option => ({
                label: option,
                value: option,
              }))}
            />
          </div>
        );
      },
    },
    {
      id: 'enabled',
      header: 'On / Off',
      size: 150,
      enableSorting: false,
      cell: ({ row }) => {
        const { step, rule } = row.original;
        return (
          <SettingSwitch
            isOn={rule.enabled}
            label={`Turn on ${step.title}`}
            onToggle={() => updateStep(step.id, { enabled: !rule.enabled })}
          />
        );
      },
    },
  ];

  // Warn before leaving the page with unsaved changes.
  useEffect(() => {
    if (!hasChanges) return undefined;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasChanges]);

  const updateStep = (id: string, values: Partial<StepRule>) =>
    setDraft(current => ({
      ...current,
      [id]: { ...current[id], ...values },
    }));

  const setAllInTab = (enabled: boolean) =>
    setDraft(current => {
      const next = { ...current };
      stepConfig[activeTab].forEach(step => {
        next[step.id] = { ...next[step.id], enabled };
      });
      return next;
    });

  const handleSave = () => {
    if (!hasChanges) {
      toast.info('There are no changes to save.');
      return;
    }
    setSaved(draft);
    toast.success('Action settings saved. New actions will follow them.');
  };

  const handleDiscard = () => {
    setDraft(saved);
    toast.success('Unsaved changes discarded.');
  };

  return (
    <>
      <Section title="Action Settings" menuId="actions" showBreadcrumbs>
        <div className="space-y-6">
          {/* Onboarding / Offboarding tabs */}
          <div role="tablist" aria-label="Action type" className="flex gap-2">
            {tabs.map(tab => {
              const isActive = tab.id === activeTab;
              return (
                <Button
                  key={tab.id}
                  type="button"
                  variant="ghost"
                  role="tab"
                  id={`action-tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`action-panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`h-auto min-h-12 rounded-none border-b-[3px] px-5 text-base font-semibold transition-colors ${
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.title}
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                    {countOn(tab.id)}/{stepConfig[tab.id].length}
                  </span>
                </Button>
              );
            })}
          </div>

          <Card
            role="tabpanel"
            id={`action-panel-${activeTab}`}
            aria-labelledby={`action-tab-${activeTab}`}
            className="space-y-2 p-6 md:p-2"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <StepHeading
                number={activeTab === 'onboarding' ? 1 : 2}
                title={`${activeInfo.title} steps`}
                description={activeInfo.subtitle}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setAllInTab(!allOn)}
              >
                {allOn ? 'Turn all off' : 'Turn all on'}
              </Button>
            </div>

            <TanStackTable
              data={tableData}
              columns={columns}
              enableSearch={false}
              showDownload={true}
              enableSorting={false}
              enablePagination={false}
              hideFooter
              getRowId={row => row.step.id}
              emptyMessage={`No ${activeInfo.title.toLowerCase()} steps available.`}
              headerClassName="bg-muted text-foreground"
              bodyClassName="divide-y divide-border"
            />
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

export default ActionSettingsPage;
