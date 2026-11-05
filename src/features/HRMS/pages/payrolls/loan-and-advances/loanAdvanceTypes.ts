import type { LucideIcon } from 'lucide-react';

export type RecordType = 'Loan' | 'Advance';
export type RecordStatus = 'pending' | 'active' | 'paused' | 'closed';
export type TypeFilter = 'all' | RecordType;
export type ViewMode = 'ongoing' | 'closed';

export interface LoanRecord {
  id: string;
  employee: string;
  type: RecordType;
  purpose: string;
  financialYear: string;
  date: string;
  amount: number;
  months: number;
  paidMonths: number;
  status: RecordStatus;
}

export interface AttentionItem {
  id: string;
  label: string;
  count: number;
  countClass: string;
  filter: TypeFilter;
}

export interface StatCardProps {
  label: string;
  value: string;
  caption: string;
  icon: LucideIcon;
  iconClass: string;
  captionClass?: string;
}

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}
