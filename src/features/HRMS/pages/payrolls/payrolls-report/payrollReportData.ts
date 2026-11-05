import type { ColumnDef } from '@tanstack/react-table';
import {
  Banknote,
  BarChart3,
  Building2,
  CalendarCheck,
  FileText,
  Layers,
  Percent,
  PiggyBank,
  Receipt,
  Repeat,
  Wallet,
} from 'lucide-react';
import {
  payrollReportFinancialYearOptions,
  payrollReportMonthOptions,
} from '@/data/reusableDropdownData';
import type {
  DocumentStatus,
  PayrollReport,
  PayrollRow,
  ReportCategory,
} from './payrollReportTypes';
export const categoryOptions: ReportCategory[] = [
  'Payroll Overview',
  'Salary Structure',
  'Payslip',
  'Tax Deduction',
  'Form 16',
  'Reimbursement & Buyout',
  'Loans & Advance',
];

const workingDaysPerMonth = 26;
export const donutPalette = [
  'text-primary',
  'text-primary/70',
  'text-primary/45',
  'text-muted-foreground',
];

export const documentColors: Record<DocumentStatus, string> = {
  shared: 'text-primary',
  generated: 'text-primary/50',
  pending: 'text-destructive',
};
export const monthCodes = payrollReportMonthOptions
  .filter(option => option.value !== 'all')
  .map(option => option.value);

export const documentLabels: Record<DocumentStatus, string> = {
  shared: 'Shared',
  generated: 'Generated',
  pending: 'Pending',
};

const employees = [
  { name: 'Aarav Mehta', department: 'Engineering', salary: 82000 },
  { name: 'Diya Shah', department: 'Finance', salary: 74500 },
  { name: 'Kabir Rao', department: 'Operations', salary: 91000 },
  { name: 'Mira Nair', department: 'Marketing', salary: 68500 },
];

const getDocumentStatus = (
  financialYear: string,
  monthIndex: number
): DocumentStatus => {
  if (financialYear !== 'FY 2026-27') return 'shared';
  if (monthIndex < 6) return 'shared';
  return monthIndex === 6 ? 'generated' : 'pending';
};

export const payrollRows: PayrollRow[] =
  payrollReportFinancialYearOptions.flatMap(({ value: financialYear }) =>
    monthCodes.flatMap((month, monthIndex) =>
      employees.map((employee, employeeIndex) => {
        const gross = Math.round(
          employee.salary * (1 + ((monthIndex + employeeIndex) % 4) * 0.015)
        );
        const hasLoan = employeeIndex < 2;
        const loanEmi = hasLoan ? 4000 + employeeIndex * 1500 : 0;

        return {
          id: `${financialYear}-${month}-${employeeIndex}`,
          employee: employee.name,
          department: employee.department,
          financialYear,
          month,
          gross,
          pf: Math.round(gross * 0.12),
          tds: Math.round(gross * (0.06 + employeeIndex * 0.01)),
          otherDeductions: Math.round(gross * 0.02),
          reimbursement:
            (monthIndex + employeeIndex) % 3 === 0
              ? 1500 + employeeIndex * 500
              : 0,
          buyoutDays:
            (monthIndex * 3 + employeeIndex) % 7 === 0
              ? 2 + (employeeIndex % 3)
              : 0,
          loanEmi,
          loanBalance: hasLoan ? Math.max(24 - monthIndex, 0) * loanEmi : 0,
          payslip: getDocumentStatus(financialYear, monthIndex),
          form16:
            financialYear === 'FY 2026-27'
              ? 'pending'
              : employeeIndex === 3
                ? 'generated'
                : 'shared',
        };
      })
    )
  );

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

export const sumOf = (
  rows: PayrollRow[],
  getValue: (row: PayrollRow) => number
) => rows.reduce((total, row) => total + getValue(row), 0);

export const countEmployees = (rows: PayrollRow[]) =>
  new Set(rows.map(row => row.employee)).size;

export const getDeductions = (row: PayrollRow) =>
  row.pf + row.tds + row.otherDeductions + row.loanEmi;

export const getNetPay = (row: PayrollRow) => row.gross - getDeductions(row);

export const getBuyoutAmount = (row: PayrollRow) =>
  Math.round((row.gross / workingDaysPerMonth) * row.buyoutDays);

export const countStatus = (
  rows: PayrollRow[],
  field: 'payslip' | 'form16',
  status: DocumentStatus
) => rows.filter(row => row[field] === status).length;

export const formatCompact = (amount: number) =>
  `${new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount)}`;

export const getMonthLabel = (code: string) =>
  payrollReportMonthOptions.find(option => option.value === code)?.label ??
  code;

export const reports: PayrollReport[] = [
  {
    id: 'payroll-summary',
    name: 'Payroll Summary',
    description: 'Pay, deductions and net pay for every employee.',
    category: 'Payroll Overview',
    icon: BarChart3,
    iconClass: 'bg-primary/10 text-primary',
    columns: [
      { header: 'Employee', value: row => row.employee },
      { header: 'Month', value: row => getMonthLabel(row.month) },
      { header: 'Gross salary', value: row => row.gross, isMoney: true },
      { header: 'Deductions', value: getDeductions, isMoney: true },
      { header: 'Net salary', value: getNetPay, isMoney: true },
    ],
    chartLabel: 'Net salary paid',
    chartValue: getNetPay,
    metrics: rows => [
      { label: 'Employees', value: countEmployees(rows) },
      {
        label: 'Gross salary',
        value: formatCurrency(sumOf(rows, row => row.gross)),
      },
      {
        label: 'Deductions',
        value: formatCurrency(sumOf(rows, getDeductions)),
      },
      { label: 'Net payroll', value: formatCurrency(sumOf(rows, getNetPay)) },
    ],
  },
  {
    id: 'department-cost',
    name: 'Department-wise Cost',
    description: 'What each department costs the company.',
    category: 'Payroll Overview',
    icon: Building2,
    iconClass: 'bg-secondary text-secondary-foreground',
    columns: [
      { header: 'Department', value: row => row.department },
      { header: 'Employee', value: row => row.employee },
      { header: 'Month', value: row => getMonthLabel(row.month) },
      { header: 'Gross salary', value: row => row.gross, isMoney: true },
    ],
    chartLabel: 'Gross salary cost',
    chartValue: row => row.gross,
    metrics: rows => [
      {
        label: 'Departments',
        value: new Set(rows.map(row => row.department)).size,
      },
      { label: 'Employees', value: countEmployees(rows) },
      {
        label: 'Total cost',
        value: formatCurrency(sumOf(rows, row => row.gross)),
      },
      {
        label: 'Average per employee',
        value: formatCurrency(
          Math.round(sumOf(rows, row => row.gross) / Math.max(rows.length, 1))
        ),
      },
    ],
  },
  {
    id: 'salary-structure',
    name: 'Salary Structure Report',
    description: 'Basic, HRA and allowances for every employee.',
    category: 'Salary Structure',
    icon: Layers,
    iconClass: 'bg-accent text-accent-foreground',
    columns: [
      { header: 'Employee', value: row => row.employee },
      { header: 'Month', value: row => getMonthLabel(row.month) },
      {
        header: 'Basic (50%)',
        value: row => Math.round(row.gross * 0.5),
        isMoney: true,
      },
      {
        header: 'HRA (20%)',
        value: row => Math.round(row.gross * 0.2),
        isMoney: true,
      },
      {
        header: 'Allowances (30%)',
        value: row =>
          row.gross - Math.round(row.gross * 0.5) - Math.round(row.gross * 0.2),
        isMoney: true,
      },
      { header: 'Gross salary', value: row => row.gross, isMoney: true },
    ],
    chartLabel: 'Gross salary',
    chartValue: row => row.gross,
    metrics: rows => [
      { label: 'Employees', value: countEmployees(rows) },
      {
        label: 'Basic',
        value: formatCurrency(sumOf(rows, row => Math.round(row.gross * 0.5))),
      },
      {
        label: 'HRA',
        value: formatCurrency(sumOf(rows, row => Math.round(row.gross * 0.2))),
      },
      {
        label: 'Gross salary',
        value: formatCurrency(sumOf(rows, row => row.gross)),
      },
    ],
  },
  {
    id: 'payslip-register',
    name: 'Payslip Register',
    description: 'Which payslips are shared, generated or pending.',
    category: 'Payslip',
    icon: Receipt,
    iconClass: 'bg-primary/10 text-primary',
    columns: [
      { header: 'Employee', value: row => row.employee },
      { header: 'Month', value: row => getMonthLabel(row.month) },
      { header: 'Net salary', value: getNetPay, isMoney: true },
      { header: 'Payslip', value: row => documentLabels[row.payslip] },
    ],
    chartLabel: 'Net salary on payslips',
    chartValue: getNetPay,
    metrics: rows => [
      { label: 'Payslips', value: rows.length },
      { label: 'Shared', value: countStatus(rows, 'payslip', 'shared') },
      { label: 'Generated', value: countStatus(rows, 'payslip', 'generated') },
      { label: 'Pending', value: countStatus(rows, 'payslip', 'pending') },
    ],
  },
  {
    id: 'tds-report',
    name: 'Tax Deduction (TDS)',
    description: 'Income tax cut from each salary.',
    category: 'Tax Deduction',
    icon: Percent,
    iconClass: 'bg-destructive/10 text-destructive',
    columns: [
      { header: 'Employee', value: row => row.employee },
      { header: 'Month', value: row => getMonthLabel(row.month) },
      { header: 'Gross salary', value: row => row.gross, isMoney: true },
      { header: 'Tax deducted', value: row => row.tds, isMoney: true },
      {
        header: 'Tax share',
        value: row => `${((row.tds / row.gross) * 100).toFixed(1)}%`,
      },
    ],
    chartLabel: 'Tax deducted',
    chartValue: row => row.tds,
    metrics: rows => [
      { label: 'Employees', value: countEmployees(rows) },
      {
        label: 'Gross salary',
        value: formatCurrency(sumOf(rows, row => row.gross)),
      },
      {
        label: 'Tax deducted',
        value: formatCurrency(sumOf(rows, row => row.tds)),
      },
      { label: 'Net payroll', value: formatCurrency(sumOf(rows, getNetPay)) },
    ],
  },
  {
    id: 'pf-report',
    name: 'PF and ESI Contributions',
    description: 'What was deducted for PF and ESI.',
    category: 'Tax Deduction',
    icon: PiggyBank,
    iconClass: 'bg-secondary text-secondary-foreground',
    columns: [
      { header: 'Employee', value: row => row.employee },
      { header: 'Month', value: row => getMonthLabel(row.month) },
      { header: 'Employee share', value: row => row.pf, isMoney: true },
      { header: 'Company share', value: row => row.pf, isMoney: true },
    ],
    chartLabel: 'PF contributions',
    chartValue: row => row.pf * 2,
    metrics: rows => [
      { label: 'Employees', value: countEmployees(rows) },
      {
        label: 'Employee share',
        value: formatCurrency(sumOf(rows, row => row.pf)),
      },
      {
        label: 'Company share',
        value: formatCurrency(sumOf(rows, row => row.pf)),
      },
      {
        label: 'Total deposit',
        value: formatCurrency(sumOf(rows, row => row.pf * 2)),
      },
    ],
  },
  {
    id: 'form16-status',
    name: 'Form 16 Status',
    description: 'Who has Form 16 ready, shared or still pending.',
    category: 'Form 16',
    icon: FileText,
    iconClass: 'bg-destructive/10 text-destructive',
    columns: [
      { header: 'Employee', value: row => row.employee },
      { header: 'Financial year', value: row => row.financialYear },
      { header: 'Tax deducted', value: row => row.tds, isMoney: true },
      { header: 'Form 16', value: row => documentLabels[row.form16] },
    ],
    chartLabel: 'Tax covered by Form 16',
    chartValue: row => row.tds,
    metrics: rows => [
      { label: 'Employees', value: countEmployees(rows) },
      { label: 'Shared', value: countStatus(rows, 'form16', 'shared') },
      { label: 'Generated', value: countStatus(rows, 'form16', 'generated') },
      { label: 'Pending', value: countStatus(rows, 'form16', 'pending') },
    ],
  },
  {
    id: 'reimbursements',
    name: 'Reimbursement Claims',
    description: 'Expenses paid back to employees.',
    category: 'Reimbursement & Buyout',
    icon: Wallet,
    iconClass: 'bg-accent text-accent-foreground',
    filter: row => row.reimbursement > 0,
    columns: [
      { header: 'Employee', value: row => row.employee },
      { header: 'Month', value: row => getMonthLabel(row.month) },
      { header: 'Department', value: row => row.department },
      {
        header: 'Amount paid back',
        value: row => row.reimbursement,
        isMoney: true,
      },
    ],
    chartLabel: 'Reimbursed',
    chartValue: row => row.reimbursement,
    metrics: rows => [
      { label: 'Claims paid', value: rows.length },
      { label: 'Employees', value: countEmployees(rows) },
      {
        label: 'Total reimbursed',
        value: formatCurrency(sumOf(rows, row => row.reimbursement)),
      },
      {
        label: 'Average claim',
        value: formatCurrency(
          Math.round(
            sumOf(rows, row => row.reimbursement) / Math.max(rows.length, 1)
          )
        ),
      },
    ],
  },
  {
    id: 'leave-buyout',
    name: 'Leave Buyout',
    description: 'Unused leave days paid out as money.',
    category: 'Reimbursement & Buyout',
    icon: CalendarCheck,
    iconClass: 'bg-primary/10 text-primary',
    filter: row => row.buyoutDays > 0,
    columns: [
      { header: 'Employee', value: row => row.employee },
      { header: 'Month', value: row => getMonthLabel(row.month) },
      { header: 'Days bought out', value: row => row.buyoutDays },
      { header: 'Amount paid', value: getBuyoutAmount, isMoney: true },
    ],
    chartLabel: 'Buyout paid',
    chartValue: getBuyoutAmount,
    metrics: rows => [
      { label: 'Buyouts', value: rows.length },
      { label: 'Employees', value: countEmployees(rows) },
      { label: 'Days bought out', value: sumOf(rows, row => row.buyoutDays) },
      {
        label: 'Total paid',
        value: formatCurrency(sumOf(rows, getBuyoutAmount)),
      },
    ],
  },
  {
    id: 'loan-balances',
    name: 'Loan and Advance Balances',
    description: 'What each employee still has to repay.',
    category: 'Loans & Advance',
    icon: Banknote,
    iconClass: 'bg-secondary text-secondary-foreground',
    filter: row => row.loanBalance > 0,
    columns: [
      { header: 'Employee', value: row => row.employee },
      { header: 'Month', value: row => getMonthLabel(row.month) },
      { header: 'Monthly EMI', value: row => row.loanEmi, isMoney: true },
      { header: 'Balance left', value: row => row.loanBalance, isMoney: true },
    ],
    chartLabel: 'Balance left to repay',
    chartValue: row => row.loanBalance,
    metrics: rows => [
      { label: 'Employees with loans', value: countEmployees(rows) },
      {
        label: 'Monthly EMI',
        value: formatCurrency(sumOf(rows, row => row.loanEmi)),
      },
      {
        label: 'Balance left',
        value: formatCurrency(sumOf(rows, row => row.loanBalance)),
      },
      { label: 'Records', value: rows.length },
    ],
  },
  {
    id: 'emi-recovery',
    name: 'EMI Recovery',
    description: 'EMIs cut from salary each month.',
    category: 'Loans & Advance',
    icon: Repeat,
    iconClass: 'bg-accent text-accent-foreground',
    filter: row => row.loanEmi > 0,
    columns: [
      { header: 'Employee', value: row => row.employee },
      { header: 'Month', value: row => getMonthLabel(row.month) },
      { header: 'EMI recovered', value: row => row.loanEmi, isMoney: true },
      { header: 'Net salary', value: getNetPay, isMoney: true },
    ],
    chartLabel: 'EMI recovered',
    chartValue: row => row.loanEmi,
    metrics: rows => [
      { label: 'Employees', value: countEmployees(rows) },
      { label: 'EMIs recovered', value: rows.length },
      {
        label: 'Total recovered',
        value: formatCurrency(sumOf(rows, row => row.loanEmi)),
      },
      { label: 'Net payroll', value: formatCurrency(sumOf(rows, getNetPay)) },
    ],
  },
];

export const getReportRows = (report: PayrollReport, rows: PayrollRow[]) =>
  report.filter ? rows.filter(report.filter) : rows;

export const createReportColumns = (
  report: PayrollReport
): ColumnDef<PayrollRow>[] =>
  report.columns.map(column => ({
    id: column.header,
    header: column.header,
    accessorFn: column.value,
    cell: ({ getValue }) =>
      column.isMoney ? formatCurrency(getValue<number>()) : String(getValue()),
  }));

const escapeCsv = (value: string | number) =>
  `"${String(value).replace(/"/g, '""')}"`;

export const downloadReportCsv = (
  report: PayrollReport,
  rows: PayrollRow[],
  periodLabel: string
) => {
  const lines = [
    report.columns.map(column => escapeCsv(column.header)).join(','),
    ...rows.map(row =>
      report.columns.map(column => escapeCsv(column.value(row))).join(',')
    ),
  ];
  const url = URL.createObjectURL(
    new Blob([`\uFEFF${lines.join('\r\n')}`], {
      type: 'text/csv;charset=utf-8;',
    })
  );
  const link = document.createElement('a');

  link.href = url;
  link.download = `${report.id}-${periodLabel.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
