import { type FormEvent, useCallback, useMemo, useRef, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Check,
  CheckCircle2,
  Clock,
  Headphones,
  Laptop,
  Monitor,
  Package,
  PackageCheck,
  Plus,
  Smartphone,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { TanStackTable } from '@/components/common';
import {
  assetRequesterOptions,
  assetRequesters,
  assetRequestStatusFilterOptions,
  assetRequestStatusLabels,
  assetRequestTypeFilterOptions,
  assetRequestTypeOptions,
  assetRequestUrgencyFilterOptions,
  assetRequestUrgencyOptions,
  initialAssetRequests,
  type AssetRequester,
  type AssetRequestItem,
  type AssetRequestStatus,
  type AssetRequestStatusFilter,
  type AssetRequestType,
  type AssetRequestUrgency,
} from '@/data/reusableDropdownData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const typeIcons: Record<AssetRequestType, LucideIcon> = {
  laptop: Laptop,
  monitor: Monitor,
  mobile: Smartphone,
  headset: Headphones,
  furniture: Package,
};

const statusBadgeClass: Record<AssetRequestStatus, string> = {
  submitted: 'bg-accent text-accent-foreground',
  approved: 'bg-primary/10 text-primary',
  'in-progress': 'bg-secondary text-secondary-foreground',
  issued: 'bg-primary/10 text-primary',
  rejected: 'bg-destructive/10 text-destructive',
};

const statusDotClass: Record<AssetRequestStatus, string> = {
  submitted: 'bg-accent-foreground',
  approved: 'bg-primary',
  'in-progress': 'bg-secondary-foreground',
  issued: 'bg-primary',
  rejected: 'bg-destructive',
};

const avatarClasses = [
  'bg-primary/10 text-primary',
  'bg-secondary text-secondary-foreground',
  'bg-accent text-accent-foreground',
  'bg-muted text-muted-foreground',
  'bg-primary/10 text-primary',
];

const minDetailLength = 10;

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date.length === 10 ? `${date}T00:00:00` : date));

const formatDateTime = (date: string) =>
  new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));

const todayIso = () => new Date().toLocaleDateString('en-CA');

const findRequester = (id: string): AssetRequester | null =>
  assetRequesters.find(requester => requester.id === id) ?? null;

const getInitials = (name: string) =>
  name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const getTypeLabel = (type: AssetRequestType) =>
  assetRequestTypeOptions.find(option => option.value === type)?.label ?? type;

const getRequestTitle = (request: AssetRequestItem) =>
  `${getTypeLabel(request.assetType)} request`;

const isStatusFilter = (value: string): value is AssetRequestStatusFilter =>
  assetRequestStatusFilterOptions.some(option => option.value === value);

const isRequestType = (value: string): value is AssetRequestType =>
  assetRequestTypeOptions.some(option => option.value === value);

const isUrgency = (value: string): value is AssetRequestUrgency =>
  assetRequestUrgencyOptions.some(option => option.value === value);

const RequestStatusBadge = ({ status }: { status: AssetRequestStatus }) => (
  <Badge className={`gap-2 border-transparent ${statusBadgeClass[status]}`}>
    <span
      className={`h-2 w-2 shrink-0 rounded-full ${statusDotClass[status]}`}
      aria-hidden="true"
    />
    {assetRequestStatusLabels[status]}
  </Badge>
);

const UrgencyBadge = ({ urgency }: { urgency: AssetRequestUrgency }) => (
  <Badge
    className={`border-transparent ${
      urgency === 'Urgent'
        ? 'bg-destructive/10 text-destructive'
        : 'bg-muted text-muted-foreground'
    }`}
  >
    {urgency}
  </Badge>
);

const SummaryCard = ({
  icon: Icon,
  label,
  value,
  help,
  tone,
  isActive,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  help: string;
  tone: 'primary' | 'success' | 'warning' | 'info';
  isActive: boolean;
  onClick: () => void;
}) => {
  const toneClass = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-primary/10 text-primary',
    warning: 'bg-accent text-accent-foreground',
    info: 'bg-secondary text-secondary-foreground',
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className="rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <Card
        className={`flex items-center gap-4 p-4 transition-colors hover:bg-muted/40 ${
          isActive ? 'border-primary ring-1 ring-primary' : 'border-border'
        }`}
      >
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${toneClass}`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold text-card-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{help}</p>
        </div>
      </Card>
    </button>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-4 border-b border-border py-2 text-sm last:border-b-0">
    <span className="font-medium">{label}</span>
    <span className="text-right text-muted-foreground">{value}</span>
  </div>
);

const createRequestColumns = ({
  onApprove,
  onReject,
  onIssue,
  onView,
}: {
  onApprove: (request: AssetRequestItem) => void;
  onReject: (request: AssetRequestItem) => void;
  onIssue: (request: AssetRequestItem) => void;
  onView: (request: AssetRequestItem) => void;
}): ColumnDef<AssetRequestItem>[] => [
  {
    id: 'request',
    header: 'Request',
    accessorFn: request => getRequestTitle(request),
    cell: ({ row }) => {
      const request = row.original;
      const Icon = typeIcons[request.assetType];
      return (
        <div className="flex min-w-60 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-foreground">
              {getRequestTitle(request)}
            </p>
            <p className="text-xs text-muted-foreground">
              {request.id} · Raised {formatDate(request.raisedOn)}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    id: 'requester',
    header: 'Requested by',
    accessorFn: request => findRequester(request.requesterId)?.name ?? '',
    cell: ({ row }) => {
      const requester = findRequester(row.original.requesterId);
      if (!requester) return <span className="text-muted-foreground">-</span>;
      const index = assetRequesters.findIndex(item => item.id === requester.id);
      return (
        <div className="flex min-w-48 items-center gap-3">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
              avatarClasses[index % avatarClasses.length]
            }`}
            aria-hidden="true"
          >
            {getInitials(requester.name)}
          </span>
          <div className="min-w-0">
            <p className="font-medium text-foreground">{requester.name}</p>
            <p className="text-xs text-muted-foreground">
              {requester.department}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'urgency',
    header: 'Urgency',
    cell: ({ row }) => <UrgencyBadge urgency={row.original.urgency} />,
  },
  {
    accessorKey: 'neededBy',
    header: 'Needed by',
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-sm text-foreground">
        {row.original.neededBy
          ? formatDate(row.original.neededBy)
          : 'Not specified'}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <RequestStatusBadge status={row.original.status} />,
  },
  {
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    cell: ({ row }) => {
      const request = row.original;
      if (request.status === 'submitted') {
        return (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-destructive/40 text-destructive hover:text-destructive"
              onClick={() => onReject(request)}
            >
              Reject
            </Button>
            <Button type="button" size="sm" onClick={() => onApprove(request)}>
              <Check className="h-4 w-4" aria-hidden="true" />
              Approve
            </Button>
          </div>
        );
      }
      if (request.status === 'approved') {
        return (
          <Button type="button" size="sm" onClick={() => onIssue(request)}>
            Issue asset
          </Button>
        );
      }
      return (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onView(request)}
        >
          View details
        </Button>
      );
    },
  },
];

const AssetRequestsPage = () => {
  const [requests, setRequests] = useState(initialAssetRequests);
  const [statusFilter, setStatusFilter] =
    useState<AssetRequestStatusFilter>('all');
  const [search] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const requestSequence = useRef(201);

  const [viewId, setViewId] = useState<string | null>(null);

  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const [isNewOpen, setIsNewOpen] = useState(false);
  const [newRequesterId, setNewRequesterId] = useState(
    assetRequesterOptions[0]?.value ?? ''
  );
  const [newType, setNewType] = useState<AssetRequestType>('laptop');
  const [newUrgency, setNewUrgency] = useState<AssetRequestUrgency>('Normal');
  const [newNeededBy, setNewNeededBy] = useState('');
  const [newReason, setNewReason] = useState('');

  const viewRequest = requests.find(request => request.id === viewId) ?? null;
  const viewRequester = findRequester(viewRequest?.requesterId ?? '');
  const rejectRequest =
    requests.find(request => request.id === rejectId) ?? null;

  const countByStatus = (status: AssetRequestStatus) =>
    requests.filter(request => request.status === status).length;
  const statusCounts: Record<AssetRequestStatusFilter, number> = {
    all: requests.length,
    submitted: countByStatus('submitted'),
    approved: countByStatus('approved'),
    'in-progress': countByStatus('in-progress'),
    issued: countByStatus('issued'),
    rejected: countByStatus('rejected'),
  };

  const visibleRequests = useMemo(() => {
    const term = search.trim().toLowerCase();
    return requests.filter(request => {
      if (statusFilter !== 'all' && request.status !== statusFilter) {
        return false;
      }
      if (typeFilter !== 'all' && request.assetType !== typeFilter) {
        return false;
      }
      if (urgencyFilter !== 'all' && request.urgency !== urgencyFilter) {
        return false;
      }
      if (!term) return true;
      const requester = findRequester(request.requesterId);
      return [request.id, getRequestTitle(request), requester?.name ?? ''].some(
        value => value.toLowerCase().includes(term)
      );
    });
  }, [requests, statusFilter, typeFilter, urgencyFilter, search]);

  const changeStatus = useCallback(
    (id: string, status: AssetRequestStatus, historyText: string) =>
      setRequests(current =>
        current.map(request =>
          request.id === id
            ? {
                ...request,
                status,
                history: [
                  ...request.history,
                  { at: new Date().toISOString(), text: historyText },
                ],
              }
            : request
        )
      ),
    []
  );

  const closeNewDialog = () => {
    setIsNewOpen(false);
    setNewRequesterId(assetRequesterOptions[0]?.value ?? '');
    setNewType('laptop');
    setNewUrgency('Normal');
    setNewNeededBy('');
    setNewReason('');
  };

  const columns = useMemo(
    () =>
      createRequestColumns({
        onApprove: request => {
          changeStatus(request.id, 'approved', 'Approved by manager');
          toast.success(`${request.id} approved.`);
        },
        onReject: request => {
          setRejectReason('');
          setRejectId(request.id);
        },
        onIssue: request => {
          changeStatus(request.id, 'issued', 'Asset issued to employee');
          toast.success(`Asset issued for ${request.id}.`);
        },
        onView: request => setViewId(request.id),
      }),
    [changeStatus]
  );

  const handleCardClick = (filter: AssetRequestStatusFilter) =>
    setStatusFilter(filter);

  const handleReject = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!rejectRequest) return;

    const reason = rejectReason.trim();
    if (reason.length < minDetailLength) {
      toast.error(
        `Add a reason of at least ${minDetailLength} characters so the employee knows why.`
      );
      return;
    }

    changeStatus(rejectRequest.id, 'rejected', `Rejected (note: ${reason})`);
    toast.success(`${rejectRequest.id} rejected.`);
    setRejectId(null);
  };

  const handleSubmitRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!findRequester(newRequesterId)) {
      toast.error('Choose who the request is for.');
      return;
    }
    if (newReason.trim().length < minDetailLength) {
      toast.error(
        `Explain why it is needed in at least ${minDetailLength} characters.`
      );
      return;
    }
    if (newNeededBy && newNeededBy < todayIso()) {
      toast.error('Pick today or a future date for "Needed by".');
      return;
    }

    requestSequence.current += 1;
    const id = `REQ-2026-${String(requestSequence.current).padStart(4, '0')}`;
    const request: AssetRequestItem = {
      id,
      assetType: newType,
      requesterId: newRequesterId,
      urgency: newUrgency,
      neededBy: newNeededBy || null,
      raisedOn: todayIso(),
      reason: newReason.trim(),
      status: 'submitted',
      history: [{ at: new Date().toISOString(), text: 'Request submitted' }],
    };
    setRequests(current => [request, ...current]);
    toast.success(`Request submitted. ${id}.`);
    closeNewDialog();
  };

  return (
    <>
      <Section title="Asset Requests" menuId="assets-requests" showBreadcrumbs>
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              icon={Clock}
              label="Waiting for approval"
              value={statusCounts.submitted}
              help="Needs a manager decision"
              tone="warning"
              isActive={statusFilter === 'submitted'}
              onClick={() => handleCardClick('submitted')}
            />
            <SummaryCard
              icon={CheckCircle2}
              label="Approved"
              value={statusCounts.approved}
              help="Ready for the asset team"
              tone="primary"
              isActive={statusFilter === 'approved'}
              onClick={() => handleCardClick('approved')}
            />
            <SummaryCard
              icon={Truck}
              label="In progress"
              value={statusCounts['in-progress']}
              help="Being arranged"
              tone="info"
              isActive={statusFilter === 'in-progress'}
              onClick={() => handleCardClick('in-progress')}
            />
            <SummaryCard
              icon={PackageCheck}
              label="Issued"
              value={statusCounts.issued}
              help="Handed to the employee"
              tone="success"
              isActive={statusFilter === 'issued'}
              onClick={() => handleCardClick('issued')}
            />
          </div>

          <TanStackTable
            data={visibleRequests}
            columns={columns}
            enableSearch={false}
            showDownload={true}
            enableColumnVisibility
            enablePagination
            pageSize={8}
            pageSizeOptions={[8, 10, 20]}
            getRowId={request => request.id}
            emptyMessage="No requests match these filters."
            customFilters={
              <div className="w-full space-y-4">
                <div className="flex flex-wrap items-end gap-3">
                  <div className="min-w-44">
                    <FormField
                      label="Asset type"
                      name="request-type"
                      type="select"
                      value={typeFilter}
                      onChange={setTypeFilter}
                      options={assetRequestTypeFilterOptions}
                    />
                  </div>
                  <div className="min-w-44">
                    <FormField
                      label="Urgency"
                      name="request-urgency"
                      type="select"
                      value={urgencyFilter}
                      onChange={setUrgencyFilter}
                      options={assetRequestUrgencyFilterOptions}
                    />
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setIsNewOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                    New Request
                  </Button>
                </div>

                <div
                  className="flex flex-wrap gap-2"
                  role="group"
                  aria-label="Filter by status"
                >
                  {assetRequestStatusFilterOptions.map(option => {
                    const isActive = statusFilter === option.value;
                    return (
                      <Button
                        key={option.value}
                        type="button"
                        size="sm"
                        variant="outline"
                        aria-pressed={isActive}
                        className={`rounded-full ${
                          isActive
                            ? 'border-primary bg-primary/10 text-primary'
                            : ''
                        }`}
                        onClick={() => {
                          if (isStatusFilter(option.value)) {
                            handleCardClick(option.value);
                          }
                        }}
                      >
                        {option.label}
                        <span className="rounded-full bg-muted px-2 text-xs font-semibold text-foreground">
                          {statusCounts[option.value]}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            }
          />
        </div>
      </Section>

      <Dialog
        open={Boolean(viewRequest)}
        onOpenChange={open => !open && setViewId(null)}
      >
        <DialogContent
          className="sm:max-w-xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {viewRequest ? getRequestTitle(viewRequest) : 'Request details'}
            </DialogTitle>
            <DialogDescription>Request details and history.</DialogDescription>
          </DialogHeader>

          {viewRequest && (
            <div className="space-y-4">
              <div
                className="rounded-lg border border-border px-3"
                role="group"
                aria-label="Request details"
              >
                <DetailRow label="Request ID" value={viewRequest.id} />
                <DetailRow
                  label="Asset needed"
                  value={getTypeLabel(viewRequest.assetType)}
                />
                <DetailRow
                  label="Requested by"
                  value={
                    viewRequester
                      ? `${viewRequester.name} (${viewRequester.department})`
                      : '-'
                  }
                />
                <DetailRow label="Urgency" value={viewRequest.urgency} />
                <DetailRow
                  label="Needed by"
                  value={
                    viewRequest.neededBy
                      ? formatDate(viewRequest.neededBy)
                      : 'Not specified'
                  }
                />
                <DetailRow
                  label="Raised on"
                  value={formatDate(viewRequest.raisedOn)}
                />
                <DetailRow
                  label="Status"
                  value={assetRequestStatusLabels[viewRequest.status]}
                />
                <DetailRow label="Reason" value={viewRequest.reason} />
              </div>

              <div>
                <p className="text-sm font-medium text-foreground">History</p>
                <div className="mt-2 space-y-3" role="list">
                  {[...viewRequest.history].reverse().map(entry => (
                    <div
                      key={`${entry.at}-${entry.text}`}
                      className="flex items-start gap-3 text-sm"
                      role="listitem"
                    >
                      <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                      <div>
                        <p className="text-foreground">{entry.text}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(entry.at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="default"
              onClick={() => setViewId(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(rejectRequest)}
        onOpenChange={open => !open && setRejectId(null)}
      >
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Reject this request?</DialogTitle>
            <DialogDescription>
              {rejectRequest ? getRequestTitle(rejectRequest) : ''}{' '}
              {rejectRequest ? `(${rejectRequest.id})` : ''}. The employee will
              see your reason.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleReject} className="space-y-4">
            <FormField
              label="Reason for rejection"
              name="reject-reason"
              type="textarea"
              value={rejectReason}
              onChange={setRejectReason}
              placeholder="e.g. Budget freeze for this quarter"
              required
            />

            <DialogFooter>
              <Button
                type="button"
                variant="default"
                onClick={() => setRejectId(null)}
              >
                Keep request
              </Button>
              <Button type="submit" variant="destructive">
                Reject request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isNewOpen}
        onOpenChange={open => {
          if (open) {
            setIsNewOpen(true);
          } else {
            closeNewDialog();
          }
        }}
      >
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>New asset request</DialogTitle>
            <DialogDescription>
              The manager approves first, then the asset team issues it.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitRequest} className="space-y-4">
            <FormField
              label="Requested for"
              name="new-request-employee"
              type="select"
              value={newRequesterId}
              onChange={setNewRequesterId}
              options={assetRequesterOptions}
              required
            />
            <FormField
              label="What is needed?"
              name="new-request-type"
              type="select"
              value={newType}
              onChange={value => {
                if (isRequestType(value)) setNewType(value);
              }}
              options={assetRequestTypeOptions}
              required
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                label="How soon?"
                name="new-request-urgency"
                type="select"
                value={newUrgency}
                onChange={value => {
                  if (isUrgency(value)) setNewUrgency(value);
                }}
                options={assetRequestUrgencyOptions}
                required
              />
              <FormField
                label="Needed by (optional)"
                name="new-request-needed-by"
                type="date"
                value={newNeededBy}
                onChange={setNewNeededBy}
              />
            </div>
            <FormField
              label="Why is it needed?"
              name="new-request-reason"
              type="textarea"
              value={newReason}
              onChange={setNewReason}
              placeholder="e.g. My current monitor is flickering"
              required
            />

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={closeNewDialog}
              >
                Cancel
              </Button>
              <Button type="submit">Submit request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssetRequestsPage;
