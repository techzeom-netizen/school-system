import { useCallback, useMemo, useState, type ReactNode } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye, FileText, ImageIcon, X } from 'lucide-react';
import { TanStackTable } from '@/components/common';
import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CompanyApprovalRequest,
  type CompanyDocumentInfo,
  type CompanyDocuments,
  fieldLabels,
  initialDetails,
} from '@/features/Admin/companyDetails';
import type { CompanyDetails } from '@/types';
import { useAppDispatch } from '@/redux/store';
import {
  fetchSuperAdminCompanyById,
  fetchSuperAdminCompanyList,
} from '@/redux/slices/superadminCompany.slice';
import type {
  SuperAdminCompany,
  SuperAdminCompanyDetail,
} from '@/services/superadminCompany.service';
import type { DataFetchFunction } from '@/components/common/TanStackTable';
import { toAssetImageUrl } from '@/utils/imageUrl';

const documentLabels: Record<keyof CompanyDocuments, string> = {
  logo: 'Company logo',
  gstCertificate: 'GST certificate',
  panCard: 'Company PAN card',
  incorporationCertificate: 'Incorporation certificate',
  cinCertificate: 'CIN certificate',
};

const statusStyles: Record<string, string> = {
  pending: 'border-amber-200 bg-amber-50 text-amber-700',
  approved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  rejected: 'border-red-200 bg-red-50 text-red-700',
  inactive: 'border-gray-200 bg-gray-50 text-gray-700',
};

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleString('en-IN') : '-';

const formatDetailValue = (value: CompanyDetails[keyof CompanyDetails]) => {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return value || '-';
};

type CompanyListRow = CompanyApprovalRequest & {
  listingStatus: string;
  updatedAt: string;
  companyDetail?: SuperAdminCompanyDetail;
};

const kycDocumentKeys: Record<string, keyof CompanyDocuments> = {
  gst: 'gstCertificate',
  pan: 'panCard',
  registration: 'incorporationCertificate',
  cin: 'cinCertificate',
};

const documentKycTypes: Partial<Record<keyof CompanyDocuments, string>> = {
  gstCertificate: 'gst',
  panCard: 'pan',
  incorporationCertificate: 'registration',
  cinCertificate: 'cin',
};

const getDocumentType = (fileName: string) =>
  fileName.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/*';

const isCompanyDetail = (
  company: SuperAdminCompany
): company is SuperAdminCompanyDetail =>
  'addresses' in company && 'kycs' in company;

const mapCompanyToApprovalRequest = (
  company: SuperAdminCompany
): CompanyListRow => {
  const companyDetail = isCompanyDetail(company) ? company : undefined;
  const registeredAddress = companyDetail?.addresses.find(
    address => address.type === 'registered'
  );
  const officeAddress = companyDetail?.addresses.find(
    address => address.type === 'office'
  );
  const kycs = companyDetail?.kycs ?? [];
  const kycByType = (type: string) => kycs.find(kyc => kyc.type === type);
  const rejectionReasons = kycs
    .map(kyc => kyc.rejectionReason?.trim())
    .filter((reason): reason is string => Boolean(reason));
  const documents: CompanyListRow['documents'] = {};

  if (company.logo) {
    documents.logo = {
      name: company.logo.split('/').pop() || 'Company logo',
      size: 0,
      type: getDocumentType(company.logo),
      dataUrl: toAssetImageUrl(company.logo),
    };
  }

  kycs.forEach(kyc => {
    const documentKey = kycDocumentKeys[kyc.type];
    if (!documentKey || !kyc.fileKey) return;
    documents[documentKey] = {
      name: kyc.fileKey.split('/').pop() || `${kyc.type} document`,
      size: 0,
      type: getDocumentType(kyc.fileKey),
      dataUrl: toAssetImageUrl(kyc.fileKey),
    };
  });

  return {
    status:
      company.status === 'approved' || company.status === 'rejected'
        ? company.status
        : 'pending',
    reference: company.id,
    listingStatus: company.status,
    submittedAt: company.createdAt,
    updatedAt: company.updatedAt,
    ownerId: company.onboardedBy,
    ownerEmail: company.email || '',
    rejectionReason: rejectionReasons[0],
    rejectionReasons,
    details: {
      ...initialDetails,
      companyName: company.name,
      legalName: company.legalName,
      website: company.website || '',
      industry: company.industry || '',
      companySize: company.companySize || '',
      companyEmail: company.email || '',
      companyPhone: company.contactNumber || '',
      gstNumber: kycByType('gst')?.uniqueId || '',
      panNumber: kycByType('pan')?.uniqueId || '',
      registrationNumber: kycByType('registration')?.uniqueId || '',
      cinNumber: kycByType('cin')?.uniqueId || '',
      registeredAddressLine1: registeredAddress?.addressLine1 || '',
      registeredAddressLine2: registeredAddress?.addressLine2 || '',
      registeredCity: registeredAddress?.city || '',
      registeredState: registeredAddress?.state || '',
      registeredCountry: registeredAddress?.country || '',
      registeredPostalCode: registeredAddress?.postalCode || '',
      registeredIsPrimary: registeredAddress?.isPrimary ?? false,
      officeAddressLine1: officeAddress?.addressLine1 || '',
      officeAddressLine2: officeAddress?.addressLine2 || '',
      officeCity: officeAddress?.city || '',
      officeState: officeAddress?.state || '',
      officeCountry: officeAddress?.country || '',
      officePostalCode: officeAddress?.postalCode || '',
      officeIsPrimary: officeAddress?.isPrimary ?? false,
    },
    documents,
    companyDetail,
  };
};

interface DocumentPreview {
  label: string;
  document: CompanyDocumentInfo;
}

const StatusBadge = ({ status }: { status?: string }) => {
  const key = status ?? 'pending';
  const style = statusStyles[key] ?? statusStyles.pending;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${style}`}
    >
      {key}
    </span>
  );
};

interface DetailRow {
  label: string;
  value: ReactNode;
  label2?: string;
  value2?: ReactNode;
}

const DetailRows = ({ rows }: { rows: DetailRow[] }) => (
  <dl className="overflow-hidden rounded-md border border-border">
    {rows.map((row, index) => (
      <div
        key={`${row.label}-${index}`}
        className="grid grid-cols-1 border-b border-border last:border-b-0 md:grid-cols-4"
      >
        <dt className="flex items-center bg-muted/50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-foreground md:border-r md:border-border">
          {row.label}
        </dt>
        <dd
          className={`min-w-0 break-words px-4 py-3 text-[14px] font-medium md:border-r md:border-border ${
            row.label2 ? '' : 'md:col-span-3 md:border-r-0'
          }`}
        >
          {row.value || '-'}
        </dd>
        {row.label2 && (
          <>
            <dt className="flex items-center border-t border-border bg-muted/50 px-4 py-3 text-[14px] font-semibold uppercase tracking-wide text-foreground md:border-r md:border-t-0">
              {row.label2}
            </dt>
            <dd className="min-w-0 break-words border-t border-border px-4 py-3 text-[14px] font-medium md:border-t-0">
              {row.value2 || '-'}
            </dd>
          </>
        )}
      </div>
    ))}
  </dl>
);

const DetailSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="bg-background">
    <h3 className="px-4 pb-4 pt-2 text-center text-lg font-bold text-primary underline decoration-2 underline-offset-4">
      {title}
    </h3>
    {children}
  </section>
);

const CompanyApprovalRequestsPage = () => {
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<CompanyListRow | null>(null);
  const [documentPreview, setDocumentPreview] =
    useState<DocumentPreview | null>(null);
  const [industryFilter, setIndustryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [companySizeFilter, setCompanySizeFilter] = useState('');
  const [viewingCompanyId, setViewingCompanyId] = useState<string | null>(null);

  const fetchCompanies = useCallback<DataFetchFunction<CompanyListRow>>(
    async (pageIndex, pageSize, search) => {
      const response = await dispatch(
        fetchSuperAdminCompanyList({
          name: search,
          industry: industryFilter,
          status: statusFilter,
          companySize: companySizeFilter,
          page: pageIndex + 1,
          pageSize,
        })
      ).unwrap();

      return {
        data: response.companies.map(mapCompanyToApprovalRequest),
        totalCount: response.pagination.total,
        totalPages: response.pagination.pageCount,
      };
    },
    [companySizeFilter, dispatch, industryFilter, statusFilter]
  );

  const openRequest = useCallback(
    async (request: CompanyListRow) => {
      if (!request.reference) return;

      setViewingCompanyId(request.reference);
      setDocumentPreview(null);
      try {
        const company = await dispatch(
          fetchSuperAdminCompanyById(request.reference)
        ).unwrap();
        setSelected(mapCompanyToApprovalRequest(company));
      } catch {
        setSelected(null);
      } finally {
        setViewingCompanyId(null);
      }
    },
    [dispatch]
  );

  const columns = useMemo<ColumnDef<CompanyListRow>[]>(
    () => [
      {
        header: 'Company',
        accessorFn: row => row.details?.companyName || '-',
        cell: ({ row }) => (
          <div className="flex min-w-[180px] items-center gap-3">
            {row.original.documents.logo?.dataUrl && (
              <img
                src={row.original.documents.logo.dataUrl}
                alt=""
                className="size-9 rounded-md border border-border object-cover"
              />
            )}
            <div className="min-w-0">
              <p className="truncate font-medium">
                {row.original.details?.companyName || '-'}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {row.original.details?.industry || '-'}
              </p>
            </div>
          </div>
        ),
      },
      {
        header: 'Legal name',
        accessorFn: row => row.details?.legalName || '-',
      },
      {
        header: 'Company size',
        accessorFn: row => row.details?.companySize || '-',
      },
      {
        header: 'Contact',
        accessorFn: row =>
          `${row.details?.companyEmail ?? ''} ${row.details?.companyPhone ?? ''}`,
        cell: ({ row }) => (
          <div className="min-w-[180px]">
            <p>{row.original.details?.companyEmail || '-'}</p>
            <p className="text-xs text-muted-foreground">
              {row.original.details?.companyPhone || '-'}
            </p>
          </div>
        ),
      },
      {
        header: 'Website',
        accessorFn: row => row.details?.website || '-',
      },
      {
        accessorKey: 'ownerId',
        header: 'Submitted by',
      },
      {
        accessorKey: 'reference',
        header: 'Reference',
      },
      {
        accessorKey: 'submittedAt',
        header: 'Submitted On',
        cell: ({ getValue }) => formatDate(getValue<string | undefined>()),
      },
      {
        accessorKey: 'listingStatus',
        header: 'Status',
        cell: ({ getValue }) => <StatusBadge status={getValue<string>()} />,
      },
      {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: ({ row }) => (
          <Button
            type="button"
            variant="outline"
            size="sm"
            isLoading={viewingCompanyId === row.original.reference}
            disabled={viewingCompanyId !== null}
            onClick={() => void openRequest(row.original)}
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            View
          </Button>
        ),
      },
    ],
    [openRequest, viewingCompanyId]
  );

  return (
    <>
      <Section
        title="Company approval requests"
        menuId="company-approvals"
        showBreadcrumbs
      >
        <TanStackTable
          data={[]}
          columns={columns}
          enableColumnReordering={false}
          enableSearch={false}
          searchPlaceholder="Search by company name..."
          enableSorting={false}
          enablePagination
          enableServerSidePagination
          pageSize={10}
          pageSizeOptions={[10, 20, 50, 100]}
          onDataFetch={fetchCompanies}
          customFilters={
            <div className="flex flex-wrap items-end gap-3">
              <FormField
                label="Industry"
                name="company-industry-filter"
                value={industryFilter}
                onChange={setIndustryFilter}
                placeholder="Filter by industry"
                className="w-44"
              />
              <FormField
                type="select"
                label="Status"
                name="company-status-filter"
                value={statusFilter || 'all'}
                onChange={value =>
                  setStatusFilter(value === 'all' ? '' : value)
                }
                options={[
                  { value: 'all', label: 'All statuses' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'approved', label: 'Approved' },
                  { value: 'rejected', label: 'Rejected' },
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
                className="w-40"
              />
              <FormField
                type="select"
                label="Company size"
                name="company-size-filter"
                value={companySizeFilter || 'all'}
                onChange={value =>
                  setCompanySizeFilter(value === 'all' ? '' : value)
                }
                options={[
                  { value: 'all', label: 'All sizes' },
                  { value: '1-10', label: '1-10' },
                  { value: '11-50', label: '11-50' },
                  { value: '51-200', label: '51-200' },
                  { value: '201-500', label: '201-500' },
                  { value: '501-1000', label: '501-1000' },
                  { value: '1001+', label: '1001+' },
                ]}
                className="w-40"
              />
            </div>
          }
          emptyMessage="No company approval requests found."
        />
      </Section>

      <Dialog
        open={selected !== null}
        onOpenChange={open => {
          if (!open) {
            setSelected(null);
            setDocumentPreview(null);
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-h-[90vh] w-[90vw] overflow-y-auto border-0 bg-transparent p-0 shadow-none sm:max-w-full"
        >
          {selected && (
            <div className="w-full overflow-hidden rounded-lg border-2 border-border bg-background shadow-2xl">
              <DialogHeader className="relative flex-row items-center justify-end bg-primary px-4 py-2 text-primary-foreground">
                <DialogTitle className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center text-sm font-semibold uppercase tracking-wide text-primary-foreground sm:text-base">
                  Company approval application
                </DialogTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-destructive"
                  aria-label="Close company approval details"
                  onClick={() => {
                    setSelected(null);
                    setDocumentPreview(null);
                  }}
                >
                  <X className="size-5" aria-hidden="true" />
                </Button>
              </DialogHeader>

              <div className="max-h-[80vh] space-y-6 overflow-y-auto p-4 [scrollbar-gutter:stable]">
                <DetailSection title="Request details">
                  <DetailRows
                    rows={[
                      {
                        label: 'Company ',
                        value: selected.details?.companyName || '-',
                        label2: 'Reference',
                        value2: selected.reference || '-',
                      },
                      {
                        label: 'Submitted on',
                        value: formatDate(selected.submittedAt),
                        label2: 'Submitted by',
                        value2: selected.ownerId || '-',
                      },
                      {
                        label: 'Status',
                        value: <StatusBadge status={selected.listingStatus} />,
                        label2: 'Last updated',
                        value2: formatDate(selected.updatedAt),
                      },
                    ]}
                  />
                </DetailSection>

                <DetailSection title="Business information">
                  <DetailRows
                    rows={[
                      {
                        label: fieldLabels.legalName,
                        value: selected.details?.legalName || '-',
                        label2: fieldLabels.cinNumber,
                        value2: selected.details?.cinNumber || '-',
                      },
                      {
                        label: fieldLabels.industry,
                        value: selected.details?.industry || '-',
                        label2: fieldLabels.companySize,
                        value2: selected.details?.companySize || '-',
                      },
                      {
                        label: fieldLabels.website,
                        value: selected.details?.website || '-',
                        label2: fieldLabels.gstNumber,
                        value2: selected.details?.gstNumber || '-',
                      },
                      {
                        label: fieldLabels.panNumber,
                        value: selected.details?.panNumber || '-',
                        label2: fieldLabels.registrationNumber,
                        value2: selected.details?.registrationNumber || '-',
                      },
                    ]}
                  />
                </DetailSection>

                <DetailSection title="Contact information">
                  <DetailRows
                    rows={[
                      {
                        label: fieldLabels.companyEmail,
                        value: selected.details?.companyEmail || '-',
                        label2: fieldLabels.companyPhone,
                        value2: selected.details?.companyPhone || '-',
                      },
                    ]}
                  />
                </DetailSection>

                <DetailSection title="Registered address">
                  <DetailRows
                    rows={[
                      {
                        label: fieldLabels.registeredAddressLine1,
                        value: selected.details?.registeredAddressLine1 || '-',
                        label2: fieldLabels.registeredAddressLine2,
                        value2: selected.details?.registeredAddressLine2 || '-',
                      },
                      {
                        label: fieldLabels.registeredCity,
                        value: selected.details?.registeredCity || '-',
                        label2: fieldLabels.registeredState,
                        value2: selected.details?.registeredState || '-',
                      },
                      {
                        label: fieldLabels.registeredCountry,
                        value: selected.details?.registeredCountry || '-',
                        label2: fieldLabels.registeredPostalCode,
                        value2: selected.details?.registeredPostalCode || '-',
                      },
                      {
                        label: fieldLabels.registeredIsPrimary,
                        value: selected.details
                          ? formatDetailValue(
                              selected.details.registeredIsPrimary
                            )
                          : '-',
                      },
                    ]}
                  />
                </DetailSection>

                <DetailSection title="Office address">
                  <DetailRows
                    rows={[
                      {
                        label: fieldLabels.officeAddressLine1,
                        value: selected.details?.officeAddressLine1 || '-',
                        label2: fieldLabels.officeAddressLine2,
                        value2: selected.details?.officeAddressLine2 || '-',
                      },
                      {
                        label: fieldLabels.officeCity,
                        value: selected.details?.officeCity || '-',
                        label2: fieldLabels.officeState,
                        value2: selected.details?.officeState || '-',
                      },
                      {
                        label: fieldLabels.officeCountry,
                        value: selected.details?.officeCountry || '-',
                        label2: fieldLabels.officePostalCode,
                        value2: selected.details?.officePostalCode || '-',
                      },
                      {
                        label: fieldLabels.officeIsPrimary,
                        value: selected.details
                          ? formatDetailValue(selected.details.officeIsPrimary)
                          : '-',
                      },
                    ]}
                  />
                </DetailSection>

                <DetailSection title="Uploaded Documents">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {(
                      Object.entries(documentLabels) as [
                        keyof CompanyDocuments,
                        string,
                      ][]
                    ).map(([key, label]) => {
                      const document = selected.documents?.[key];
                      const isImage = document?.type.startsWith('image/');
                      const kycType = documentKycTypes[key];
                      const kyc = selected.companyDetail?.kycs.find(
                        item => item.type === kycType
                      );
                      return (
                        <article
                          key={key}
                          className="overflow-hidden rounded-lg border border-border bg-background shadow-sm"
                        >
                          <h4 className="bg-primary px-3 py-1 text-center text-sm font-semibold capitalize  text-primary-foreground">
                            {label}
                          </h4>
                          <div className="m-3 flex h-48 items-center justify-center overflow-hidden rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                            {document?.dataUrl && isImage ? (
                              <img
                                src={document.dataUrl}
                                alt={`${label} preview`}
                                className="h-full w-full rounded-md object-contain"
                              />
                            ) : isImage ? (
                              <div className="text-center text-slate-500">
                                <ImageIcon
                                  className="mx-auto size-10"
                                  aria-hidden="true"
                                />
                                <p className="mt-2 text-sm">
                                  Image preview unavailable
                                </p>
                              </div>
                            ) : (
                              <div className="text-center text-slate-500">
                                <FileText
                                  className="mx-auto size-10"
                                  aria-hidden="true"
                                />
                                <p className="mt-2 text-sm">
                                  {document ? 'Document attached' : 'Not added'}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="space-y-3">
                            {kyc && (
                              <div className="space-y-1 border-t border-border px-3 pt-3 text-xs">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-muted-foreground">
                                    Status
                                  </span>
                                  <StatusBadge status={kyc.status} />
                                </div>
                                <p className="break-all">
                                  <span className="text-muted-foreground">
                                    ID:{' '}
                                  </span>
                                  {kyc.uniqueId || '-'}
                                </p>
                                <p>
                                  <span className="text-muted-foreground">
                                    Submitted:{' '}
                                  </span>
                                  {formatDate(kyc.submittedAt || undefined)}
                                </p>
                                {kyc.reviewedBy && (
                                  <p className="break-all">
                                    <span className="text-muted-foreground">
                                      Reviewed by:{' '}
                                    </span>
                                    {kyc.reviewedBy}
                                  </p>
                                )}
                                {kyc.reviewedAt && (
                                  <p>
                                    <span className="text-muted-foreground">
                                      Reviewed:{' '}
                                    </span>
                                    {formatDate(kyc.reviewedAt)}
                                  </p>
                                )}
                                {kyc.rejectionReason && (
                                  <p className="whitespace-normal break-words rounded-md border border-red-200 bg-red-50 p-2 text-red-700">
                                    <span className="font-semibold">
                                      Rejection reason:{' '}
                                    </span>
                                    {kyc.rejectionReason}
                                  </p>
                                )}
                              </div>
                            )}
                            {document?.dataUrl && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() =>
                                  setDocumentPreview({ label, document })
                                }
                              >
                                <Eye className="size-4" aria-hidden="true" />
                                Preview
                              </Button>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </DetailSection>

                {selected.status === 'rejected' && selected.rejectionReason && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-red-700">
                      Rejection message
                    </p>
                    <p className="mt-1 text-sm text-red-900">
                      {selected.rejectionReason}
                    </p>
                  </div>
                )}

                <div className="border border-border p-3">
                  <div className="flex flex-col justify-end gap-3 sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelected(null)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={documentPreview !== null}
        onOpenChange={open => {
          if (!open) setDocumentPreview(null);
        }}
      >
        <DialogContent className="max-h-[92vh] overflow-hidden p-0 sm:max-w-5xl">
          <DialogHeader className="border-b border-border px-6 py-5">
            <DialogTitle>{documentPreview?.label}</DialogTitle>
            <DialogDescription className="break-all">
              {documentPreview?.document.name}
            </DialogDescription>
          </DialogHeader>
          <div className="flex min-h-96 items-center justify-center bg-muted/30 p-4">
            {documentPreview?.document.dataUrl &&
              (documentPreview.document.type === 'application/pdf' ? (
                <iframe
                  src={documentPreview.document.dataUrl}
                  title={`${documentPreview.label} preview`}
                  className="h-[70vh] w-full rounded-lg border border-border bg-background"
                />
              ) : (
                <img
                  src={documentPreview.document.dataUrl}
                  alt={`${documentPreview.label} preview`}
                  className="max-h-[70vh] max-w-full rounded-lg object-contain"
                />
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompanyApprovalRequestsPage;
