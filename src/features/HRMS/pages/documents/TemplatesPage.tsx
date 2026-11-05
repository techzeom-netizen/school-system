import {
  type FormEvent,
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowLeft, Check, FileText, Plus } from 'lucide-react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { TanStackTable } from '@/components/common';
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
import { cn } from '@/lib/utils';

type AutoTrigger = 'joins' | 'request-approved' | 'leaves' | 'after-90-days';

interface Template {
  id: string;
  name: string;
  usedCount: number;
  body: string;
  trigger: AutoTrigger | null;
  sendForSignature: boolean;
  emailCopy: boolean;
}

interface Person {
  id: string;
  name: string;
  department: string;
}

type AutoTarget = { type: 'list'; id: string } | { type: 'editor' } | null;

const offerBody = `Offer of Employment

Date: {{Today's date}}

Dear {{Name}},

We are pleased to offer you the position of {{Designation}} in the {{Department}} department, starting on {{Joining date}}.

Your gross salary will be {{Gross salary}} per month.

Sincerely,
HR Team`;

const genericBody = `Date: {{Today's date}}

To whom it may concern,

This is to certify that {{Name}} works as {{Designation}} in the {{Department}} department.

Sincerely,
HR Team`;

const initialTemplates: Template[] = [
  {
    id: 'offer-letter',
    name: 'Offer Letter',
    usedCount: 24,
    body: offerBody,
    trigger: 'joins',
    sendForSignature: true,
    emailCopy: false,
  },
  {
    id: 'salary-certificate',
    name: 'Salary Certificate',
    usedCount: 31,
    body: genericBody,
    trigger: 'request-approved',
    sendForSignature: false,
    emailCopy: true,
  },
  {
    id: 'relieving-letter',
    name: 'Relieving Letter',
    usedCount: 9,
    body: genericBody,
    trigger: 'leaves',
    sendForSignature: true,
    emailCopy: false,
  },
  {
    id: 'experience-letter',
    name: 'Experience Letter',
    usedCount: 18,
    body: genericBody,
    trigger: null,
    sendForSignature: false,
    emailCopy: false,
  },
  {
    id: 'appointment-letter',
    name: 'Appointment Letter',
    usedCount: 14,
    body: offerBody,
    trigger: null,
    sendForSignature: false,
    emailCopy: false,
  },
  {
    id: 'address-proof-letter',
    name: 'Address Proof Letter',
    usedCount: 12,
    body: genericBody,
    trigger: null,
    sendForSignature: false,
    emailCopy: false,
  },
];

const people: Person[] = [
  { id: 'rahul', name: 'Rahul Menon', department: 'Engineering' },
  { id: 'ananya', name: 'Ananya Das', department: 'Finance' },
  { id: 'priya', name: 'Priya Nair', department: 'Finance' },
  { id: 'meera', name: 'Meera S.', department: 'HR' },
  { id: 'jay', name: 'Jay Kapoor', department: 'Engineering' },
  { id: 'karan', name: 'Karan Patel', department: 'Sales' },
];

const triggerOptions: { value: AutoTrigger; label: string }[] = [
  { value: 'joins', label: 'When someone joins' },
  { value: 'request-approved', label: 'When a request is approved' },
  { value: 'leaves', label: 'When someone leaves' },
  { value: 'after-90-days', label: '90 days after someone joins' },
];

const detailChips = [
  'Name',
  'Designation',
  'Department',
  'Joining date',
  'Gross salary',
  "Today's date",
];

const getTriggerLabel = (trigger: AutoTrigger | null) =>
  triggerOptions.find(option => option.value === trigger)?.label ?? '';

const renderLetter = (body: string): ReactNode[] =>
  body.split(/(\{\{[^}]+\}\})/g).map((part, index) =>
    /^\{\{[^}]+\}\}$/.test(part) ? (
      <span
        key={`${part}-${index}`}
        className="rounded bg-primary/10 px-1.5 font-semibold text-primary"
      >
        {part.slice(2, -2)}
      </span>
    ) : (
      <span key={`text-${index}`}>{part}</span>
    )
  );

const createTemplateColumns = ({
  onToggleAuto,
  onCreate,
  onEdit,
}: {
  onToggleAuto: (template: Template, checked: boolean) => void;
  onCreate: (template: Template) => void;
  onEdit: (template: Template) => void;
}): ColumnDef<Template>[] => [
  {
    accessorKey: 'name',
    header: 'Template',
    cell: ({ row }) => (
      <div className="flex min-w-48 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FileText className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">
            Used {row.original.usedCount} times
          </p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'trigger',
    header: 'Create automatically',
    enableSorting: false,
    cell: ({ row }) => (
      <div className="min-w-56 space-y-1">
        <FormField
          label={`Create ${row.original.name} automatically`}
          name={`auto-${row.original.id}`}
          type="toggle"
          value={row.original.trigger !== null}
          onToggleChange={checked => onToggleAuto(row.original, checked)}
          toggleActiveLabel="Automatic"
          toggleInactiveLabel="Not automatic"
        />
        {row.original.trigger && (
          <p className="pl-10 text-xs text-muted-foreground">
            {getTriggerLabel(row.original.trigger)}
          </p>
        )}
      </div>
    ),
  },
  {
    id: 'actions',
    header: 'Action',
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="default"
          aria-label={`Create ${row.original.name} now`}
          onClick={() => onCreate(row.original)}
        >
          Create now
        </Button>
        <Button
          type="button"
          variant="outline"
          aria-label={`Edit ${row.original.name}`}
          onClick={() => onEdit(row.original)}
        >
          Edit
        </Button>
      </div>
    ),
  },
];

const TemplatesPage = () => {
  const [templates, setTemplates] = useState(initialTemplates);
  const [query] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editTrigger, setEditTrigger] = useState<AutoTrigger | null>(null);
  const [editSign, setEditSign] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const [autoTarget, setAutoTarget] = useState<AutoTarget>(null);
  const [autoTrigger, setAutoTrigger] = useState<AutoTrigger>('joins');
  const [autoSign, setAutoSign] = useState(false);
  const [autoEmail, setAutoEmail] = useState(false);

  const [createTemplate, setCreateTemplate] = useState<Template | null>(null);
  const [personSearch, setPersonSearch] = useState('');
  const [createDueDate, setCreateDueDate] = useState('');
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [createSign, setCreateSign] = useState(true);
  const [createSave, setCreateSave] = useState(true);
  const [doneInfo, setDoneInfo] = useState<{
    name: string;
    count: number;
    signed: boolean;
  } | null>(null);

  const visibleTemplates = useMemo(() => {
    const search = query.trim().toLowerCase();

    return templates.filter(
      template => !search || template.name.toLowerCase().includes(search)
    );
  }, [query, templates]);

  const visiblePeople = useMemo(() => {
    const search = personSearch.trim().toLowerCase();

    return people.filter(
      person =>
        !search ||
        person.name.toLowerCase().includes(search) ||
        person.department.toLowerCase().includes(search)
    );
  }, [personSearch]);

  const openAutoDialog = useCallback(
    (
      target: NonNullable<AutoTarget>,
      trigger: AutoTrigger | null,
      sign: boolean,
      email: boolean
    ) => {
      setAutoTarget(target);
      setAutoTrigger(trigger ?? 'joins');
      setAutoSign(sign);
      setAutoEmail(email);
    },
    []
  );

  const handleToggleAuto = useCallback(
    (template: Template, checked: boolean) => {
      if (checked) {
        openAutoDialog(
          { type: 'list', id: template.id },
          template.trigger,
          template.sendForSignature,
          template.emailCopy
        );
        return;
      }

      setTemplates(currentTemplates =>
        currentTemplates.map(item =>
          item.id === template.id ? { ...item, trigger: null } : item
        )
      );
      toast.success(`"${template.name}" is no longer created automatically.`);
    },
    [openAutoDialog]
  );

  const openCreateDialog = useCallback((template: Template) => {
    setCreateTemplate(template);
    setPersonSearch('');
    setCreateDueDate('');
    setSelectedPeople([]);
    setCreateSign(template.sendForSignature);
    setCreateSave(true);
  }, []);

  const openEditor = useCallback((template: Template | null) => {
    setEditingId(template?.id ?? null);
    setEditName(template?.name ?? '');
    setEditBody(template?.body ?? genericBody);
    setEditTrigger(template?.trigger ?? null);
    setEditSign(template?.sendForSignature ?? false);
    setEditEmail(template?.emailCopy ?? false);
    setIsEditing(true);
  }, []);

  const templateColumns = useMemo(
    () =>
      createTemplateColumns({
        onToggleAuto: handleToggleAuto,
        onCreate: openCreateDialog,
        onEdit: openEditor,
      }),
    [handleToggleAuto, openCreateDialog, openEditor]
  );

  const insertDetail = (detail: string) => {
    const token = `{{${detail}}}`;
    const field = bodyRef.current;
    const start = field?.selectionStart ?? editBody.length;
    const end = field?.selectionEnd ?? editBody.length;

    setEditBody(`${editBody.slice(0, start)}${token}${editBody.slice(end)}`);
    window.requestAnimationFrame(() => {
      field?.focus();
      field?.setSelectionRange(start + token.length, start + token.length);
    });
  };

  const handleSaveTemplate = () => {
    if (!editName.trim() || !editBody.trim()) {
      toast.error('Add a template name and the letter text.');
      return;
    }

    const savedFields = {
      name: editName.trim(),
      body: editBody,
      trigger: editTrigger,
      sendForSignature: editSign,
      emailCopy: editEmail,
    };

    if (editingId) {
      setTemplates(currentTemplates =>
        currentTemplates.map(template =>
          template.id === editingId ? { ...template, ...savedFields } : template
        )
      );
    } else {
      setTemplates(currentTemplates => [
        { id: `template-${Date.now()}`, usedCount: 0, ...savedFields },
        ...currentTemplates,
      ]);
    }

    toast.success(`"${savedFields.name}" saved.`);
    setIsEditing(false);
  };

  const closeAutoDialog = () => setAutoTarget(null);

  const handleAutoSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!autoTarget) return;

    if (autoTarget.type === 'editor') {
      setEditTrigger(autoTrigger);
      setEditSign(autoSign);
      setEditEmail(autoEmail);
    } else {
      const targetId = autoTarget.id;

      setTemplates(currentTemplates =>
        currentTemplates.map(template =>
          template.id === targetId
            ? {
                ...template,
                trigger: autoTrigger,
                sendForSignature: autoSign,
                emailCopy: autoEmail,
              }
            : template
        )
      );
    }

    toast.success(
      `Automatic creation turned on: ${getTriggerLabel(autoTrigger).toLowerCase()}.`
    );
    closeAutoDialog();
  };

  const closeCreateDialog = () => setCreateTemplate(null);

  const togglePerson = (id: string, checked: boolean) => {
    setSelectedPeople(current =>
      checked ? [...current, id] : current.filter(item => item !== id)
    );
  };

  const handleCreateDocuments = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!createTemplate) return;

    if (selectedPeople.length === 0) {
      toast.error('Choose at least one person.');
      return;
    }

    const count = selectedPeople.length;

    setTemplates(currentTemplates =>
      currentTemplates.map(template =>
        template.id === createTemplate.id
          ? { ...template, usedCount: template.usedCount + count }
          : template
      )
    );
    setDoneInfo({ name: createTemplate.name, count, signed: createSign });
    closeCreateDialog();
  };

  return (
    <>
      {isEditing ? (
        <Section
          title={editingId ? `Edit ${editName || 'template'}` : 'New template'}
          buttonText="Save template"
          buttonIcon={Check}
          onButtonClick={handleSaveTemplate}
        >
          <div className="space-y-5">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to templates
            </Button>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <Card className="space-y-4 border-border p-5">
                <FormField
                  label="Template name"
                  name="template-name"
                  value={editName}
                  onChange={setEditName}
                  placeholder="e.g. Offer Letter"
                  required
                />
                <FormField
                  ref={bodyRef}
                  label="Letter text"
                  name="template-body"
                  type="textarea"
                  value={editBody}
                  onChange={setEditBody}
                  rows={12}
                />
                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">
                    How it will look
                  </p>
                  <div className="whitespace-pre-wrap rounded-lg bg-muted/50 p-5 text-sm leading-7 text-foreground">
                    {renderLetter(editBody)}
                  </div>
                </div>
              </Card>

              <Card className="space-y-3 self-start border-border p-5">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Add a detail
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Click one to add it to the letter.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {detailChips.map(detail => (
                    <Button
                      key={detail}
                      type="button"
                      size="sm"
                      variant="outline"
                      className="rounded-full border-primary/30 bg-primary/5 text-primary"
                      onClick={() => insertDetail(detail)}
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      {detail}
                    </Button>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="flex flex-wrap items-center gap-4 border-border p-4">
              <FormField
                label="Create this letter automatically"
                name="edit-auto-create"
                type="toggle"
                value={editTrigger !== null}
                onToggleChange={checked => {
                  if (checked) {
                    openAutoDialog(
                      { type: 'editor' },
                      editTrigger,
                      editSign,
                      editEmail
                    );
                  } else {
                    setEditTrigger(null);
                  }
                }}
                toggleActiveLabel="Automatic"
                toggleInactiveLabel="Not automatic"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground">
                  Create this letter automatically
                </p>
                <p className="text-sm text-muted-foreground">
                  {editTrigger ? getTriggerLabel(editTrigger) : 'Not automatic'}
                </p>
              </div>
              {editTrigger && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    openAutoDialog(
                      { type: 'editor' },
                      editTrigger,
                      editSign,
                      editEmail
                    )
                  }
                >
                  Change
                </Button>
              )}
            </Card>
          </div>
        </Section>
      ) : (
        <Section title="Templates & auto-generation">
          <TanStackTable
            data={visibleTemplates}
            columns={templateColumns}
            enableSearch={true}
            customFilters={
              <Button type="button" onClick={() => openEditor(null)} size="lg">
                <Plus className="h-4 w-4" aria-hidden="true" />
                New Template
              </Button>
            }
            enableColumnVisibility={false}
            showDownload={true}
            enablePagination
            pageSize={8}
            pageSizeOptions={[8, 10, 20]}
            getRowId={template => template.id}
            emptyMessage="No templates match your search."
          />
        </Section>
      )}

      <Dialog
        open={Boolean(autoTarget)}
        onOpenChange={open => !open && closeAutoDialog()}
      >
        <DialogContent
          className="sm:max-w-xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Create automatically</DialogTitle>
            <DialogDescription>
              Choose when this letter should be created.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAutoSubmit} className="space-y-5">
            <FormField
              label="When should it be created?"
              name="auto-trigger"
              type="radio"
              value={autoTrigger}
              onChange={value => setAutoTrigger(value as AutoTrigger)}
              options={triggerOptions}
            />

            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Also</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Card className="p-3">
                  <FormField
                    label="Send it for e-signature"
                    name="auto-sign"
                    type="checkbox"
                    value={autoSign}
                    onCheckboxChange={setAutoSign}
                  />
                </Card>
                <Card className="p-3">
                  <FormField
                    label="Email a copy to the employee"
                    name="auto-email"
                    type="checkbox"
                    value={autoEmail}
                    onCheckboxChange={setAutoEmail}
                  />
                </Card>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeAutoDialog}>
                Cancel
              </Button>
              <Button type="submit">Turn on</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(createTemplate)}
        onOpenChange={open => !open && closeCreateDialog()}
      >
        <DialogContent
          className="max-h-[92vh] overflow-y-auto sm:max-w-xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Create {createTemplate?.name}</DialogTitle>
            <DialogDescription>Choose who it is for.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateDocuments} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Search people"
                name="person-search"
                value={personSearch}
                onChange={setPersonSearch}
                placeholder="Name or department"
              />
              <FormField
                label="Signing due date (optional)"
                name="create-due-date"
                type="date"
                value={createDueDate}
                onChange={setCreateDueDate}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">
                People ({selectedPeople.length} selected)
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {visiblePeople.map(person => (
                  <Card
                    key={person.id}
                    className={cn(
                      'p-3 text-sm',
                      selectedPeople.includes(person.id) &&
                        'border-primary bg-primary/5'
                    )}
                  >
                    <FormField
                      label={person.name}
                      name={`person-${person.id}`}
                      type="checkbox"
                      value={selectedPeople.includes(person.id)}
                      onCheckboxChange={checked =>
                        togglePerson(person.id, checked)
                      }
                    />
                    <span className="ml-6 block text-xs text-muted-foreground">
                      {person.department}
                    </span>
                  </Card>
                ))}
              </div>
              {visiblePeople.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No people match your search.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Card className="p-3">
                <FormField
                  label="Send for e-signature"
                  name="create-sign"
                  type="checkbox"
                  value={createSign}
                  onCheckboxChange={setCreateSign}
                />
              </Card>
              <Card className="p-3">
                <FormField
                  label="Save to their documents"
                  name="create-save"
                  type="checkbox"
                  value={createSave}
                  onCheckboxChange={setCreateSave}
                />
              </Card>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeCreateDialog}
              >
                Cancel
              </Button>
              <Button type="submit">
                Create {selectedPeople.length || ''}{' '}
                {selectedPeople.length === 1 ? 'document' : 'documents'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(doneInfo)}
        onOpenChange={open => !open && setDoneInfo(null)}
      >
        <DialogContent
          className="sm:max-w-sm"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader className="items-center text-center sm:text-center">
            <span className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
              <Check className="h-7 w-7" aria-hidden="true" />
            </span>
            <DialogTitle>
              {doneInfo?.count}{' '}
              {doneInfo?.count === 1 ? 'document' : 'documents'} created
            </DialogTitle>
            <DialogDescription>
              {doneInfo?.name} was saved to each employee&apos;s documents
              {doneInfo?.signed ? ' and sent for e-signature' : ''}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-center">
            {/* TODO: link "View documents" to the generated documents page. */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setDoneInfo(null)}
            >
              View documents
            </Button>
            <Button type="button" onClick={() => setDoneInfo(null)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TemplatesPage;
