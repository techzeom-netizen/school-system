import { useState, type ChangeEvent, type FormEvent } from 'react';
import { FileImage, FileText, Pencil, Plus, Trash2, X } from 'lucide-react';
import Section from '@/components/common/Section';
import FormField from '@/components/common/FormField';
import type { ProfileEditField } from './ProfileEditDialog';
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

type DocumentFieldKey =
  | 'documentName'
  | 'documentType'
  | 'documentReference'
  | 'uploadedDate'
  | 'expiryDate'
  | 'documentFile';

type DocumentRecord = {
  id: string;
  documentName: string;
  documentType: string;
  documentReference: string;
  uploadedDate: string;
  expiryDate: string;
  documentFile: string;
  previewUrl?: string;
  isImage?: boolean;
  fileType?: string;
};

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `doc-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const createEmptyDocument = (): DocumentRecord => ({
  id: createId(),
  documentName: '',
  documentType: '',
  documentReference: '',
  uploadedDate: '',
  expiryDate: '',
  documentFile: '',
  previewUrl: '',
  isImage: false,
  fileType: '',
});

const initialDocuments: DocumentRecord[] = [
  {
    id: createId(),
    documentName: 'Passport',
    documentType: 'Identity Proof',
    documentReference: 'PAS-2024-112',
    uploadedDate: '2024-02-12',
    expiryDate: '2034-02-11',
    documentFile: 'passport-scan.png',
    previewUrl: '',
    isImage: false,
    fileType: '',
  },
];

const documentFields: Array<ProfileEditField & { name: DocumentFieldKey }> = [
  { name: 'documentName', label: 'Document Name' },
  { name: 'documentType', label: 'Document Type' },
  { name: 'documentReference', label: 'Document Reference' },
  { name: 'uploadedDate', label: 'Uploaded Date', type: 'date' },
  { name: 'expiryDate', label: 'Expiry Date', type: 'date' },
  {
    name: 'documentFile',
    label: 'Select Document',
    type: 'file',
    accept: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png',
    colSpan: 2,
  },
];

const isPdfType = (fileType?: string, fileName?: string) => {
  if (fileType === 'application/pdf') return true;
  return Boolean(fileName?.toLowerCase().endsWith('.pdf'));
};

const DocumentDetail = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
      {label}
    </p>
    <p className="mt-1 text-sm text-card-foreground">
      {value || 'Not provided'}
    </p>
  </div>
);

const DocumentsTab = () => {
  const [documents, setDocuments] =
    useState<DocumentRecord[]>(initialDocuments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [draft, setDraft] = useState<DocumentRecord>(createEmptyDocument());
  const [previewDocument, setPreviewDocument] = useState<DocumentRecord | null>(
    null
  );
  const [documentToDelete, setDocumentToDelete] =
    useState<DocumentRecord | null>(null);

  const updateDraft = (name: DocumentFieldKey, value: string) => {
    setDraft(current => ({ ...current, [name]: value }));
  };

  const openAddDialog = () => {
    setDialogMode('add');
    setDraft(createEmptyDocument());
    setIsDialogOpen(true);
  };

  const openEditDialog = (document: DocumentRecord) => {
    setDialogMode('edit');
    setDraft({ ...document });
    setIsDialogOpen(true);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (draft.previewUrl) {
      URL.revokeObjectURL(draft.previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    const isImage = file.type.startsWith('image/');

    setDraft(current => ({
      ...current,
      documentFile: file.name,
      previewUrl: objectUrl,
      isImage,
      fileType: file.type,
    }));

    event.target.value = '';
  };

  const saveDocument = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedDocument: DocumentRecord = {
      ...draft,
      id: draft.id || createId(),
      documentFile: draft.documentFile || 'No file selected',
    };

    if (dialogMode === 'add') {
      setDocuments(current => [normalizedDocument, ...current]);
    } else {
      setDocuments(current =>
        current.map(doc => (doc.id === draft.id ? normalizedDocument : doc))
      );
    }

    setIsDialogOpen(false);
  };

  const confirmDeleteDocument = () => {
    if (!documentToDelete) {
      return;
    }

    if (documentToDelete.previewUrl) {
      URL.revokeObjectURL(documentToDelete.previewUrl);
    }

    setDocuments(current =>
      current.filter(doc => doc.id !== documentToDelete.id)
    );

    setDocumentToDelete(null);
  };

  const canPreview = (document: DocumentRecord) => Boolean(document.previewUrl);

  const isImageDocument = (document: DocumentRecord) =>
    Boolean(document.isImage && document.previewUrl);

  const isPdfDocument = (document: DocumentRecord) =>
    isPdfType(document.fileType, document.documentFile);

  return (
    <>
      <Section title="Documents">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button
              type="button"
              className="w-full shrink-0 sm:w-auto"
              onClick={openAddDialog}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add New Document
            </Button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {documents.map(document => {
            const hasPreview = Boolean(document.previewUrl);
            const isImage = Boolean(document.isImage && document.previewUrl);
            const clickable = canPreview(document);

            return (
              <Card key={document.id} className="bg-muted/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-foreground">
                      {document.documentName || 'Untitled document'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {document.documentType || 'Document type not added'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${document.documentName || 'document'}`}
                      onClick={() => openEditDialog(document)}
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${
                        document.documentName || 'document'
                      }`}
                      onClick={() => setDocumentToDelete(document)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>

                <div
                  className="mt-4 grid gap-3 sm:grid-cols-2"
                  role="group"
                  aria-label="Document details"
                >
                  <DocumentDetail
                    label="Reference"
                    value={document.documentReference}
                  />
                  <DocumentDetail
                    label="Uploaded date"
                    value={document.uploadedDate}
                  />
                  <div className="sm:col-span-2">
                    <DocumentDetail
                      label="Expiry date"
                      value={document.expiryDate}
                    />
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-dashed border-border bg-background p-3">
                  {hasPreview && isImage ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setPreviewDocument(document)}
                      className="h-auto w-full overflow-hidden rounded-md p-0 focus-visible:ring-2 focus-visible:ring-primary"
                      title="Click to preview"
                      aria-label={`Preview ${
                        document.documentName || 'document'
                      }`}
                    >
                      <img
                        src={document.previewUrl}
                        alt={
                          document.documentName || 'Uploaded document preview'
                        }
                        className="h-32 w-full rounded-md object-contain transition hover:opacity-90"
                      />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={!clickable}
                      onClick={() => clickable && setPreviewDocument(document)}
                      className="h-auto w-full justify-start gap-3 p-0 text-left text-sm text-muted-foreground transition enabled:hover:opacity-80 disabled:cursor-default"
                    >
                      {document.previewUrl ? (
                        <FileImage className="h-5 w-5 text-primary" />
                      ) : (
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      )}
                      <span className="truncate">
                        {document.documentFile || 'No uploaded file'}
                      </span>
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="max-h-[85vh] gap-3 overflow-y-auto p-4 sm:max-w-lg sm:p-5"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'add' ? 'Add New Document' : 'Edit Document'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'add'
                ? 'Add a new document record and upload the supporting file.'
                : 'Update the selected document details and file.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={saveDocument} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {documentFields.map(field => {
                const fieldName = field.name as DocumentFieldKey;

                return (
                  <FormField
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    type={field.type ?? 'text'}
                    value={draft[fieldName] ?? ''}
                    onChange={value => updateDraft(fieldName, value)}
                    onFileChange={handleFileChange}
                    placeholder={
                      fieldName === 'documentName'
                        ? 'Enter document name'
                        : undefined
                    }
                    accept={field.accept}
                    previewUrl={
                      fieldName === 'documentFile'
                        ? draft.previewUrl
                        : undefined
                    }
                    colSpan={field.colSpan}
                  />
                );
              })}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {dialogMode === 'add' ? 'Add Document' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={documentToDelete !== null}
        onOpenChange={open => !open && setDocumentToDelete(null)}
      >
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader className="flex-row items-center justify-between gap-3">
            <div>
              <DialogTitle className="text-xl font-semibold">
                Delete Document
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this document? This action
                cannot be undone.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="rounded-md border border-border bg-muted/30 p-4 text-sm">
            <p className="font-medium text-foreground">
              {documentToDelete?.documentName || 'Untitled document'}
            </p>
            <p className="mt-1 text-muted-foreground">
              {documentToDelete?.documentType || 'Document type not added'}
            </p>
            {documentToDelete?.documentFile && (
              <p className="mt-2 truncate text-xs text-muted-foreground">
                File: {documentToDelete.documentFile}
              </p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDocumentToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDeleteDocument}
            >
              Delete Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={previewDocument !== null}
        onOpenChange={open => !open && setPreviewDocument(null)}
      >
        <DialogContent
          className="overflow-hidden p-0"
          style={{ width: '50vw', maxWidth: '90vw' }}
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader className="flex-row items-center justify-between gap-3 border-b border-border px-4 py-3">
            <DialogTitle className="text-base font-semibold">
              {previewDocument?.documentName || 'Document Preview'}
            </DialogTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setPreviewDocument(null)}
              aria-label="Close preview"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </DialogHeader>

          <div
            className="flex items-center justify-center bg-muted/30"
            style={{ height: '70vh' }}
          >
            {previewDocument && isImageDocument(previewDocument) ? (
              <img
                src={previewDocument.previewUrl}
                alt={previewDocument.documentName || 'Document preview'}
                className="max-h-full max-w-full object-contain"
              />
            ) : previewDocument && isPdfDocument(previewDocument) ? (
              <iframe
                src={previewDocument.previewUrl}
                title={previewDocument.documentName || 'PDF preview'}
                className="h-full w-full"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 px-6 text-center">
                <FileText
                  className="h-10 w-10 text-muted-foreground"
                  aria-hidden="true"
                />
                <p className="text-sm text-muted-foreground">
                  Preview isn&apos;t available for this file type. Open it in a
                  new tab to view.
                </p>
                {previewDocument?.previewUrl && (
                  <a
                    href={previewDocument.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary underline"
                  >
                    Open file in new tab
                  </a>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentsTab;
