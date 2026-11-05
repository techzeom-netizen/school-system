import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import {
  CalendarCheck,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  Download,
  FileText,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import Section from '@/components/common/Section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TanStackTable } from '@/components/common';
import { PieChartComponent } from '@/components/ui/charts';

type FiscalYear = '2026-27' | '2025-26';
const PAYSLIPS_PATH = '/dashboard/employer/payrolls/payslips';

interface PayrollRecord {
  month: string;
  netSalary: number;
  payDate: string;
  status: string;
}

interface SummaryCardItem {
  title: string;
  value: string;
  icon: typeof CalendarCheck;
  iconStyle: string;
  detail?: string;
  isStatus?: boolean;
}

const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

const payrollByYear: Record<FiscalYear, PayrollRecord[]> = {
  '2026-27': [
    {
      month: 'May 2026',
      netSalary: 58750,
      payDate: '31 May 2026',
      status: 'Processed',
    },
    {
      month: 'Apr 2026',
      netSalary: 59500,
      payDate: '30 Apr 2026',
      status: 'Processed',
    },
    {
      month: 'Mar 2026',
      netSalary: 56980,
      payDate: '31 Mar 2026',
      status: 'Processed',
    },
    {
      month: 'Feb 2026',
      netSalary: 56670,
      payDate: '28 Feb 2026',
      status: 'Processed',
    },
    {
      month: 'Jan 2026',
      netSalary: 58400,
      payDate: '31 Jan 2026',
      status: 'Processed',
    },
    {
      month: 'Dec 2025',
      netSalary: 57120,
      payDate: '31 Dec 2025',
      status: 'Processed',
    },
    {
      month: 'Nov 2025',
      netSalary: 57850,
      payDate: '30 Nov 2025',
      status: 'Processed',
    },
    {
      month: 'Oct 2025',
      netSalary: 56200,
      payDate: '31 Oct 2025',
      status: 'Processed',
    },
  ],
  '2025-26': [
    {
      month: 'May 2025',
      netSalary: 55250,
      payDate: '31 May 2025',
      status: 'Processed',
    },
    {
      month: 'Apr 2025',
      netSalary: 56000,
      payDate: '30 Apr 2025',
      status: 'Processed',
    },
    {
      month: 'Mar 2025',
      netSalary: 53980,
      payDate: '31 Mar 2025',
      status: 'Processed',
    },
    {
      month: 'Feb 2025',
      netSalary: 53670,
      payDate: '28 Feb 2025',
      status: 'Processed',
    },
    {
      month: 'Jan 2025',
      netSalary: 55400,
      payDate: '31 Jan 2025',
      status: 'Processed',
    },
    {
      month: 'Dec 2024',
      netSalary: 54120,
      payDate: '31 Dec 2024',
      status: 'Processed',
    },
    {
      month: 'Nov 2024',
      netSalary: 54850,
      payDate: '30 Nov 2024',
      status: 'Processed',
    },
    {
      month: 'Oct 2024',
      netSalary: 53200,
      payDate: '31 Oct 2024',
      status: 'Processed',
    },
  ],
};

const summaryByYear: Record<
  FiscalYear,
  {
    net: number;
    gross: number;
    deductions: number;
    workingDays: number;
    lossOfPay: number;
  }
> = {
  '2026-27': {
    net: 58750,
    gross: 78500,
    deductions: 19750,
    workingDays: 26,
    lossOfPay: 0,
  },
  '2025-26': {
    net: 55250,
    gross: 75000,
    deductions: 19750,
    workingDays: 25,
    lossOfPay: 1,
  },
};

const salaryBreakdown = [
  { label: 'Basic Salary', percent: 45, color: 'hsl(var(--primary))' },
  {
    label: 'HRA',
    percent: 20,
    color: 'hsl(var(--secondary-foreground))',
  },
  {
    label: 'Special Allowance',
    percent: 15,
    color: 'hsl(var(--accent-foreground))',
  },
  { label: 'Other Allowance', percent: 10, color: 'hsl(var(--destructive))' },
  {
    label: 'Deductions',
    percent: 10,
    color: 'hsl(var(--muted-foreground))',
  },
];

const SummaryCard = ({
  item: { title, value, icon: Icon, iconStyle, isStatus },
}: {
  item: SummaryCardItem;
}) => (
  <div className="flex min-w-0 items-center gap-3 rounded-xl bg-muted/40 px-3.5 py-3">
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconStyle}`}
    >
      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
    </span>
    <div className="min-w-0">
      <p className="truncate text-xs text-muted-foreground">{title}</p>
      {isStatus ? (
        <Badge variant="secondary" className="mt-0.5 border-transparent">
          {value}
        </Badge>
      ) : (
        <p className="truncate text-lg font-bold leading-tight tracking-tight">
          {value}
        </p>
      )}
    </div>
  </div>
);

const SalaryDonut = ({ gross }: { gross: number }) => {
  const chartData = salaryBreakdown.map(item => ({
    name: item.label,
    value: Math.round((gross * item.percent) / 100),
    color: item.color,
  }));

  return (
    <div
      className="relative min-h-56 w-full shrink-0 sm:w-56"
      role="img"
      aria-label="Pie chart showing the salary breakdown"
    >
      <PieChartComponent
        data={chartData}
        height={224}
        innerRadius={58}
        outerRadius={86}
        showLegend={false}
        className="text-xs font-medium"
      />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-lg font-bold text-card-foreground">
          {formatCurrency(gross)}
        </span>
        <span className="text-xs text-muted-foreground">Gross</span>
      </div>
    </div>
  );
};

const BreakdownRow = ({
  label,
  percent,
  color,
  amount,
}: {
  label: string;
  percent: number;
  color: string;
  amount: number;
}) => (
  <div className="grid grid-cols-3 items-center gap-2 py-1.5 text-xs sm:gap-4 sm:text-sm">
    <span className="flex min-w-0 items-center gap-2">
      <span
        className={`h-3 w-3 shrink-0 rounded-full bg-current ${color}`}
        aria-hidden="true"
      />
      <span className="truncate font-medium">{label}</span>
    </span>
    <span className="text-right font-medium">{percent}%</span>
    <span className="text-right font-semibold">{formatCurrency(amount)}</span>
  </div>
);

const QuickActionButton = ({
  label,
  icon: Icon,
  iconStyle,
  onClick,
}: {
  label: string;
  icon: LucideIcon;
  iconStyle: string;
  onClick: () => void;
}) => (
  <Button
    type="button"
    variant="outline"
    className="h-auto justify-start gap-3 px-3 py-3 text-left"
    onClick={onClick}
  >
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconStyle}`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </span>
    {label}
  </Button>
);

const PayrollOverview = () => {
  const navigate = useNavigate();

  const fiscalYear: FiscalYear = '2026-27';
  const summary = summaryByYear[fiscalYear];
  const payrollRecords = payrollByYear[fiscalYear];
  const recentRecords = payrollRecords.slice(0, 4);

  const downloadSalarySlip = useCallback(
    (record: PayrollRecord = payrollRecords[0]) => {
      const csv = [
        ['Month', 'Net Salary', 'Gross Salary', 'Deductions', 'Pay Date'],
        [
          record.month,
          record.netSalary,
          summary.gross,
          summary.deductions,
          record.payDate,
        ],
      ]
        .map(row => row.join(','))
        .join('\n');
      const url = URL.createObjectURL(
        new Blob([csv], { type: 'text/csv;charset=utf-8' })
      );
      const link = document.createElement('a');
      link.href = url;
      link.download = `salary-slip-${record.month.replace(' ', '-')}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
    },
    [payrollRecords, summary.deductions, summary.gross]
  );

  const payrollColumns = useMemo<ColumnDef<PayrollRecord>[]>(
    () => [
      {
        accessorKey: 'month',
        header: 'Month',
      },
      {
        accessorKey: 'netSalary',
        header: 'Net Salary',
        cell: ({ getValue }) => formatCurrency(getValue<number>()),
      },
      {
        accessorKey: 'payDate',
        header: 'Pay Date',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => (
          <Badge
            variant="secondary"
            className="border-transparent bg-accent text-accent-foreground"
          >
            <Check className="mr-1 h-3 w-3" aria-hidden="true" />
            {getValue<string>()}
          </Badge>
        ),
      },
      {
        id: 'download',
        header: 'Slip',
        cell: ({ row }) => (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Download ${row.original.month} salary slip`}
            onClick={() => downloadSalarySlip(row.original)}
          >
            <Download className="h-4 w-4" aria-hidden="true" />
          </Button>
        ),
      },
    ],
    [downloadSalarySlip]
  );

  const summaryCards: SummaryCardItem[] = [
    {
      title: 'Current Payroll Status',
      value: 'Processed',
      detail: payrollRecords[0].month,
      icon: CalendarCheck,
      iconStyle: 'bg-accent text-accent-foreground',
      isStatus: true,
    },
    {
      title: 'Net Salary',
      value: formatCurrency(summary.net),
      icon: Wallet,
      iconStyle: 'bg-primary/10 text-primary',
    },
    {
      title: 'Gross Salary',
      value: formatCurrency(summary.gross),
      icon: CircleDollarSign,
      iconStyle: 'bg-secondary text-secondary-foreground',
    },
    {
      title: 'Deductions',
      value: formatCurrency(summary.deductions),
      icon: CircleDollarSign,
      iconStyle: 'bg-destructive/10 text-destructive',
    },
    {
      title: 'Working Days',
      value: String(summary.workingDays),
      icon: CalendarDays,
      iconStyle: 'bg-primary/10 text-primary',
    },
    {
      title: 'Loss of Pay',
      value: String(summary.lossOfPay),
      icon: CalendarCheck,
      iconStyle: 'bg-muted text-muted-foreground',
    },
  ];

  const quickActions = [
    {
      label: 'View Payslip',
      icon: FileText,
      iconStyle: 'bg-primary/10 text-primary',
      onClick: () => navigate('/dashboard/employer/payrolls/payslips'),
    },
    {
      label: 'Tax Declaration',
      icon: FileText,
      iconStyle: 'bg-secondary text-secondary-foreground',
      onClick: () => navigate('/dashboard/employer/payrolls/tax-declarations'),
    },
    {
      label: 'Form 16',
      icon: FileText,
      iconStyle: 'bg-primary/10 text-primary',
      onClick: () => navigate('/dashboard/employer/payrolls/form16'),
    },
    {
      label: 'Download Salary Slip',
      icon: Download,
      iconStyle: 'bg-accent text-accent-foreground',
      onClick: () => downloadSalarySlip(),
    },
  ];

  return (
    <>
      <Section
        title="Payroll Overview"
        menuId="payroll-overview"
        showBreadcrumbs
      >
        <div className="space-y-5">
          <div
            aria-label="Payroll summary"
            className="grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-6"
          >
            {summaryCards.map(item => (
              <SummaryCard key={item.title} item={item} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="min-w-0">
              <h3 className="mb-3 text-sm font-semibold">Salary Breakdown</h3>
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <SalaryDonut gross={summary.gross} />
                <div className="w-full min-w-0">
                  {salaryBreakdown.map(item => (
                    <BreakdownRow
                      key={item.label}
                      {...item}
                      amount={Math.round((summary.gross * item.percent) / 100)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="min-w-0">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Recent Payslips</h3>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="h-auto p-0"
                  onClick={() => navigate(PAYSLIPS_PATH)}
                >
                  View all
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
              <TanStackTable
                data={recentRecords}
                columns={payrollColumns}
                enableSearch={false}
                enableSorting={false}
                enableColumnVisibility={false}
                enablePagination={false}
                hideFooter
                getRowId={row => row.month}
                emptyMessage="No payslips available for this financial year."
                className="space-y-0 rounded-xl"
                headerClassName="bg-muted/60"
                bodyClassName="bg-transparent"
              />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Quick Actions</h3>
            <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
              {quickActions.map(action => (
                <QuickActionButton key={action.label} {...action} />
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default PayrollOverview;
