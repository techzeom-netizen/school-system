import { ChevronRight, ClipboardList, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type {
  AttentionItem,
  LoanRecord,
  SegmentedOption,
  StatCardProps,
  TypeFilter,
} from './loanAdvanceTypes';
export const StatCard = ({
  label,
  value,
  caption,
  icon: Icon,
  iconClass,
  captionClass = 'text-muted-foreground',
}: StatCardProps) => (
  <div className="rounded-xl border border-border bg-card p-5">
    <span
      className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconClass}`}
    >
      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
    </span>
    <p className="mt-3 text-sm font-medium text-muted-foreground">{label}</p>
    <p className="mt-0.5 text-3xl font-extrabold text-card-foreground">
      {value}
    </p>
    <p className={`text-xs ${captionClass}`}>{caption}</p>
  </div>
);

export const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}) => (
  <div
    className="flex w-fit gap-1  rounded-xl bg-muted p-1"
    role="group"
    aria-label={ariaLabel}
  >
    {options.map(option => (
      <Button
        key={option.value}
        type="button"
        size="sm"
        variant={value === option.value ? 'secondary' : 'ghost'}
        aria-pressed={value === option.value}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </Button>
    ))}
  </div>
);

export const NeedsAttentionCard = ({
  records,
  onSelect,
}: {
  records: LoanRecord[];
  onSelect: (filter: TypeFilter) => void;
}) => {
  const items: AttentionItem[] = [
    {
      id: 'pending-loans',
      label: 'Loans pending approval',
      count: records.filter(r => r.type === 'Loan' && r.status === 'pending')
        .length,
      countClass: 'text-secondary-foreground',
      filter: 'Loan',
    },
    {
      id: 'pending-advances',
      label: 'Advances awaiting approval',
      count: records.filter(r => r.type === 'Advance' && r.status === 'pending')
        .length,
      countClass: 'text-secondary-foreground',
      filter: 'Advance',
    },
    {
      id: 'closing',
      label: 'Loans closing this month',
      count: records.filter(
        r => r.status === 'active' && r.months - r.paidMonths === 1
      ).length,
      countClass: 'text-primary',
      filter: 'all',
    },
  ];

  return (
    <div className="rounded-xl bg-muted/40 px-5 py-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <ClipboardList className="h-4 w-4" aria-hidden="true" />
        Needs attention
      </h3>
      <div className="mt-2 divide-y divide-border" role="list">
        {items.map(item => (
          <div key={item.id} role="listitem">
            <Button
              type="button"
              variant="ghost"
              className="h-auto w-full justify-between gap-3 rounded-none px-0 py-3 text-left text-sm font-normal hover:bg-transparent hover:text-primary"
              onClick={() => onSelect(item.filter)}
            >
              <span>{item.label}</span>
              <span className="flex items-center gap-1">
                <span
                  className={`font-semibold ${item.count > 0 ? item.countClass : 'text-muted-foreground'}`}
                >
                  {item.count}
                </span>
                <ChevronRight
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
              </span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const EmptyState = ({
  hasRecords,
  onAddLoan,
}: {
  hasRecords: boolean;
  onAddLoan: () => void;
}) => (
  <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
    <div className="relative mb-6 flex h-40 w-48 items-center justify-center rounded-[40%_60%_55%_45%/50%_45%_55%_50%] bg-primary/10">
      <div className="flex h-24 w-20 flex-col gap-2 rounded-lg border-2 border-primary/60 bg-card p-3 shadow-sm">
        <span className="h-1.5 w-full rounded-full bg-primary/50" />
        <span className="h-1.5 w-4/5 rounded-full bg-primary/40" />
        <span className="h-1.5 w-full rounded-full bg-primary/40" />
        <span className="h-1.5 w-3/5 rounded-full bg-primary/30" />
      </div>
      <span className="absolute bottom-6 right-8 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
        <Plus className="h-6 w-6" aria-hidden="true" />
      </span>
    </div>

    <h3 className="text-2xl font-bold tracking-tight text-card-foreground">
      No loans or advances to display
    </h3>
    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
      {hasRecords
        ? 'Nothing matches your search or filters. Try changing them.'
        : 'Add a loan or advance to manage employee finances.'}
    </p>

    {!hasRecords && (
      <Button type="button" className="mt-5" onClick={onAddLoan}>
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add Loan
      </Button>
    )}
  </div>
);
