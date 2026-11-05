import { CompanyDetails } from '@/types';

export type RegistrationStep = 1 | 2 | 3 | 4;

/** draft = not submitted yet. The other three are decided by the super admin flow. */
export type ApprovalStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export interface CompanyDocuments {
  logo: File | null;
  gstCertificate: File | null;
  panCard: File | null;
  incorporationCertificate: File | null;
  cinCertificate: File | null;
}

export interface ExistingCompanyDocument {
  url: string;
  status?: string;
  rejectionReason?: string | null;
}

export type ExistingCompanyDocuments = Partial<
  Record<keyof CompanyDocuments, ExistingCompanyDocument>
>;

export const emptyDocuments: CompanyDocuments = {
  logo: null,
  gstCertificate: null,
  panCard: null,
  incorporationCertificate: null,
  cinCertificate: null,
};

export interface ApprovalInfo {
  status: ApprovalStatus;
  message?: string;
  reference?: string;
  submittedAt?: string;
  rejectionReason?: string;
  rejectionReasons?: string[];
  details?: CompanyDetails;
}

export const initialDetails: CompanyDetails = {
  companyName: '',
  legalName: '',
  website: '',
  companySize: '',
  gstNumber: '',
  panNumber: '',
  registrationNumber: '',
  cinNumber: '',
  industry: '',
  companyEmail: '',
  companyPhone: '',
  registeredAddressLine1: '',
  registeredAddressLine2: '',
  registeredCity: '',
  registeredState: '',
  registeredCountry: 'India',
  registeredPostalCode: '',
  registeredIsPrimary: true,
  officeAddressLine1: '',
  officeAddressLine2: '',
  officeCity: '',
  officeState: '',
  officeCountry: 'India',
  officePostalCode: '',
  officeIsPrimary: false,
};

export const fieldLabels: Record<keyof CompanyDetails, string> = {
  companyName: 'Name',
  legalName: 'Legal name',
  website: 'Website',
  companySize: 'Company size',
  industry: 'Industry',
  registrationNumber: 'Registration number',
  gstNumber: 'GST number',
  panNumber: 'PAN number',
  cinNumber: 'CIN number',
  companyEmail: 'Company email',
  companyPhone: 'Company phone',
  registeredAddressLine1: 'Registered address line 1',
  registeredAddressLine2: 'Registered address line 2',
  registeredCity: 'Registered city',
  registeredState: 'Registered state',
  registeredCountry: 'Registered country',
  registeredPostalCode: 'Registered postal code',
  registeredIsPrimary: 'Registered address is primary',
  officeAddressLine1: 'Office address line 1',
  officeAddressLine2: 'Office address line 2',
  officeCity: 'Office city',
  officeState: 'Office state',
  officeCountry: 'Office country',
  officePostalCode: 'Office postal code',
  officeIsPrimary: 'Office address is primary',
};
