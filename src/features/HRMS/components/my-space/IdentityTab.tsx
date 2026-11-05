import { useState, type ChangeEvent, type FormEvent } from 'react';
import { LockKeyhole, ShieldCheck, X, FileText } from 'lucide-react';
import Section from '@/components/common/Section';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { showErrorToast, showSuccessToast } from '@/lib/utils';

type IdentityFieldKey =
  | 'uan'
  | 'esiNumber'
  | 'pan'
  | 'aadharCardNumber'
  | 'nationality'
  | 'passportNumber'
  | 'passportValidUntil';

type DocumentKey = 'uan' | 'pan' | 'aadhar' | 'passportImage';

type ActionDialogType = 'password' | null;

type DocumentFile = {
  name: string;
  url: string;
  type: string;
  isImage: boolean;
};

const initialValues: Record<IdentityFieldKey, string> = {
  uan: '',
  esiNumber: '',
  pan: '',
  aadharCardNumber: '',
  nationality: '',
  passportNumber: '',
  passportValidUntil: '',
};

const documentConfigs: Record<DocumentKey, { title: string; accept: string }> =
  {
    uan: {
      title: 'UAN Document',
      accept: '.pdf,.jpg,.jpeg,.png',
    },
    pan: {
      title: 'PAN Document',
      accept: '.pdf,.jpg,.jpeg,.png',
    },
    aadhar: {
      title: 'Aadhaar Card Document',
      accept: '.pdf,.jpg,.jpeg,.png',
    },
    passportImage: {
      title: 'Passport Image Upload',
      accept: 'image/*',
    },
  };

const IdentityTab = () => {
  const [values, setValues] =
    useState<Record<IdentityFieldKey, string>>(initialValues);
  const [documents, setDocuments] = useState<
    Partial<Record<DocumentKey, DocumentFile>>
  >({});
  const [dialogType, setDialogType] = useState<ActionDialogType>(null);
  const [previewDocument, setPreviewDocument] = useState<DocumentFile | null>(
    null
  );
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const updateField = (field: IdentityFieldKey, value: string) => {
    setValues(current => ({ ...current, [field]: value }));
  };

  const handleFileChange = (
    documentKey: DocumentKey,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const previous = documents[documentKey];
    if (previous?.url) {
      URL.revokeObjectURL(previous.url);
    }

    const objectUrl = URL.createObjectURL(file);
    const isImage = file.type.startsWith('image/');

    setDocuments(current => ({
      ...current,
      [documentKey]: {
        name: file.name,
        url: objectUrl,
        type: file.type,
        isImage,
      },
    }));

    event.target.value = '';
  };

  const handlePasswordSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      showErrorToast('Please fill all password fields');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      showErrorToast('Password must be at least 8 characters long');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showErrorToast('Passwords do not match');
      return;
    }

    showSuccessToast('Password changed successfully');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setDialogType(null);
  };

  const handleSaveChanges = () => {
    showSuccessToast('Identity details saved successfully');
  };

  return (
    <>
      <Section title="Identity">
        <div className="space-y-4">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Sr. Software Engineer • Engineering &amp; Delivery
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-md  px-3 py-2 text-sm font-medium text-foreground">
                Employee ID: ABCD001
              </span>
              <Button
                type="button"
                variant="default"
                className="gap-2"
                onClick={() => setDialogType('password')}
              >
                <LockKeyhole className="h-4 w-4" aria-hidden="true" />
                Change Password
              </Button>
              <Button
                type="button"
                className="gap-2"
                variant="default"
                onClick={handleSaveChanges}
              >
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Save Changes
              </Button>
            </div>
          </div>

          <div className="rounded-md border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <h3 className="text-xl font-semibold text-foreground">
                Identity Information
              </h3>
            </div>

            <div className="grid gap-4 p-4 md:grid-cols-3">
              <FormField
                label="UAN (Universal Account Number)"
                name="uan"
                type="text"
                value={values.uan}
                onChange={value => updateField('uan', value)}
                placeholder="Enter UAN number"
              />
              <FormField
                label="ESI Number"
                name="esiNumber"
                type="text"
                value={values.esiNumber}
                onChange={value => updateField('esiNumber', value)}
                placeholder="Enter ESIC insurance number"
              />
              <FormField
                label="PAN (Permanent Account Number)"
                name="pan"
                type="text"
                value={values.pan}
                onChange={value => updateField('pan', value)}
                placeholder="Enter PAN number"
                required
              />
              <FormField
                label="Aadhaar Card Number"
                name="aadharCardNumber"
                type="text"
                value={values.aadharCardNumber}
                onChange={value => updateField('aadharCardNumber', value)}
                placeholder="Enter Aadhaar card number"
                required
              />
              <FormField
                label="Nationality"
                name="nationality"
                type="text"
                value={values.nationality}
                onChange={value => updateField('nationality', value)}
                placeholder="Enter nationality"
                required
              />
              <FormField
                label="Passport Number"
                name="passportNumber"
                type="text"
                value={values.passportNumber}
                onChange={value => updateField('passportNumber', value)}
                placeholder="Enter passport number"
              />
              <FormField
                label="Passport Valid Until"
                name="passportValidUntil"
                type="date"
                value={values.passportValidUntil}
                onChange={value => updateField('passportValidUntil', value)}
                placeholder="mm/dd/yyyy"
              />
            </div>
          </div>

          <div className="rounded-md border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h3 className="text-xl font-semibold text-foreground">
                Identity Documents
              </h3>
            </div>

            <div className="grid gap-4 p-4 md:grid-cols-2">
              {(Object.keys(documentConfigs) as DocumentKey[]).map(
                documentKey => {
                  const config = documentConfigs[documentKey];
                  const doc = documents[documentKey];
                  const isUploaded = Boolean(doc);
                  const documentLabel =
                    documentKey === 'aadhar'
                      ? 'Aadhaar'
                      : documentKey === 'passportImage'
                        ? 'Passport Image'
                        : documentKey.toUpperCase();

                  return (
                    <div
                      key={documentKey}
                      className="flex flex-col gap-3 rounded-md border border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        {isUploaded && doc && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setPreviewDocument(doc)}
                            className="relative h-14 w-14 shrink-0 overflow-hidden p-0"
                            title="Click to preview"
                            aria-label={`Preview ${config.title}`}
                          >
                            {doc.isImage ? (
                              <img
                                src={doc.url}
                                alt={config.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <FileText
                                className="h-6 w-6 text-muted-foreground"
                                aria-hidden="true"
                              />
                            )}
                          </Button>
                        )}

                        <div className="min-w-0">
                          <p className="text-base font-medium text-foreground">
                            {config.title}
                          </p>
                          <p className="mt-1 truncate text-sm text-muted-foreground">
                            {isUploaded && doc
                              ? `Uploaded supporting document for ${documentLabel}: ${doc.name}`
                              : `Upload supporting document for ${documentLabel}: Not provided`}
                          </p>
                        </div>
                      </div>

                      <div className="w-full sm:max-w-xs">
                        <FormField
                          label={
                            isUploaded
                              ? `Replace ${config.title}`
                              : `Upload ${config.title}`
                          }
                          name={`identity-document-${documentKey}`}
                          type="file"
                          value={doc?.name ?? ''}
                          accept={config.accept}
                          onFileChange={event =>
                            handleFileChange(documentKey, event)
                          }
                          previewUrl={doc?.isImage ? doc.url : undefined}
                          onImageClick={() => doc && setPreviewDocument(doc)}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>

        <Dialog
          open={dialogType !== null}
          onOpenChange={open => !open && setDialogType(null)}
        >
          <DialogContent
            className="sm:max-w-md"
            onInteractOutside={event => event.preventDefault()}
          >
            <DialogHeader className="flex-row items-center justify-between gap-3">
              <div>
                <DialogTitle className="text-xl font-semibold">
                  Change Password
                </DialogTitle>
                <DialogDescription>
                  Enter your current password and choose a new password.
                </DialogDescription>
              </div>
            </DialogHeader>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <FormField
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={value =>
                  setPasswordForm(current => ({
                    ...current,
                    currentPassword: value,
                  }))
                }
                placeholder="Enter your current password"
              />
              <FormField
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={value =>
                  setPasswordForm(current => ({
                    ...current,
                    newPassword: value,
                  }))
                }
                placeholder="Enter your new password"
              />
              <FormField
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={value =>
                  setPasswordForm(current => ({
                    ...current,
                    confirmPassword: value,
                  }))
                }
                placeholder="Confirm your new password"
              />

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setDialogType(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">Change Password</Button>
              </DialogFooter>
            </form>
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
                Document Preview
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
              {previewDocument?.isImage ? (
                <img
                  src={previewDocument.url}
                  alt={previewDocument.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <iframe
                  src={previewDocument?.url}
                  title={previewDocument?.name}
                  className="h-full w-full"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </Section>
    </>
  );
};

export default IdentityTab;
