import { type FormEvent, useCallback, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  AlertTriangle,
  ArrowDownToLine,
  Bell,
  Check,
  FileText,
  PenLine,
  Plus,
  Send,
} from 'lucide-react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  documentRequestAudienceOptions,
  documentRequestDepartmentFilterOptions,
  documentRequestReminderOptions,
} from '@/data/reusableDropdownData';
import WaitingForYouTab from './document-request/WaitingForYouTab';
import InprogressTab from './document-request/InprogressTab';
import OverDueTab from './document-request/OverDueTab';
import IssuedTab from './document-request/IssuedTab';
import RejectedTab from './document-request/RejectedTab';

type RequestStatus = 'pending' | 'in-progress' | 'issued' | 'rejected';
type RequestFilter =
  | 'pending'
  | 'in-progress'
  | 'overdue'
  | 'issued'
  | 'rejected';
type DeliveryMethod = 'Digital PDF' | 'Hard copy';

interface DocumentRequest {
  id: string;
  employeeName: string;
  initials: string;
  department: string;
  documentType: string;
  purpose: string;
  requestedAt: string;
  neededBy: string;
  delivery: DeliveryMethod;
  notes: string;
  status: RequestStatus;
  remarks?: string;
}

interface CollectionPerson {
  id: string;
  name: string;
  department: string;
  lastReminded: string | null;
}

interface DocumentCollection {
  id: string;
  title: string;
  sent: number;
  total: number;
  pendingPeople: CollectionPerson[];
}

const initialRequests: DocumentRequest[] = [
  {
    id: 'DR-1050',
    employeeName: 'Sneha Iyer',
    initials: 'SI',
    department: 'Marketing',
    documentType: 'Form 16 (FY 2025-26)',
    purpose: 'Tax filing',
    requestedAt: '2026-09-25',
    neededBy: '2026-09-30',
    delivery: 'Digital PDF',
    notes: '',
    status: 'pending',
  },
  {
    id: 'DR-1042',
    employeeName: 'Priya Nair',
    initials: 'PN',
    department: 'Finance',
    documentType: 'Salary Certificate',
    purpose: 'Loan application',
    requestedAt: '2026-10-06',
    neededBy: '2026-10-10',
    delivery: 'Digital PDF',
    notes: 'Include gross salary',
    status: 'pending',
  },
  {
    id: 'DR-1039',
    employeeName: 'Arjun Rao',
    initials: 'AR',
    department: 'Engineering',
    documentType: 'Experience Letter',
    purpose: 'Visa application',
    requestedAt: '2026-10-02',
    neededBy: '2026-10-12',
    delivery: 'Digital PDF',
    notes: '',
    status: 'pending',
  },
  {
    id: 'DR-1035',
    employeeName: 'Dev Malhotra',
    initials: 'DM',
    department: 'Operations',
    documentType: 'Address Proof Letter',
    purpose: 'Bank account',
    requestedAt: '2026-10-01',
    neededBy: '2026-10-15',
    delivery: 'Hard copy',
    notes: '',
    status: 'pending',
  },
  {
    id: 'DR-1030',
    employeeName: 'Meera S.',
    initials: 'MS',
    department: 'HR',
    documentType: 'Employment Verification',
    purpose: 'New job',
    requestedAt: '2026-09-28',
    neededBy: '2026-10-17',
    delivery: 'Digital PDF',
    notes: '',
    status: 'pending',
  },
  {
    id: 'DR-1025',
    employeeName: 'Karan Patel',
    initials: 'KP',
    department: 'Sales',
    documentType: 'Experience Letter',
    purpose: 'Higher studies',
    requestedAt: '2026-09-26',
    neededBy: '2026-10-05',
    delivery: 'Digital PDF',
    notes: '',
    status: 'in-progress',
  },
  {
    id: 'DR-1018',
    employeeName: 'Ananya Das',
    initials: 'AD',
    department: 'Finance',
    documentType: 'Salary Certificate',
    purpose: 'Rent agreement',
    requestedAt: '2026-09-12',
    neededBy: '2026-09-18',
    delivery: 'Digital PDF',
    notes: '',
    status: 'issued',
  },
  {
    id: 'DR-1012',
    employeeName: 'Jay Kapoor',
    initials: 'JK',
    department: 'Engineering',
    documentType: 'Form 16 (FY 2025-26)',
    purpose: 'Tax filing',
    requestedAt: '2026-09-05',
    neededBy: '2026-09-12',
    delivery: 'Digital PDF',
    notes: '',
    status: 'rejected',
    remarks: 'Missing information',
  },
];

const initialCollections: DocumentCollection[] = [
  {
    id: 'government-id',
    title: 'Government ID proof',
    sent: 38,
    total: 52,
    pendingPeople: [
      {
        id: 'p1',
        name: 'Arjun Rao',
        department: 'Engineering',
        lastReminded: '2026-10-07',
      },
      {
        id: 'p2',
        name: 'Dev Malhotra',
        department: 'Operations',
        lastReminded: null,
      },
      {
        id: 'p3',
        name: 'Sneha Iyer',
        department: 'Marketing',
        lastReminded: '2026-10-07',
      },
      {
        id: 'p4',
        name: 'Karan Patel',
        department: 'Sales',
        lastReminded: null,
      },
    ],
  },
  {
    id: 'bank-passbook',
    title: 'Bank passbook copy',
    sent: 44,
    total: 52,
    pendingPeople: [
      {
        id: 'p5',
        name: 'Meera S.',
        department: 'HR',
        lastReminded: null,
      },
      {
        id: 'p6',
        name: 'Jay Kapoor',
        department: 'Engineering',
        lastReminded: '2026-10-06',
      },
    ],
  },
  {
    id: 'qualification',
    title: 'Qualification certificate',
    sent: 52,
    total: 52,
    pendingPeople: [],
  },
];

const filterOptions: { value: RequestFilter; label: string }[] = [
  { value: 'pending', label: 'Waiting for you' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'issued', label: 'Issued' },
  { value: 'rejected', label: 'Rejected' },
];

const rejectChoices = [
  'Not eligible',
  'Missing information',
  'Duplicate request',
  'Something else',
];

const documentChoices = [
  'Government ID proof',
  'Bank passbook copy',
  'Qualification certificate',
  'Address proof',
  'PAN card',
];

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-GB').format(new Date(`${date}T00:00:00`));

const getDaysUntil = (date: string) => {
  const today = new Date(new Date().toDateString()).getTime();
  return Math.round(
    (new Date(`${date}T00:00:00`).getTime() - today) / 86400000
  );
};

const isOverdue = (request: DocumentRequest) =>
  (request.status === 'pending' || request.status === 'in-progress') &&
  getDaysUntil(request.neededBy) < 0;

const matchesFilter = (request: DocumentRequest, filter: RequestFilter) =>
  filter === 'overdue' ? isOverdue(request) : request.status === filter;

const getStatusBadge = (request: DocumentRequest) => {
  if (request.status === 'issued') {
    return { label: 'Issued', className: 'bg-success/10 text-success' };
  }

  if (request.status === 'rejected') {
    return { label: 'Rejected', className: 'bg-muted text-muted-foreground' };
  }

  const days = getDaysUntil(request.neededBy);

  if (days < 0) {
    return {
      label: `Overdue by ${Math.abs(days)} days`,
      className: 'bg-destructive/10 text-destructive',
    };
  }

  if (request.status === 'in-progress') {
    return { label: 'In progress', className: 'bg-primary/10 text-primary' };
  }

  if (days <= 1) {
    return {
      label: days === 0 ? 'Needed today' : 'Needed tomorrow',
      className: 'bg-accent text-accent-foreground',
    };
  }

  return {
    label: `Due in ${days} days`,
    className: days <= 3 ? 'bg-primary/10 text-primary' : 'bg-muted',
  };
};

const downloadLetter = (request: DocumentRequest) => {
  const fileContent = [
    request.documentType,
    '',
    `Employee: ${request.employeeName} (${request.department})`,
    `Purpose: ${request.purpose}`,
    `Requested: ${formatDate(request.requestedAt)}`,
    '',
    'This sample file represents the generated letter download workflow.',
  ].join('\n');
  const downloadUrl = URL.createObjectURL(
    new Blob([fileContent], { type: 'text/plain;charset=utf-8' })
  );
  const link = document.createElement('a');

  link.href = downloadUrl;
  link.download = `${request.documentType.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${request.employeeName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
};

const createRequestColumns = ({
  onReview,
}: {
  onReview: (request: DocumentRequest) => void;
}): ColumnDef<DocumentRequest>[] => [
  {
    accessorKey: 'employeeName',
    header: 'Employee',
    cell: ({ row }) => (
      <div className="flex min-w-44 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
          {row.original.initials}
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-foreground">
            {row.original.employeeName}
          </p>
          <p className="text-xs text-muted-foreground">
            {row.original.department}
          </p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'documentType',
    header: 'Document',
    cell: ({ row }) => (
      <div className="min-w-44">
        <p className="font-semibold text-foreground">
          {row.original.documentType}
        </p>
        <p className="text-xs text-muted-foreground">
          For {row.original.purpose.toLowerCase()}
        </p>
      </div>
    ),
  },
  {
    accessorKey: 'neededBy',
    header: 'Needed by',
    cell: ({ row }) => {
      const badge = getStatusBadge(row.original);

      return (
        <div className="min-w-36 space-y-1">
          <Badge
            variant="secondary"
            className={cn(
              'whitespace-nowrap border-transparent',
              badge.className
            )}
          >
            {badge.label}
          </Badge>
          <p className="text-xs text-muted-foreground">
            {formatDate(row.original.neededBy)}
          </p>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Action',
    enableSorting: false,
    cell: ({ row }) => (
      <Button
        type="button"
        size="sm"
        variant={row.original.status === 'pending' ? 'default' : 'outline'}
        aria-label={`Review ${row.original.documentType} for ${row.original.employeeName}`}
        onClick={() => onReview(row.original)}
      >
        {row.original.status === 'pending' ? 'Review' : 'View'}
      </Button>
    ),
  },
];

const DocumentRequestsPage = () => {
  const [requests, setRequests] = useState(initialRequests);
  const [collections, setCollections] = useState(initialCollections);
  const [filter, setFilter] = useState<RequestFilter>('pending');
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('all');

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [createdRequest, setCreatedRequest] = useState<DocumentRequest | null>(
    null
  );

  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectChoice, setRejectChoice] = useState('');
  const [rejectMessage, setRejectMessage] = useState('');
  const [allowResubmit, setAllowResubmit] = useState(true);

  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [requestDocs, setRequestDocs] = useState<string[]>([
    'Government ID proof',
    'Bank passbook copy',
  ]);
  const [requestAudience, setRequestAudience] = useState('all');
  const [requestDueDate, setRequestDueDate] = useState('');
  const [requestReminder, setRequestReminder] = useState('2');
  const [requestMessage, setRequestMessage] = useState('');

  const [remindCollection, setRemindCollection] =
    useState<DocumentCollection | null>(null);
  const [remindSelected, setRemindSelected] = useState<string[]>([]);
  const [remindMessage, setRemindMessage] = useState('');

  const selectedRequest =
    requests.find(request => request.id === selectedId) ?? null;
  const canDecide = selectedRequest?.status === 'pending';

  const departments = useMemo(
    () => [...new Set(requests.map(request => request.department))].sort(),
    [requests]
  );
  const departmentOptions = useMemo(
    () => [
      ...documentRequestDepartmentFilterOptions,
      ...departments.map(value => ({ value, label: value })),
    ],
    [departments]
  );

  const filterCounts = useMemo(
    () =>
      Object.fromEntries(
        filterOptions.map(option => [
          option.value,
          requests.filter(request => matchesFilter(request, option.value))
            .length,
        ])
      ) as Record<RequestFilter, number>,
    [requests]
  );

  const visibleRequests = useMemo(() => {
    const search = query.trim().toLowerCase();

    return requests
      .filter(
        request =>
          matchesFilter(request, filter) &&
          (department === 'all' || request.department === department) &&
          (!search ||
            request.employeeName.toLowerCase().includes(search) ||
            request.documentType.toLowerCase().includes(search))
      )
      .sort((first, second) => first.neededBy.localeCompare(second.neededBy));
  }, [department, filter, query, requests]);

  const openReview = useCallback((request: DocumentRequest) => {
    setSelectedId(request.id);
    setRemarks(request.remarks ?? '');
    setIsReviewOpen(true);
  }, []);

  const requestColumns = useMemo(
    () => createRequestColumns({ onReview: openReview }),
    [openReview]
  );

  const requestFilters = (
    <div className="space-y-3">
      <div
        role="group"
        aria-label="Request filter"
        className="flex flex-wrap gap-2"
      >
        {filterOptions.map(option => (
          <Button
            key={option.value}
            type="button"
            size="sm"
            className="rounded-full"
            variant={filter === option.value ? 'default' : 'outline'}
            aria-pressed={filter === option.value}
            onClick={() => setFilter(option.value)}
          >
            {option.label} {filterCounts[option.value]}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-56">
          <FormField
            label="Search"
            name="request-search"
            value={query}
            onChange={setQuery}
            placeholder="Employee or document"
          />
        </div>
        <div className="min-w-44">
          <FormField
            label="Department"
            name="request-department"
            type="select"
            value={department}
            onChange={setDepartment}
            options={departmentOptions}
          />
        </div>
        <Button variant="default" onClick={() => setIsRequestOpen(true)}>
          <Plus className="w-4 h-4" />
          Request Documents
        </Button>
      </div>
    </div>
  );

  const requestTableProps = {
    data: visibleRequests,
    columns: requestColumns,
    customFilters: requestFilters,
  };

  const renderRequestTab = () => {
    switch (filter) {
      case 'pending':
        return <WaitingForYouTab {...requestTableProps} />;
      case 'in-progress':
        return <InprogressTab {...requestTableProps} />;
      case 'overdue':
        return <OverDueTab {...requestTableProps} />;
      case 'issued':
        return <IssuedTab {...requestTableProps} />;
      case 'rejected':
        return <RejectedTab {...requestTableProps} />;
    }
  };

  const updateRequest = (id: string, changes: Partial<DocumentRequest>) => {
    setRequests(currentRequests =>
      currentRequests.map(request =>
        request.id === id ? { ...request, ...changes } : request
      )
    );
  };

  const handleApprove = () => {
    if (!selectedRequest || !canDecide) return;

    const approvedRequest: DocumentRequest = {
      ...selectedRequest,
      status: 'issued',
      remarks: remarks.trim() || undefined,
    };

    updateRequest(approvedRequest.id, {
      status: 'issued',
      remarks: approvedRequest.remarks,
    });
    setIsReviewOpen(false);
    setCreatedRequest(approvedRequest);
  };

  const handleSendForSignature = () => {
    if (!selectedRequest || !canDecide) return;

    updateRequest(selectedRequest.id, {
      status: 'in-progress',
      remarks: remarks.trim() || undefined,
    });
    toast.success(`"${selectedRequest.documentType}" sent for e-signature.`);
    setIsReviewOpen(false);
  };

  const closeRejectDialog = () => {
    setIsRejectOpen(false);
    setRejectChoice('');
    setRejectMessage('');
    setAllowResubmit(true);
  };

  const handleReject = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedRequest) return;

    if (!rejectChoice) {
      toast.error('Choose a reason for rejecting.');
      return;
    }

    if (rejectChoice === 'Something else' && !rejectMessage.trim()) {
      toast.error('Tell the employee why you are rejecting.');
      return;
    }

    updateRequest(selectedRequest.id, {
      status: 'rejected',
      remarks: [rejectChoice, rejectMessage.trim()].filter(Boolean).join(' – '),
    });
    toast.success(`Request from ${selectedRequest.employeeName} rejected.`);
    closeRejectDialog();
  };

  const closeRequestDialog = () => {
    setIsRequestOpen(false);
    setRequestDocs(['Government ID proof', 'Bank passbook copy']);
    setRequestAudience('all');
    setRequestDueDate('');
    setRequestReminder('2');
    setRequestMessage('');
  };

  const toggleRequestDoc = (title: string) => {
    setRequestDocs(currentDocs =>
      currentDocs.includes(title)
        ? currentDocs.filter(item => item !== title)
        : [...currentDocs, title]
    );
  };

  const audience =
    documentRequestAudienceOptions.find(
      option => option.value === requestAudience
    ) ?? documentRequestAudienceOptions[0];

  const handleRequestDocuments = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (requestDocs.length === 0) {
      toast.error('Choose at least one document.');
      return;
    }

    if (!requestDueDate) {
      toast.error('Pick a due date.');
      return;
    }

    const newCollections: DocumentCollection[] = requestDocs.map(title => ({
      id: `collection-${Date.now()}-${title}`,
      title,
      sent: 0,
      total: audience.people,
      pendingPeople: [],
    }));

    setCollections(currentCollections => [
      ...newCollections,
      ...currentCollections,
    ]);
    toast.success(`Request sent to ${audience.people} people.`);
    closeRequestDialog();
  };

  const openRemind = (collection: DocumentCollection) => {
    setRemindCollection(collection);
    setRemindSelected(collection.pendingPeople.map(person => person.id));
    setRemindMessage(
      `Please upload your ${collection.title.toLowerCase()} by the due date.`
    );
  };

  const closeRemindDialog = () => {
    setRemindCollection(null);
    setRemindSelected([]);
    setRemindMessage('');
  };

  const hiddenPendingCount = remindCollection
    ? Math.max(
        remindCollection.total -
          remindCollection.sent -
          remindCollection.pendingPeople.length,
        0
      )
    : 0;
  const remindCount = remindSelected.length + hiddenPendingCount;

  const handleRemind = () => {
    if (!remindCollection) return;

    if (remindCount === 0) {
      toast.error('Choose at least one person.');
      return;
    }

    const today = new Date().toISOString().slice(0, 10);

    setCollections(currentCollections =>
      currentCollections.map(collection =>
        collection.id === remindCollection.id
          ? {
              ...collection,
              pendingPeople: collection.pendingPeople.map(person =>
                remindSelected.includes(person.id)
                  ? { ...person, lastReminded: today }
                  : person
              ),
            }
          : collection
      )
    );
    toast.success(`Reminder sent to ${remindCount} people.`);
    closeRemindDialog();
  };

  return (
    <>
      <Section
        title="Document Requests"
        menuId="document-requests"
        showBreadcrumbs
      >
        <div className="space-y-6">
          {renderRequestTab()}

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              Collecting documents
            </h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {collections.map(collection => {
                const pendingCount = collection.total - collection.sent;

                return (
                  <Card
                    key={collection.id}
                    className="space-y-3 border-border p-4"
                  >
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <p className="font-semibold text-foreground">
                        {collection.title}
                      </p>
                      <span className="text-muted-foreground">
                        {collection.sent} of {collection.total} sent
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${(collection.sent / collection.total) * 100}%`,
                        }}
                      />
                    </div>
                    {pendingCount > 0 ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => openRemind(collection)}
                      >
                        <Bell className="h-4 w-4" aria-hidden="true" />
                        Remind {pendingCount} people
                      </Button>
                    ) : (
                      <p className="text-sm font-medium text-success">
                        Everyone has sent it
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      <Dialog
        open={isReviewOpen && Boolean(selectedRequest)}
        onOpenChange={open => !open && setIsReviewOpen(false)}
      >
        <DialogContent
          className="max-h-[92vh] overflow-y-auto sm:max-w-3xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {selectedRequest?.documentType} – {selectedRequest?.employeeName}
            </DialogTitle>
            <DialogDescription>
              {selectedRequest &&
                `${selectedRequest.id} · Requested ${formatDate(selectedRequest.requestedAt)}`}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="grid gap-6 md:grid-cols-[1.1fr_1fr]">
              <div className="rounded-xl bg-muted/50 p-4">
                <div className="space-y-2.5 rounded-lg bg-card p-5 text-sm leading-relaxed shadow-sm">
                  <div className="h-3 w-2/5 rounded bg-muted" />
                  <p className="pt-1">To whom it may concern,</p>
                  <p>
                    This is to certify that{' '}
                    <span className="rounded bg-primary/10 px-1.5 font-semibold text-primary">
                      {selectedRequest.employeeName}
                    </span>{' '}
                    works in the{' '}
                    <span className="rounded bg-primary/10 px-1.5 font-semibold text-primary">
                      {selectedRequest.department}
                    </span>{' '}
                    department of our company.
                  </p>
                  <p>
                    This letter is issued at their request for{' '}
                    <span className="rounded bg-primary/10 px-1.5 font-semibold text-primary">
                      {selectedRequest.purpose.toLowerCase()}
                    </span>
                    .
                  </p>
                  <div className="h-2 w-11/12 rounded bg-muted" />
                  <div className="h-2 w-4/5 rounded bg-muted" />
                  <p className="pt-2 text-xs text-muted-foreground">
                    HR Manager
                  </p>
                </div>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Preview of the letter that will be created
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2 text-sm">
                  {[
                    [
                      'Employee',
                      `${selectedRequest.employeeName} · ${selectedRequest.department}`,
                    ],
                    ['Purpose', selectedRequest.purpose],
                    [
                      'Needed by',
                      `${formatDate(selectedRequest.neededBy)} (${getStatusBadge(selectedRequest).label.toLowerCase()})`,
                    ],
                    ['Delivery', selectedRequest.delivery],
                    ['Notes', selectedRequest.notes || '–'],
                  ].map(([label, value]) => (
                    <Card
                      key={label}
                      className="flex justify-between gap-3 p-3"
                    >
                      <span className="font-medium">{label}</span>
                      <span className="text-right text-muted-foreground ">
                        {value}
                      </span>
                    </Card>
                  ))}
                </div>

                {canDecide ? (
                  <FormField
                    label="Remarks for the employee (optional)"
                    name="review-remarks"
                    value={remarks}
                    onChange={setRemarks}
                    placeholder="Add a short note"
                  />
                ) : (
                  selectedRequest.remarks && (
                    <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                      <strong className="text-foreground">Remarks:</strong>{' '}
                      {selectedRequest.remarks}
                    </p>
                  )
                )}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:justify-between">
            {canDecide ? (
              <>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    setIsReviewOpen(false);
                    setIsRejectOpen(true);
                  }}
                >
                  Reject
                </Button>
                <div className="flex flex-col-reverse gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSendForSignature}
                  >
                    <PenLine className="h-4 w-4" aria-hidden="true" />
                    Send for e-signature
                  </Button>
                  <Button type="button" onClick={handleApprove}>
                    Approve &amp; generate
                  </Button>
                </div>
              </>
            ) : (
              <Button
                type="button"
                variant="destructive"
                className="sm:ml-auto"
                onClick={() => setIsReviewOpen(false)}
              >
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(createdRequest)}
        onOpenChange={open => !open && setCreatedRequest(null)}
      >
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader className="items-center text-center sm:text-center">
            <span className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
              <Check className="h-7 w-7" aria-hidden="true" />
            </span>
            <DialogTitle>
              Letter created for {createdRequest?.employeeName}
            </DialogTitle>
            <DialogDescription>
              {createdRequest?.documentType} is ready to share.
            </DialogDescription>
          </DialogHeader>

          {createdRequest && (
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {createdRequest.documentType} – {createdRequest.employeeName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {createdRequest.delivery}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:justify-center">
            {createdRequest && (
              <>
                <Button
                  type="button"
                  variant="success"
                  onClick={() => {
                    downloadLetter(createdRequest);
                    toast.success(
                      `Downloading "${createdRequest.documentType}".`
                    );
                  }}
                >
                  <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
                  Download
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    toast.success(
                      `Letter sent to ${createdRequest.employeeName}.`
                    );
                    setCreatedRequest(null);
                  }}
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Send to {createdRequest.employeeName.split(' ')[0]}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isRejectOpen}
        onOpenChange={open => !open && closeRejectDialog()}
      >
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Reject request</DialogTitle>
            <DialogDescription>
              {selectedRequest?.documentType} · {selectedRequest?.employeeName}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleReject} className="space-y-4">
            <FormField
              label="Reason"
              name="reject-choice"
              type="radio"
              value={rejectChoice}
              onChange={setRejectChoice}
              options={rejectChoices.map(choice => ({
                value: choice,
                label: choice,
              }))}
            />

            <FormField
              label={`Message to ${selectedRequest?.employeeName.split(' ')[0] ?? 'the employee'}`}
              name="reject-message"
              value={rejectMessage}
              onChange={setRejectMessage}
              placeholder="e.g. Please add your loan reference number"
            />

            <FormField
              label="Let them fix this and resubmit"
              name="allow-resubmit"
              type="checkbox"
              value={allowResubmit}
              onCheckboxChange={setAllowResubmit}
            />

            <div className="flex gap-3 rounded-lg bg-accent p-3 text-sm text-accent-foreground">
              <AlertTriangle
                className="mt-0.5 h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              <span>
                The employee will get your message by email and in the app.
              </span>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={closeRejectDialog}
              >
                Cancel
              </Button>
              <Button type="submit" variant="default">
                Reject request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isRequestOpen}
        onOpenChange={open => !open && closeRequestDialog()}
      >
        <DialogContent
          className="max-h-[92vh] overflow-y-auto sm:max-w-xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Request Documents</DialogTitle>
            <DialogDescription>
              Ask your team to send documents. They get reminders automatically.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRequestDocuments} className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-semibold text-foreground">
                Which documents do you need?
              </p>
              <div className="flex flex-wrap gap-2">
                {documentChoices.map(title => {
                  const isSelected = requestDocs.includes(title);

                  return (
                    <Button
                      key={title}
                      type="button"
                      size="sm"
                      className="rounded-full"
                      variant={isSelected ? 'default' : 'outline'}
                      aria-pressed={isSelected}
                      onClick={() => toggleRequestDoc(title)}
                    >
                      {isSelected && (
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      {title}
                    </Button>
                  );
                })}
              </div>
            </div>

            <FormField
              label="Who should send them?"
              name="request-audience"
              type="select"
              value={requestAudience}
              onChange={setRequestAudience}
              options={documentRequestAudienceOptions}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Due date"
                name="request-due-date"
                type="date"
                value={requestDueDate}
                onChange={setRequestDueDate}
                required
              />
              <FormField
                label="Reminders"
                name="request-reminders"
                type="select"
                value={requestReminder}
                onChange={setRequestReminder}
                options={documentRequestReminderOptions}
              />
            </div>

            <FormField
              label="Message (optional)"
              name="request-message"
              value={requestMessage}
              onChange={setRequestMessage}
              placeholder="Please upload clear scans before the due date."
            />

            <p className="rounded-lg bg-primary/10 p-3 text-sm text-primary">
              {audience.people} people will get an email and an in-app notice.
            </p>

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={closeRequestDialog}
              >
                Cancel
              </Button>
              <Button type="submit">
                <Send className="h-4 w-4" aria-hidden="true" />
                Send to {audience.people} people
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(remindCollection)}
        onOpenChange={open => !open && closeRemindDialog()}
      >
        <DialogContent
          className="max-h-[92vh] overflow-y-auto sm:max-w-lg"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {remindCollection &&
                `Remind ${remindCollection.total - remindCollection.sent} people`}
            </DialogTitle>
            <DialogDescription>{remindCollection?.title}</DialogDescription>
          </DialogHeader>

          {remindCollection && (
            <div className="space-y-4">
              <div>
                <div className="py-2">
                  <FormField
                    label={`Select all (${remindCollection.total - remindCollection.sent})`}
                    name="select-all-reminders"
                    type="checkbox"
                    value={
                      remindSelected.length ===
                      remindCollection.pendingPeople.length
                    }
                    onCheckboxChange={checked =>
                      setRemindSelected(
                        checked
                          ? remindCollection.pendingPeople.map(
                              person => person.id
                            )
                          : []
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  {remindCollection.pendingPeople.map(person => (
                    <Card key={person.id} className="p-3">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="min-w-0 flex-1">
                          <FormField
                            label={person.name}
                            name={`remind-${person.id}`}
                            type="checkbox"
                            value={remindSelected.includes(person.id)}
                            onCheckboxChange={checked =>
                              setRemindSelected(current =>
                                checked
                                  ? [...current, person.id]
                                  : current.filter(id => id !== person.id)
                              )
                            }
                          />
                          <span className="ml-6 block text-xs text-muted-foreground">
                            {person.department}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {person.lastReminded
                            ? `Last reminded ${formatDate(person.lastReminded)}`
                            : 'Not reminded yet'}
                        </span>
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary"
                          aria-hidden="true"
                        >
                          {person.name
                            .split(' ')
                            .map(part => part[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
                {hiddenPendingCount > 0 && (
                  <p className="pt-2 text-xs text-muted-foreground">
                    {hiddenPendingCount} more people will be reminded too.
                  </p>
                )}
              </div>

              <FormField
                label="Message (optional)"
                name="remind-message"
                value={remindMessage}
                onChange={setRemindMessage}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              onClick={closeRemindDialog}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleRemind}>
              <Bell className="h-4 w-4" aria-hidden="true" />
              Send reminder to {remindCount} people
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentRequestsPage;
