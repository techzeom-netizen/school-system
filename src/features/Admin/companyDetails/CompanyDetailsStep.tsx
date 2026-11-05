import React, { useEffect, useState } from 'react';
import { CheckCircle2, FileText } from 'lucide-react';
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
import { CompanyDetails } from '@/types';
import { CompanyDocuments } from './types';
import { CompanyErrors, validateCompanyDetails } from './validation';

interface CompanyDetailsStepProps {
  details: CompanyDetails;
  documents: CompanyDocuments;
  existingLogoUrl?: string;
  rejectionReasons?: string[];
  onChange: <K extends keyof CompanyDetails>(
    field: K,
    value: CompanyDetails[K]
  ) => void;
  onDocumentChange: (key: keyof CompanyDocuments, file: File | null) => void;
  onNext: () => void;
}

const registeredToOfficeField: Partial<
  Record<keyof CompanyDetails, keyof CompanyDetails>
> = {
  registeredAddressLine1: 'officeAddressLine1',
  registeredAddressLine2: 'officeAddressLine2',
  registeredCity: 'officeCity',
  registeredState: 'officeState',
  registeredCountry: 'officeCountry',
  registeredPostalCode: 'officePostalCode',
};

/** Step 1: business + contact information. */
const CompanyDetailsStep: React.FC<CompanyDetailsStepProps> = ({
  details,
  documents,
  existingLogoUrl = '',
  rejectionReasons = [],
  onChange,
  onDocumentChange,
  onNext,
}) => {
  const [errors, setErrors] = useState<CompanyErrors>({});
  const [logoPreviewUrl, setLogoPreviewUrl] = useState('');
  const [isLogoPreviewOpen, setIsLogoPreviewOpen] = useState(false);
  const [sameAsRegisteredAddress, setSameAsRegisteredAddress] = useState(false);

  useEffect(() => {
    if (!documents.logo) {
      setLogoPreviewUrl('');
      setIsLogoPreviewOpen(false);
      return;
    }

    const url = URL.createObjectURL(documents.logo);
    setLogoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [documents.logo]);

  useEffect(() => {
    const hasRegisteredAddress = Boolean(
      details.registeredAddressLine1.trim() ||
        details.registeredCity.trim() ||
        details.registeredPostalCode.trim()
    );
    const addressesMatch =
      hasRegisteredAddress &&
      details.registeredAddressLine1.trim() ===
        details.officeAddressLine1.trim() &&
      details.registeredAddressLine2.trim() ===
        details.officeAddressLine2.trim() &&
      details.registeredCity.trim() === details.officeCity.trim() &&
      details.registeredState.trim() === details.officeState.trim() &&
      details.registeredCountry.trim() === details.officeCountry.trim() &&
      details.registeredPostalCode.trim() === details.officePostalCode.trim();

    if (addressesMatch) setSameAsRegisteredAddress(true);
  }, [
    details.officeAddressLine1,
    details.officeAddressLine2,
    details.officeCity,
    details.officeCountry,
    details.officePostalCode,
    details.officeState,
    details.registeredAddressLine1,
    details.registeredAddressLine2,
    details.registeredCity,
    details.registeredCountry,
    details.registeredPostalCode,
    details.registeredState,
  ]);

  const update = <K extends keyof CompanyDetails>(
    field: K,
    value: CompanyDetails[K]
  ) => {
    onChange(field, value);
    const officeField = registeredToOfficeField[field];

    if (sameAsRegisteredAddress && officeField) {
      onChange(officeField, value);
    }

    if (errors[field] || (officeField && errors[officeField])) {
      setErrors(previous => ({
        ...previous,
        [field]: undefined,
        ...(officeField ? { [officeField]: undefined } : {}),
      }));
    }
  };

  const handleSameAddressChange = (checked: boolean) => {
    setSameAsRegisteredAddress(checked);
    if (!checked) return;

    onChange('officeAddressLine1', details.registeredAddressLine1);
    onChange('officeAddressLine2', details.registeredAddressLine2);
    onChange('officeCity', details.registeredCity);
    onChange('officeState', details.registeredState);
    onChange('officeCountry', details.registeredCountry);
    onChange('officePostalCode', details.registeredPostalCode);
    setErrors(previous => ({
      ...previous,
      officeAddressLine1: undefined,
      officeAddressLine2: undefined,
      officeCity: undefined,
      officeState: undefined,
      officeCountry: undefined,
      officePostalCode: undefined,
    }));
  };

  const handleRegisteredPrimaryChange = (checked: boolean) => {
    if (checked) {
      onChange('officeIsPrimary', false);
    }

    update('registeredIsPrimary', checked);
  };

  const handleOfficePrimaryChange = (checked: boolean) => {
    if (checked) {
      onChange('registeredIsPrimary', false);
    }

    update('officeIsPrimary', checked);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!details.registeredIsPrimary && !details.officeIsPrimary) {
      toast.error('Select either the registered or office address as primary.');
      return;
    }

    if (details.registeredIsPrimary && details.officeIsPrimary) {
      toast.error('Only one address can be selected as primary.');
      return;
    }

    const found = validateCompanyDetails(details);
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;
    onNext();
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const displayedLogoUrl = logoPreviewUrl || existingLogoUrl;
  const existingLogoName = existingLogoUrl
    ? decodeURIComponent(
        existingLogoUrl.split(/[?#]/)[0].split('/').pop() || 'Company logo'
      )
    : '';

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 rounded-xl border bg-white dark:bg-gray-900 border-gray-200  p-6 sm:p-8"
    >
      {rejectionReasons.length > 0 ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-semibold">Rejection reasons</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {rejectionReasons.map(reason => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Once approved you get full access <b>and the free HRMS</b> for your
            employees.
          </span>
        </div>
      )}

      {hasErrors && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Please fix the highlighted fields.
        </div>
      )}

      <section>
        <h3 className="mb-4 py-2 text-lg font-semibold text-gray-900 dark:text-white">
          Business information
        </h3>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4">
          <FormField
            label="Company name"
            name="name"
            value={details.companyName}
            onChange={value => update('companyName', value)}
            error={errors.companyName}
            required
            placeholder="Enter company name"
          />
          <FormField
            label="Legal name"
            name="legalName"
            value={details.legalName}
            onChange={value => update('legalName', value)}
            error={errors.legalName}
            required
            placeholder="Enter registered legal name"
          />
          <FormField
            type="url"
            label="Website"
            name="website"
            value={details.website}
            onChange={value => update('website', value)}
            error={errors.website}
            placeholder="https://example.com"
          />
          <FormField
            label="Industry"
            name="industry"
            value={details.industry}
            onChange={value => update('industry', value)}
            error={errors.industry}
            required
            placeholder="e.g. Information Technology"
          />
          <FormField
            type="select"
            label="Company size"
            name="companySize"
            value={details.companySize}
            onChange={value => update('companySize', value)}
            error={errors.companySize}
            required
            placeholder="select company size"
            options={[
              { value: '1-10', label: '1-10 employees' },
              { value: '11-50', label: '11-50 employees' },
              { value: '51-200', label: '51-200 employees' },
              { value: '201-500', label: '201-500 employees' },
              { value: '501-1000', label: '501-1,000 employees' },
              { value: '1001+', label: '1,001+ employees' },
            ]}
          />
          <FormField
            label="CIN number"
            name="cinNumber"
            value={details.cinNumber}
            onChange={value => update('cinNumber', value.toUpperCase())}
            error={errors.cinNumber}
            maxLength={21}
            placeholder="Enter CIN number"
          />
          <FormField
            label="Company registration number"
            name="registrationNumber"
            value={details.registrationNumber}
            onChange={value => update('registrationNumber', value)}
            error={errors.registrationNumber}
            required
            minLength={6}
            maxLength={21}
            pattern="[A-Za-z0-9]{6,21}"
            placeholder="Enter registration number"
          />
          <FormField
            label="GST number"
            name="gstNumber"
            value={details.gstNumber}
            onChange={value => update('gstNumber', value.toUpperCase())}
            error={errors.gstNumber}
            required
            maxLength={15}
            placeholder="Enter GST number"
          />
          <FormField
            label="PAN number"
            name="panNumber"
            value={details.panNumber}
            onChange={value => update('panNumber', value.toUpperCase())}
            error={errors.panNumber}
            required
            maxLength={10}
            placeholder="Enter PAN number"
          />

          <div>
            <FormField
              type="file"
              label="Company logo"
              name="logo"
              value={documents.logo?.name || existingLogoName}
              accept="image/jpeg,image/png,image/webp"
              onFileChange={event =>
                onDocumentChange('logo', event.target.files?.[0] ?? null)
              }
            />
            {displayedLogoUrl && (
              <Button
                type="button"
                variant="outline"
                size="xs"
                className="mt-2"
                onClick={() => setIsLogoPreviewOpen(true)}
                aria-label="Preview company logo"
              >
                <FileText className="size-4" aria-hidden="true" />
                Preview logo
              </Button>
            )}
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-4 py-2 text-lg font-semibold text-gray-900 dark:text-white">
          Contact information
        </h3>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <FormField
            type="email"
            label="Company email"
            name="companyEmail"
            value={details.companyEmail}
            onChange={value => update('companyEmail', value)}
            error={errors.companyEmail}
            required
            placeholder="company@example.com"
          />
          <FormField
            type="tel"
            label="Company phone"
            name="companyPhone"
            value={details.companyPhone}
            onChange={value => update('companyPhone', value)}
            error={errors.companyPhone}
            required
            maxLength={10}
            placeholder="Enter phone number"
          />
        </div>
      </section>

      <section>
        <h3 className="mb-4 py-2 text-lg font-semibold text-gray-900 dark:text-white">
          Registered address
        </h3>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4">
          <FormField
            label="Postal code"
            name="registeredPostalCode"
            value={details.registeredPostalCode}
            onChange={value => update('registeredPostalCode', value)}
            error={errors.registeredPostalCode}
            required
            maxLength={6}
            placeholder="Enter postal code"
          />
          <FormField
            label="City"
            name="registeredCity"
            value={details.registeredCity}
            onChange={value => update('registeredCity', value)}
            error={errors.registeredCity}
            required
            placeholder="Enter city"
          />
          <FormField
            label="State"
            name="registeredState"
            value={details.registeredState}
            onChange={value => update('registeredState', value)}
            error={errors.registeredState}
            required
            placeholder="Enter state"
          />
          <FormField
            label="Country"
            name="registeredCountry"
            value={details.registeredCountry}
            onChange={value => update('registeredCountry', value)}
            error={errors.registeredCountry}
            required
            placeholder="Enter country"
          />
          <FormField
            label="Address line 1"
            name="registeredAddressLine1"
            value={details.registeredAddressLine1}
            onChange={value => update('registeredAddressLine1', value)}
            error={errors.registeredAddressLine1}
            required
            placeholder="Building, street, or area"
          />
          <FormField
            label="Address line 2"
            name="registeredAddressLine2"
            value={details.registeredAddressLine2}
            onChange={value => update('registeredAddressLine2', value)}
            placeholder="Landmark or additional address details"
          />
          <div className="border border-gray-400 flex justify-start h-8 pl-4 md:mt-6 items-center">
            <FormField
              type="toggle"
              label="Primary address"
              name="registeredIsPrimary"
              value={details.registeredIsPrimary}
              onToggleChange={handleRegisteredPrimaryChange}
              toggleActiveLabel="Primary address"
              toggleInactiveLabel="Not primary address"
            />
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-3 py-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Office address
          </h3>
          <FormField
            type="checkbox"
            label="Same as registered address"
            name="sameAsRegisteredAddress"
            value={sameAsRegisteredAddress}
            onCheckboxChange={handleSameAddressChange}
          />
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4">
          <FormField
            label="Postal code"
            name="officePostalCode"
            value={details.officePostalCode}
            onChange={value => update('officePostalCode', value)}
            error={errors.officePostalCode}
            required
            disabled={sameAsRegisteredAddress}
            maxLength={6}
            placeholder="Enter postal code"
          />
          <FormField
            label="City"
            name="officeCity"
            value={details.officeCity}
            onChange={value => update('officeCity', value)}
            error={errors.officeCity}
            required
            disabled={sameAsRegisteredAddress}
            placeholder="Enter city"
          />
          <FormField
            label="State"
            name="officeState"
            value={details.officeState}
            onChange={value => update('officeState', value)}
            error={errors.officeState}
            required
            disabled={sameAsRegisteredAddress}
            placeholder="Enter state"
          />
          <FormField
            label="Country"
            name="officeCountry"
            value={details.officeCountry}
            onChange={value => update('officeCountry', value)}
            error={errors.officeCountry}
            required
            disabled={sameAsRegisteredAddress}
            placeholder="Enter country"
          />
          <FormField
            label="Address line 1"
            name="officeAddressLine1"
            value={details.officeAddressLine1}
            onChange={value => update('officeAddressLine1', value)}
            error={errors.officeAddressLine1}
            required
            disabled={sameAsRegisteredAddress}
            placeholder="Building, street, or area"
          />
          <FormField
            label="Address line 2"
            name="officeAddressLine2"
            value={details.officeAddressLine2}
            onChange={value => update('officeAddressLine2', value)}
            disabled={sameAsRegisteredAddress}
            placeholder="Landmark or additional address details"
          />
          <div className="border border-gray-400 flex justify-start h-8 pl-4 md:mt-6 items-center">
            <FormField
              type="toggle"
              label="Primary address"
              name="officeIsPrimary"
              value={details.officeIsPrimary}
              onToggleChange={handleOfficePrimaryChange}
              toggleActiveLabel="Primary address"
              toggleInactiveLabel="Not primary address"
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end border-t border-gray-200 pt-6">
        <Button type="submit" size="lg">
          Continue to documents
        </Button>
      </div>

      <Dialog open={isLogoPreviewOpen} onOpenChange={setIsLogoPreviewOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Company logo</DialogTitle>
            <DialogDescription className="break-all">
              {documents.logo?.name || 'Current company logo'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex min-h-72 items-center justify-center rounded-lg bg-muted/30 p-4">
            {displayedLogoUrl && (
              <img
                src={displayedLogoUrl}
                alt="Company logo preview"
                className="max-h-[60vh] max-w-full rounded-lg object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default CompanyDetailsStep;
