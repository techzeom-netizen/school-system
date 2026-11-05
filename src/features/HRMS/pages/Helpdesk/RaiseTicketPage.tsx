import {
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from 'react';
import {
  Building2,
  Clock,
  IndianRupee,
  Laptop,
  MoreHorizontal,
  Palmtree,
  Trash2,
  UploadCloud,
  type LucideIcon,
} from 'lucide-react';
import Section from '@/components/common/Section';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type TicketPriority = 'Low' | 'Medium' | 'High';

type CategoryOption = {
  value: string;
  label: string;
  icon: LucideIcon;
};

type TicketDraft = {
  category: string;
  priority: TicketPriority;
  subject: string;
  description: string;
};

const MAX_FILE_SIZE_MB = 3;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_FILES = 5;
const ACCEPTED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'pdf'];

const categories: CategoryOption[] = [
  { value: 'Payroll', label: 'Payroll', icon: IndianRupee },
  { value: 'Leave', label: 'Leave', icon: Palmtree },
  { value: 'Attendance', label: 'Attendance', icon: Clock },
  { value: 'IT Support', label: 'IT Support', icon: Laptop },
  { value: 'Admin', label: 'Admin', icon: Building2 },
  { value: 'Other', label: 'Other', icon: MoreHorizontal },
];

const priorities: TicketPriority[] = ['Low', 'Medium', 'High'];

const responseTimes: Array<{
  priority: TicketPriority;
  time: string;
  dot: string;
}> = [
  { priority: 'High', time: 'Within 4 hours', dot: 'bg-destructive' },
  { priority: 'Medium', time: '1 business day', dot: 'bg-accent-foreground' },
  { priority: 'Low', time: '3 business days', dot: 'bg-muted-foreground' },
];

const createEmptyDraft = (): TicketDraft => ({
  category: categories[0].value,
  priority: 'Medium',
  subject: '',
  description: '',
});

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getExtension = (name: string) =>
  name.split('.').pop()?.toLowerCase() ?? '';

const RaiseTicketTab = () => {
  const [draft, setDraft] = useState<TicketDraft>(createEmptyDraft());
  const [touched, setTouched] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const subjectError =
    touched && !draft.subject.trim() ? 'Please enter a subject.' : undefined;
  const descriptionError =
    touched && !draft.description.trim()
      ? 'Please describe the issue.'
      : undefined;

  const updateDraft = <K extends keyof TicketDraft>(
    key: K,
    value: TicketDraft[K]
  ) => {
    setDraft(current => ({ ...current, [key]: value }));
  };

  const addFiles = (incoming: File[]) => {
    if (incoming.length === 0) return;

    const accepted: File[] = [];

    incoming.forEach(file => {
      if (!ACCEPTED_EXTENSIONS.includes(getExtension(file.name))) {
        toast.error(`${file.name}: only PNG, JPG or PDF files are allowed.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error(`${file.name} is larger than ${MAX_FILE_SIZE_MB} MB.`);
        return;
      }
      accepted.push(file);
    });

    if (accepted.length === 0) return;

    setFiles(current => {
      const merged = [...current];
      accepted.forEach(file => {
        const duplicate = merged.some(
          existing => existing.name === file.name && existing.size === file.size
        );
        if (!duplicate) merged.push(file);
      });

      if (merged.length > MAX_FILES) {
        toast.error(`You can attach up to ${MAX_FILES} files.`);
        return merged.slice(0, MAX_FILES);
      }
      return merged;
    });
  };

  const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(event.target.files ?? []));
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(event.dataTransfer.files));
  };

  const removeFile = (index: number) => {
    setFiles(current => current.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setDraft(createEmptyDraft());
    setFiles([]);
    setTouched(false);
  };

  const submitTicket = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);

    if (!draft.subject.trim() || !draft.description.trim()) {
      toast.error('Please enter a subject and describe the issue.');
      return;
    }

    toast.success('Ticket submitted successfully.');
    resetForm();
  };

  return (
    <>
      <Section title="Raise Ticket" menuId="raise-ticket" showBreadcrumbs>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <form onSubmit={submitTicket} className="space-y-5" noValidate>
            <div role="radiogroup" aria-label="Category" className="space-y-2">
              <p className="text-sm font-medium text-foreground">Category</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {categories.map(category => {
                  const selected = draft.category === category.value;
                  const Icon = category.icon;

                  return (
                    <Button
                      key={category.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      variant="ghost"
                      onClick={() => updateDraft('category', category.value)}
                      className={`h-auto flex items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-primary ${
                        selected
                          ? 'border-primary bg-primary/10 font-medium text-primary'
                          : 'border-border bg-background text-foreground hover:bg-muted/40'
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                          selected
                            ? 'bg-primary/15 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      {category.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Priority</p>
              <div
                role="radiogroup"
                aria-label="Priority"
                className="inline-flex gap-1 rounded-lg bg-muted/50 p-1"
              >
                {priorities.map(priority => {
                  const selected = draft.priority === priority;

                  return (
                    <Button
                      key={priority}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      variant={selected ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => updateDraft('priority', priority)}
                      className="min-w-20"
                    >
                      {priority}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <FormField
                label="Subject"
                name="subject"
                type="text"
                value={draft.subject}
                onChange={value => updateDraft('subject', value)}
                placeholder="e.g. Payslip shows wrong deductions"
              />
              {subjectError && (
                <p className="mt-1 text-xs text-destructive">{subjectError}</p>
              )}
              <FormField
                label="Description"
                name="description"
                type="textarea"
                value={draft.description}
                onChange={value => updateDraft('description', value)}
                rows={5}
                placeholder="Describe the issue with as much detail as you can"
                error={descriptionError}
              />
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">Submit Ticket</Button>
            </div>
          </form>

          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <h3 className="text-sm font-semibold text-foreground">
                Expected response time
              </h3>
              <div className="mt-3 space-y-2" role="list">
                {responseTimes.map(item => (
                  <div
                    key={item.priority}
                    className="flex items-center justify-between text-sm"
                    role="listitem"
                  >
                    <span className="inline-flex items-center gap-2 text-foreground">
                      <span
                        className={`h-2 w-2 rounded-full ${item.dot}`}
                        aria-hidden="true"
                      />
                      {item.priority}
                    </span>
                    <span className="font-semibold text-foreground">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div
                onDragOver={event => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`rounded-lg border border-dashed p-4 text-center transition ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-background'
                }`}
              >
                <UploadCloud
                  className="mx-auto mb-1 h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
                <p className="text-sm text-muted-foreground">
                  Select files below or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG or PDF · up to {MAX_FILE_SIZE_MB} MB each
                </p>
                <FormField
                  label="Upload attachments"
                  name="ticket-attachments"
                  type="file"
                  value=""
                  accept=".png,.jpg,.jpeg,.pdf"
                  onFileChange={handleFileInput}
                  className="text-left"
                />
              </div>

              {files.length > 0 && (
                <div className="space-y-2" role="list">
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${file.size}`}
                      className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/20 px-3 py-2 text-sm"
                      role="listitem"
                    >
                      <span className="min-w-0 truncate text-foreground">
                        {file.name}
                        <span className="ml-2 text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </span>
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0 text-destructive hover:text-destructive"
                        onClick={() => removeFile(index)}
                        aria-label={`Remove ${file.name}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default RaiseTicketTab;
