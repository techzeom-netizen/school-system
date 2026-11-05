import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Download,
  Eye,
  FileText,
  LockKeyhole,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog';

interface EducationRecord {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  completionYear: string;
  document: File | null;
  documentName: string;
}

const degreeOptions = [
  { value: "Master's Degree", label: "Master's Degree" },
  { value: 'Graduation', label: 'Graduation' },
  { value: '12th / Senior Secondary', label: '12th / Senior Secondary' },
  { value: '10th / Secondary School', label: '10th / Secondary School' },
  { value: 'Diploma', label: 'Diploma' },
  { value: 'Other', label: 'Other' },
];

const initialEducation: EducationRecord[] = [
  {
    id: 'education-1',
    degree: "Master's Degree",
    institution: 'Bhilai Institute of Technology, Durg',
    fieldOfStudy: 'Masters of Computer Application',
    completionYear: '2025',
    document: null,
    documentName:
      'master - Bhilai Institute of Technology, Durg - Supporting Document',
  },
  {
    id: 'education-2',
    degree: 'Graduation',
    institution: 'Disha College',
    fieldOfStudy: 'Bachelor of Computer Application',
    completionYear: '2023',
    document: null,
    documentName: 'bachelor - Disha College - Supporting Document',
  },
  {
    id: 'education-3',
    degree: '12th / Senior Secondary',
    institution: 'Pt. Sundar Lal Sharma H.S School',
    fieldOfStudy: 'PCM',
    completionYear: '2020',
    document: null,
    documentName:
      'senior-school - Pt. Sundar Lal Sharma H.S School - Supporting Document',
  },
  {
    id: 'education-4',
    degree: '10th / Secondary School',
    institution: 'Little Flower Higher Secondary School',
    fieldOfStudy: '',
    completionYear: '2017',
    document: null,
    documentName:
      'high-school - Little Flower Higher Secondary School - Supporting Document',
  },
  {
    id: 'education-5',
    degree: '',
    institution: '',
    fieldOfStudy: '',
    completionYear: '',
    document: null,
    documentName: '',
  },
];

const createEducation = (id: string): EducationRecord => ({
  id,
  degree: '',
  institution: '',
  fieldOfStudy: '',
  completionYear: '',
  document: null,
  documentName: '',
});

const EducationTab = () => {
  const [education, setEducation] = useState(initialEducation);
  const [savedEducation, setSavedEducation] = useState(initialEducation);
  const [pendingApproval, setPendingApproval] = useState(false);
  const [pendingItems, setPendingItems] = useState<string[]>([]);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState('');
  const [documentNotice, setDocumentNotice] = useState('');
  const [passwords, setPasswords] = useState({
    current: '',
    next: '',
    confirm: '',
  });

  const updateEducation = (
    id: string,
    field: keyof EducationRecord,
    value: string | File | null
  ) => {
    setEducation(current =>
      current.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addEducation = () => {
    setEducation(current => [
      ...current,
      createEducation(`education-${Date.now()}`),
    ]);
  };

  const removeEducation = (id: string) => {
    setEducation(current => current.filter(item => item.id !== id));
  };

  const handleFileUpload = (
    id: string,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setEducation(current =>
      current.map(item =>
        item.id === id
          ? { ...item, document: file, documentName: file.name }
          : item
      )
    );
    event.target.value = '';
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const changes = education.flatMap(item => {
      const saved = savedEducation.find(savedItem => savedItem.id === item.id);
      if (!saved) {
        return [
          `${item.degree || 'Education'}${item.institution ? ` at ${item.institution}` : ''} added`,
        ];
      }

      const hasChanges =
        item.degree !== saved.degree ||
        item.institution !== saved.institution ||
        item.fieldOfStudy !== saved.fieldOfStudy ||
        item.completionYear !== saved.completionYear ||
        item.document !== saved.document ||
        item.documentName !== saved.documentName;

      return hasChanges
        ? [
            `${item.degree || 'Education'}${item.institution ? ` at ${item.institution}` : ''} updated`,
          ]
        : [];
    });
    savedEducation.forEach(item => {
      if (!education.some(current => current.id === item.id)) {
        changes.push(
          `${item.degree || 'Education'}${item.institution ? ` at ${item.institution}` : ''} removed`
        );
      }
    });

    setSavedEducation(education);
    setPendingItems(changes);
    setPendingApproval(changes.length > 0);
  };

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (passwords.next !== passwords.confirm) {
      setPasswordNotice('New password and confirmation do not match.');
      return;
    }
    if (!passwords.current || !passwords.next) {
      setPasswordNotice('Enter your current and new password.');
      return;
    }

    setPasswordNotice(
      'Password change is not connected to an account service in this UI.'
    );
    setPasswords({ current: '', next: '', confirm: '' });
  };

  const downloadDocument = (item: EducationRecord) => {
    if (item.document) {
      const url = URL.createObjectURL(item.document);
      const link = document.createElement('a');
      link.href = url;
      link.download = item.document.name;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      return;
    }

    const link = document.createElement('a');
    const sampleDocument = `${item.documentName}\r\nThis is display-only sample data. No supporting document file is attached.`;
    link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(sampleDocument)}`;
    link.download = `${item.degree || 'education'}-sample-supporting-document.txt`;
    link.click();
  };

  const previewDocument = (item: EducationRecord) => {
    if (item.document) {
      const url = URL.createObjectURL(item.document);
      window.open(url, '_blank', 'noopener,noreferrer');
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      return;
    }

    setDocumentNotice(
      'Sample supporting documents are display-only. Upload a file to preview its contents.'
    );
  };

  return (
    <Section title="Education">
      <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="mt-1 text-sm text-muted-foreground">
            Software Engineer · Engineering &amp; Delivery
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
            Employee ID: ZT-10141
          </span>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setPasswordNotice('');
              setPasswordDialogOpen(true);
            }}
          >
            <LockKeyhole className="h-4 w-4" aria-hidden="true" />
            Change Password
          </Button>
          <Button type="submit" form="education-form">
            <Save className="h-4 w-4" aria-hidden="true" />
            Save Changes
          </Button>
        </div>
      </div>

      {pendingApproval && (
        <div
          role="status"
          className="rounded-md border border-border bg-muted/30 p-3 text-sm text-card-foreground"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium">Changes pending HR approval</p>
              <div className="mt-1 space-y-1 text-xs text-muted-foreground">
                {pendingItems.length > 0 ? (
                  pendingItems.map(item => <p key={item}>{item}</p>)
                ) : (
                  <p>No education changes to submit.</p>
                )}
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Dismiss pending approval notice"
              onClick={() => setPendingApproval(false)}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}

      {documentNotice && (
        <div
          role="status"
          className="rounded-md border border-border bg-muted p-3 text-sm text-muted-foreground"
        >
          <div className="flex items-start justify-between gap-3">
            <p>{documentNotice}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Dismiss document message"
              onClick={() => setDocumentNotice('')}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}

      <Section title="Education Background">
        <form id="education-form" onSubmit={handleSave} className="space-y-3">
          {education.map((item, index) => (
            <Card key={item.id} className="min-w-0 p-4 sm:p-5">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-sm font-medium ">Education {index + 1}</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="min-w-0 sm:w-52">
                    <FormField
                      label="Upload Document"
                      name={`${item.id}-document`}
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      value=""
                      onFileChange={event => handleFileUpload(item.id, event)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    aria-label={`Remove education ${index + 1}`}
                    onClick={() => removeEducation(item.id)}
                    className="mt-5"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Remove
                  </Button>
                </div>
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  label="Degree / Level"
                  name={`${item.id}-degree`}
                  type="select"
                  value={item.degree}
                  onChange={value => updateEducation(item.id, 'degree', value)}
                  options={degreeOptions}
                  placeholder="Select education level"
                  required={Boolean(
                    item.institution ||
                      item.fieldOfStudy ||
                      item.completionYear ||
                      item.documentName
                  )}
                />
                <FormField
                  label="Institution"
                  name={`${item.id}-institution`}
                  value={item.institution}
                  onChange={value =>
                    updateEducation(item.id, 'institution', value)
                  }
                  required={Boolean(
                    item.degree ||
                      item.fieldOfStudy ||
                      item.completionYear ||
                      item.documentName
                  )}
                />
                <FormField
                  label="Field of Study"
                  name={`${item.id}-field`}
                  value={item.fieldOfStudy}
                  onChange={value =>
                    updateEducation(item.id, 'fieldOfStudy', value)
                  }
                />
                <FormField
                  label="Completion Year"
                  name={`${item.id}-year`}
                  type="number"
                  value={item.completionYear}
                  onChange={value =>
                    updateEducation(item.id, 'completionYear', value)
                  }
                  min="1900"
                  max="2100"
                />
              </div>

              <div className="mt-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Supporting Documents:
                </p>
                {item.documentName ? (
                  <div className="mt-2 flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 flex-1 items-center gap-2 text-xs text-card-foreground">
                      <FileText
                        className="h-4 w-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span className="break-words">{item.documentName}</span>
                    </div>
                    <div className="flex items-center gap-1 self-end sm:self-auto">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Preview ${item.documentName}`}
                        onClick={() => previewDocument(item)}
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Download ${item.documentName}`}
                        onClick={() => downloadDocument(item)}
                      >
                        <Download className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove ${item.documentName}`}
                        onClick={() => {
                          updateEducation(item.id, 'document', null);
                          updateEducation(item.id, 'documentName', '');
                        }}
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">
                    No supporting documents uploaded
                  </p>
                )}
              </div>
            </Card>
          ))}

          <Button type="button" variant="outline" onClick={addEducation}>
            Add Education
          </Button>
        </form>
      </Section>

      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent
          className="w-[calc(100%-2rem)] gap-0 border-0 bg-transparent p-0 shadow-none sm:max-w-xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <Section
            title="Change Password"
            icon={LockKeyhole}
            className="!rounded-md border-border"
            contentClassName="space-y-4 bg-card p-4 sm:p-6"
          >
            <DialogHeader>
              <DialogDescription>
                Enter your current password and choose a new password.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <FormField
                label="Current Password"
                name="education-current-password"
                type="password"
                value={passwords.current}
                placeholder="Enter Current Password"
                onChange={value =>
                  setPasswords(current => ({ ...current, current: value }))
                }
                required
              />
              <FormField
                label="New Password"
                name="education-new-password"
                type="password"
                value={passwords.next}
                placeholder="Enter Password"
                onChange={value =>
                  setPasswords(current => ({ ...current, next: value }))
                }
                required
              />
              <FormField
                label="Confirm New Password"
                name="education-confirm-password"
                type="password"
                value={passwords.confirm}
                placeholder="Enter Confirm Password"
                onChange={value =>
                  setPasswords(current => ({ ...current, confirm: value }))
                }
                required
              />
              {passwordNotice && (
                <p role="status" className="text-sm text-muted-foreground">
                  {passwordNotice}
                </p>
              )}
              <DialogFooter>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setPasswordDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Password</Button>
              </DialogFooter>
            </form>
          </Section>
        </DialogContent>
      </Dialog>
    </Section>
  );
};

export default EducationTab;
