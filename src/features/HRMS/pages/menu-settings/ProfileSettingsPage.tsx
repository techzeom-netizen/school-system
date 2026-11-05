import { useEffect, useState } from 'react';
import {
  Award,
  BadgeCheck,
  Box,
  Briefcase,
  CalendarCheck,
  CalendarMinus,
  Check,
  Contact,
  FileText,
  GraduationCap,
  Phone,
  RotateCcw,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import TanStackTable from '@/components/common/TanStackTable';
import { profileReminderFrequencyOptions } from '@/data/reusableDropdownData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type SectionKey =
  | 'work'
  | 'experience'
  | 'attendance'
  | 'leaves'
  | 'payslips'
  | 'assets'
  | 'education'
  | 'contact'
  | 'identity'
  | 'documents'
  | 'acknowledgements';

type RequiredId =
  | 'bank'
  | 'emergency'
  | 'education'
  | 'identity'
  | 'documents'
  | 'experience';

type ReminderFrequency = 'every3days' | 'weekly' | 'monthly';

interface SectionRule {
  show: boolean;
  canEdit: boolean;
}

interface ReminderRules {
  enabled: boolean;
  frequency: ReminderFrequency;
}

interface ProfileSettings {
  sections: Record<SectionKey, SectionRule>;
  required: Record<RequiredId, boolean>;
  reminder: ReminderRules;
}

// Same section list and order as the My Profile page.
const profileSections: {
  key: SectionKey;
  label: string;
  description: string;
  icon: LucideIcon;
  isViewOnly: boolean;
}[] = [
  {
    key: 'work',
    label: 'Work',
    description: 'Job title, department and reporting manager.',
    icon: Briefcase,
    isViewOnly: false,
  },
  {
    key: 'experience',
    label: 'Experience',
    description: 'Past jobs and skills.',
    icon: Award,
    isViewOnly: false,
  },
  {
    key: 'attendance',
    label: 'Attendance',
    description: 'Daily and monthly attendance.',
    icon: CalendarCheck,
    isViewOnly: true,
  },
  {
    key: 'leaves',
    label: 'Leaves',
    description: 'Leave balance and history.',
    icon: CalendarMinus,
    isViewOnly: true,
  },
  {
    key: 'payslips',
    label: 'Payslips',
    description: 'Monthly salary slips.',
    icon: Wallet,
    isViewOnly: true,
  },
  {
    key: 'assets',
    label: 'Assets',
    description: 'Laptop, ID card and other items given.',
    icon: Box,
    isViewOnly: true,
  },
  {
    key: 'education',
    label: 'Education',
    description: 'Degrees and certificates.',
    icon: GraduationCap,
    isViewOnly: false,
  },
  {
    key: 'contact',
    label: 'Contact',
    description: 'Phone, address and emergency contact.',
    icon: Phone,
    isViewOnly: false,
  },
  {
    key: 'identity',
    label: 'Identity',
    description: 'ID proofs such as Aadhaar and PAN.',
    icon: Contact,
    isViewOnly: false,
  },
  {
    key: 'documents',
    label: 'Documents',
    description: 'Uploaded files and letters.',
    icon: FileText,
    isViewOnly: false,
  },
  {
    key: 'acknowledgements',
    label: 'Acknowledgements',
    description: 'Policies the employee has accepted.',
    icon: BadgeCheck,
    isViewOnly: true,
  },
];

type ProfileSection = (typeof profileSections)[number];

const requiredRows: { id: RequiredId; title: string; section: SectionKey }[] = [
  { id: 'bank', title: 'Bank account details', section: 'contact' },
  { id: 'emergency', title: 'Emergency contact', section: 'contact' },
  { id: 'education', title: 'Education details', section: 'education' },
  { id: 'identity', title: 'Identity proof', section: 'identity' },
  { id: 'documents', title: 'Documents upload', section: 'documents' },
  { id: 'experience', title: 'Experience details', section: 'experience' },
];

const frequencyLabels: Record<ReminderFrequency, string> = {
  weekly: 'every week',
  every3days: 'every 3 days',
  monthly: 'every month',
};

const maxChangesShown = 3;

const defaultSettings: ProfileSettings = {
  sections: {
    work: { show: true, canEdit: false },
    experience: { show: true, canEdit: true },
    attendance: { show: true, canEdit: false },
    leaves: { show: true, canEdit: false },
    payslips: { show: true, canEdit: false },
    assets: { show: true, canEdit: false },
    education: { show: true, canEdit: true },
    contact: { show: true, canEdit: true },
    identity: { show: true, canEdit: false },
    documents: { show: true, canEdit: true },
    acknowledgements: { show: true, canEdit: false },
  },
  required: {
    bank: true,
    emergency: true,
    education: false,
    identity: false,
    documents: false,
    experience: false,
  },
  reminder: { enabled: true, frequency: 'weekly' },
};

const pluralize = (count: number, singular: string, plural = `${singular}s`) =>
  count === 1 ? singular : plural;

const isEqual = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b);

const getChanges = (saved: ProfileSettings, draft: ProfileSettings) => [
  ...profileSections
    .filter(row => !isEqual(saved.sections[row.key], draft.sections[row.key]))
    .map(row => {
      const before = saved.sections[row.key];
      const after = draft.sections[row.key];
      if (before.show !== after.show) {
        return `${row.label} ${after.show ? 'shown' : 'hidden'}`;
      }
      return `${row.label} editing ${after.canEdit ? 'allowed' : 'turned off'}`;
    }),
  ...requiredRows
    .filter(row => saved.required[row.id] !== draft.required[row.id])
    .map(
      row =>
        `${row.title} ${draft.required[row.id] ? 'now required' : 'not required'}`
    ),
  ...(saved.reminder.enabled !== draft.reminder.enabled
    ? [`Reminders turned ${draft.reminder.enabled ? 'on' : 'off'}`]
    : []),
  ...(saved.reminder.frequency !== draft.reminder.frequency
    ? [`Reminders set to ${frequencyLabels[draft.reminder.frequency]}`]
    : []),
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
  const name = `profile-toggle-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

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

const ProfileCompletionRing = ({ percent }: { percent: number }) => (
  <div
    className="grid h-14 w-14 shrink-0 place-items-center rounded-full p-1.5"
    style={{
      background: `conic-gradient(hsl(var(--primary)) 0deg ${
        percent * 3.6
      }deg, hsl(var(--muted)) ${percent * 3.6}deg 360deg)`,
    }}
    role="img"
    aria-label={`Example: profile ${percent} percent complete`}
  >
    <span className="grid h-full w-full place-items-center rounded-full bg-background text-xs font-semibold text-primary">
      {percent}%
    </span>
  </div>
);

const ProfileSettingsPage = () => {
  const [saved, setSaved] = useState<ProfileSettings>(defaultSettings);
  const [draft, setDraft] = useState<ProfileSettings>(defaultSettings);

  const { sections, required, reminder } = draft;

  const changes = getChanges(saved, draft);
  const hasChanges = changes.length > 0;
  const shownCount = profileSections.filter(
    row => sections[row.key].show
  ).length;
  const requiredCount = requiredRows.filter(row => required[row.id]).length;

  // Warn before leaving the page with unsaved changes.
  useEffect(() => {
    if (!hasChanges) return undefined;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasChanges]);

  const toggleShow = (key: SectionKey) =>
    setDraft(current => {
      const nextShow = !current.sections[key].show;
      return {
        ...current,
        sections: {
          ...current.sections,
          [key]: { ...current.sections[key], show: nextShow },
        },
        // A hidden section cannot have required items.
        required: nextShow
          ? current.required
          : Object.fromEntries(
              requiredRows.map(row => [
                row.id,
                row.section === key ? false : current.required[row.id],
              ])
            ),
      } as ProfileSettings;
    });

  const toggleEdit = (key: SectionKey) =>
    setDraft(current => ({
      ...current,
      sections: {
        ...current.sections,
        [key]: {
          ...current.sections[key],
          canEdit: !current.sections[key].canEdit,
        },
      },
    }));

  const toggleRequired = (id: RequiredId) =>
    setDraft(current => ({
      ...current,
      required: { ...current.required, [id]: !current.required[id] },
    }));

  const updateReminder = (values: Partial<ReminderRules>) =>
    setDraft(current => ({
      ...current,
      reminder: { ...current.reminder, ...values },
    }));

  const handleSave = () => {
    if (!hasChanges) {
      toast.info('There are no changes to save.');
      return;
    }
    if (shownCount === 0) {
      toast.error('Show at least one section on My Profile.');
      return;
    }
    if (draft.reminder.enabled && requiredCount === 0) {
      toast.error('Pick at least one required item, or turn reminders off.');
      return;
    }
    setSaved(draft);
    toast.success('Profile settings saved. My Profile will use them.');
  };

  const handleDiscard = () => {
    setDraft(saved);
    toast.success('Unsaved changes discarded.');
  };

  const handleResetDefaults = () => {
    setDraft(defaultSettings);
    toast.success('Settings reset to default. Save to apply them.');
  };

  const sectionColumns: ColumnDef<ProfileSection>[] = [
    {
      accessorKey: 'label',
      header: 'Section',
      size: 620,
      cell: ({ row }) => {
        const section = row.original;
        const Icon = section.icon;

        return (
          <div className="flex min-w-64 items-start gap-3 py-1">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-foreground">
                {section.label}
              </p>
              <p className="text-sm text-muted-foreground">
                {section.description}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      id: 'show',
      header: 'Show',
      size: 180,
      enableSorting: false,
      cell: ({ row }) => {
        const section = row.original;
        const rule = sections[section.key];

        return (
          <SettingSwitch
            isOn={rule.show}
            label={`Show ${section.label} on profile`}
            onToggle={() => toggleShow(section.key)}
          />
        );
      },
    },
    {
      id: 'canEdit',
      header: 'Employee can edit',
      size: 220,
      enableSorting: false,
      cell: ({ row }) => {
        const section = row.original;
        const rule = sections[section.key];

        if (section.isViewOnly) {
          return (
            <span className="text-sm text-muted-foreground">View only</span>
          );
        }

        return (
          <SettingSwitch
            isOn={rule.canEdit}
            label={`Employee can edit ${section.label}`}
            disabled={!rule.show}
            onToggle={() => toggleEdit(section.key)}
          />
        );
      },
    },
  ];

  return (
    <>
      <Section
        title="Profile Settings"
        menuId="profile-settings"
        showBreadcrumbs
      >
        <div className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <StepHeading
              number={1}
              title="Profile sections"
              description="Switch off a section to hide it from My Profile."
            />
            <p className="text-sm font-semibold text-muted-foreground">
              {shownCount} of {profileSections.length} sections shown
            </p>
          </div>

          <TanStackTable
            data={profileSections}
            columns={sectionColumns}
            enableSearch={false}
            enableSorting={false}
            showDownload={true}
            getRowId={section => section.key}
            emptyMessage="No profile sections available."
            headerClassName="bg-muted text-foreground"
            bodyClassName="divide-y divide-border"
          />

          <Card className="space-y-4 p-6 md:p-2">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <StepHeading
                number={2}
                title="Profile completion"
                description="Pick what counts towards the completion percentage."
              />
              <div className="flex items-center gap-3">
                <ProfileCompletionRing percent={80} />
                <span className="max-w-[6rem] text-xs text-muted-foreground">
                  Example of what employees see
                </span>
              </div>
            </div>

            <div className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
              {requiredRows.map(row => {
                const isSectionHidden = !sections[row.section].show;
                return (
                  <FormField
                    key={row.id}
                    label={row.title}
                    name={`profile-required-${row.id}`}
                    type="checkbox"
                    value={required[row.id]}
                    className={`min-h-11 ${
                      isSectionHidden ? 'opacity-50' : ''
                    }`}
                    onCheckboxChange={() => toggleRequired(row.id)}
                    disabled={isSectionHidden}
                  />
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-foreground">
                  Remind employees to complete their profile
                </p>
                <p className="text-sm text-muted-foreground">
                  Only sent while required items are missing.
                </p>
              </div>
              <div className="flex flex-wrap items-end gap-4">
                <div className="w-48">
                  <FormField
                    label="Reminder frequency"
                    name="profile-reminder-frequency"
                    type="select"
                    value={reminder.frequency}
                    disabled={!reminder.enabled}
                    onChange={value =>
                      updateReminder({
                        frequency: value as ReminderFrequency,
                      })
                    }
                    options={profileReminderFrequencyOptions}
                  />
                </div>
                <SettingSwitch
                  isOn={reminder.enabled}
                  label="Remind employees to complete their profile"
                  onToggle={() =>
                    updateReminder({ enabled: !reminder.enabled })
                  }
                />
              </div>
            </div>
          </Card>

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
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleResetDefaults}
            >
              <RotateCcw className="w-4 h4" /> Reset to default
            </Button>
            <Button type="button" variant="default" onClick={handleSave}>
              <Contact className="w-4 h-4" />
              Save changes
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
};

export default ProfileSettingsPage;
