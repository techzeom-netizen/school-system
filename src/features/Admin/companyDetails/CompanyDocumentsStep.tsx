import React, { useEffect, useState } from 'react';
import { FileText, X } from 'lucide-react';
import { toast } from 'sonner';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CompanyDocuments, ExistingCompanyDocuments } from './types';

interface DocumentPreview {
  url: string;
  label: string;
}

interface CompanyDocumentsStepProps {
  documents: CompanyDocuments;
  existingDocuments?: ExistingCompanyDocuments;
  onChange: (key: keyof CompanyDocuments, file: File | null) => void;
  onBack: () => void;
  onNext: () => void;
}

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED = '.pdf,.jpg,.jpeg,.png';
const ACCEPTED_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png']);

const slots: {
  key: keyof CompanyDocuments;
  label: string;
  hint: string;
  required: boolean;
}[] = [
  {
    key: 'gstCertificate',
    label: 'GST certificate',
    hint: 'PDF, JPG or PNG, up to 5 MB',
    required: true,
  },
  {
    key: 'panCard',
    label: 'Company PAN card',
    hint: 'PDF, JPG or PNG, up to 5 MB',
    required: true,
  },
  {
    key: 'incorporationCertificate',
    label: 'Incorporation/registration certificate',
    hint: 'PDF, JPG or PNG, up to 5 MB',
    required: true,
  },
  {
    key: 'cinCertificate',
    label: 'CIN certificate',
    hint: 'Optional. PDF, JPG or PNG, up to 5 MB',
    required: false,
  },
];

/** Step 2: verification documents. */
const CompanyDocumentsStep: React.FC<CompanyDocumentsStepProps> = ({
  documents,
  existingDocuments = {},
  onChange,
  onBack,
  onNext,
}) => {
  const [error, setError] = useState('');
  const [documentPreview, setDocumentPreview] =
    useState<DocumentPreview | null>(null);
  const [uploadedPreviewUrls, setUploadedPreviewUrls] = useState<
    Partial<Record<keyof CompanyDocuments, string>>
  >({});

  useEffect(() => {
    const previewUrls: Partial<Record<keyof CompanyDocuments, string>> = {};

    (Object.keys(documents) as (keyof CompanyDocuments)[]).forEach(key => {
      const file = documents[key];
      if (file?.type.startsWith('image/')) {
        previewUrls[key] = URL.createObjectURL(file);
      }
    });

    setUploadedPreviewUrls(previewUrls);
    return () => {
      Object.values(previewUrls).forEach(url => URL.revokeObjectURL(url));
    };
  }, [documents]);
  const handleFile = (key: keyof CompanyDocuments, file: File | undefined) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.has(file.type)) {
      setError(`${file.name} must be a PDF, JPG or PNG file.`);
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError(`${file.name} is larger than 5 MB.`);
      return;
    }
    setError('');
    onChange(key, file);
  };

  const handleNext = () => {
    const rejectedDocuments = slots.filter(
      ({ key }) =>
        !documents[key] &&
        existingDocuments[key]?.status?.toLowerCase() === 'rejected'
    );

    if (rejectedDocuments.length > 0) {
      const rejectedLabels = rejectedDocuments
        .map(document => document.label)
        .join(', ');
      const message = `Replace the rejected document${
        rejectedDocuments.length > 1 ? 's' : ''
      } before continuing: ${rejectedLabels}.`;
      setError(message);
      toast.error(message);
      return;
    }

    if (
      (!documents.gstCertificate && !existingDocuments.gstCertificate) ||
      (!documents.panCard && !existingDocuments.panCard) ||
      (!documents.incorporationCertificate &&
        !existingDocuments.incorporationCertificate)
    ) {
      setError(
        'Attach the GST certificate, PAN card, and registration certificate to continue.'
      );
      return;
    }
    setError('');
    onNext();
  };

  const isPreviewPdf = Boolean(
    documentPreview && /\.pdf(?:$|[?#])/i.test(documentPreview.url)
  );

  return (
    <>
      <div className="space-y-6 rounded-xl border border-gray-200 bg-white dark:bg-gray-900  p-6 sm:p-8">
        <div>
          <h3 className="text-lg font-semibold ">Verification documents</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-white/70">
            These help the KD Public School team verify your organisation.
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
          {slots.map(({ key, label, hint, required }) => {
            const file = documents[key];
            const existingDocument = existingDocuments[key];
            const hasDocument = Boolean(file || existingDocument?.url);
            const previewUrl = file
              ? uploadedPreviewUrls[key]
              : existingDocument?.url;
            const existingFileName = existingDocument?.url
              ? decodeURIComponent(
                  existingDocument.url.split(/[?#]/)[0].split('/').pop() ||
                    'Current document'
                )
              : '';
            const isRejected = Boolean(
              !file &&
                existingDocument?.status?.toLowerCase() === 'rejected' &&
                existingDocument.rejectionReason?.trim()
            );
            let documentDescription = hint;
            if (existingDocument?.url) {
              documentDescription =
                'Current document on file — choose a file to replace it';
            }
            if (isRejected) {
              documentDescription = `Rejected: ${existingDocument?.rejectionReason?.trim()}`;
            }
            if (file) {
              documentDescription = file.name;
            }
            let iconBackgroundClass = 'bg-blue-800';
            if (hasDocument) {
              iconBackgroundClass = 'bg-emerald-600';
            }
            if (isRejected) {
              iconBackgroundClass = 'bg-red-600';
            }
            let documentCardClass = 'border-dashed border-gray-300';
            if (hasDocument) {
              documentCardClass =
                'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/90 text-black dark:text-white';
            }
            if (isRejected) {
              documentCardClass =
                'border-red-500 bg-red-50 text-red-950 dark:bg-red-950/30 dark:text-red-100';
            }
            return (
              <div
                key={key}
                className={`flex items-center gap-4 rounded-xl border p-4 ${documentCardClass}`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    iconBackgroundClass
                  }`}
                >
                  <FileText className="h-5 w-5 text-white" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold ">
                    {label}{' '}
                    {required && <span className="text-red-500">*</span>}
                  </p>
                  <p className="mt-1 whitespace-normal break-words text-xs leading-relaxed">
                    {documentDescription}
                  </p>
                </div>
                <div className="relative h-60 w-60">
                  <div className="min-w-0 flex-1">
                    <FormField
                      type="contentFile"
                      label={label}
                      name={key}
                      value={file?.name || existingFileName}
                      accept={ACCEPTED}
                      previewUrl={previewUrl}
                      onImageClick={(url, imageLabel) =>
                        setDocumentPreview({ url, label: imageLabel })
                      }
                      required={required}
                      onFileChange={event => {
                        handleFile(key, event.target.files?.[0]);
                        event.target.value = '';
                      }}
                      className="[&_label]:sr-only"
                    />
                  </div>
                  {file && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="opacity-80 dark:opacity-80 hover:opacity-100 dark:bg-red-500 absolute right-0.5 top-2.5 z-10 !size-4 rounded-none p-0"
                      onClick={() => onChange(key, null)}
                      aria-label={`Remove ${label}`}
                      title={`Remove ${label}`}
                    >
                      <X
                        className="!size-3.5 stroke-[2.5]"
                        aria-hidden="true"
                      />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <Button type="button" variant="outline" size="lg" onClick={onBack}>
            Back
          </Button>
          <Button type="button" size="lg" onClick={handleNext}>
            Review details
          </Button>
        </div>
      </div>

      <Dialog
        open={documentPreview !== null}
        onOpenChange={open => {
          if (!open) setDocumentPreview(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-hidden p-0 sm:max-w-4xl">
          <DialogHeader className="border-b border-border px-6 py-5">
            <DialogTitle>{documentPreview?.label}</DialogTitle>
            <DialogDescription>Document preview</DialogDescription>
          </DialogHeader>
          <div className="flex min-h-80 items-center justify-center bg-muted/30 p-4">
            {documentPreview &&
              (isPreviewPdf ? (
                <iframe
                  src={documentPreview.url}
                  draggable={false}
                  title={`${documentPreview.label} preview`}
                  className="h-[80vh] w-full rounded-lg border border-border bg-background"
                />
              ) : (
                <img
                  src={documentPreview.url}
                  draggable={false}
                  alt={`${documentPreview.label} preview`}
                  className="max-h-[80vh] max-w-full rounded-lg object-contain"
                />
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompanyDocumentsStep;
