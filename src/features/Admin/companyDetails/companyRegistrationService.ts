import { CompanyDetails } from '@/types';
import { ApprovalInfo, ApprovalStatus, CompanyDocuments } from './types';

export interface CompanyDocumentInfo {
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
}

export interface CompanyApprovalRequest extends ApprovalInfo {
  ownerId: string;
  ownerEmail: string;
  documents: Partial<Record<keyof CompanyDocuments, CompanyDocumentInfo>>;
}

const approvalRequests: CompanyApprovalRequest[] = [];

/** Build the multipart body consumed by the company create API. */
export const createCompanyFormData = (
  details: CompanyDetails,
  documents: CompanyDocuments
): FormData => {
  const formData = new FormData();
  const appendText = (key: string, value: string) => {
    const normalizedValue = value.trim();
    if (normalizedValue) formData.append(key, normalizedValue);
  };

  appendText('name', details.companyName);
  appendText('legalName', details.legalName);
  appendText('website', details.website);
  appendText('email', details.companyEmail);
  appendText('contactNumber', details.companyPhone);
  appendText('industry', details.industry);
  appendText('companySize', details.companySize);
  appendText('registeredAddressLine1', details.registeredAddressLine1);
  appendText('registeredAddressLine2', details.registeredAddressLine2);
  appendText('registeredCity', details.registeredCity);
  appendText('registeredState', details.registeredState);
  appendText('registeredCountry', details.registeredCountry);
  appendText('registeredPostalCode', details.registeredPostalCode);
  formData.append('registeredIsPrimary', String(details.registeredIsPrimary));
  appendText('officeAddressLine1', details.officeAddressLine1);
  appendText('officeAddressLine2', details.officeAddressLine2);
  appendText('officeCity', details.officeCity);
  appendText('officeState', details.officeState);
  appendText('officeCountry', details.officeCountry);
  appendText('officePostalCode', details.officePostalCode);
  formData.append('officeIsPrimary', String(details.officeIsPrimary));
  appendText('gstNumber', details.gstNumber.toUpperCase());
  appendText('panNumber', details.panNumber.toUpperCase());
  appendText('registrationNumber', details.registrationNumber);
  appendText('cinNumber', details.cinNumber.toUpperCase());

  if (documents.logo) formData.append('logo', documents.logo);
  if (documents.gstCertificate)
    formData.append('gst', documents.gstCertificate);
  if (documents.panCard) formData.append('pan', documents.panCard);
  if (documents.incorporationCertificate) {
    formData.append('registration', documents.incorporationCertificate);
  }
  if (documents.cinCertificate)
    formData.append('cin', documents.cinCertificate);

  return formData;
};

export const fetchCompanyApprovalRequests = async (): Promise<
  CompanyApprovalRequest[]
> => [...approvalRequests];

export const updateCompanyApprovalRequest = async (
  reference: string,
  status: Extract<ApprovalStatus, 'approved' | 'rejected'>,
  rejectionReason?: string
): Promise<CompanyApprovalRequest> => {
  const index = approvalRequests.findIndex(
    item => item.reference === reference
  );

  if (index < 0) throw new Error('Company approval request was not found.');
  if (status === 'rejected' && !rejectionReason?.trim()) {
    throw new Error('A rejection message is required.');
  }

  const updated: CompanyApprovalRequest = {
    ...approvalRequests[index],
    status,
    rejectionReason:
      status === 'rejected' ? rejectionReason?.trim() : undefined,
  };

  approvalRequests[index] = updated;
  return updated;
};
