import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  formatSalary,
  isAtLeastAge,
  isValidEmail,
  type PersonalDetails,
  type ProfileValidationErrors,
} from '../../data/profile';

type PersonalDetailsCardProps = {
  details: PersonalDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (details: PersonalDetails) => void;
};

const genders = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const maritalStatuses = ['Single', 'Married', 'Other'];
const authorizations = ['Indian citizen', 'Work permit', 'Need sponsorship'];
const toOptions = (options: string[]) =>
  options.map(option => ({ label: option, value: option }));

const validate = (draft: PersonalDetails) => {
  const errors: ProfileValidationErrors = {};
  if (!draft.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!isValidEmail(draft.email)) errors.email = 'Enter a valid email.';
  if (!/^\d{10}$/.test(draft.mobile)) {
    errors.mobile = 'Mobile must be exactly 10 digits.';
  }
  if (draft.alternateMobile && !/^\d{10}$/.test(draft.alternateMobile)) {
    errors.alternateMobile = 'Alternate mobile must be 10 digits.';
  }
  if (!isAtLeastAge(draft.dateOfBirth, 16)) {
    errors.dateOfBirth = 'Candidate must be at least 16 years old.';
  }
  if (!draft.currentLocation.trim()) {
    errors.currentLocation = 'Current location is required.';
  }
  const years = Number(draft.experienceYears);
  const months = Number(draft.experienceMonths);
  if (!/^\d+$/.test(draft.experienceYears) || years < 0 || years > 50) {
    errors.experienceYears = 'Years must be 0 to 50.';
  }
  if (!/^\d+$/.test(draft.experienceMonths) || months < 0 || months > 11) {
    errors.experienceMonths = 'Months must be 0 to 11.';
  }
  if (draft.currentSalary && !/^\d+$/.test(draft.currentSalary)) {
    errors.currentSalary = 'Salary must contain digits only.';
  }
  return errors;
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
    <dt className="text-xs text-slate-500 dark:text-slate-400">{label}</dt>
    <dd className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
      {value || '-'}
    </dd>
  </div>
);

const VerifiedValue = ({
  label,
  value,
  verified,
}: {
  label: string;
  value: string;
  verified: boolean;
}) => (
  <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
    <dt className="text-xs text-slate-500 dark:text-slate-400">{label}</dt>
    <dd className="mt-1 flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
      {value}
      {verified && (
        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
      )}
    </dd>
  </div>
);

const PersonalDetailsCard = ({
  details,
  open,
  onOpenChange,
  onSave,
}: PersonalDetailsCardProps) => {
  const [draft, setDraft] = useState(details);
  const [errors, setErrors] = useState<ProfileValidationErrors>({});

  const setField = (key: keyof PersonalDetails, value: string | boolean) => {
    setDraft(current => ({
      ...current,
      [key]: value,
      ...(key === 'email' ? { emailVerified: false } : {}),
      ...(key === 'mobile' ? { mobileVerified: false } : {}),
    }));
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setDraft(details);
      setErrors({});
    }
    onOpenChange(nextOpen);
  };

  const handleSave = () => {
    const nextErrors = validate(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSave(draft);
    onOpenChange(false);
  };

  return (
    <section className="rounded-t-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800/50 p-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
          Personal details
        </h2>
        <Button
          type="button"
          variant="outline"
          className="rounded-none border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
          onClick={() => handleOpenChange(true)}
        >
          Edit
        </Button>
      </div>
      <dl className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <DetailItem label="Full name" value={details.fullName} />
        <DetailItem label="Date of birth" value={details.dateOfBirth} />
        <DetailItem label="Gender" value={details.gender} />
        <DetailItem label="Marital status" value={details.maritalStatus} />
        <DetailItem label="Current location" value={details.currentLocation} />
        <DetailItem label="Hometown" value={details.hometown} />
        <VerifiedValue
          label="Email"
          value={details.email}
          verified={details.emailVerified}
        />
        <VerifiedValue
          label="Mobile"
          value={`+91 ${details.mobile}`}
          verified={details.mobileVerified}
        />
        <DetailItem label="Alternate mobile" value={details.alternateMobile} />
        <DetailItem
          label="Total experience"
          value={`${details.experienceYears} years ${details.experienceMonths} months`}
        />
        <DetailItem label="Current role" value={details.currentRole} />
        <DetailItem
          label="Current salary"
          value={`₹${formatSalary(details.currentSalary)}`}
        />
        <DetailItem
          label="Work authorization"
          value={details.workAuthorization}
        />
        <DetailItem
          label="Differently abled"
          value={details.differentlyAbled ? 'Yes' : 'No'}
        />
        <DetailItem
          label="Career break"
          value={details.careerBreak ? 'Yes' : 'No'}
        />
      </dl>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto dark:bg-slate-800 /50 sm:max-w-3xl lg:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit profile details</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <fieldset className="grid gap-3 md:grid-cols-3">
              <legend className="mb-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                Personal
              </legend>
              <FormField
                label="Full name"
                name="fullName"
                type="text"
                value={draft.fullName}
                onChange={value => setField('fullName', value)}
                required
                maxLength={80}
                error={errors.fullName}
              />
              <FormField
                label="Date of birth"
                name="dateOfBirth"
                type="date"
                value={draft.dateOfBirth}
                onChange={value => setField('dateOfBirth', value)}
                error={errors.dateOfBirth}
              />
              <FormField
                label="Gender"
                name="gender"
                type="select"
                value={draft.gender}
                onChange={value => setField('gender', value)}
                options={toOptions(genders)}
              />
              <FormField
                label="Marital status"
                name="maritalStatus"
                type="select"
                value={draft.maritalStatus}
                onChange={value => setField('maritalStatus', value)}
                options={toOptions(maritalStatuses)}
              />
            </fieldset>

            <fieldset className="grid gap-3 md:grid-cols-3">
              <legend className="mb-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                Contact
              </legend>
              <FormField
                label="Email"
                name="email"
                type="text"
                value={draft.email}
                onChange={value => setField('email', value)}
                maxLength={120}
                error={errors.email}
              />
              <FormField
                label="Mobile"
                name="mobile"
                type="text"
                value={draft.mobile}
                onChange={value =>
                  setField('mobile', value.replace(/\D/g, '').slice(0, 10))
                }
                maxLength={10}
                error={errors.mobile}
              />
              <FormField
                label="Alternate mobile"
                name="alternateMobile"
                type="text"
                value={draft.alternateMobile}
                onChange={value =>
                  setField(
                    'alternateMobile',
                    value.replace(/\D/g, '').slice(0, 10)
                  )
                }
                maxLength={10}
                error={errors.alternateMobile}
              />
              <FormField
                label="Current location"
                name="currentLocation"
                type="text"
                value={draft.currentLocation}
                onChange={value => setField('currentLocation', value)}
                maxLength={120}
                error={errors.currentLocation}
              />
              <FormField
                label="Hometown"
                name="hometown"
                type="text"
                value={draft.hometown}
                onChange={value => setField('hometown', value)}
                maxLength={120}
              />
            </fieldset>

            <fieldset className="grid gap-3 md:grid-cols-3">
              <legend className="mb-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                Work snapshot
              </legend>
              <FormField
                label="Experience years"
                name="experienceYears"
                type="text"
                value={draft.experienceYears}
                onChange={value =>
                  setField('experienceYears', value.replace(/\D/g, ''))
                }
                error={errors.experienceYears}
              />
              <FormField
                label="Experience months"
                name="experienceMonths"
                type="text"
                value={draft.experienceMonths}
                onChange={value =>
                  setField('experienceMonths', value.replace(/\D/g, ''))
                }
                error={errors.experienceMonths}
              />
              <FormField
                label="Current role"
                name="currentRole"
                type="text"
                value={draft.currentRole}
                onChange={value => setField('currentRole', value)}
                maxLength={120}
              />
              <FormField
                label="Company"
                name="company"
                type="text"
                value={draft.company}
                onChange={value => setField('company', value)}
                maxLength={120}
              />
              <FormField
                label="Current salary"
                name="currentSalary"
                type="text"
                value={draft.currentSalary}
                onChange={value =>
                  setField('currentSalary', value.replace(/\D/g, ''))
                }
                error={errors.currentSalary}
              />
              <FormField
                label="Work authorization"
                name="workAuthorization"
                type="select"
                value={draft.workAuthorization}
                onChange={value => setField('workAuthorization', value)}
                options={toOptions(authorizations)}
              />
            </fieldset>

            <fieldset className="grid gap-3 md:grid-cols-2">
              <legend className="mb-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                Additional information
              </legend>
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={draft.differentlyAbled}
                  onChange={event =>
                    setField('differentlyAbled', event.target.checked)
                  }
                />
                Differently abled
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={draft.careerBreak}
                  onChange={event =>
                    setField('careerBreak', event.target.checked)
                  }
                />
                Career break
              </label>
            </fieldset>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-none border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="rounded-none bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleSave}
              >
                Save details
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PersonalDetailsCard;
