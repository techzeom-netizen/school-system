import { type FormEvent, useMemo, useRef, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Headphones,
  Laptop,
  Monitor,
  Package,
  PackageCheck,
  Plus,
  ShieldCheck,
  ClipboardList,
  CreditCard,
  Smartphone,
  Undo2,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { TanStackTable } from '@/components/common';
import {
  assetDetails,
  assetCategoryOptions,
  assetProblemOptions,
  assetReturnModeOptions,
  assetSpecifications,
  assetStatusFilterOptions,
  assetUrgencyOptions,
  type AssetKind,
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

type AssetStatus = 'pending' | 'confirmed' | 'returning';
type StatusFilter = 'all' | AssetStatus;
type RequestStatus =
  | 'Submitted'
  | 'Manager approved'
  | 'In progress'
  | 'Issued'
  | 'Cancelled';
type ProblemType = 'Not working properly' | 'Damaged' | 'Lost or stolen';
type ReturnMode = 'Hand over to IT desk' | 'Courier to office';
type Urgency = 'Normal' | 'Urgent';

interface HistoryEntry {
  at: string;
  text: string;
}

interface Asset {
  id: string;
  name: string;
  kind: AssetKind;
  tag: string;
  givenOn: string;
  status: AssetStatus;
  confirmedAt: string | null;
  details: { label: string; value: string }[];
  specs: { label: string; value: string }[];
  returnBy: string | null;
  returnMode: ReturnMode | null;
  returnStep: number;
  history: HistoryEntry[];
}

interface AssetRequest {
  id: string;
  title: string;
  createdAt: string;
  status: RequestStatus;
  assetId: string | null;
  isRepair: boolean;
}

const initialAssets: Asset[] = [
  {
    id: 'asset-laptop',
    name: 'Dell Latitude laptop',
    kind: 'laptop',
    tag: 'AST-LAP-00231',
    givenOn: '2026-08-12',
    status: 'confirmed',
    confirmedAt: '2026-08-12T11:20:00',
    details: assetDetails.laptop,
    specs: assetSpecifications.laptop,
    returnBy: null,
    returnMode: null,
    returnStep: 0,
    history: [
      { at: '2026-07-28T09:00:00', text: 'Added to inventory' },
      { at: '2026-08-12T10:05:00', text: 'Given to you by IT admin' },
      { at: '2026-08-12T11:20:00', text: 'Confirmed by you' },
    ],
  },
  {
    id: 'asset-phone',
    name: 'Samsung Galaxy S23 phone',
    kind: 'phone',
    tag: 'AST-MOB-00412',
    givenOn: '2026-10-05',
    status: 'pending',
    confirmedAt: null,
    details: assetDetails.phone,
    specs: assetSpecifications.phone,
    returnBy: null,
    returnMode: null,
    returnStep: 0,
    history: [
      { at: '2026-10-01T09:00:00', text: 'Added to inventory' },
      { at: '2026-10-05T12:30:00', text: 'Given to you by IT admin' },
    ],
  },
  {
    id: 'asset-card',
    name: 'Office access card',
    kind: 'card',
    tag: 'AST-ACC-00877',
    givenOn: '2026-08-12',
    status: 'confirmed',
    confirmedAt: '2026-08-12T11:22:00',
    details: assetDetails.card,
    specs: assetSpecifications.card,
    returnBy: null,
    returnMode: null,
    returnStep: 0,
    history: [
      { at: '2026-08-10T09:00:00', text: 'Card issued by admin' },
      { at: '2026-08-12T10:05:00', text: 'Given to you' },
      { at: '2026-08-12T11:22:00', text: 'Confirmed by you' },
    ],
  },
  {
    id: 'asset-monitor',
    name: 'Dell 24 inch monitor',
    kind: 'monitor',
    tag: 'AST-MON-00305',
    givenOn: '2026-08-12',
    status: 'returning',
    confirmedAt: '2026-08-12T11:21:00',
    details: assetDetails.monitor,
    specs: assetSpecifications.monitor,
    returnBy: '2026-10-20',
    returnMode: 'Hand over to IT desk',
    returnStep: 0,
    history: [
      { at: '2026-08-12T10:05:00', text: 'Given to you by IT admin' },
      { at: '2026-08-12T11:21:00', text: 'Confirmed by you' },
      { at: '2026-10-09T15:40:00', text: 'Return requested by you' },
    ],
  },
];

const initialRequests: AssetRequest[] = [
  {
    id: 'REQ-2026-0193',
    title: 'Headset request',
    createdAt: '2026-10-08',
    status: 'Manager approved',
    assetId: null,
    isRepair: false,
  },
  {
    id: 'REQ-2026-0187',
    title: 'Laptop battery repair',
    createdAt: '2026-10-02',
    status: 'In progress',
    assetId: 'asset-laptop',
    isRepair: true,
  },
];

const assetIcons: Record<AssetKind, LucideIcon> = {
  laptop: Laptop,
  phone: Smartphone,
  card: CreditCard,
  monitor: Monitor,
  headset: Headphones,
  other: Package,
};

const returnSteps = [
  'Return requested',
  'Handed over',
  'Condition checked',
  'Closed',
];

const closedRequestStatuses: RequestStatus[] = ['Issued', 'Cancelled'];
const minDetailLength = 10;

const isStatusFilter = (value: string): value is StatusFilter =>
  assetStatusFilterOptions.some(option => option.value === value);

const isProblemType = (value: string): value is ProblemType =>
  assetProblemOptions.some(option => option.value === value);

const isReturnMode = (value: string): value is ReturnMode =>
  assetReturnModeOptions.some(option => option.value === value);

const isUrgency = (value: string): value is Urgency =>
  assetUrgencyOptions.some(option => option.value === value);

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

const dateOffset = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString('en-CA');
};

const isRequestOpen = (request: AssetRequest) =>
  !closedRequestStatuses.includes(request.status);

const requestStatusClasses: Record<RequestStatus, string> = {
  Submitted: 'bg-accent text-accent-foreground',
  'Manager approved': 'bg-primary/10 text-primary',
  'In progress': 'bg-accent text-accent-foreground',
  Issued: 'bg-primary/10 text-primary',
  Cancelled: 'bg-muted text-muted-foreground',
};

const requestBadgeClass = (status: RequestStatus) => {
  return requestStatusClasses[status];
};

const assetStatusPresentation: Record<
  AssetStatus,
  { label: string; className: string }
> = {
  pending: {
    label: 'Needs your confirmation',
    className: 'bg-accent text-accent-foreground',
  },
  confirmed: { label: 'Confirmed', className: 'bg-primary/10 text-primary' },
  returning: {
    label: 'Being returned',
    className: 'bg-primary/10 text-primary',
  },
};

const AssetStatusBadge = ({ status }: { status: AssetStatus }) => {
  const presentation = assetStatusPresentation[status];

  return (
    <Badge className={`border-transparent ${presentation.className}`}>
      {presentation.label}
    </Badge>
  );
};

const SummaryCard = ({
  icon: Icon,
  label,
  value,
  tone = 'primary',
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  tone?: 'primary' | 'warning';
}) => (
  <Card className="flex items-center gap-3 border-border p-4">
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
        tone === 'warning'
          ? 'bg-accent text-accent-foreground'
          : 'bg-primary/10 text-primary'
      }`}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold text-card-foreground">{value}</p>
    </div>
  </Card>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-4 border-b border-border py-2 text-sm last:border-b-0">
    <span className="font-medium">{label}</span>
    <span className="text-right text-muted-foreground">{value}</span>
  </div>
);

const createAssetColumns = ({
  onConfirm,
  onView,
  onTrack,
}: {
  onConfirm: (asset: Asset) => void;
  onView: (asset: Asset) => void;
  onTrack: (asset: Asset) => void;
}): ColumnDef<Asset>[] => [
  {
    accessorKey: 'name',
    header: 'Item',
    cell: ({ row }) => {
      const asset = row.original;
      const Icon = assetIcons[asset.kind];
      return (
        <div className="flex min-w-64 items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="font-medium text-foreground">{asset.name}</p>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
              {asset.details.map(detail => (
                <span key={detail.label}>
                  {detail.label}{' '}
                  <span className="font-medium text-foreground">
                    {detail.value}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'tag',
    header: 'Tag',
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: 'givenOn',
    header: 'Given on',
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {row.original.status === 'returning' && row.original.returnBy
          ? `Return by ${formatDate(row.original.returnBy)}`
          : formatDate(row.original.givenOn)}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <AssetStatusBadge status={row.original.status} />,
  },
  {
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    cell: ({ row }) => {
      const asset = row.original;
      if (asset.status === 'pending') {
        return (
          <Button type="button" size="sm" onClick={() => onConfirm(asset)}>
            Confirm
          </Button>
        );
      }
      if (asset.status === 'returning') {
        return (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onTrack(asset)}
          >
            Track
          </Button>
        );
      }
      return (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onView(asset)}
        >
          View
        </Button>
      );
    },
  },
];

const MyAssetsPage = () => {
  const [assets, setAssets] = useState(initialAssets);
  const [requests, setRequests] = useState(initialRequests);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [showAllRequests, setShowAllRequests] = useState(false);
  const requestSequence = useRef(193);

  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [confirmNote, setConfirmNote] = useState('');

  const [viewId, setViewId] = useState<string | null>(null);
  const [trackId, setTrackId] = useState<string | null>(null);

  const [problemId, setProblemId] = useState<string | null>(null);
  const [problemType, setProblemType] = useState<ProblemType>(
    'Not working properly'
  );
  const [problemDescription, setProblemDescription] = useState('');

  const [returnId, setReturnId] = useState<string | null>(null);
  const [returnDate, setReturnDate] = useState(dateOffset(3));
  const [returnMode, setReturnMode] = useState<ReturnMode>(
    'Hand over to IT desk'
  );

  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [requestCategory, setRequestCategory] = useState('Laptop');
  const [requestReason, setRequestReason] = useState('');
  const [requestUrgency, setRequestUrgency] = useState<Urgency>('Normal');
  const [requestNeededBy, setRequestNeededBy] = useState('');

  const [withdrawId, setWithdrawId] = useState<string | null>(null);

  const findAsset = (id: string | null) =>
    assets.find(asset => asset.id === id) ?? null;
  const confirmAsset = findAsset(confirmId);
  const viewAsset = findAsset(viewId);
  const trackAsset = findAsset(trackId);
  const problemAsset = findAsset(problemId);
  const returnAsset = findAsset(returnId);
  const withdrawRequest =
    requests.find(request => request.id === withdrawId) ?? null;

  const hasOpenRepair = (asset: Asset) =>
    requests.some(
      request =>
        request.assetId === asset.id &&
        request.isRepair &&
        isRequestOpen(request)
    );

  const pendingCount = assets.filter(
    asset => asset.status === 'pending'
  ).length;
  const returningCount = assets.filter(
    asset => asset.status === 'returning'
  ).length;
  const openRequestCount = requests.filter(isRequestOpen).length;

  const visibleAssets = useMemo(
    () =>
      assets.filter(
        asset => statusFilter === 'all' || asset.status === statusFilter
      ),
    [assets, statusFilter]
  );
  const sortedRequests = useMemo(
    () =>
      [...requests].sort((first, second) => (first.id < second.id ? 1 : -1)),
    [requests]
  );
  const visibleRequests = showAllRequests
    ? sortedRequests
    : sortedRequests.slice(0, 3);

  const updateAsset = (id: string, change: (asset: Asset) => Asset) =>
    setAssets(current =>
      current.map(asset => (asset.id === id ? change(asset) : asset))
    );

  const addHistory = (asset: Asset, text: string): HistoryEntry[] => [
    ...asset.history,
    { at: new Date().toISOString(), text },
  ];

  const nextRequestId = () => {
    requestSequence.current += 1;
    return `REQ-2026-${String(requestSequence.current).padStart(4, '0')}`;
  };

  const assetColumns = useMemo(
    () =>
      createAssetColumns({
        onConfirm: asset => openConfirmDialog(asset.id),
        onView: asset => setViewId(asset.id),
        onTrack: asset => setTrackId(asset.id),
      }),
    []
  );

  function openConfirmDialog(id: string) {
    setConfirmId(id);
    setIsAcknowledged(false);
    setConfirmNote('');
  }

  const openProblemDialog = (asset: Asset) => {
    setViewId(null);
    setProblemId(asset.id);
    setProblemType('Not working properly');
    setProblemDescription('');
  };

  const openReturnDialog = (asset: Asset) => {
    if (hasOpenRepair(asset)) {
      toast.error(
        'This item has an open repair request. Return it after the repair is done.'
      );
      return;
    }
    setViewId(null);
    setReturnId(asset.id);
    setReturnDate(dateOffset(3));
    setReturnMode('Hand over to IT desk');
  };

  const backToDetails = (id: string) => {
    setProblemId(null);
    setReturnId(null);
    setViewId(id);
  };

  const closeRequestForm = () => {
    setIsRequestFormOpen(false);
    setRequestCategory('Laptop');
    setRequestReason('');
    setRequestUrgency('Normal');
    setRequestNeededBy('');
  };

  const handleConfirmReceipt = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!confirmAsset) return;

    if (!isAcknowledged) {
      toast.error('Tick the box to confirm you received this item.');
      return;
    }

    const note = confirmNote.trim();
    updateAsset(confirmAsset.id, asset => ({
      ...asset,
      status: 'confirmed',
      confirmedAt: new Date().toISOString(),
      history: addHistory(
        asset,
        note ? `Confirmed by you (note: ${note})` : 'Confirmed by you'
      ),
    }));
    toast.success(`Receipt confirmed for "${confirmAsset.name}".`);
    setConfirmId(null);
  };

  const handleReportProblem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!problemAsset) return;

    if (problemDescription.trim().length < minDetailLength) {
      toast.error(
        `Describe the problem in at least ${minDetailLength} characters.`
      );
      return;
    }

    const requestId = nextRequestId();
    setRequests(current => [
      ...current,
      {
        id: requestId,
        title: `${problemType}: ${problemAsset.name}`,
        createdAt: dateOffset(0),
        status: 'Submitted',
        assetId: problemAsset.id,
        isRepair: problemType !== 'Lost or stolen',
      },
    ]);
    updateAsset(problemAsset.id, asset => ({
      ...asset,
      history: addHistory(asset, `Problem reported (${problemType})`),
    }));
    toast.success(`Report sent. Request ${requestId}.`);
    setProblemId(null);
  };

  const handleRequestReturn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!returnAsset) return;

    if (!returnDate || returnDate < dateOffset(0)) {
      toast.error('Pick today or a future date for the return.');
      return;
    }

    updateAsset(returnAsset.id, asset => ({
      ...asset,
      status: 'returning',
      returnBy: returnDate,
      returnMode,
      returnStep: 0,
      history: addHistory(asset, 'Return requested by you'),
    }));
    toast.success(`Return requested for "${returnAsset.name}".`);
    setReturnId(null);
  };

  const handleCancelReturn = () => {
    if (!trackAsset) return;

    updateAsset(trackAsset.id, asset => ({
      ...asset,
      status: 'confirmed',
      returnBy: null,
      returnMode: null,
      returnStep: 0,
      history: addHistory(asset, 'Return cancelled by you'),
    }));
    toast.success('Return cancelled.');
    setTrackId(null);
  };

  const handleSubmitRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (requestReason.trim().length < minDetailLength) {
      toast.error(
        `Explain why you need it in at least ${minDetailLength} characters.`
      );
      return;
    }
    if (requestNeededBy && requestNeededBy < dateOffset(0)) {
      toast.error('Pick today or a future date for "Needed by".');
      return;
    }

    const requestId = nextRequestId();
    setRequests(current => [
      ...current,
      {
        id: requestId,
        title: `${requestCategory} request${
          requestUrgency === 'Urgent' ? ' (urgent)' : ''
        }`,
        createdAt: dateOffset(0),
        status: 'Submitted',
        assetId: null,
        isRepair: false,
      },
    ]);
    setShowAllRequests(false);
    closeRequestForm();
    toast.success(`Request submitted. ${requestId}.`);
  };

  const handleWithdrawRequest = () => {
    if (!withdrawRequest) return;

    setRequests(current =>
      current.map(request =>
        request.id === withdrawRequest.id
          ? { ...request, status: 'Cancelled' }
          : request
      )
    );
    toast.success(`Request ${withdrawRequest.id} withdrawn.`);
    setWithdrawId(null);
  };

  const firstPending = assets.find(asset => asset.status === 'pending');

  return (
    <>
      <Section title="My Assets" menuId="my-assets" showBreadcrumbs>
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              icon={Package}
              label="Total items"
              value={assets.length}
            />
            <SummaryCard
              icon={ShieldCheck}
              label="To confirm"
              value={pendingCount}
              tone="warning"
            />
            <SummaryCard
              icon={ClipboardList}
              label="Open requests"
              value={openRequestCount}
            />
            <SummaryCard
              icon={Undo2}
              label="Return due"
              value={returningCount}
            />
          </div>

          {pendingCount > 0 && firstPending && (
            <Card className="flex flex-wrap items-center gap-3 border-accent bg-primary/10 p-4 text-accent-foreground">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent-foreground" />
              <p className="text-sm">
                You have {pendingCount} new{' '}
                {pendingCount > 1 ? 'items' : 'item'} to confirm.
              </p>
              <Button
                type="button"
                size="sm"
                className="ml-auto"
                onClick={() => openConfirmDialog(firstPending.id)}
              >
                Confirm now
              </Button>
            </Card>
          )}

          <TanStackTable
            data={visibleAssets}
            columns={assetColumns}
            enableSearch={false}
            showDownload={true}
            enableColumnVisibility
            enablePagination
            pageSize={8}
            pageSizeOptions={[8, 10, 20]}
            getRowId={asset => asset.id}
            emptyMessage="No assets match these filters."
            customFilters={
              <div className="flex flex-wrap items-end gap-3">
                <div className="min-w-40">
                  <FormField
                    label="Status"
                    name="asset-status"
                    type="select"
                    value={statusFilter}
                    onChange={value => {
                      if (isStatusFilter(value)) setStatusFilter(value);
                    }}
                    options={assetStatusFilterOptions}
                  />
                </div>
                <Button
                  variant="default"
                  onClick={() => setIsRequestFormOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                  Request Asset
                </Button>
              </div>
            }
          />

          <Section title="Recent request" contentClassName="p-4">
            <div className="flex items-center justify-end">
              {requests.length > 3 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllRequests(current => !current)}
                >
                  {showAllRequests
                    ? 'Show less'
                    : `View all (${requests.length})`}
                </Button>
              )}
            </div>

            <div className="mt-3 divide-y divide-border">
              {visibleRequests.length === 0 && (
                <p className="py-3 text-sm text-muted-foreground">
                  No requests yet. Use &quot;Request Asset&quot; to raise one.
                </p>
              )}
              {visibleRequests.map(request => {
                const canWithdraw =
                  request.status === 'Submitted' ||
                  request.status === 'Manager approved';
                return (
                  <div
                    key={request.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">
                        {request.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {request.id} · {formatDate(request.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {canWithdraw && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setWithdrawId(request.id)}
                        >
                          Withdraw
                        </Button>
                      )}
                      <Badge
                        className={`border-transparent ${requestBadgeClass(request.status)}`}
                      >
                        {request.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        </div>
      </Section>

      <Dialog
        open={Boolean(confirmAsset)}
        onOpenChange={open => !open && setConfirmId(null)}
      >
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Confirm you received this item</DialogTitle>
            <DialogDescription>
              Check the details below before you confirm.
            </DialogDescription>
          </DialogHeader>

          {confirmAsset && (
            <form onSubmit={handleConfirmReceipt} className="space-y-4">
              <div
                className="rounded-lg border border-border px-3"
                role="group"
                aria-label="Item details"
              >
                <DetailRow label="Item" value={confirmAsset.name} />
                <DetailRow label="Tag" value={confirmAsset.tag} />
                {confirmAsset.details.map(detail => (
                  <DetailRow
                    key={detail.label}
                    label={detail.label}
                    value={detail.value}
                  />
                ))}
              </div>

              <FormField
                label="I received this item in the condition shown above and I will use it as per the company asset policy."
                name="confirm-receipt"
                type="checkbox"
                value={isAcknowledged}
                onCheckboxChange={setIsAcknowledged}
                className="rounded-lg bg-muted/40 p-3"
              />

              <FormField
                label="Note (optional)"
                name="confirm-note"
                value={confirmNote}
                onChange={setConfirmNote}
                placeholder="e.g. Small scratch on the back"
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setConfirmId(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">Confirm receipt</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(viewAsset)}
        onOpenChange={open => !open && setViewId(null)}
      >
        <DialogContent
          className="sm:max-w-2xl max-h-auto"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{viewAsset?.name}</DialogTitle>
            <DialogDescription>Item details and history.</DialogDescription>
          </DialogHeader>

          {viewAsset && (
            <div className="space-y-4">
              <div
                className="rounded-lg border border-border px-3"
                role="group"
                aria-label="Item details"
              >
                <DetailRow label="Tag" value={viewAsset.tag} />
                <DetailRow
                  label="Given on"
                  value={formatDate(viewAsset.givenOn)}
                />
                {viewAsset.details.map(detail => (
                  <DetailRow
                    key={detail.label}
                    label={detail.label}
                    value={detail.value}
                  />
                ))}
                {viewAsset.specs.map(spec => (
                  <DetailRow
                    key={spec.label}
                    label={spec.label}
                    value={spec.value}
                  />
                ))}
                {viewAsset.confirmedAt && (
                  <DetailRow
                    label="Confirmed by you"
                    value={formatDateTime(viewAsset.confirmedAt)}
                  />
                )}
              </div>

              {hasOpenRepair(viewAsset) && (
                <Card className="border-accent bg-accent/30 p-3 text-sm text-accent-foreground">
                  This item has an open repair request. You can return it after
                  the repair is done.
                </Card>
              )}

              <div>
                <p className="text-sm font-medium text-foreground">History</p>
                <div className="relative mt-2 space-y-3" role="list">
                  {[...viewAsset.history].reverse().map(entry => (
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
              variant="destructive"
              onClick={() => viewAsset && openProblemDialog(viewAsset)}
            >
              Report a problem
            </Button>
            <Button
              type="button"
              onClick={() => viewAsset && openReturnDialog(viewAsset)}
            >
              <PackageCheck className="h-4 w-4" aria-hidden="true" />
              Return this item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(problemAsset)}
        onOpenChange={open => !open && setProblemId(null)}
      >
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Report a problem</DialogTitle>
            <DialogDescription>
              {problemAsset?.name}. Tell the asset team what went wrong.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleReportProblem} className="space-y-4">
            <FormField
              label="What happened?"
              name="problem-type"
              type="select"
              value={problemType}
              onChange={value => {
                if (isProblemType(value)) setProblemType(value);
              }}
              options={assetProblemOptions}
              required
            />
            <FormField
              label="Describe the problem"
              name="problem-description"
              type="textarea"
              value={problemDescription}
              onChange={setProblemDescription}
              placeholder="e.g. Battery drains in under an hour"
              required
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => problemAsset && backToDetails(problemAsset.id)}
              >
                Back
              </Button>
              <Button type="submit">Submit report</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(returnAsset)}
        onOpenChange={open => !open && setReturnId(null)}
      >
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Return this item</DialogTitle>
            <DialogDescription>
              {returnAsset?.name}. Choose when and how you will return it.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRequestReturn} className="space-y-4">
            <FormField
              label="Return date"
              name="return-date"
              type="date"
              value={returnDate}
              onChange={setReturnDate}
              required
            />
            <FormField
              label="How will you return it?"
              name="return-mode"
              type="select"
              value={returnMode}
              onChange={value => {
                if (isReturnMode(value)) setReturnMode(value);
              }}
              options={assetReturnModeOptions}
              required
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => returnAsset && backToDetails(returnAsset.id)}
              >
                Back
              </Button>
              <Button type="submit">Request return</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(trackAsset)}
        onOpenChange={open => !open && setTrackId(null)}
      >
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Track your return</DialogTitle>
            <DialogDescription>{trackAsset?.name}</DialogDescription>
          </DialogHeader>

          {trackAsset && (
            <div className="space-y-4">
              <div
                className="rounded-lg border border-border px-3"
                role="group"
                aria-label="Return details"
              >
                <DetailRow
                  label="Return by"
                  value={
                    trackAsset.returnBy ? formatDate(trackAsset.returnBy) : '-'
                  }
                />
                <DetailRow label="How" value={trackAsset.returnMode ?? '-'} />
              </div>

              <div className="space-y-3" role="list">
                {returnSteps.map((step, index) => {
                  const isDone = index <= trackAsset.returnStep;
                  return (
                    <div
                      key={step}
                      className="flex items-center gap-3 text-sm"
                      role="listitem"
                    >
                      <span
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                          isDone ? 'bg-primary' : 'border border-border'
                        }`}
                      />
                      <span
                        className={
                          isDone ? 'text-foreground' : 'text-muted-foreground'
                        }
                      >
                        {step}
                      </span>
                      {index === trackAsset.returnStep && (
                        <Badge className="border-transparent bg-primary/10 text-primary">
                          Current step
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              onClick={handleCancelReturn}
            >
              Cancel return
            </Button>
            <Button type="button" onClick={() => setTrackId(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isRequestFormOpen}
        onOpenChange={open => {
          if (open) {
            setIsRequestFormOpen(true);
          } else {
            closeRequestForm();
          }
        }}
      >
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Request an asset</DialogTitle>
            <DialogDescription>
              Your manager approves first, then the asset team issues it.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitRequest} className="space-y-4">
            <FormField
              label="What do you need?"
              name="request-category"
              type="select"
              value={requestCategory}
              onChange={setRequestCategory}
              options={assetCategoryOptions}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                label="How soon?"
                name="request-urgency"
                type="select"
                value={requestUrgency}
                onChange={value => {
                  if (isUrgency(value)) setRequestUrgency(value);
                }}
                options={assetUrgencyOptions}
                required
              />
              <FormField
                label="Needed by (optional)"
                name="request-needed-by"
                type="date"
                value={requestNeededBy}
                onChange={setRequestNeededBy}
              />
            </div>
            <FormField
              label="Why do you need it?"
              name="request-reason"
              type="textarea"
              value={requestReason}
              onChange={setRequestReason}
              placeholder="e.g. My current monitor is flickering"
              required
            />

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={closeRequestForm}
              >
                Cancel
              </Button>
              <Button type="submit">Submit request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(withdrawRequest)}
        onOpenChange={open => !open && setWithdrawId(null)}
      >
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Withdraw this request?</DialogTitle>
            <DialogDescription>
              {withdrawRequest?.title} ({withdrawRequest?.id}) will be
              cancelled. You can raise a new request any time.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="success"
              onClick={() => setWithdrawId(null)}
            >
              Keep it
            </Button>
            <Button type="button" onClick={handleWithdrawRequest}>
              Withdraw request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MyAssetsPage;
