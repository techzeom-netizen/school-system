import React from 'react';
import { X, User, Contact, Home, UserPlus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Section from '@/components/common/Section';

interface FormData {
  receiptDate: string;
  memberType: string;
  gender: string;
  title: string;
  fatherHusbandName: string;
  religion: string;
  firstName: string;
  lastName: string;
  dob: string;
  age: string;
  mobile: string;
  email: string;
  occupation: string;
  annualIncome: string;
  occupationalAddress: string;
  permanentPinCode: string;
  permanentStreetAddress: string;
  permanentLandmark: string;
  permanentVillageTown: string;
  permanentState: string;
  permanentDistrict: string;
  permanentTaluka: string;
  permanentCity: string;
  permanentVillage: string;
  sameAsPermanent: boolean;
  currentPinCode: string;
  currentStreetAddress: string;
  currentDistrict: string;
  currentLandmark: string;
  currentVillageTown: string;
  currentState: string;
  currentTaluka: string;
  currentCity: string;
  nomineeTitle: string;
  nomineeName: string;
  nomineeDob: string;
  nomineeAge: string;
  nomineeRelationship: string;
  nomineeSameAsPermanent: boolean;
  nomineeSameAsCurrent: boolean;
  nomineePinCode: string;
  nomineeStreetAddress: string;
  nomineeLandmark: string;
  nomineeVillageTown: string;
  nomineeState: string;
  nomineeDistrict: string;
  nomineeTaluka: string;
  nomineeCity: string;
  agentNo: string;
  introducerName: string;
  // KYC Documents
  passport: boolean;
  voterIdCard: boolean;
  panCard: boolean;
  governmentDefenceIdCard: boolean;
  idCardReputedEmployer: boolean;
  drivingLicense: boolean;
  pensionPaymentOrder: boolean;
  photoIdPostOffice: boolean;
  photoIdUniversity: boolean;
  photoIdPublicAuthority: boolean;
  aanbaarLetterCard: boolean;
  nreqaCard: boolean;
  creditCardStatement: boolean;
  incomeWealthTaxAssessment: boolean;
  electricityBill: boolean;
  telephoneBill: boolean;
  bankAccountStatement: boolean;
  letterReputedEmployer: boolean;
  letterPublicAuthority: boolean;
  rationCard: boolean;
  voterIdCardAddress: boolean;
  pensionPaymentOrderAddress: boolean;
  leaseDeedSaleDeed: boolean;
  proofResidenceUniversity: boolean;
  gasBill: boolean;
  addressProofRelatives: boolean;
  addressProofGazettedOfficers: boolean;
  aanbarCard: boolean;
}

interface FileUploads {
  [key: string]: {
    file: File | null;
    preview: string;
  };
}

interface FormPreviewPopupProps {
  isOpen: boolean;
  formData: FormData;
  fileUploads: FileUploads;
  onSave: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

// Helper to display label for select values
const getLabelFromValue = (
  value: string,
  options: { value: string; label: string }[]
) => {
  const option = options.find(opt => opt.value === value);
  return option?.label || value || '-';
};

// Options for lookups
const TITLES = [
  { value: 'Mr.', label: 'Mr.' },
  { value: 'Mrs.', label: 'Mrs.' },
  { value: 'Ms.', label: 'Ms.' },
  { value: 'Dr.', label: 'Dr.' },
];

const MEMBER_TYPES = [
  { value: 'ordinary', label: 'Ordinary Member' },
  { value: 'shareholder', label: 'Share Holder' },
];

const GENDER_TYPES = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const RELIGIONS = [
  { value: 'hindu', label: 'Hindu' },
  { value: 'muslim', label: 'Muslim' },
  { value: 'christian', label: 'Christian' },
  { value: 'sikh', label: 'Sikh' },
  { value: 'buddhist', label: 'Buddhist' },
  { value: 'jain', label: 'Jain' },
  { value: 'other', label: 'Other' },
];

const OCCUPATIONS = [
  { value: 'business', label: 'Business' },
  { value: 'service', label: 'Service' },
  { value: 'professional', label: 'Professional' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'student', label: 'Student' },
  { value: 'housewife', label: 'Housewife' },
  { value: 'retired', label: 'Retired' },
];

const INCOME_RANGES = [
  { value: '0-100000', label: '0 - 1,00,000' },
  { value: '100001-500000', label: '1,00,001 - 5,00,000' },
  { value: '500001-1000000', label: '5,00,001 - 10,00,000' },
  { value: '1000001+', label: '10,00,001+' },
];

const STATES = [
  { value: 'andhra-pradesh', label: 'Andhra Pradesh' },
  { value: 'karnataka', label: 'Karnataka' },
  { value: 'tamil-nadu', label: 'Tamil Nadu' },
  { value: 'kerala', label: 'Kerala' },
  { value: 'maharashtra', label: 'Maharashtra' },
];

const RELATIONSHIPS = [
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'son', label: 'Son' },
  { value: 'daughter', label: 'Daughter' },
  { value: 'brother', label: 'Brother' },
  { value: 'sister', label: 'Sister' },
];

// KYC Document labels
const KYC_IDENTITY_LABELS: Record<string, string> = {
  passport: 'Passport',
  voterIdCard: 'Voter ID Card',
  panCard: 'PAN Card',
  governmentDefenceIdCard: 'Government/Defence ID Card',
  idCardReputedEmployer: 'ID Card of Reputed Employer',
  drivingLicense: 'Driving License',
  pensionPaymentOrder: 'Pension Payment Order',
  photoIdPostOffice: 'Photo ID Card Issued by Post Office',
  photoIdUniversity: 'Photo ID Card Issued by University',
  photoIdPublicAuthority: 'Photo ID Card Issued by Public Authority',
  aanbaarLetterCard: 'Aadhaar Letter/Card',
  nreqaCard: 'NREGA Card',
};

const KYC_ADDRESS_LABELS: Record<string, string> = {
  creditCardStatement: 'Credit Card Statement',
  incomeWealthTaxAssessment: 'Income/Wealth Tax Assessment Order',
  electricityBill: 'Electricity Bill',
  telephoneBill: 'Telephone Bill',
  bankAccountStatement: 'Bank Account Statement',
  letterReputedEmployer: 'Letter from Reputed Employer',
  letterPublicAuthority: 'Letter from Public Authority',
  rationCard: 'Ration Card',
  voterIdCardAddress: 'Voter ID Card (Address)',
  pensionPaymentOrderAddress: 'Pension Payment Order',
  leaseDeedSaleDeed: 'Lease Deed/Sale Deed',
  proofResidenceUniversity: 'Proof of Residence from University',
  gasBill: 'Gas Bill',
  addressProofRelatives: 'Address Proof of Close Relatives',
  addressProofGazettedOfficers: 'Address Proof of Gazetted Officers',
  aanbarCard: 'Aadhaar Card',
};

const PreviewField: React.FC<{ label: string; value: string | undefined }> = ({
  label,
  value,
}) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
      {value || '-'}
    </span>
  </div>
);

const FormPreviewPopup: React.FC<FormPreviewPopupProps> = ({
  isOpen,
  formData,
  fileUploads,
  onSave,
  onCancel,
  isSubmitting = false,
}) => {
  if (!isOpen) return null;

  // Get selected KYC documents
  const selectedIdentityDocs = Object.entries(KYC_IDENTITY_LABELS)
    .filter(([key]) => formData[key as keyof FormData])
    .map(([, label]) => label);

  const selectedAddressDocs = Object.entries(KYC_ADDRESS_LABELS)
    .filter(([key]) => formData[key as keyof FormData])
    .map(([, label]) => label);

  // Get uploaded documents
  const uploadedDocs = Object.entries(fileUploads).filter(
    ([, value]) => value.preview
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700">
          <h3 className="text-xl font-bold text-white">
            Customer Details Preview
          </h3>
          <Button
            type="button"
            onClick={onCancel}
            className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Personal Details Section */}
          <Section icon={User} title="Personal Details">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <PreviewField label="Receipt Date" value={formData.receiptDate} />
              <PreviewField
                label="Title"
                value={getLabelFromValue(formData.title, TITLES)}
              />
              <PreviewField label="First Name" value={formData.firstName} />
              <PreviewField label="Last Name" value={formData.lastName} />
              <PreviewField
                label="Member Type"
                value={getLabelFromValue(formData.memberType, MEMBER_TYPES)}
              />
              <PreviewField
                label="Father/Husband Name"
                value={formData.fatherHusbandName}
              />
              <PreviewField label="Date of Birth" value={formData.dob} />
              <PreviewField label="Age" value={formData.age} />
              <PreviewField
                label="Gender"
                value={getLabelFromValue(formData.gender, GENDER_TYPES)}
              />
              <PreviewField
                label="Religion"
                value={getLabelFromValue(formData.religion, RELIGIONS)}
              />
            </div>
          </Section>
          {/* Contact Details Section */}
          <Section icon={Contact} title="Contact Details">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <PreviewField label="Mobile No" value={formData.mobile} />
              <PreviewField label="Email" value={formData.email} />
              <PreviewField
                label="Occupation"
                value={getLabelFromValue(formData.occupation, OCCUPATIONS)}
              />
              <PreviewField
                label="Annual Income"
                value={getLabelFromValue(formData.annualIncome, INCOME_RANGES)}
              />
              <div className="col-span-2 md:col-span-3 lg:col-span-4">
                <PreviewField
                  label="Occupational Address"
                  value={formData.occupationalAddress}
                />
              </div>
            </div>
          </Section>

          {/* Permanent Address Section */}
          <Section icon={Home} title="Permanent Address">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <PreviewField
                label="Pin Code"
                value={formData.permanentPinCode}
              />
              <PreviewField
                label="Street Address"
                value={formData.permanentStreetAddress}
              />
              <PreviewField
                label="Landmark"
                value={formData.permanentLandmark}
              />
              <PreviewField
                label="Village/Town"
                value={formData.permanentVillageTown}
              />
              <PreviewField
                label="State"
                value={getLabelFromValue(formData.permanentState, STATES)}
              />
              <PreviewField
                label="District"
                value={formData.permanentDistrict}
              />
              <PreviewField label="Taluka" value={formData.permanentTaluka} />
              <PreviewField label="City" value={formData.permanentCity} />
              <PreviewField label="Village" value={formData.permanentVillage} />
            </div>
          </Section>

          {/* Current Address Section */}
          <Section icon={Home} title="Current Address">
            {formData.sameAsPermanent && (
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-3 italic">
                Same as Permanent Address
              </p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <PreviewField label="Pin Code" value={formData.currentPinCode} />
              <PreviewField
                label="Street Address"
                value={formData.currentStreetAddress}
              />
              <PreviewField label="Landmark" value={formData.currentLandmark} />
              <PreviewField
                label="Village/Town"
                value={formData.currentVillageTown}
              />
              <PreviewField
                label="State"
                value={getLabelFromValue(formData.currentState, STATES)}
              />
              <PreviewField label="District" value={formData.currentDistrict} />
              <PreviewField label="Taluka" value={formData.currentTaluka} />
              <PreviewField label="City" value={formData.currentCity} />
            </div>
          </Section>

          {/* Nominee Details Section */}
          <Section icon={UserPlus} title="Nominee Details">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <PreviewField
                label="Title"
                value={getLabelFromValue(formData.nomineeTitle, TITLES)}
              />
              <PreviewField label="Name" value={formData.nomineeName} />
              <PreviewField label="Date of Birth" value={formData.nomineeDob} />
              <PreviewField label="Age" value={formData.nomineeAge} />
              <PreviewField
                label="Relationship"
                value={getLabelFromValue(
                  formData.nomineeRelationship,
                  RELATIONSHIPS
                )}
              />
              <PreviewField label="Pin Code" value={formData.nomineePinCode} />
              <PreviewField
                label="Street Address"
                value={formData.nomineeStreetAddress}
              />
              <PreviewField label="Landmark" value={formData.nomineeLandmark} />
              <PreviewField
                label="Village/Town"
                value={formData.nomineeVillageTown}
              />
              <PreviewField
                label="State"
                value={getLabelFromValue(formData.nomineeState, STATES)}
              />
              <PreviewField label="District" value={formData.nomineeDistrict} />
              <PreviewField label="Taluka" value={formData.nomineeTaluka} />
              <PreviewField label="City" value={formData.nomineeCity} />
            </div>
          </Section>

          {/* Agent Details Section */}
          <Section icon={User} title="Agent Details">
            <div className="grid grid-cols-2 gap-4">
              <PreviewField label="Agent No" value={formData.agentNo} />
              <PreviewField
                label="Introducer Name"
                value={formData.introducerName}
              />
            </div>
          </Section>

          {/* KYC Details Section */}
          <Section icon={FileText} title="KYC Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Proof of Identity
                </h5>
                {selectedIdentityDocs.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {selectedIdentityDocs.map(doc => (
                      <li key={doc}>{doc}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 italic">None selected</p>
                )}
              </div>
              <div>
                <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Proof of Address
                </h5>
                {selectedAddressDocs.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {selectedAddressDocs.map(doc => (
                      <li key={doc}>{doc}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 italic">None selected</p>
                )}
              </div>
            </div>
          </Section>

          {/* Uploaded Documents Section */}
          {uploadedDocs.length > 0 && (
            <Section icon={FileText} title="Uploaded Documents">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {uploadedDocs.map(([key, value]) => (
                  <div key={key} className="text-center">
                    <img
                      src={value.preview}
                      alt={key}
                      className="w-full h-20 object-contain rounded border border-gray-200 dark:border-gray-600 mb-1"
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={isSubmitting}
            className="px-6 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? 'Saving...' : 'Save Customer'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormPreviewPopup;
