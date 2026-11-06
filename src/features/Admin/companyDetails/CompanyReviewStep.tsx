import React, { useEffect, useState } from 'react';
import { Eye, FileText, Info } from 'lucide-react';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CompanyDetails } from '@/types';
import {
  CompanyDocuments,
  ExistingCompanyDocuments,
  fieldLabels,
} from './types';

interface CompanyReviewStepProps {
  details: CompanyDetails;
  documents: CompanyDocuments;
  existingDocuments?: ExistingCompanyDocuments;
  isSubmitting: boolean;
  error: string;
  onBack: () => void;
  onSubmit: () => void;
}

interface PreviewDocument {
  label: string;
  file?: File;
  url?: string;
}

const documentLabels: Record<keyof CompanyDocuments, string> = {
  logo: 'Company logo',
  gstCertificate: 'GST certificate',
  panCard: 'Company PAN card',
  incorporationCertificate: 'Incorporation certificate',
  cinCertificate: 'CIN certificate',
};

const detailSections: {
  title: string;
  fields: (keyof CompanyDetails)[];
}[] = [
  {
    title: 'Business information',
    fields: [
      'companyName',
      'legalName',
      'website',
      'industry',
      'companySize',
      'gstNumber',
      'panNumber',
      'registrationNumber',
      'cinNumber',
    ],
  },
  {
    title: 'Contact information',
    fields: ['companyEmail', 'companyPhone'],
  },
  {
    title: 'Registered address',
    fields: [
      'registeredAddressLine1',
      'registeredAddressLine2',
      'registeredCity',
      'registeredState',
      'registeredCountry',
      'registeredPostalCode',
      'registeredIsPrimary',
    ],
  },
  {
    title: 'Office address',
    fields: [
      'officeAddressLine1',
      'officeAddressLine2',
      'officeCity',
      'officeState',
      'officeCountry',
      'officePostalCode',
      'officeIsPrimary',
    ],
  },
];

const addressFieldLabels: Partial<Record<keyof CompanyDetails, string>> = {
  registeredAddressLine1: 'Address line 1',
  registeredAddressLine2: 'Address line 2',
  registeredCity: 'City',
  registeredState: 'State',
  registeredCountry: 'Country',
  registeredPostalCode: 'Postal code',
  registeredIsPrimary: 'Primary address',
  officeAddressLine1: 'Address line 1',
  officeAddressLine2: 'Address line 2',
  officeCity: 'City',
  officeState: 'State',
  officeCountry: 'Country',
  officePostalCode: 'Postal code',
  officeIsPrimary: 'Primary address',
};

const formatDetailValue = (value: CompanyDetails[keyof CompanyDetails]) => {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return value || '-';
};

/** Step 3: read-only summary and final submit. */
const CompanyReviewStep: React.FC<CompanyReviewStepProps> = ({
  details,
  documents,
  existingDocuments = {},
  isSubmitting,
  error,
  onBack,
  onSubmit,
}) => {
  const [agreed, setAgreed] = useState(false);
  const [agreeError, setAgreeError] = useState(false);
  const [previewDocument, setPreviewDocument] =
    useState<PreviewDocument | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (!previewDocument) {
      setPreviewUrl('');
      return;
    }

    if (!previewDocument.file) {
      setPreviewUrl(previewDocument.url || '');
      return;
    }

    const url = URL.createObjectURL(previewDocument.file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [previewDocument]);

  const handleSubmit = () => {
    if (!agreed) {
      setAgreeError(true);
      return;
    }
    onSubmit();
  };

  const isPdf = Boolean(
    previewDocument?.file?.type === 'application/pdf' ||
      previewDocument?.file?.name.toLowerCase().endsWith('.pdf') ||
      (previewDocument?.url && /\.pdf(?:$|[?#])/i.test(previewDocument.url))
  );

  return (
    <>
      <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 dark:bg-gray-900 sm:p-8">
        <div>
          <h3 className="text-lg font-semibold">Review and submit</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-white/70">
            Check everything once. After you submit, your request goes to the KD
            Public School administrator for approval.
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {detailSections.map(section => (
            <section
              key={section.title}
              className="overflow-hidden rounded-lg border border-border bg-card"
            >
              <div className="border-b border-border bg-muted/50 px-3 py-2">
                <h4 className="text-xs font-bold uppercase tracking-wide text-card-foreground">
                  {section.title}
                </h4>
              </div>
              <dl className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
                {section.fields.map(field => (
                  <div key={field} className="min-w-0 bg-card px-3 py-2">
                    <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      {addressFieldLabels[field] || fieldLabels[field]}
                    </dt>
                    <dd className="mt-0.5 break-words text-xs font-semibold leading-5 text-card-foreground">
                      {formatDetailValue(details[field])}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <h4 className="text-sm font-semibold text-card-foreground">
              Verification documents
            </h4>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {(Object.keys(documentLabels) as (keyof CompanyDocuments)[]).map(
              key => {
                const file = documents[key];
                const existingDocument = existingDocuments[key];
                const hasDocument = Boolean(file || existingDocument?.url);
                const isRejected = Boolean(
                  !file &&
                    existingDocument?.status?.toLowerCase() === 'rejected' &&
                    existingDocument.rejectionReason?.trim()
                );
                const canPreviewExistingImage = Boolean(
                  existingDocument?.url &&
                    !/\.pdf(?:$|[?#])/i.test(existingDocument.url)
                );
                const label = documentLabels[key];
                let documentIconClass = 'bg-muted text-muted-foreground';

                if (isRejected) {
                  documentIconClass = 'bg-red-500/10 text-red-600';
                } else if (hasDocument) {
                  documentIconClass = 'bg-emerald-500/10 text-emerald-600';
                }

                let documentStatusClass = 'text-muted-foreground';
                if (isRejected) {
                  documentStatusClass = 'text-red-600';
                } else if (hasDocument) {
                  documentStatusClass = 'text-emerald-600';
                }

                let documentStatusText = 'Not added';
                if (file) {
                  documentStatusText = file.name;
                } else if (isRejected) {
                  documentStatusText = `Rejected: ${existingDocument?.rejectionReason?.trim()}`;
                } else if (existingDocument?.url) {
                  documentStatusText = 'Current document on file';
                }

                return (
                  <article
                    key={key}
                    className="flex min-w-0 items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-xs"
                  >
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg ${documentIconClass}`}
                    >
                      {!file && canPreviewExistingImage ? (
                        <img
                          src={existingDocument?.url || ''}
                          alt={`${label} preview`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FileText className="h-5 w-5" aria-hidden="true" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-card-foreground">
                        {label}
                      </p>
                      <p
                        className={`mt-0.5 truncate text-xs ${documentStatusClass}`}
                        title={file?.name}
                      >
                        {documentStatusText}
                      </p>
                    </div>
                    {hasDocument && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setPreviewDocument(
                            file
                              ? { file, label }
                              : { url: existingDocument?.url, label }
                          )
                        }
                        aria-label={`Preview ${label}`}
                        title={`Preview ${label}`}
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    )}
                  </article>
                );
              }
            )}
          </div>
        </section>

        <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-4 text-sm text-card-foreground">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Info className="h-4 w-4" aria-hidden="true" />
          </span>
          <span>
            Your account stays in <b>Pending approval</b>. The dashboard menu
            unlocks only after the super admin approves your company.
          </span>
        </div>

        <FormField
          type="checkbox"
          label="I confirm the details and documents are correct and I am authorised to register this organisation on KD Public School."
          name="company-registration-declaration"
          value={agreed}
          onCheckboxChange={checked => {
            setAgreed(checked);
            setAgreeError(false);
          }}
          error={
            agreeError ? 'Please confirm the declaration to submit.' : undefined
          }
        />

        <footer className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="outline" size="lg" onClick={onBack}>
            Edit details
          </Button>
          <Button
            type="button"
            size="lg"
            isLoading={isSubmitting}
            onClick={handleSubmit}
          >
            Submit for approval
          </Button>
        </footer>
      </div>

      <Dialog
        open={previewDocument !== null}
        onOpenChange={open => {
          if (!open) setPreviewDocument(null);
        }}
      >
        <DialogContent
          className="max-h-[90vh] overflow-hidden p-0 sm:max-w-4xl"
          onPointerDownOutside={event => event.preventDefault()}
          onEscapeKeyDown={event => event.preventDefault()}
        >
          <DialogHeader className="border-b border-border px-6 py-5">
            <DialogTitle>{previewDocument?.label}</DialogTitle>
            <DialogDescription className="break-all">
              {previewDocument?.file?.name ||
                previewDocument?.url?.split(/[?#]/)[0].split('/').pop() ||
                'Current document'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex min-h-80 items-center justify-center bg-muted/30 p-4">
            {previewUrl &&
              (isPdf ? (
                <iframe
                  src={previewUrl}
                  title={`${previewDocument?.label} preview`}
                  className="h-[65vh] w-full rounded-lg border border-border bg-background"
                />
              ) : (
                <img
                  src={previewUrl}
                  alt={`${previewDocument?.label} preview`}
                  className="max-h-[65vh] max-w-full rounded-lg object-contain"
                />
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompanyReviewStep;
