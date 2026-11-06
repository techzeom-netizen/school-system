import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/redux/store';
import { refreshAccessToken } from '@/redux/slices/auth.slice';
import {
  createCompany,
  getCompanyDetail,
  resubmitCompany,
} from '@/redux/slices/company.slice';
import { CompanyDetail } from '@/services/company.service';
import { CompanyDetails } from '@/types';
import { toAssetImageUrl } from '@/utils/imageUrl';
import {
  ApprovalInfo,
  ApprovalStatusStep,
  CompanyDetailsStep,
  CompanyDocuments,
  CompanyDocumentsStep,
  CompanyReviewStep,
  ExistingCompanyDocuments,
  createCompanyFormData,
  RegistrationStep,
  RegistrationStepper,
  emptyDocuments,
  initialDetails,
} from '@/features/Admin/companyDetails';

const mapCompanyDetail = (
  company: CompanyDetail,
  current: CompanyDetails
): CompanyDetails => {
  const registeredAddress = company.addresses?.find(
    address => address.type.toLowerCase() === 'registered'
  );
  const officeAddress = company.addresses?.find(
    address => address.type.toLowerCase() === 'office'
  );
  const getKycId = (type: string) =>
    company.kycs?.find(kyc => kyc.type.toLowerCase() === type)?.uniqueId || '';

  return {
    ...initialDetails,
    ...current,
    companyName: company.name || '',
    legalName: company.legalName || '',
    website: company.website || '',
    companySize: company.companySize || '',
    industry: company.industry || '',
    companyEmail: company.email || '',
    companyPhone: company.contactNumber || '',
    gstNumber: getKycId('gst'),
    panNumber: getKycId('pan'),
    registrationNumber: getKycId('registration'),
    cinNumber: getKycId('cin'),
    registeredAddressLine1: registeredAddress?.addressLine1 || '',
    registeredAddressLine2: registeredAddress?.addressLine2 || '',
    registeredCity: registeredAddress?.city || '',
    registeredState: registeredAddress?.state || '',
    registeredCountry: registeredAddress?.country || 'India',
    registeredPostalCode: registeredAddress?.postalCode || '',
    registeredIsPrimary: registeredAddress?.isPrimary ?? true,
    officeAddressLine1: officeAddress?.addressLine1 || '',
    officeAddressLine2: officeAddress?.addressLine2 || '',
    officeCity: officeAddress?.city || '',
    officeState: officeAddress?.state || '',
    officeCountry: officeAddress?.country || 'India',
    officePostalCode: officeAddress?.postalCode || '',
    officeIsPrimary: officeAddress?.isPrimary ?? false,
  };
};

const mapExistingDocuments = (
  company: CompanyDetail
): ExistingCompanyDocuments => {
  const documentKeyByKycType: Record<string, keyof CompanyDocuments> = {
    gst: 'gstCertificate',
    pan: 'panCard',
    registration: 'incorporationCertificate',
    cin: 'cinCertificate',
  };

  return (company.kycs || []).reduce<ExistingCompanyDocuments>(
    (documents, kyc) => {
      const documentKey = documentKeyByKycType[kyc.type.toLowerCase()];
      if (documentKey && kyc.fileKey) {
        documents[documentKey] = {
          url: toAssetImageUrl(kyc.fileKey),
          status: kyc.status,
          rejectionReason: kyc.rejectionReason,
        };
      }
      return documents;
    },
    company.logo
      ? {
          logo: {
            url: toAssetImageUrl(company.logo),
          },
        }
      : {}
  );
};

const mapCompanyApproval = (
  company: CompanyDetail,
  mappedDetails: CompanyDetails
): ApprovalInfo => {
  const rejectionReasons = [
    ...(company.rejectionReason?.trim()
      ? [company.rejectionReason.trim()]
      : []),
    ...(company.kycs || [])
      .filter(kyc => Boolean(kyc.rejectionReason?.trim()))
      .map(
        kyc => `${kyc.type.toUpperCase()}: ${kyc.rejectionReason?.trim() || ''}`
      ),
  ];
  const apiStatus = company.status.toLowerCase();
  let status: ApprovalInfo['status'];
  if (apiStatus === 'approved') {
    status = 'approved';
  } else if (apiStatus === 'rejected' || rejectionReasons.length > 0) {
    status = 'rejected';
  } else {
    status = 'pending';
  }

  return {
    status,
    reference: company.id,
    submittedAt: company.createdAt,
    rejectionReason: rejectionReasons[0],
    rejectionReasons,
    details: mappedDetails,
  };
};

const CompanyRegistrationPage: React.FC = () => {
  const { updateUser, user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [approval, setApproval] = useState<ApprovalInfo>({ status: 'draft' });
  const [step, setStep] = useState<RegistrationStep>(1);
  const [details, setDetails] = useState<CompanyDetails>(initialDetails);
  const [documents, setDocuments] = useState<CompanyDocuments>(emptyDocuments);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [hasExistingCompany, setHasExistingCompany] = useState(false);
  const [existingLogoUrl, setExistingLogoUrl] = useState('');
  const [existingDocuments, setExistingDocuments] =
    useState<ExistingCompanyDocuments>({});
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadApproval = async () => {
      if (!user?.companyId) {
        if (!active) return;
        setApproval({ status: 'draft' });
        setStep(1);
        return;
      }

      try {
        const company = await dispatch(getCompanyDetail()).unwrap();
        if (!active || !company) return;

        const cachedDetails = {
          ...initialDetails,
          ...user.companyDetails,
        };
        const mappedDetails = mapCompanyDetail(company, cachedDetails);
        setDetails(mappedDetails);
        setApproval(mapCompanyApproval(company, mappedDetails));
        setExistingLogoUrl(toAssetImageUrl(company.logo));
        setExistingDocuments(mapExistingDocuments(company));
        setHasExistingCompany(true);
        setStep(4);
      } catch {
        if (!active) return;
        setApproval({ status: 'draft' });
        setStep(1);
      }
    };

    void loadApproval();
    return () => {
      active = false;
    };
  }, [dispatch, user?.companyId]);

  const updateField = <K extends keyof CompanyDetails>(
    field: K,
    value: CompanyDetails[K]
  ) => {
    setDetails(previous => ({ ...previous, [field]: value }));
  };

  const updateDocument = (key: keyof CompanyDocuments, file: File | null) => {
    setDocuments(previous => ({ ...previous, [key]: file }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const formData = createCompanyFormData(details, documents);
      const response = hasExistingCompany
        ? await dispatch(resubmitCompany(formData)).unwrap()
        : await dispatch(createCompany(formData)).unwrap();

      if (!hasExistingCompany) {
        await dispatch(refreshAccessToken()).unwrap();
      }

      const company = await dispatch(getCompanyDetail()).unwrap();
      const mappedDetails = mapCompanyDetail(company, details);
      const apiApproval = mapCompanyApproval(company, mappedDetails);

      // Not approved yet, so the dashboard stays locked.
      updateUser({
        isRegisterComplete: false,
        companyDetails: details,
        companyId: company.id,
      });
      setDetails(mappedDetails);
      setApproval(apiApproval);
      setExistingLogoUrl(toAssetImageUrl(company.logo));
      setExistingDocuments(mapExistingDocuments(company));
      setHasExistingCompany(true);
      setStep(4);
      toast.success(
        response.message ||
          'Company details submitted successfully, Please wait for approval'
      );
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Could not submit your request. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckStatus = async () => {
    setIsChecking(true);
    try {
      const company = await dispatch(getCompanyDetail()).unwrap();
      const mappedDetails = mapCompanyDetail(company, details);
      setDetails(mappedDetails);
      setApproval(mapCompanyApproval(company, mappedDetails));
      setExistingLogoUrl(toAssetImageUrl(company.logo));
      setExistingDocuments(mapExistingDocuments(company));
      setHasExistingCompany(true);
    } catch {
      toast.error('Could not refresh the company approval status.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleGoToDashboard = () => {
    if (approval.status !== 'approved') return;
    updateUser({ isRegisterComplete: true });
    navigate('/dashboard/admin', { replace: true });
  };

  const handleEdit = () => {
    setDocuments(emptyDocuments);
    setStep(1);
  };

  let stepFourCopy: { title: React.ReactNode; subtitle: string };
  if (approval.status === 'rejected') {
    stepFourCopy = {
      title: <>We need a few corrections.</>,
      subtitle:
        'We could not approve this request yet. Fix the points below and resubmit.',
    };
  } else if (approval.status === 'approved') {
    stepFourCopy = {
      title: <>Your company is verified.</>,
      subtitle:
        'Welcome to KD Public School. Your full dashboard menu is now unlocked.',
    };
  } else {
    stepFourCopy = {
      title: <>Your request is with our team.</>,
      subtitle:
        'Your organisation details were sent to the KD Public School team for verification.',
    };
  }

  const title = step === 4 ? stepFourCopy.title : 'Enter your company Details.';
  const subtitle =
    step === 4
      ? stepFourCopy.subtitle
      : 'Complete these details and send them for approval to access the Admin dashboard.';

  return (
    <main>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="mt-2 text-gray-600 dark:text-white/90">{subtitle}</p>
      </div>

      <RegistrationStepper
        currentStep={step}
        approvalStatus={approval.status}
      />

      {step === 1 && (
        <CompanyDetailsStep
          details={details}
          documents={documents}
          existingLogoUrl={existingLogoUrl}
          rejectionReasons={
            approval.rejectionReasons ||
            (approval.rejectionReason ? [approval.rejectionReason] : [])
          }
          onChange={updateField}
          onDocumentChange={updateDocument}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <CompanyDocumentsStep
          documents={documents}
          existingDocuments={existingDocuments}
          onChange={updateDocument}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <CompanyReviewStep
          details={details}
          documents={documents}
          existingDocuments={existingDocuments}
          isSubmitting={isSubmitting}
          error={error}
          onBack={() => setStep(2)}
          onSubmit={handleSubmit}
        />
      )}
      {step === 4 && (
        <ApprovalStatusStep
          approval={approval}
          details={details}
          isChecking={isChecking}
          onCheckStatus={handleCheckStatus}
          onEdit={handleEdit}
          onGoToDashboard={handleGoToDashboard}
        />
      )}
    </main>
  );
};

export default CompanyRegistrationPage;
