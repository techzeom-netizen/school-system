import { type FormEvent, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  ArrowDownToLine,
  Eye,
  FileText,
  ShieldCheck,
  Upload,
  UserRound,
  UserRoundPlus,
  UsersRound,
} from 'lucide-react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { TanStackTable } from '@/components/common';
import { Badge } from '@/components/ui/badge';
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
import {
  companyDocumentAudienceFilterOptions,
  companyDocumentAudienceOptions,
  companyDocumentCategoryFilterOptions,
} from '@/data/reusableDropdownData';

type DocumentAudience =
  | 'All Employees'
  | 'HR Team'
  | 'Management'
  | 'Stakeholders';
type AudienceFilter = 'anyone' | DocumentAudience;

interface CompanyDocument {
  id: string;
  title: string;
  createdAt: string;
  sharedWith: DocumentAudience[];
  validTill: string | null;
  tag: string;
  requiresAcknowledgment: boolean;
  isMine: boolean;
}

const initialDocuments: CompanyDocument[] = [
  {
    id: 'company-it-security',
    title: 'Company IT and Security Policies',
    createdAt: '2026-01-28',
    sharedWith: ['All Employees'],
    validTill: '2026-12-31',
    tag: 'IT Policies',
    requiresAcknowledgment: true,
    isMine: true,
  },
  {
    id: 'employee-handbook',
    title: 'Employee Handbook',
    createdAt: '2025-12-12',
    sharedWith: ['All Employees', 'HR Team'],
    validTill: '2026-12-31',
    tag: 'Company Handbook',
    requiresAcknowledgment: true,
    isMine: true,
  },
  {
    id: 'zero-tolerance',
    title: 'Zero Tolerance Policy',
    createdAt: '2025-12-12',
    sharedWith: ['All Employees'],
    validTill: '2026-12-31',
    tag: 'Compliance',
    requiresAcknowledgment: true,
    isMine: false,
  },
  {
    id: 'exit-policy',
    title: 'Exit Policy',
    createdAt: '2025-12-12',
    sharedWith: ['HR Team', 'Management'],
    validTill: '2026-12-31',
    tag: 'HR Policies',
    requiresAcknowledgment: true,
    isMine: true,
  },
  {
    id: 'whistleblower',
    title: 'Whistleblower Policy',
    createdAt: '2025-12-12',
    sharedWith: ['All Employees'],
    validTill: null,
    tag: 'HR Policies',
    requiresAcknowledgment: false,
    isMine: false,
  },
  {
    id: 'open-door',
    title: 'Open Door Policy',
    createdAt: '2025-12-12',
    sharedWith: ['All Employees', 'Management'],
    validTill: null,
    tag: 'HR Policies',
    requiresAcknowledgment: false,
    isMine: false,
  },
  {
    id: 'dress-code',
    title: 'Dress Code Policy',
    createdAt: '2025-12-12',
    sharedWith: ['All Employees'],
    validTill: '2026-12-31',
    tag: 'HR Policies',
    requiresAcknowledgment: true,
    isMine: false,
  },
  {
    id: 'code-of-conduct',
    title: 'Code of Conduct',
    createdAt: '2025-12-12',
    sharedWith: ['All Employees', 'Stakeholders'],
    validTill: '2026-12-31',
    tag: 'HR Policies',
    requiresAcknowledgment: true,
    isMine: false,
  },
];

const isAudienceFilter = (value: string): value is AudienceFilter =>
  companyDocumentAudienceFilterOptions.some(option => option.value === value);

const isDocumentAudience = (value: string): value is DocumentAudience =>
  companyDocumentAudienceOptions.some(option => option.value === value);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-GB').format(new Date(`${date}T00:00:00`));

const normalizePdfText = (text: string) =>
  text
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[^\x20-\x7E]/g, '');

const escapePdfText = (text: string) =>
  normalizePdfText(text)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');

const wrapPdfLine = (text: string, maxLength: number) => {
  const words = normalizePdfText(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = '';

  words.forEach(word => {
    if (!currentLine) {
      currentLine = word;
      return;
    }

    if (`${currentLine} ${word}`.length <= maxLength) {
      currentLine = `${currentLine} ${word}`;
      return;
    }

    lines.push(currentLine);
    currentLine = word;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.length ? lines : [''];
};

const buildPdf = (title: string, lines: string[]) => {
  const contentLines = [
    'BT',
    '/F1 18 Tf',
    '72 760 Td',
    ...wrapPdfLine(title, 48).flatMap((line, index) => [
      index === 0
        ? `(${escapePdfText(line)}) Tj`
        : `0 -24 Td (${escapePdfText(line)}) Tj`,
    ]),
    '/F1 11 Tf',
    '0 -34 Td',
    ...lines.flatMap(line =>
      wrapPdfLine(line, 78).map(
        wrappedLine => `0 -16 Td (${escapePdfText(wrappedLine)}) Tj`
      )
    ),
    'ET',
  ];
  const content = contentLines.join('\n');
  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    `5 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`,
  ];
  const header = '%PDF-1.4\n';
  const offsets: number[] = [];
  let body = header;

  objects.forEach(object => {
    offsets.push(body.length);
    body += object;
  });

  const xrefOffset = body.length;
  const xref = [
    'xref',
    `0 ${objects.length + 1}`,
    '0000000000 65535 f ',
    ...offsets.map(offset => `${String(offset).padStart(10, '0')} 00000 n `),
    'trailer',
    `<< /Size ${objects.length + 1} /Root 1 0 R >>`,
    'startxref',
    String(xrefOffset),
    '%%EOF',
  ].join('\n');

  return `${body}${xref}`;
};

const downloadDocument = (companyDocument: CompanyDocument) => {
  const fileContent = buildPdf(companyDocument.title, [
    `Created: ${formatDate(companyDocument.createdAt)}`,
    `Shared with: ${companyDocument.sharedWith.join(', ')}`,
    `Valid till: ${companyDocument.validTill ? formatDate(companyDocument.validTill) : 'No expiry'}`,
    `Tag: ${companyDocument.tag}`,
    '',
    'This sample file represents the document download workflow.',
  ]);
  const downloadUrl = URL.createObjectURL(
    new Blob([fileContent], { type: 'application/pdf' })
  );
  const link = document.createElement('a');

  link.href = downloadUrl;
  link.download = `${companyDocument.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
};

const createDocumentColumns = ({
  onPreview,
  onDownload,
  onShare,
}: {
  onPreview: (document: CompanyDocument) => void;
  onDownload: (document: CompanyDocument) => void;
  onShare: (document: CompanyDocument) => void;
}): ColumnDef<CompanyDocument>[] => [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const document = row.original;
      return (
        <div className="flex min-w-64 items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-foreground">{document.title}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Created {formatDate(document.createdAt)}
              </span>
              {document.requiresAcknowledgment && (
                <Badge className="border-transparent bg-accent text-accent-foreground">
                  Requires acknowledgment
                </Badge>
              )}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'sharedWith',
    header: 'Shared with',
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex min-w-32 flex-wrap gap-1.5">
        {row.original.sharedWith.map(audience => (
          <Badge
            key={audience}
            variant="secondary"
            className="border-transparent bg-primary/10 text-primary"
          >
            {audience}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: 'validTill',
    header: 'Valid till',
    cell: ({ getValue }) => {
      const validTill = getValue<string | null>();
      return (
        <span className="whitespace-nowrap text-muted-foreground">
          {validTill ? formatDate(validTill) : 'No expiry'}
        </span>
      );
    },
  },
  {
    accessorKey: 'tag',
    header: 'Tag',
    cell: ({ getValue }) => (
      <Badge
        variant="secondary"
        className="border-transparent bg-secondary text-secondary-foreground"
      >
        {getValue<string>()}
      </Badge>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-8 w-8"
          aria-label={`Preview ${row.original.title}`}
          onClick={() => onPreview(row.original)}
        >
          <Eye className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-8 w-8"
          aria-label={`Download ${row.original.title}`}
          onClick={() => onDownload(row.original)}
        >
          <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-8 w-8"
          aria-label={`Share ${row.original.title}`}
          onClick={() => onShare(row.original)}
        >
          <UserRoundPlus className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    ),
  },
];

const CompanyDocumentsPage = () => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [category, setCategory] = useState('all');
  const [audience, setAudience] = useState<AudienceFilter>('anyone');
  const [newestFirst] = useState(true);
  const [previewDocument, setPreviewDocument] =
    useState<CompanyDocument | null>(null);
  const [shareDocument, setShareDocument] = useState<CompanyDocument | null>(
    null
  );
  const [shareAudience, setShareAudience] =
    useState<DocumentAudience>('All Employees');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadTag, setUploadTag] = useState('HR Policies');
  const [uploadAudience, setUploadAudience] =
    useState<DocumentAudience>('All Employees');
  const [uploadFileName, setUploadFileName] = useState('');

  const categories = useMemo(
    () => [...new Set(documents.map(document => document.tag))].sort(),
    [documents]
  );
  const visibleDocuments = useMemo(() => {
    return documents
      .filter(
        document =>
          (category === 'all' || document.tag === category) &&
          (audience === 'anyone' || document.sharedWith.includes(audience))
      )
      .sort((first, second) =>
        newestFirst
          ? second.createdAt.localeCompare(first.createdAt)
          : first.createdAt.localeCompare(second.createdAt)
      );
  }, [audience, category, documents, newestFirst]);

  const pendingAcknowledgments = documents.filter(
    document => document.requiresAcknowledgment
  ).length;
  const myDocuments = documents.filter(document => document.isMine).length;
  const documentColumns = useMemo(
    () =>
      createDocumentColumns({
        onPreview: setPreviewDocument,
        onDownload: document => {
          downloadDocument(document);
          toast.success(`Downloading "${document.title}".`);
        },
        onShare: document => {
          setShareDocument(document);
          setShareAudience(document.sharedWith[0] ?? 'All Employees');
        },
      }),
    []
  );
  const tagOptions = useMemo(
    () => categories.map(value => ({ value, label: value })),
    [categories]
  );

  const closeUploadDialog = () => {
    setIsUploadOpen(false);
    setUploadTitle('');
    setUploadTag('HR Policies');
    setUploadAudience('All Employees');
    setUploadFileName('');
  };

  const handleUploadDocument = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!uploadTitle.trim() || !uploadFileName) {
      toast.error('Add a document title and choose a file.');
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const newDocument: CompanyDocument = {
      id: `company-document-${Date.now()}`,
      title: uploadTitle.trim(),
      createdAt: today,
      sharedWith: [uploadAudience],
      validTill: null,
      tag: uploadTag,
      requiresAcknowledgment: false,
      isMine: true,
    };

    setDocuments(currentDocuments => [newDocument, ...currentDocuments]);
    closeUploadDialog();
    toast.success(`"${newDocument.title}" uploaded to company documents.`);
  };

  const handleShareDocument = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!shareDocument) return;

    setDocuments(currentDocuments =>
      currentDocuments.map(document => {
        if (document.id !== shareDocument.id) return document;

        return {
          ...document,
          sharedWith: document.sharedWith.includes(shareAudience)
            ? document.sharedWith
            : [...document.sharedWith, shareAudience],
        };
      })
    );
    toast.success(`"${shareDocument.title}" shared with ${shareAudience}.`);
    setShareDocument(null);
  };

  return (
    <>
      <Section
        title="Company Documents"
        menuId="comapny-documents"
        showBreadcrumbs
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Card className="flex items-center gap-3 border-border p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UsersRound className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">Organization</p>
                <p className="text-xl font-semibold text-card-foreground">
                  {documents.length}
                </p>
              </div>
            </Card>
            <Card className="flex items-center gap-3 border-border p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UserRound className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">My Documents</p>
                <p className="text-xl font-semibold text-card-foreground">
                  {myDocuments}
                </p>
              </div>
            </Card>
            <Card className="flex items-center gap-3 border-border p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">
                  Pending Acknowledgments
                </p>
                <p className="text-xl font-semibold text-card-foreground">
                  {pendingAcknowledgments}
                </p>
              </div>
            </Card>
          </div>

          <TanStackTable
            data={visibleDocuments}
            columns={documentColumns}
            enableSearch={false}
            enableColumnVisibility
            enablePagination
            showDownload={true}
            pageSize={8}
            pageSizeOptions={[8, 10, 20]}
            getRowId={document => document.id}
            emptyMessage="No documents match these filters."
            customFilters={
              <div className="flex flex-wrap items-end gap-3">
                <div className="min-w-36">
                  <FormField
                    label="Category"
                    name="document-category"
                    type="select"
                    value={category}
                    onChange={setCategory}
                    options={[
                      ...companyDocumentCategoryFilterOptions,
                      ...categories.map(value => ({ value, label: value })),
                    ]}
                  />
                </div>
                <div className="min-w-40">
                  <FormField
                    label="Shared with"
                    name="document-audience"
                    type="select"
                    value={audience}
                    onChange={value => {
                      if (isAudienceFilter(value)) setAudience(value);
                    }}
                    options={companyDocumentAudienceFilterOptions}
                  />
                </div>

                <Button variant="default" onClick={() => setIsUploadOpen(true)}>
                  <Upload className="w-4 h-4" />
                  Upload File
                </Button>
              </div>
            }
          />
        </div>
      </Section>

      <Dialog
        open={isUploadOpen}
        onOpenChange={open => {
          if (open) {
            setIsUploadOpen(true);
          } else {
            closeUploadDialog();
          }
        }}
      >
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Upload Company Document</DialogTitle>
            <DialogDescription>
              Add a file and decide who can access it.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadDocument} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <FormField
                label="Document title"
                name="company-document-title"
                value={uploadTitle}
                onChange={setUploadTitle}
                placeholder="e.g. Leave Policy"
                required
              />
              <FormField
                label="Category"
                name="company-document-tag"
                type="select"
                value={uploadTag}
                onChange={setUploadTag}
                options={tagOptions}
                required
              />
              <FormField
                label="Share with"
                name="company-document-audience"
                type="select"
                value={uploadAudience}
                onChange={value => {
                  if (isDocumentAudience(value)) setUploadAudience(value);
                }}
                options={companyDocumentAudienceOptions}
                required
              />
              <FormField
                label="Document file"
                name="company-document-file"
                type="file"
                value=""
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                onFileChange={event => {
                  const file = event.currentTarget.files?.[0];
                  setUploadFileName(file?.name ?? '');
                }}
                hint={uploadFileName || 'Choose a policy, handbook, or file.'}
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={closeUploadDialog}
              >
                Cancel
              </Button>
              <Button type="submit">Upload</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(previewDocument)}
        onOpenChange={open => !open && setPreviewDocument(null)}
      >
        <DialogContent
          className="sm:max-w-lg"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{previewDocument?.title}</DialogTitle>
            <DialogDescription>
              Document preview and sharing details.
            </DialogDescription>
          </DialogHeader>

          {previewDocument && (
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">
                      {previewDocument.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      This preview shows the document workflow before connecting
                      real file storage.
                    </p>
                  </div>
                </div>
              </div>

              <div
                role="group"
                aria-label="Document details"
                className="grid gap-3 text-sm sm:grid-cols-2"
              >
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-muted-foreground">
                    {formatDate(previewDocument.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Valid till</p>
                  <p className="text-muted-foreground">
                    {previewDocument.validTill
                      ? formatDate(previewDocument.validTill)
                      : 'No expiry'}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Category</p>
                  <p className="text-muted-foreground">{previewDocument.tag}</p>
                </div>
                <div>
                  <p className="font-medium">Acknowledgment</p>
                  <p className="text-muted-foreground">
                    {previewDocument.requiresAcknowledgment
                      ? 'Required'
                      : 'Not required'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Shared with</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {previewDocument.sharedWith.map(item => (
                    <Badge
                      key={item}
                      variant="secondary"
                      className="border-transparent bg-primary/10 text-primary"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPreviewDocument(null)}
            >
              Close
            </Button>
            {previewDocument && (
              <Button
                type="button"
                onClick={() => {
                  downloadDocument(previewDocument);
                  toast.success(`Downloading "${previewDocument.title}".`);
                }}
              >
                <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
                Download
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(shareDocument)}
        onOpenChange={open => !open && setShareDocument(null)}
      >
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Share Document</DialogTitle>
            <DialogDescription>
              Select the audience that should receive access.
            </DialogDescription>
          </DialogHeader>

          {shareDocument && (
            <form onSubmit={handleShareDocument} className="space-y-4">
              <div className="rounded-lg border border-border p-3">
                <p className="font-medium text-foreground">
                  {shareDocument.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Currently shared with {shareDocument.sharedWith.join(', ')}.
                </p>
              </div>

              <FormField
                label="Share with"
                name="share-document-audience"
                type="select"
                value={shareAudience}
                onChange={value => {
                  if (isDocumentAudience(value)) setShareAudience(value);
                }}
                options={companyDocumentAudienceOptions}
                required
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShareDocument(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">Share</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompanyDocumentsPage;
