import { Fragment, useCallback, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { ChevronRight, Plus, Receipt } from 'lucide-react';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { TanStackTable } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { claimCategories } from '@/data/reusableDropdownData';

type ClaimStatus = 'pending' | 'approved' | 'paid' | 'rejected';
type ClaimFilter = 'all' | ClaimStatus;

interface Claim {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: number;
  status: ClaimStatus;
  nextStep: string;
}

interface StatusConfig {
  label: string;
  detail: string;
  cardClass: string;
  dotClass: string;
  badgeClass: string;
}

interface BuyoutOption {
  id: string;
  title: string;
  description: string;
  availability: string;
  daysLabel: string;
  days: number;
  ratePerDay: number;
  actionLabel: string;
  actionVariant: 'default' | 'outline';
}

const statusFlow: ClaimStatus[] = ['pending', 'approved', 'paid'];

const filterOptions: ClaimFilter[] = [
  'all',
  'pending',
  'approved',
  'paid',
  'rejected',
];

const statusConfig: Record<ClaimStatus, StatusConfig> = {
  pending: {
    label: 'Pending review',
    detail: 'Waiting for approval',
    cardClass: 'border-border bg-muted',
    dotClass: 'bg-secondary-foreground',
    badgeClass: 'bg-secondary text-secondary-foreground',
  },
  approved: {
    label: 'Approved',
    detail: 'Will be added to October payroll',
    cardClass: 'border-primary/20 bg-primary/5',
    dotClass: 'bg-primary',
    badgeClass: 'bg-primary/10 text-primary',
  },
  paid: {
    label: 'Paid',
    detail: 'Credited to your account',
    cardClass: 'border-accent bg-accent/50',
    dotClass: 'bg-accent-foreground',
    badgeClass: 'bg-accent text-accent-foreground',
  },
  rejected: {
    label: 'Rejected',
    detail: 'Fix the issue and resubmit',
    cardClass: 'border-destructive/20 bg-destructive/5',
    dotClass: 'bg-destructive',
    badgeClass: 'bg-destructive/10 text-destructive',
  },
};

const initialClaims: Claim[] = [
  {
    id: 'CLM-001',
    title: 'Client visit cab',
    category: 'Travel',
    date: '2026-10-02',
    amount: 4850,
    status: 'approved',
    nextStep: 'Paid in October payroll',
  },
  {
    id: 'CLM-002',
    title: 'Internet bill, Sep',
    category: 'Utilities',
    date: '2026-09-30',
    amount: 1200,
    status: 'pending',
    nextStep: 'With your manager',
  },
  {
    id: 'CLM-003',
    title: 'Health checkup',
    category: 'Medical',
    date: '2026-09-24',
    amount: 3500,
    status: 'paid',
    nextStep: 'Credited on 28 Sep',
  },
  {
    id: 'CLM-004',
    title: 'Team lunch',
    category: 'Meals',
    date: '2026-09-19',
    amount: 1850,
    status: 'pending',
    nextStep: 'With the finance team',
  },
  {
    id: 'CLM-005',
    title: 'Phone bill, Sep',
    category: 'Utilities',
    date: '2026-09-12',
    amount: 999,
    status: 'rejected',
    nextStep: 'Invoice missing.',
  },
];

const buyoutOptions: BuyoutOption[] = [
  {
    id: 'notice',
    title: 'Notice period buyout',
    description: 'Pay instead of serving your notice',
    availability: '30 days left',
    daysLabel: 'Days to buy out',
    days: 30,
    ratePerDay: 2355,
    actionLabel: 'Request notice buyout',
    actionVariant: 'default',
  },
  {
    id: 'leave',
    title: 'Leave encashment',
    description: 'Get paid for unused leave',
    availability: '18 days available',
    daysLabel: 'Days to encash',
    days: 18,
    ratePerDay: 1178,
    actionLabel: 'Request leave encashment',
    actionVariant: 'default',
  },
];

const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const getClaimsByStatus = (items: Claim[], status: ClaimStatus) =>
  items.filter(claim => claim.status === status);

const getTotal = (items: Claim[]) =>
  items.reduce((total, claim) => total + claim.amount, 0);

const createClaimColumns = (
  onResubmit: (claimId: string) => void
): ColumnDef<Claim>[] => [
  {
    accessorKey: 'title',
    header: 'Claim',
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="truncate font-medium ">{row.original.title}</p>
        <p className="text-xs ">{row.original.category}</p>
      </div>
    ),
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ getValue }) => formatDate(getValue<string>()),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ getValue }) => formatCurrency(getValue<number>()),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<ClaimStatus>();

      return (
        <Badge variant="secondary" className={statusConfig[status].badgeClass}>
          {statusConfig[status].label}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'nextStep',
    header: 'Next step',
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground sm:text-sm">
        {row.original.nextStep}{' '}
        {row.original.status === 'rejected' && (
          <Button
            type="button"
            variant="link"
            size="xs"
            className="h-auto px-0 py-0 text-xs"
            onClick={() => onResubmit(row.original.id)}
          >
            Resubmit
          </Button>
        )}
      </span>
    ),
  },
];

const StatusSummaryCard = ({
  status,
  claims,
}: {
  status: ClaimStatus;
  claims: Claim[];
}) => {
  const config = statusConfig[status];
  const statusClaims = getClaimsByStatus(claims, status);

  return (
    <Section
      className={`rounded-xl xl:flex-1 ${config.cardClass}`}
      contentClassName="p-4"
    >
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 shrink-0 rounded-full ${config.dotClass}`} />
        <p className="text-sm font-semibold text-card-foreground">
          {config.label}
        </p>
      </div>
      <p className="mt-2 text-xl font-bold tracking-tight text-card-foreground">
        {formatCurrency(getTotal(statusClaims))}
      </p>
      <p className="text-xs text-muted-foreground">
        {statusClaims.length} {statusClaims.length === 1 ? 'claim' : 'claims'}
      </p>
      <p className="mt-3 text-sm text-card-foreground">{config.detail}</p>
    </Section>
  );
};

const BuyoutCard = ({
  option,
  requested,
  onRequest,
}: {
  option: BuyoutOption;
  requested: boolean;
  onRequest: (option: BuyoutOption) => void;
}) => (
  <Section className="rounded-xl border-border" contentClassName="bg-card p-4">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="font-semibold text-card-foreground">{option.title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {option.description}
        </p>
      </div>
      <Badge
        variant="secondary"
        className="shrink-0 bg-muted text-muted-foreground"
      >
        {option.availability}
      </Badge>
    </div>

    <div className="mt-3 space-y-1.5 rounded-lg bg-muted p-3 text-sm">
      <div className="flex justify-between gap-3">
        <span className="text-muted-foreground">{option.daysLabel}</span>
        <span className="font-medium text-card-foreground">
          {option.days} days
        </span>
      </div>
      <div className="flex justify-between gap-3">
        <span className="text-muted-foreground">Rate per day</span>
        <span className="font-medium text-card-foreground">
          {formatCurrency(option.ratePerDay)}
        </span>
      </div>
      <div className="flex items-baseline justify-between gap-3 border-t border-dashed border-border pt-2">
        <span className="font-medium text-card-foreground">
          Estimated amount
        </span>
        <span className="text-xl font-bold tracking-tight text-card-foreground">
          {formatCurrency(option.days * option.ratePerDay)}
        </span>
      </div>
    </div>

    <Button
      type="button"
      variant={option.actionVariant}
      className="mt-3 w-auto"
      disabled={requested}
      onClick={() => onRequest(option)}
    >
      {requested ? 'Request submitted' : option.actionLabel}
    </Button>
  </Section>
);

const ReimbursementBuyoutPage = () => {
  const [filter, setFilter] = useState<ClaimFilter>('all');
  const [claimList, setClaimList] = useState(initialClaims);
  const [isNewClaimOpen, setIsNewClaimOpen] = useState(false);
  const [claimTitle, setClaimTitle] = useState('');
  const [claimCategory, setClaimCategory] = useState('Travel');
  const [claimAmount, setClaimAmount] = useState('');
  const [requestedBuyouts, setRequestedBuyouts] = useState<string[]>([]);

  const visibleClaims =
    filter === 'all'
      ? claimList
      : claimList.filter(claim => claim.status === filter);

  const getFilterLabel = (option: ClaimFilter) => {
    const label = option === 'all' ? 'All' : statusConfig[option].label;
    const count =
      option === 'all'
        ? claimList.length
        : getClaimsByStatus(claimList, option).length;
    return `${label} ${count}`;
  };

  const handleResubmit = useCallback((claimId: string) => {
    setClaimList(currentClaims =>
      currentClaims.map(claim =>
        claim.id === claimId
          ? {
              ...claim,
              status: 'pending',
              nextStep: 'Resubmitted for review',
            }
          : claim
      )
    );
    setFilter('all');
    toast.success('Claim resubmitted for review.');
  }, []);

  const claimColumns = useMemo(
    () => createClaimColumns(handleResubmit),
    [handleResubmit]
  );

  const handleCreateClaim = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = Number(claimAmount);
    if (!claimTitle.trim() || !Number.isFinite(amount) || amount <= 0) {
      toast.error('Enter a claim name and a valid amount.');
      return;
    }

    const claimDate = new Date().toISOString().slice(0, 10);
    const newClaim: Claim = {
      id: `CLM-${Date.now()}`,
      title: claimTitle.trim(),
      category: claimCategory,
      date: claimDate,
      amount,
      status: 'pending',
      nextStep: 'Waiting for approval',
    };

    setClaimList(currentClaims => [newClaim, ...currentClaims]);
    setFilter('all');
    setClaimTitle('');
    setClaimCategory('Travel');
    setClaimAmount('');
    setIsNewClaimOpen(false);
    toast.success('Claim added and submitted for review.');
  };

  const handleBuyoutRequest = (option: BuyoutOption) => {
    setRequestedBuyouts(current => [...current, option.id]);
    toast.success(`${option.title} request submitted.`);
  };

  return (
    <>
      <div className="mx-auto w-full space-y-4">
        <Section
          title="Reimbursement & Buyout"
          menuId="reimbursements-and-buyouts"
          showBreadcrumbs
        >
          <div className="flex flex-col gap-3 xl:flex-row xl:items-stretch">
            {statusFlow.map((status, index) => (
              <Fragment key={status}>
                {index > 0 && (
                  <ChevronRight
                    className="hidden h-5 w-5 shrink-0 self-center text-muted-foreground xl:block"
                    aria-hidden="true"
                  />
                )}
                <StatusSummaryCard status={status} claims={claimList} />
              </Fragment>
            ))}
            <span className="mx-2 hidden w-px bg-border xl:block" />
            <StatusSummaryCard status="rejected" claims={claimList} />
          </div>
        </Section>

        <Section
          title="Your claims"
          icon={Receipt}
          contentClassName="bg-card p-3 sm:p-4"
        >
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="min-w-0 space-y-4 lg:col-span-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  {filterOptions.map(option => (
                    <Button
                      key={option}
                      type="button"
                      size="sm"
                      variant={filter === option ? 'secondary' : 'outline'}
                      className="rounded-full"
                      aria-pressed={filter === option}
                      onClick={() => setFilter(option)}
                    >
                      {getFilterLabel(option)}
                    </Button>
                  ))}
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="self-start"
                  onClick={() => setIsNewClaimOpen(true)}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  New claim
                </Button>
              </div>

              <TanStackTable
                data={visibleClaims}
                columns={claimColumns}
                enableSearch={false}
                enableSorting={false}
                enableColumnVisibility={false}
                enablePagination={false}
                hideFooter
                getRowId={claim => claim.id}
                emptyMessage="No claims with this status."
                className="space-y-0 rounded-lg"
                headerClassName="bg-muted"
                bodyClassName="bg-transparent"
              />
            </div>
            <div className="min-w-0 space-y-4">
              {buyoutOptions.map(option => (
                <BuyoutCard
                  key={option.id}
                  option={option}
                  requested={requestedBuyouts.includes(option.id)}
                  onRequest={handleBuyoutRequest}
                />
              ))}
            </div>
          </div>
        </Section>
      </div>

      <Dialog open={isNewClaimOpen} onOpenChange={setIsNewClaimOpen}>
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>New reimbursement claim</DialogTitle>
            <DialogDescription>
              Add the claim details to submit it for review.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateClaim} className="space-y-4">
            <FormField
              label="Category"
              name="claim-category"
              type="select"
              value={claimCategory}
              onChange={setClaimCategory}
              options={claimCategories}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                label="Claim name"
                name="claim-title"
                value={claimTitle}
                onChange={setClaimTitle}
                placeholder="e.g. Client visit cab"
                required
              />

              <FormField
                label="Amount (₹)"
                name="claim-amount"
                type="number"
                value={claimAmount}
                onChange={setClaimAmount}
                min="1"
                step="1"
                placeholder="0"
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsNewClaimOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit claim</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReimbursementBuyoutPage;
