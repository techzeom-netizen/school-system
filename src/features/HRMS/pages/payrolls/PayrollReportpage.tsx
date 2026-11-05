import { useMemo, useState } from 'react';
import { Download, Users } from 'lucide-react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { TanStackTable } from '@/components/common';
import {
  payrollReportFinancialYearOptions,
  payrollReportMonthOptions,
} from '@/data/reusableDropdownData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  categoryOptions,
  countStatus,
  createReportColumns,
  documentColors,
  documentLabels,
  downloadReportCsv,
  formatCompact,
  formatCurrency,
  getBuyoutAmount,
  getMonthLabel,
  getNetPay,
  getReportRows,
  monthCodes,
  donutPalette,
  payrollRows,
  reports,
  sumOf,
} from './payrolls-report/payrollReportData';
import {
  DonutChart,
  DonutLegend,
  MetricCard,
  ReportCard,
  SummaryCard,
} from './payrolls-report/PayrollReportComponents';
import type {
  CategoryFilter,
  DocumentStatus,
  DonutSlice,
  PayrollReport,
} from './payrolls-report/payrollReportTypes';
const PayrollReportsPage = () => {
  const [financialYear, setFinancialYear] = useState('FY 2026-27');
  const [month, setMonth] = useState('all');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [query, setQuery] = useState('');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const periodLabel = `${financialYear} ${getMonthLabel(month)}`;

  const periodRows = useMemo(
    () =>
      payrollRows.filter(
        row =>
          row.financialYear === financialYear &&
          (month === 'all' || row.month === month)
      ),
    [financialYear, month]
  );

  const searchedReports = useMemo(() => {
    const search = query.trim().toLowerCase();

    return reports.filter(
      report =>
        !search ||
        `${report.name} ${report.description} ${report.category}`
          .toLowerCase()
          .includes(search)
    );
  }, [query]);

  const visibleReports = searchedReports.filter(
    report => category === 'all' || report.category === category
  );

  const selectedReport =
    reports.find(report => report.id === selectedReportId) ?? null;
  const selectedRows = useMemo(
    () => (selectedReport ? getReportRows(selectedReport, periodRows) : []),
    [selectedReport, periodRows]
  );
  const selectedColumns = useMemo(
    () => (selectedReport ? createReportColumns(selectedReport) : []),
    [selectedReport]
  );
  const chartData = useMemo(() => {
    if (!selectedReport) return [];

    const totals = new Map<string, number>();
    selectedRows.forEach(row =>
      totals.set(
        row.month,
        (totals.get(row.month) ?? 0) + selectedReport.chartValue(row)
      )
    );

    return monthCodes
      .filter(code => totals.has(code))
      .map(code => ({ name: code, amount: totals.get(code) ?? 0 }));
  }, [selectedReport, selectedRows]);
  const monthlySlices: DonutSlice[] = chartData.map((item, index) => ({
    label: item.name,
    value: item.amount,
    color: donutPalette[index % donutPalette.length],
  }));

  const totalGross = sumOf(periodRows, row => row.gross);
  const totalNet = sumOf(periodRows, getNetPay);
  const netShare =
    totalGross === 0 ? 0 : Math.round((totalNet / totalGross) * 100);

  const moneySlices: DonutSlice[] = [
    { label: 'Net pay', value: totalNet, color: 'text-primary' },
    {
      label: 'Income tax (TDS)',
      value: sumOf(periodRows, row => row.tds),
      color: 'text-primary/60',
    },
    {
      label: 'PF and ESI',
      value: sumOf(periodRows, row => row.pf),
      color: 'text-primary/30',
    },
    {
      label: 'Loans and others',
      value: sumOf(periodRows, row => row.loanEmi + row.otherDeductions),
      color: 'text-muted-foreground',
    },
  ];

  const payslipSlices: DonutSlice[] = (
    ['shared', 'generated', 'pending'] as DocumentStatus[]
  ).map(status => ({
    label: `Payslip ${documentLabels[status].toLowerCase()}`,
    value: countStatus(periodRows, 'payslip', status),
    color: documentColors[status],
  }));

  const departmentSlices: DonutSlice[] = useMemo(() => {
    if (!selectedReport) return [];

    const totals = new Map<string, number>();
    selectedRows.forEach(row =>
      totals.set(
        row.department,
        (totals.get(row.department) ?? 0) + selectedReport.chartValue(row)
      )
    );

    return Array.from(totals, ([label, value]) => ({ label, value }))
      .filter(item => item.value > 0)
      .sort((first, second) => second.value - first.value)
      .map((item, index) => ({
        ...item,
        color: donutPalette[index % donutPalette.length],
      }));
  }, [selectedReport, selectedRows]);

  const handleDownload = (report: PayrollReport) => {
    const rows = getReportRows(report, periodRows);

    if (rows.length === 0) {
      toast.error('There is no data for this report in the chosen period.');
      return;
    }

    downloadReportCsv(report, rows, periodLabel);
    toast.success(`${report.name} downloaded.`);
  };

  const handleClearFilters = () => {
    setQuery('');
    setCategory('all');
  };

  return (
    <>
      <Section title="Payroll Reports" menuId="payroll-reports" showBreadcrumbs>
        <div className="space-y-5">
          <div className="flex flex-wrap justify-end gap-3">
            <FormField
              label="Financial year"
              name="report-financial-year"
              type="select"
              value={financialYear}
              onChange={setFinancialYear}
              options={payrollReportFinancialYearOptions}
            />

            <FormField
              label="Month"
              name="report-month"
              type="select"
              value={month}
              onChange={setMonth}
              options={payrollReportMonthOptions}
            />

            <FormField
              label="Search reports"
              name="report-search"
              value={query}
              onChange={setQuery}
              placeholder="e.g. TDS, loans, payslip"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              label="Total payroll cost"
              value={formatCurrency(sumOf(periodRows, row => row.gross))}
              hint="Payroll Overview"
            />
            <SummaryCard
              label="Tax deducted (TDS)"
              value={formatCurrency(sumOf(periodRows, row => row.tds))}
              hint="Tax Deduction"
            />
            <SummaryCard
              label="Reimbursed and bought out"
              value={formatCurrency(
                sumOf(
                  periodRows,
                  row => row.reimbursement + getBuyoutAmount(row)
                )
              )}
              hint="Reimbursement & Buyout"
            />
            <SummaryCard
              label="Loan EMIs recovered"
              value={formatCurrency(sumOf(periodRows, row => row.loanEmi))}
              hint="Loans & Advance"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="space-y-4 rounded-xl border-border p-5">
              <div>
                <h2 className="text-lg font-semibold text-card-foreground">
                  Where does the payroll go?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Share of the total payroll cost Â· {periodLabel}
                </p>
              </div>
              <div className="grid items-center gap-6 sm:grid-cols-2">
                <DonutChart
                  slices={moneySlices}
                  centerValue={`${netShare}%`}
                  centerLabel="is net pay"
                  label="Payroll cost split"
                  formatValue={formatCurrency}
                />
                <DonutLegend
                  slices={moneySlices}
                  formatValue={formatCurrency}
                />
              </div>
            </Card>

            <Card className="space-y-4 rounded-xl border-border p-5">
              <div>
                <h2 className="text-lg font-semibold text-card-foreground">
                  Payslip progress
                </h2>
                <p className="text-sm text-muted-foreground">
                  How many payslips are shared Â· {periodLabel}
                </p>
              </div>
              <div className="grid items-center gap-6 sm:grid-cols-2">
                <DonutChart
                  slices={payslipSlices}
                  centerValue={String(payslipSlices[0].value)}
                  centerLabel={`of ${periodRows.length} shared`}
                  label="Payslip status"
                  formatValue={String}
                />
                <DonutLegend slices={payslipSlices} formatValue={String} />
              </div>
            </Card>
          </div>

          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter reports by menu"
          >
            {(['all', ...categoryOptions] as CategoryFilter[]).map(option => {
              const count =
                option === 'all'
                  ? searchedReports.length
                  : searchedReports.filter(report => report.category === option)
                      .length;

              return (
                <Button
                  key={option}
                  type="button"
                  size="sm"
                  className="rounded-full"
                  variant={category === option ? 'default' : 'outline'}
                  aria-pressed={category === option}
                  onClick={() => setCategory(option)}
                >
                  {option === 'all' ? 'All reports' : option} {count}
                </Button>
              );
            })}
          </div>

          {visibleReports.length === 0 ? (
            <div className="space-y-3 rounded-xl border border-border px-6 py-14 text-center">
              <p className="text-base font-semibold text-foreground">
                No reports found
              </p>
              <p className="text-sm text-muted-foreground">
                Nothing matches your search or filter. Try changing them.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={handleClearFilters}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleReports.map(report => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onView={() => setSelectedReportId(report.id)}
                  onDownload={() => handleDownload(report)}
                />
              ))}
            </div>
          )}
        </div>
      </Section>

      <Dialog
        open={selectedReport !== null}
        onOpenChange={open => !open && setSelectedReportId(null)}
      >
        <DialogContent
          aria-label={selectedReport?.name}
          className="w-[calc(100vw-2rem)] max-w-7xl overflow-hidden p-0 sm:max-w-7xl"
          onInteractOutside={event => event.preventDefault()}
        >
          {selectedReport && (
            <Section
              title={selectedReport.name}
              className="flex max-h-[90vh] w-full min-w-0 flex-col rounded-lg border-0 shadow-none"
              contentClassName="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-6"
            >
              <p className="text-sm text-muted-foreground">
                {selectedReport.description} Period: {financialYear},{' '}
                {getMonthLabel(month)}.
              </p>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {selectedReport.metrics(selectedRows).map((metric, index) => (
                  <MetricCard
                    key={metric.label}
                    label={metric.label}
                    value={metric.value}
                    icon={index === 0 ? Users : undefined}
                  />
                ))}
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <div className="min-w-0 rounded-xl border border-border p-3 sm:col-span-2 sm:p-4">
                  <h3 className="mb-3 font-semibold text-foreground">
                    Monthly donut Â· {selectedReport.chartLabel}
                  </h3>
                  {monthlySlices.length > 0 ? (
                    <div className="grid items-center gap-4 sm:grid-cols-2">
                      <DonutChart
                        slices={monthlySlices}
                        centerValue={formatCompact(
                          monthlySlices.reduce(
                            (sum, slice) => sum + slice.value,
                            0
                          )
                        )}
                        centerLabel="total"
                        label={`Monthly ${selectedReport.chartLabel}`}
                        formatValue={formatCurrency}
                      />
                      <DonutLegend
                        slices={monthlySlices}
                        formatValue={formatCurrency}
                      />
                    </div>
                  ) : (
                    <p className="py-10 text-center text-sm text-muted-foreground">
                      No chart data is available for this period.
                    </p>
                  )}
                </div>

                <div className="min-w-0 rounded-xl border border-border p-3 sm:p-4">
                  <h3 className="mb-3 font-semibold text-foreground">
                    Share by department
                  </h3>
                  {departmentSlices.length > 0 ? (
                    <>
                      <DonutChart
                        slices={departmentSlices}
                        centerValue={formatCompact(
                          departmentSlices.reduce(
                            (sum, slice) => sum + slice.value,
                            0
                          )
                        )}
                        centerLabel="total"
                        label="Share by department"
                        formatValue={formatCurrency}
                      />
                      <DonutLegend
                        slices={departmentSlices}
                        formatValue={formatCurrency}
                      />
                    </>
                  ) : (
                    <p className="py-10 text-center text-sm text-muted-foreground">
                      No data is available for this period.
                    </p>
                  )}
                </div>
              </div>

              <div className=" p-2 sm:p-4">
                <TanStackTable
                  data={selectedRows}
                  columns={selectedColumns}
                  enablePagination
                  pageSize={8}
                  showDownload={true}
                  pageSizeOptions={[8, 16, 32]}
                  getRowId={row => row.id}
                  emptyMessage="No records are available for this period."
                  headerClassName="bg-muted"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => handleDownload(selectedReport)}
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download CSV
                </Button>
              </div>
            </Section>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PayrollReportsPage;
