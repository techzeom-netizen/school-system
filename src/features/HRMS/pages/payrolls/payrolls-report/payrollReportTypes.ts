import type { LucideIcon } from 'lucide-react';

export type ReportCategory =
  | 'Payroll Overview'
  | 'Salary Structure'
  | 'Payslip'
  | 'Tax Deduction'
  | 'Form 16'
  | 'Reimbursement & Buyout'
  | 'Loans & Advance';

export type CategoryFilter = 'all' | ReportCategory;

export type DocumentStatus = 'shared' | 'generated' | 'pending';

export interface PayrollRow {
  id: string;
  employee: string;
  department: string;
  financialYear: string;
  month: string;
  gross: number;
  pf: number;
  tds: number;
  otherDeductions: number;
  reimbursement: number;
  buyoutDays: number;
  loanEmi: number;
  loanBalance: number;
  payslip: DocumentStatus;
  form16: DocumentStatus;
}

export interface ReportColumn {
  header: string;
  value: (row: PayrollRow) => string | number;
  isMoney?: boolean;
}

export interface ReportMetric {
  label: string;
  value: string | number;
}

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

export interface PayrollReport {
  id: string;
  name: string;
  description: string;
  category: ReportCategory;
  icon: LucideIcon;
  iconClass: string;
  columns: ReportColumn[];
  filter?: (row: PayrollRow) => boolean;
  chartLabel: string;
  chartValue: (row: PayrollRow) => number;
  metrics: (rows: PayrollRow[]) => ReportMetric[];
}
