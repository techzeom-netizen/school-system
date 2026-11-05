import { useMemo, useState } from 'react';
import {
  CalendarDays,
  Download,
  FileText,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { payslipFinancialYearOptions } from '@/data/reusableDropdownData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Payslip {
  id: string;
  period: string;
  payDate: string;
  netSalary: number;
  status: 'Paid';
  financialYear: string;
}

const payslips: Payslip[] = [
  {
    id: '2026-08',
    period: 'August 2026',
    payDate: '31/08/2026',
    netSalary: 10000,
    status: 'Paid',
    financialYear: '2026-27',
  },
  {
    id: '2026-07',
    period: 'July 2026',
    payDate: '31/07/2026',
    netSalary: 9565,
    status: 'Paid',
    financialYear: '2026-27',
  },
  {
    id: '2025-03',
    period: 'March 2026',
    payDate: '31/03/2026',
    netSalary: 9200,
    status: 'Paid',
    financialYear: '2025-26',
  },
  {
    id: '2025-02',
    period: 'February 2026',
    payDate: '28/02/2026',
    netSalary: 9100,
    status: 'Paid',
    financialYear: '2025-26',
  },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

const downloadPayslipCsv = (records: Payslip[], fileName: string) => {
  const rows = [
    ['Pay Period', 'Pay Date', 'Net Salary', 'Status', 'Financial Year'],
    ...records.map(record => [
      record.period,
      record.payDate,
      record.netSalary.toString(),
      record.status,
      record.financialYear,
    ]),
  ];
  const csv = rows
    .map(row => row.map(value => `"${value.replace(/"/g, '""')}"`).join(','))
    .join('\r\n');
  const downloadUrl = URL.createObjectURL(
    new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
  );
  const link = document.createElement('a');

  link.href = downloadUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
};

const PayslipsTab = () => {
  const [financialYear, setFinancialYear] = useState('2026-27');
  const [search, setSearch] = useState('');

  const yearPayslips = useMemo(
    () => payslips.filter(payslip => payslip.financialYear === financialYear),
    [financialYear]
  );
  const visiblePayslips = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return yearPayslips;

    return yearPayslips.filter(
      payslip =>
        payslip.period.toLowerCase().includes(query) ||
        payslip.payDate.toLowerCase().includes(query)
    );
  }, [search, yearPayslips]);

  const salaryTotal = yearPayslips.reduce(
    (total, payslip) => total + payslip.netSalary,
    0
  );
  const averageSalary = yearPayslips.length
    ? Math.round(salaryTotal / yearPayslips.length)
    : 0;
  const latestSalary = yearPayslips[0]?.netSalary ?? 0;

  const summary = [
    {
      label: 'Last Salary',
      value: formatCurrency(latestSalary),
      icon: Wallet,
      iconClass: 'bg-primary/10 text-primary',
    },
    {
      label: 'Average Salary',
      value: formatCurrency(averageSalary),
      icon: TrendingUp,
      iconClass: 'bg-secondary text-secondary-foreground',
    },
    {
      label: 'Total Payslips',
      value: String(yearPayslips.length),
      icon: FileText,
      iconClass: 'bg-accent text-accent-foreground',
    },
    {
      label: 'FY Net (YTD)',
      value: formatCurrency(salaryTotal),
      icon: CalendarDays,
      iconClass: 'bg-muted text-muted-foreground',
    },
  ];

  const handleDownloadAll = () => {
    downloadPayslipCsv(visiblePayslips, `payslips-FY-${financialYear}.csv`);
  };

  return (
    <>
      <Section title="Payslip">
        <div className="min-w-0 space-y-5">
          <div className="flex flex-col gap-2 justify-end sm:flex-row sm:items-end">
            <div className="min-w-40">
              <FormField
                label="Financial year"
                name="payslip-financial-year"
                type="select"
                value={financialYear}
                onChange={setFinancialYear}
                options={payslipFinancialYearOptions}
              />
            </div>
            <Button
              type="button"
              variant="default"
              onClick={handleDownloadAll}
              disabled={visiblePayslips.length === 0}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download All
            </Button>
          </div>

          <section
            aria-label="Payslip summary"
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
          >
            {summary.map(item => {
              const Icon = item.icon;

              return (
                <Card
                  key={item.label}
                  className="min-w-0 border-border bg-card"
                >
                  <CardContent className="flex items-center gap-3 p-4">
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${item.iconClass}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="mt-1 truncate text-lg font-semibold text-card-foreground">
                        {item.value}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          <div className="relative w-full sm:max-w-md">
            <FormField
              label="Search payslips"
              name="payslip-search"
              type="text"
              placeholder="Search by pay period..."
              value={search}
              onChange={setSearch}
            />
          </div>

          <Section title="Salary Statements">
            {visiblePayslips.length ? (
              visiblePayslips.map(payslip => (
                <Card
                  key={payslip.id}
                  className="flex min-w-0 flex-col gap-4 p-3 sm:flex-row sm:items-center sm:p-4 mb-2"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-card-foreground">
                          {payslip.period}
                        </h3>
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          {payslip.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Pay Date: {payslip.payDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
                    <div className="text-left sm:text-right">
                      <p className="text-sm text-muted-foreground">
                        Net Salary
                      </p>
                      <p className="font-semibold text-card-foreground">
                        {formatCurrency(payslip.netSalary)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="default"
                      onClick={() =>
                        downloadPayslipCsv(
                          [payslip],
                          `payslip-${payslip.id}.csv`
                        )
                      }
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                      Download
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <p className="rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                No payslips match this financial year and search.
              </p>
            )}
          </Section>
        </div>
      </Section>
    </>
  );
};

export default PayslipsTab;
