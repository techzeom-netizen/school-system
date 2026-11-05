import type { ColumnDef } from '@tanstack/react-table';

export type DeclarationStatus = 'approved' | 'waiting' | 'notSubmitted';
export type FilterId = 'all' | DeclarationStatus;
export type TaxRegime = 'old' | 'new';

export interface DeclarationItems {
  section80C: number;
  section80D: number;
  hra: number;
  homeLoanInterest: number;
}

export interface Declaration {
  id: string;
  name: string;
  employeeCode: string;
  regime: TaxRegime | null;
  status: DeclarationStatus;
  items: DeclarationItems | null;
  submittedOn: string | null;
  approvedOn: string | null;
  sentBackReason: string | null;
  isReminded: boolean;
}

export interface TaxDeclarationTabProps {
  rows: Declaration[];
  columns: ColumnDef<Declaration>[];
}
