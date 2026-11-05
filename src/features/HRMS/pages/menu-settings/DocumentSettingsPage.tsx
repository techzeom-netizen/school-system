import { type ReactNode, useEffect, useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import {
  documentExpiryOptions,
  documentFileSizeOptions,
  documentHandlerOptions,
  documentReminderOptions,
  documentReplyOptions,
  documentReviewerOptions,
  documentViewerOptions,
  type DropdownOption,
} from '@/data/reusableDropdownData';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type ViewerOption = 'all' | 'managersHr' | 'hrOnly';
type FileSizeOption = '5' | '10' | '25';
type ReviewerOption = 'hr' | 'manager' | 'none';
type ReminderOption = 'daily' | 'every3days' | 'weekly';
type ExpiryOption = '3' | '7' | '14' | '30';
type HandlerOption = 'hr' | 'manager' | 'finance';
type ReplyOption = '1' | '2' | '5';

interface CompanyDocumentRules {
  viewer: ViewerOption;
  allowDownload: boolean;
  maxFileSize: FileSizeOption;
}

interface TemplateRules {
  autoGenerate: boolean;
  reviewer: ReviewerOption;
  emailLetter: boolean;
}

interface ESignatureRules {
  required: boolean;
  reminder: ReminderOption;
  expiryDays: ExpiryOption;
}

interface RequestRules {
  allowRequests: boolean;
  handler: HandlerOption;
  replyWithinDays: ReplyOption;
}

interface DocumentSettings {
  company: CompanyDocumentRules;
  templates: TemplateRules;
  eSignature: ESignatureRules;
  requests: RequestRules;
}

const companyLabels: Record<keyof CompanyDocumentRules, string> = {
  viewer: 'document access',
  allowDownload: 'downloads',
  maxFileSize: 'file size limit',
};

const templateLabels: Record<keyof TemplateRules, string> = {
  autoGenerate: 'auto-generation',
  reviewer: 'letter check',
  emailLetter: 'letter email',
};

const eSignatureLabels: Record<keyof ESignatureRules, string> = {
  required: 'e-signature',
  reminder: 'signature reminder',
  expiryDays: 'signing link expiry',
};

const requestLabels: Record<keyof RequestRules, string> = {
  allowRequests: 'document requests',
  handler: 'request handler',
  replyWithinDays: 'reply time',
};

const maxChangesShown = 3;

const defaultSettings: DocumentSettings = {
  company: {
    viewer: 'all',
    allowDownload: true,
    maxFileSize: '10',
  },
  templates: {
    autoGenerate: true,
    reviewer: 'hr',
    emailLetter: true,
  },
  eSignature: {
    required: true,
    reminder: 'every3days',
    expiryDays: '7',
  },
  requests: {
    allowRequests: true,
    handler: 'hr',
    replyWithinDays: '2',
  },
};

const pluralize = (count: number, singular: string, plural = `${singular}s`) =>
  count === 1 ? singular : plural;

const isEqual = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b);

const collectChanges = <T extends object>(
  saved: T,
  draft: T,
  labels: Record<keyof T, string>
) =>
  (Object.keys(labels) as (keyof T)[])
    .filter(key => !isEqual(saved[key], draft[key]))
    .map(key => `${labels[key]} updated`);

const getChanges = (saved: DocumentSettings, draft: DocumentSettings) => [
  ...collectChanges(saved.company, draft.company, companyLabels),
  ...collectChanges(saved.templates, draft.templates, templateLabels),
  ...collectChanges(saved.eSignature, draft.eSignature, eSignatureLabels),
  ...collectChanges(saved.requests, draft.requests, requestLabels),
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
  const name = `document-toggle-${label
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

const SettingSelect = <T extends string>({
  label,
  value,
  options,
  disabled = false,
  onChange,
}: {
  label: string;
  value: T;
  options: DropdownOption[];
  disabled?: boolean;
  onChange: (value: T) => void;
}) => {
  const name = `document-select-${label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')}`;

  return (
    <FormField
      label={label}
      name={name}
      type="select"
      value={value}
      disabled={disabled}
      onChange={selectedValue => onChange(selectedValue as T)}
      options={options}
      className="w-56 [&>label]:sr-only"
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

const DocumentSettingsPage = () => {
  const [saved, setSaved] = useState(defaultSettings);
  const [draft, setDraft] = useState(defaultSettings);

  const { company, templates, eSignature, requests } = draft;

  const changes = getChanges(saved, draft);
  const hasChanges = changes.length > 0;

  // Warn before leaving the page with unsaved changes.
  useEffect(() => {
    if (!hasChanges) return undefined;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasChanges]);

  const updateCompany = (values: Partial<CompanyDocumentRules>) =>
    setDraft(current => ({
      ...current,
      company: { ...current.company, ...values },
    }));

  const updateTemplates = (values: Partial<TemplateRules>) =>
    setDraft(current => ({
      ...current,
      templates: { ...current.templates, ...values },
    }));

  const updateESignature = (values: Partial<ESignatureRules>) =>
    setDraft(current => ({
      ...current,
      eSignature: { ...current.eSignature, ...values },
    }));

  const updateRequests = (values: Partial<RequestRules>) =>
    setDraft(current => ({
      ...current,
      requests: { ...current.requests, ...values },
    }));

  const handleSave = () => {
    if (!hasChanges) {
      toast.info('There are no changes to save.');
      return;
    }
    setSaved(draft);
    toast.success('Document settings saved. New documents will follow them.');
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
      <Section
        title="Document Settings"
        menuId="document-settings"
        showBreadcrumbs
      >
        <div className="space-y-6">
          <Card className="space-y-2 p-6 md:p-8">
            <StepHeading
              number={1}
              title="Company Documents"
              description="Policies, forms and files you share with employees."
            />
            <div className="divide-y divide-border">
              <SettingRow
                title="Who can see company documents"
                description="Choose who can open the document library."
              >
                <SettingSelect
                  label="Who can see company documents"
                  value={company.viewer}
                  options={documentViewerOptions}
                  onChange={viewer => updateCompany({ viewer })}
                />
              </SettingRow>

              <SettingRow
                title="Employees can download files"
                description="Switch off to allow viewing only."
              >
                <SettingSwitch
                  isOn={company.allowDownload}
                  label="Employees can download files"
                  onToggle={() =>
                    updateCompany({ allowDownload: !company.allowDownload })
                  }
                />
              </SettingRow>

              <SettingRow
                title="Largest file you can upload"
                description="Files bigger than this are not accepted."
              >
                <SettingSelect
                  label="Largest file size"
                  value={company.maxFileSize}
                  options={documentFileSizeOptions}
                  onChange={maxFileSize => updateCompany({ maxFileSize })}
                />
              </SettingRow>
            </div>
          </Card>

          <Card className="space-y-2 p-6 md:p-8">
            <StepHeading
              number={2}
              title="Templates & Auto-generation"
              description="Letters that are created for you, such as offer and relieving letters."
            />
            <div className="divide-y divide-border">
              <SettingRow
                title="Create letters automatically"
                description="Made when a candidate is hired or an employee leaves."
              >
                <SettingSwitch
                  isOn={templates.autoGenerate}
                  label="Create letters automatically"
                  onToggle={() =>
                    updateTemplates({ autoGenerate: !templates.autoGenerate })
                  }
                />
              </SettingRow>

              <SettingRow
                title="Check before sending"
                description="Someone reviews each letter first."
                isDimmed={!templates.autoGenerate}
              >
                <SettingSelect
                  label="Who checks before sending"
                  value={templates.reviewer}
                  options={documentReviewerOptions}
                  disabled={!templates.autoGenerate}
                  onChange={reviewer => updateTemplates({ reviewer })}
                />
              </SettingRow>

              <SettingRow
                title="Email the letter to the employee"
                description="Sent as soon as the letter is ready."
                isDimmed={!templates.autoGenerate}
              >
                <SettingSwitch
                  isOn={templates.emailLetter}
                  label="Email the letter to the employee"
                  disabled={!templates.autoGenerate}
                  onToggle={() =>
                    updateTemplates({ emailLetter: !templates.emailLetter })
                  }
                />
              </SettingRow>
            </div>
          </Card>

          <Card className="space-y-2 p-6 md:p-8">
            <StepHeading
              number={3}
              title="E-Signature"
              description="Let people sign documents online."
            />
            <div className="divide-y divide-border">
              <SettingRow
                title="Ask for e-signature on letters"
                description="Employees sign online instead of on paper."
              >
                <SettingSwitch
                  isOn={eSignature.required}
                  label="Ask for e-signature on letters"
                  onToggle={() =>
                    updateESignature({ required: !eSignature.required })
                  }
                />
              </SettingRow>

              <SettingRow
                title="Remind people who have not signed"
                description="Sent until the document is signed."
                isDimmed={!eSignature.required}
              >
                <SettingSelect
                  label="Signature reminder"
                  value={eSignature.reminder}
                  options={documentReminderOptions}
                  disabled={!eSignature.required}
                  onChange={reminder => updateESignature({ reminder })}
                />
              </SettingRow>

              <SettingRow
                title="Signing link works for"
                description="After this the link stops working."
                isDimmed={!eSignature.required}
              >
                <SettingSelect
                  label="Signing link expiry"
                  value={eSignature.expiryDays}
                  options={documentExpiryOptions}
                  disabled={!eSignature.required}
                  onChange={expiryDays => updateESignature({ expiryDays })}
                />
              </SettingRow>
            </div>
          </Card>

          <Card className="space-y-2 p-6 md:p-8">
            <StepHeading
              number={4}
              title="Document Requests"
              description="Employees ask for documents such as experience or salary letters."
            />
            <div className="divide-y divide-border">
              <SettingRow
                title="Employees can request documents"
                description="Switch off to stop all new requests."
              >
                <SettingSwitch
                  isOn={requests.allowRequests}
                  label="Employees can request documents"
                  onToggle={() =>
                    updateRequests({ allowRequests: !requests.allowRequests })
                  }
                />
              </SettingRow>

              <SettingRow
                title="Who handles requests"
                description="This person approves and uploads the file."
                isDimmed={!requests.allowRequests}
              >
                <SettingSelect
                  label="Who handles requests"
                  value={requests.handler}
                  options={documentHandlerOptions}
                  disabled={!requests.allowRequests}
                  onChange={handler => updateRequests({ handler })}
                />
              </SettingRow>

              <SettingRow
                title="Reply within"
                description="Get an alert if a request waits longer."
                isDimmed={!requests.allowRequests}
              >
                <SettingSelect
                  label="Reply time"
                  value={requests.replyWithinDays}
                  options={documentReplyOptions}
                  disabled={!requests.allowRequests}
                  onChange={replyWithinDays =>
                    updateRequests({ replyWithinDays })
                  }
                />
              </SettingRow>
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
              <Check className="w-4 h-4" />
              Save changes
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
};

export default DocumentSettingsPage;
