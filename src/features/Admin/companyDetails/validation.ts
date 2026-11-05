import { CompanyDetails } from '@/types';

export type CompanyErrors = Partial<Record<keyof CompanyDetails, string>>;

const GST_PATTERN = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const PAN_PATTERN = /^[A-Z]{5}\d{4}[A-Z]$/;
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const validateCompanyDetails = (d: CompanyDetails): CompanyErrors => {
  const errors: CompanyErrors = {};

  if (!d.companyName.trim()) errors.companyName = 'Company name is required.';
  if (!d.legalName.trim()) errors.legalName = 'Legal name is required.';
  if (d.website.trim()) {
    try {
      new URL(d.website.trim());
    } catch {
      errors.website = 'Enter a valid website URL.';
    }
  }
  if (!d.industry.trim()) errors.industry = 'Industry is required.';
  if (!d.companySize.trim()) errors.companySize = 'Company size is required.';

  if (!d.gstNumber.trim()) errors.gstNumber = 'GST number is required.';
  else if (!GST_PATTERN.test(d.gstNumber.trim().toUpperCase()))
    errors.gstNumber = 'Enter a valid 15-character GST number.';

  if (!d.panNumber.trim()) errors.panNumber = 'PAN number is required.';
  else if (!PAN_PATTERN.test(d.panNumber.trim().toUpperCase()))
    errors.panNumber = 'Enter a valid 10-character PAN.';

  if (!d.registrationNumber.trim())
    errors.registrationNumber = 'Registration number is required.';
  else if (!/^[A-Z0-9]{6,21}$/i.test(d.registrationNumber.trim()))
    errors.registrationNumber =
      'Enter 6 to 21 letters or numbers without spaces.';

  if (!d.companyEmail.trim())
    errors.companyEmail = 'Company email is required.';
  else if (!EMAIL_PATTERN.test(d.companyEmail.trim()))
    errors.companyEmail = 'Enter a valid company email.';

  if (!d.companyPhone.trim())
    errors.companyPhone = 'Company phone is required.';
  else if (!/^\d{10}$/.test(d.companyPhone.trim()))
    errors.companyPhone = 'Enter a 10-digit phone number.';

  if (!d.registeredAddressLine1.trim())
    errors.registeredAddressLine1 = 'Registered address line 1 is required.';
  if (!d.registeredCity.trim())
    errors.registeredCity = 'Registered city is required.';
  if (!d.registeredState.trim())
    errors.registeredState = 'Registered state is required.';
  if (!d.registeredCountry.trim())
    errors.registeredCountry = 'Registered country is required.';
  if (!d.registeredPostalCode.trim())
    errors.registeredPostalCode = 'Registered postal code is required.';
  else if (!/^\d{6}$/.test(d.registeredPostalCode.trim()))
    errors.registeredPostalCode = 'Enter a 6-digit postal code.';

  if (!d.officeAddressLine1.trim())
    errors.officeAddressLine1 = 'Office address line 1 is required.';
  if (!d.officeCity.trim()) errors.officeCity = 'Office city is required.';
  if (!d.officeState.trim()) errors.officeState = 'Office state is required.';
  if (!d.officeCountry.trim())
    errors.officeCountry = 'Office country is required.';
  if (!d.officePostalCode.trim())
    errors.officePostalCode = 'Office postal code is required.';
  else if (!/^\d{6}$/.test(d.officePostalCode.trim()))
    errors.officePostalCode = 'Enter a 6-digit postal code.';

  return errors;
};
