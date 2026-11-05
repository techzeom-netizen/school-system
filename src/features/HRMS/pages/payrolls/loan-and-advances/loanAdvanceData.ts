import type {
  LoanRecord,
  RecordStatus,
  RecordType,
  SegmentedOption,
  TypeFilter,
  ViewMode,
} from './loanAdvanceTypes';
export const recordTypes = [
  { value: 'Loan', label: 'Loan' },
  { value: 'Advance', label: 'Advance' },
];

export const typeFilters: TypeFilter[] = ['all', 'Loan', 'Advance'];
export const viewModeOptions: SegmentedOption<ViewMode>[] = [
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'closed', label: 'Closed' },
];

export const statusConfig: Record<
  RecordStatus,
  { label: string; dotClass: string; textClass: string }
> = {
  pending: {
    label: 'Pending',
    dotClass: 'bg-muted-foreground',
    textClass: 'text-muted-foreground',
  },
  active: {
    label: 'Active',
    dotClass: 'bg-primary',
    textClass: 'text-foreground',
  },
  paused: {
    label: 'Paused',
    dotClass: 'bg-destructive',
    textClass: 'text-destructive',
  },
  closed: {
    label: 'Closed',
    dotClass: 'bg-accent-foreground',
    textClass: 'text-muted-foreground',
  },
};

export const typeBadgeClass: Record<RecordType, string> = {
  Loan: 'bg-primary/10 text-primary',
  Advance: 'bg-secondary text-secondary-foreground',
};

export const initialRecords: LoanRecord[] = [
  {
    id: 'LN-2601',
    employee: 'Riya Sharma',
    type: 'Loan',
    purpose: 'Home renovation',
    financialYear: 'FY 2026-27',
    date: '2026-04-12',
    amount: 120000,
    months: 12,
    paidMonths: 3,
    status: 'active',
  },
  {
    id: 'LN-2602',
    employee: 'Arjun Patel',
    type: 'Advance',
    purpose: 'Medical expense',
    financialYear: 'FY 2026-27',
    date: '2026-05-03',
    amount: 30000,
    months: 3,
    paidMonths: 1,
    status: 'active',
  },
  {
    id: 'LN-2603',
    employee: 'Nisha Kumar',
    type: 'Loan',
    purpose: 'Education',
    financialYear: 'FY 2026-27',
    date: '2026-06-18',
    amount: 80000,
    months: 10,
    paidMonths: 2,
    status: 'pending',
  },
  {
    id: 'LN-2501',
    employee: 'Dev Mehta',
    type: 'Loan',
    purpose: 'Emergency support',
    financialYear: 'FY 2025-26',
    date: '2025-11-10',
    amount: 50000,
    months: 5,
    paidMonths: 5,
    status: 'closed',
  },
];

export const formatCurrency = (amount: number) =>
  `${amount.toLocaleString('en-IN')}`;

export const getEmi = (record: LoanRecord) =>
  Math.ceil(record.amount / record.months);

export const getOutstanding = (record: LoanRecord) =>
  Math.max(record.amount - getEmi(record) * record.paidMonths, 0);

export const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('');

export const getFilterLabel = (
  option: TypeFilter,
  records: LoanRecord[]
): string => {
  const label = option === 'all' ? 'All' : `${option}s`;
  const count =
    option === 'all'
      ? records.length
      : records.filter(record => record.type === option).length;
  return `${label} (${count})`;
};
