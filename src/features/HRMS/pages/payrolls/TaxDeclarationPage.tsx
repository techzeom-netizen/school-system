import { type ReactNode, useCallback, useMemo, useState } from 'react';
import { Bell, Check, ClipboardCheck, Eye } from 'lucide-react';
import { toast } from 'sonner';
import type { ColumnDef } from '@tanstack/react-table';

import { FormField } from '@/components/common';
import Section from '@/components/common/Section';
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
import {
  taxDeclarationFilterOptions,
  taxDeclarationFinancialYearOptions,
} from '@/data/reusableDropdownData';
import AllTab from './tax-declaration/AllTab';
import ApprovedTab from './tax-declaration/ApprovedTab';
import NotSubmittedTab from './tax-declaration/NotSubmittedTab';
import WaitingForReviewTab from './tax-declaration/WaitingForReviewTab';
import type {
  Declaration,
  DeclarationItems,
  DeclarationStatus,
  FilterId,
  TaxRegime,
} from './tax-declaration/taxDeclarationTypes';

const currentYear = '2026-27';

const defaultLastDate = '2027-01-31';

const itemRows: { key: keyof DeclarationItems; label: string; hint: string }[] =
  [
    {
      key: 'section80C',
      label: 'Section 80C',
      hint: 'PF, life insurance, ELSS, tuition fees',
    },
    {
      key: 'section80D',
      label: 'Section 80D',
      hint: 'Health insurance premium',
    },
    { key: 'hra', label: 'House rent (HRA)', hint: 'Rent paid in the year' },
    {
      key: 'homeLoanInterest',
      label: 'Home loan interest',
      hint: 'Interest paid on a home loan',
    },
  ];

const statusLabels: Record<DeclarationStatus, string> = {
  approved: 'Approved',
  waiting: 'Waiting for review',
  notSubmitted: 'Not submitted',
};

const statusClasses: Record<DeclarationStatus, string> = {
  approved: 'border-transparent bg-primary/10 text-primary',
  waiting: 'border-transparent bg-accent/20 text-accent-foreground',
  notSubmitted: 'border-transparent bg-muted text-muted-foreground',
};

const makeDeclaration = (
  id: string,
  name: string,
  regime: TaxRegime | null,
  status: DeclarationStatus,
  items: DeclarationItems | null = null,
  submittedOn: string | null = null
): Declaration => ({
  id,
  name,
  employeeCode: id,
  regime,
  status,
  items,
  submittedOn,
  approvedOn: status === 'approved' ? submittedOn : null,
  sentBackReason: null,
  isReminded: false,
});

const sampleDeclarations = (): Declaration[] => [
  makeDeclaration(
    'EMP001',
    'Priya Sharma',
    'old',
    'approved',
    { section80C: 150000, section80D: 25000, hra: 120000, homeLoanInterest: 0 },
    '2026-10-12'
  ),
  makeDeclaration(
    'EMP002',
    'Arjun Mehta',
    'new',
    'approved',
    null,
    '2026-10-10'
  ),
  makeDeclaration(
    'EMP003',
    'Kavya Nair',
    'old',
    'waiting',
    { section80C: 150000, section80D: 30000, hra: 0, homeLoanInterest: 30000 },
    '2026-10-20'
  ),
  makeDeclaration(
    'EMP004',
    'Rahul Verma',
    'old',
    'waiting',
    { section80C: 100000, section80D: 20000, hra: 0, homeLoanInterest: 0 },
    '2026-10-22'
  ),
  makeDeclaration('EMP005', 'Sneha Iyer', null, 'notSubmitted'),
  makeDeclaration(
    'EMP006',
    'Imran Khan',
    'old',
    'approved',
    { section80C: 150000, section80D: 35000, hra: 0, homeLoanInterest: 0 },
    '2026-10-05'
  ),
  makeDeclaration('EMP007', 'Divya Rao', null, 'notSubmitted'),
  makeDeclaration(
    'EMP008',
    'Karthik Subramanian',
    'old',
    'waiting',
    { section80C: 70000, section80D: 25000, hra: 0, homeLoanInterest: 0 },
    '2026-10-24'
  ),
  makeDeclaration(
    'EMP009',
    'Meera Pillai',
    'new',
    'approved',
    null,
    '2026-10-08'
  ),
  makeDeclaration('EMP010', 'Nikhil Joshi', null, 'notSubmitted'),
  makeDeclaration(
    'EMP011',
    'Ananya Das',
    'old',
    'approved',
    { section80C: 120000, section80D: 25000, hra: 96000, homeLoanInterest: 0 },
    '2026-10-03'
  ),
  makeDeclaration('EMP012', 'Vikram Singh', null, 'notSubmitted'),
  makeDeclaration(
    'EMP013',
    'Lakshmi Menon',
    'old',
    'waiting',
    { section80C: 150000, section80D: 0, hra: 84000, homeLoanInterest: 0 },
    '2026-10-25'
  ),
  makeDeclaration(
    'EMP014',
    'Rohan Gupta',
    'new',
    'approved',
    null,
    '2026-10-11'
  ),
];

const previousYearDeclarations = (): Declaration[] =>
  sampleDeclarations().map(row => ({
    ...row,
    status: 'approved',
    regime: row.regime ?? 'new',
    submittedOn: row.submittedOn ?? '2025-12-15',
    approvedOn: row.approvedOn ?? '2025-12-20',
    items:
      row.regime === 'new'
        ? null
        : (row.items ?? {
            section80C: 100000,
            section80D: 0,
            hra: 0,
            homeLoanInterest: 0,
          }),
  }));

const initialRecords = (): Record<string, Declaration[]> => ({
  '2026-27': sampleDeclarations(),
  '2025-26': previousYearDeclarations(),
});

const pluralize = (count: number, singular: string, plural = `${singular}s`) =>
  count === 1 ? singular : plural;

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '-';

const getTotal = (items: DeclarationItems | null) =>
  items ? Object.values(items).reduce((sum, value) => sum + value, 0) : 0;

const getToday = () => new Date().toISOString().slice(0, 10);

const StatCard = ({
  value,
  label,
  valueClass = 'text-foreground',
}: {
  value: number;
  label: string;
  valueClass?: string;
}) => (
  <Card className="flex-1 p-5" style={{ minWidth: '9rem' }}>
    <p className={`text-3xl font-bold ${valueClass}`}>{value}</p>
    <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
  </Card>
);

const StatusBadge = ({ status }: { status: DeclarationStatus }) => (
  <Badge className={statusClasses[status]}>{statusLabels[status]}</Badge>
);

const ReviewDialog = ({
  row,
  onClose,
  onApprove,
  onSendBack,
}: {
  row: Declaration;
  onClose: () => void;
  onApprove: () => void;
  onSendBack: (reason: string) => void;
}) => {
  const [isSendingBack, setIsSendingBack] = useState(false);
  const [reason, setReason] = useState('');
  const isReviewing = row.status === 'waiting';

  const handleSendBack = () => {
    if (!reason.trim()) {
      toast.error('Write a short reason so the employee knows what to fix.');
      return;
    }
    onSendBack(reason.trim());
  };

  return (
    <Dialog open onOpenChange={open => !open && onClose()}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto"
        onInteractOutside={event => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{row.name}</DialogTitle>
          <DialogDescription>
            {row.employeeCode} · {row.regime === 'new' ? 'New' : 'Old'} tax
            regime
          </DialogDescription>
        </DialogHeader>

        {row.regime === 'new' || !row.items ? (
          <p className="rounded-xl bg-muted/40 p-4 text-sm text-muted-foreground">
            This employee chose the new tax regime, so no savings need to be
            declared.
          </p>
        ) : (
          <div className="divide-y divide-border rounded-xl border border-border">
            {itemRows.map(item => (
              <div
                key={item.key}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.hint}</p>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {formatMoney(row.items?.[item.key] ?? 0)}
                </p>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4 bg-muted/30 px-4 py-3">
              <p className="text-sm font-semibold text-foreground">Total</p>
              <p className="text-sm font-bold text-foreground">
                {formatMoney(getTotal(row.items))}
              </p>
            </div>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          Submitted on {formatDate(row.submittedOn)}
          {row.status === 'approved' &&
            ` · Approved on ${formatDate(row.approvedOn)}`}
        </p>

        {isReviewing && isSendingBack && (
          <div className="space-y-2">
            <FormField
              label="What should the employee fix?"
              name="tax-send-back-reason"
              type="textarea"
              value={reason}
              onChange={setReason}
              rows={3}
              placeholder="For example: please upload the rent receipts."
            />
          </div>
        )}

        <DialogFooter>
          {isReviewing && !isSendingBack && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSendingBack(true)}
              >
                Send back
              </Button>
              <Button type="button" onClick={onApprove}>
                <Check /> Approve
              </Button>
            </>
          )}
          {isReviewing && isSendingBack && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSendingBack(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleSendBack}>
                Send back to employee
              </Button>
            </>
          )}
          {!isReviewing && (
            <Button type="button" variant="destructive" onClick={onClose}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const RowAction = ({
  row,
  onOpen,
  onRemind,
}: {
  row: Declaration;
  onOpen: () => void;
  onRemind: () => void;
}): ReactNode => {
  if (row.status === 'waiting') {
    return (
      <Button type="button" size="sm" onClick={onOpen}>
        <ClipboardCheck className="w-4 h-4" />
      </Button>
    );
  }
  if (row.status === 'approved') {
    return (
      <Button type="button" size="sm" variant="outline" onClick={onOpen}>
        <Eye className="w-4 h-4" />
      </Button>
    );
  }
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      disabled={row.isReminded}
      onClick={onRemind}
    >
      <Bell className="w-4 h-4" />
    </Button>
  );
};

const TaxDeclarationPage = () => {
  const [records, setRecords] = useState(initialRecords);
  const [year, setYear] = useState(currentYear);
  const [lastDates, setLastDates] = useState<Record<string, string>>({
    '2026-27': defaultLastDate,
    '2025-26': '2026-01-31',
  });
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [dateDraft, setDateDraft] = useState(defaultLastDate);
  const [filter, setFilter] = useState<FilterId>('all');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = records[year];
  const isCurrentYear = year === currentYear;

  const counts = useMemo(
    () => ({
      all: rows.length,
      approved: rows.filter(row => row.status === 'approved').length,
      waiting: rows.filter(row => row.status === 'waiting').length,
      notSubmitted: rows.filter(row => row.status === 'notSubmitted').length,
    }),
    [rows]
  );

  const filteredRows = useMemo(() => {
    const search = query.trim().toLowerCase();
    return rows.filter(
      row =>
        !search ||
        row.name.toLowerCase().includes(search) ||
        row.employeeCode.toLowerCase().includes(search)
    );
  }, [rows, query]);

  const tabRows =
    filter === 'all'
      ? filteredRows
      : filteredRows.filter(row => row.status === filter);
  const TabContent = {
    all: AllTab,
    approved: ApprovedTab,
    waiting: WaitingForReviewTab,
    notSubmitted: NotSubmittedTab,
  }[filter];

  const pendingReminders = rows.filter(
    row => row.status === 'notSubmitted' && !row.isReminded
  );
  const openRow = rows.find(row => row.id === openId) ?? null;

  const updateRows = (updater: (current: Declaration[]) => Declaration[]) =>
    setRecords(current => ({ ...current, [year]: updater(current[year]) }));

  const handleYearChange = (value: string) => {
    setYear(value);
    setFilter('all');
    setQuery('');
    setIsEditingDate(false);
    setOpenId(null);
  };

  const handleFilterChange = (value: FilterId) => {
    setFilter(value);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
  };

  const handleStartDateEdit = () => {
    setDateDraft(lastDates[year]);
    setIsEditingDate(true);
  };

  const handleSaveDate = () => {
    if (!dateDraft) {
      toast.error('Pick a date first.');
      return;
    }
    if (dateDraft < getToday()) {
      toast.error('The last date cannot be in the past.');
      return;
    }
    setLastDates(current => ({ ...current, [year]: dateDraft }));
    setIsEditingDate(false);
    toast.success(`Last date changed to ${formatDate(dateDraft)}.`);
  };

  const handleRemindAll = () => {
    if (pendingReminders.length === 0) {
      toast.info('Everyone has already been reminded.');
      return;
    }
    const ids = new Set(pendingReminders.map(row => row.id));
    updateRows(current =>
      current.map(row => (ids.has(row.id) ? { ...row, isReminded: true } : row))
    );
    toast.success(
      `Reminder sent to ${pendingReminders.length} ${pluralize(
        pendingReminders.length,
        'employee'
      )}.`
    );
  };

  const handleRemindOne = useCallback(
    (row: Declaration) => {
      setRecords(current => ({
        ...current,
        [year]: current[year].map(item =>
          item.id === row.id ? { ...item, isReminded: true } : item
        ),
      }));
      toast.success(`Reminder sent to ${row.name}.`);
    },
    [year]
  );

  const handleApprove = () => {
    if (!openRow) return;
    updateRows(current =>
      current.map(row =>
        row.id === openRow.id
          ? {
              ...row,
              status: 'approved',
              approvedOn: getToday(),
              sentBackReason: null,
            }
          : row
      )
    );
    toast.success(`${openRow.name}'s declaration approved.`);
    setOpenId(null);
  };

  const handleSendBack = (reason: string) => {
    if (!openRow) return;
    updateRows(current =>
      current.map(row =>
        row.id === openRow.id
          ? {
              ...row,
              status: 'notSubmitted',
              items: null,
              submittedOn: null,
              sentBackReason: reason,
              isReminded: false,
            }
          : row
      )
    );
    toast.success(`Sent back to ${openRow.name}.`);
    setOpenId(null);
  };

  const columns = useMemo<ColumnDef<Declaration>[]>(
    () => [
      {
        id: 'employee',
        header: 'Employee',
        accessorFn: row => row.name,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
              {row.original.name
                .split(' ')
                .map(part => part[0])
                .slice(0, 2)
                .join('')}
            </span>
            <div>
              <p className="font-semibold text-foreground">
                {row.original.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {row.original.employeeCode}
              </p>
            </div>
          </div>
        ),
      },
      {
        id: 'regime',
        header: 'Regime',
        accessorFn: row => row.regime ?? '-',
        cell: ({ row }) =>
          row.original.regime === 'old'
            ? 'Old'
            : row.original.regime === 'new'
              ? 'New'
              : '-',
      },
      {
        id: 'declared',
        header: 'Declared',
        accessorFn: row => (row.regime === 'old' ? getTotal(row.items) : 0),
        cell: ({ row }) =>
          row.original.regime === 'old'
            ? formatMoney(getTotal(row.original.items))
            : '-',
      },
      {
        id: 'submittedOn',
        header: 'Submitted on',
        accessorFn: row => row.submittedOn ?? '',
        cell: ({ row }) => formatDate(row.original.submittedOn),
      },
      {
        id: 'status',
        header: 'Status',
        accessorFn: row => statusLabels[row.status],
        cell: ({ row }) => (
          <div>
            <StatusBadge status={row.original.status} />
            {row.original.sentBackReason && (
              <p className="mt-1 max-w-[12rem] text-xs text-muted-foreground">
                Sent back: {row.original.sentBackReason}
              </p>
            )}
          </div>
        ),
      },
      {
        id: 'action',
        header: 'Action',
        enableSorting: false,
        cell: ({ row }) => (
          <RowAction
            row={row.original}
            onOpen={() => setOpenId(row.original.id)}
            onRemind={() => handleRemindOne(row.original)}
          />
        ),
      },
    ],
    [handleRemindOne]
  );

  return (
    <>
      <Section
        title="Tax Declaration"
        menuId="tax-declarations"
        showBreadcrumbs
      >
        <div className="space-y-6">
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <FormField
                label="Financial year"
                name="tax-financial-year"
                type="select"
                value={year}
                onChange={handleYearChange}
                options={taxDeclarationFinancialYearOptions}
                className="min-w-40"
              />
            </div>

            <div className="ml-auto flex flex-wrap items-end justify-end gap-3">
              {isEditingDate ? (
                <div className="flex flex-wrap items-end gap-2">
                  <FormField
                    label="Last date to submit"
                    name="tax-last-date"
                    type="date"
                    min={getToday()}
                    value={dateDraft}
                    onChange={setDateDraft}
                  />
                  <Button type="button" onClick={handleSaveDate}>
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setIsEditingDate(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <p className="flex min-h-11 items-center text-sm font-semibold text-foreground">
                  {formatDate(lastDates[year])}
                </p>
              )}
              {isCurrentYear && !isEditingDate && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleStartDateEdit}
                >
                  Change last date
                </Button>
              )}
              {isCurrentYear && (
                <Button
                  type="button"
                  disabled={pendingReminders.length === 0}
                  onClick={handleRemindAll}
                >
                  <Bell /> Remind {pendingReminders.length}{' '}
                  {pluralize(pendingReminders.length, 'employee')}
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <StatCard value={counts.all} label="Employees" />
            <StatCard
              value={counts.approved}
              label="Approved"
              valueClass="text-primary"
            />
            <StatCard
              value={counts.waiting}
              label="Waiting for review"
              valueClass="text-accent-foreground"
            />
            <StatCard
              value={counts.notSubmitted}
              label="Not submitted"
              valueClass="text-muted-foreground"
            />
          </div>

          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-end justify-between gap-4 px-6 pt-2">
              <div
                role="tablist"
                aria-label="Filter by status"
                className="flex flex-wrap gap-1"
              >
                {taxDeclarationFilterOptions.map(option => {
                  const tabId = option.value as FilterId;
                  const isActive = filter === tabId;
                  return (
                    <Button
                      key={option.value}
                      type="button"
                      variant="ghost"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => handleFilterChange(tabId)}
                      className={`h-12 rounded-none border-b-[3px] px-4 text-sm font-semibold ${
                        isActive
                          ? 'border-primary text-primary'
                          : 'border-transparent text-muted-foreground'
                      }`}
                    >
                      {option.label}
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                        {counts[tabId]}
                      </span>
                    </Button>
                  );
                })}
              </div>

              <div className="flex justify-end mb-2">
                <FormField
                  label="Search employees"
                  name="tax-search"
                  type="text"
                  value={query}
                  onChange={handleQueryChange}
                  placeholder="Search by name or ID"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <TabContent rows={tabRows} columns={columns} />
            </div>
          </Card>
        </div>
      </Section>

      {openRow && (
        <ReviewDialog
          key={openRow.id}
          row={openRow}
          onClose={() => setOpenId(null)}
          onApprove={handleApprove}
          onSendBack={handleSendBack}
        />
      )}
    </>
  );
};

export default TaxDeclarationPage;
