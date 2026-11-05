import { useMemo, useState } from 'react';
import {
  Banknote,
  Landmark,
  PauseCircle,
  Plus,
  RefreshCcw,
  Upload,
} from 'lucide-react';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { TanStackTable } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  formatCurrency,
  getEmi,
  getFilterLabel,
  getOutstanding,
  initialRecords,
  recordTypes,
  typeBadgeClass,
  typeFilters,
  viewModeOptions,
} from './loan-and-advances/loanAdvanceData';
import { requestColumns } from './loan-and-advances/loanAdvanceColumns';
import {
  EmptyState,
  NeedsAttentionCard,
  SegmentedControl,
  StatCard,
} from './loan-and-advances/LoanAdvanceComponents';
import type {
  LoanRecord,
  RecordType,
  TypeFilter,
  ViewMode,
} from './loan-and-advances/loanAdvanceTypes';
const LoanAndAdvancePage = () => {
  const [financialYear] = useState('FY 2026-27');
  const [records, setRecords] = useState<LoanRecord[]>(initialRecords);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('ongoing');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [recordType, setRecordType] = useState<RecordType>('Loan');
  const [employeeName, setEmployeeName] = useState('');
  const [recordAmount, setRecordAmount] = useState('');
  const [recordMonths, setRecordMonths] = useState('1');
  const [recordPurpose, setRecordPurpose] = useState('');
  const [importFileName, setImportFileName] = useState('');

  const yearRecords = useMemo(
    () => records.filter(record => record.financialYear === financialYear),
    [records, financialYear]
  );

  const ongoingRecords = useMemo(
    () => yearRecords.filter(record => record.status !== 'closed'),
    [yearRecords]
  );

  const stats = useMemo(() => {
    const activeLoans = ongoingRecords.filter(
      r => r.type === 'Loan' && r.status === 'active'
    );
    const advances = yearRecords.filter(r => r.type === 'Advance');
    const paused = ongoingRecords.filter(r => r.status === 'paused');
    const activeAll = ongoingRecords.filter(r => r.status === 'active');

    return {
      loanCount: activeLoans.length,
      loanOutstanding: activeLoans.reduce(
        (sum, r) => sum + getOutstanding(r),
        0
      ),
      repayments: activeAll.reduce((sum, r) => sum + getEmi(r), 0),
      deductionCount: activeAll.length,
      advanceTotal: advances.reduce((sum, r) => sum + r.amount, 0),
      advanceEmployees: new Set(advances.map(r => r.employee)).size,
      pausedCount: paused.length,
      pausedInstallments: paused.reduce(
        (sum, r) => sum + (r.months - r.paidMonths),
        0
      ),
    };
  }, [ongoingRecords, yearRecords]);

  const visibleRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return yearRecords.filter(record => {
      const matchesView =
        viewMode === 'closed'
          ? record.status === 'closed'
          : record.status !== 'closed';
      const matchesType = typeFilter === 'all' || record.type === typeFilter;
      const matchesSearch =
        !query ||
        [
          record.employee,
          record.type,
          record.purpose,
          String(record.amount),
        ].some(value => value.toLowerCase().includes(query));

      return matchesView && matchesType && matchesSearch;
    });
  }, [yearRecords, viewMode, typeFilter, search]);

  const resetForm = () => {
    setRecordType('Loan');
    setEmployeeName('');
    setRecordAmount('');
    setRecordMonths('1');
    setRecordPurpose('');
  };

  const resetImportForm = () => {
    setImportFileName('');
  };

  const openDialog = (type: RecordType) => {
    setRecordType(type);
    setIsDialogOpen(true);
  };

  const viewRecordsByType = (type: TypeFilter) => {
    setTypeFilter(type);
    setViewMode('ongoing');
    setSearch('');
    setIsTypeDialogOpen(false);
  };

  const handleAttentionSelect = (type: TypeFilter) => {
    setTypeFilter(type);
    setViewMode('ongoing');
    setSearch('');
  };

  const startRecordWorkflow = (type: RecordType) => {
    setIsTypeDialogOpen(false);
    openDialog(type);
  };

  const handleCreateRecord = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = Number(recordAmount);
    const months = Number(recordMonths);

    if (
      !employeeName.trim() ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !Number.isInteger(months) ||
      months < 1
    ) {
      toast.error('Enter an employee, a valid amount and recovery period.');
      return;
    }

    const newRecord: LoanRecord = {
      id: `LN-${Date.now()}`,
      employee: employeeName.trim(),
      type: recordType,
      purpose: recordPurpose.trim() || recordType,
      financialYear,
      date: new Date().toISOString().slice(0, 10),
      amount,
      months,
      paidMonths: 0,
      status: 'pending',
    };

    setRecords(current => [newRecord, ...current]);
    setTypeFilter('all');
    resetForm();
    setIsDialogOpen(false);
    toast.success(`${recordType} added for review.`);
  };

  const handleImportSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!importFileName) {
      toast.error('Choose a CSV file to import.');
      return;
    }

    resetImportForm();
    setIsImportDialogOpen(false);
    toast.success('Import file queued for review.');
  };

  return (
    <>
      <Section
        title="Loan & Advance"
        menuId="loans-and-advances"
        showBreadcrumbs
      >
        <div className="flex justify-end gap-3 mb-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsTypeDialogOpen(true)}
          >
            Loan Types
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setIsImportDialogOpen(true)}
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            Import
          </Button>

          <Button
            type="button"
            variant="default"
            onClick={() => openDialog('Advance')}
          >
            <Plus className="h-4 w-4" />
            Add Advance
          </Button>
          <Button type="button" onClick={() => openDialog('Loan')}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Loan
          </Button>
        </div>
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Ongoing loans"
              value={String(stats.loanCount)}
              caption={`${formatCurrency(stats.loanOutstanding)} outstanding`}
              icon={Landmark}
              iconClass="bg-primary/10 text-primary"
            />
            <StatCard
              label="Expected repayments"
              value={formatCurrency(stats.repayments)}
              caption={`${stats.deductionCount} deductions this month`}
              icon={RefreshCcw}
              iconClass="bg-accent text-accent-foreground"
            />
            <StatCard
              label="Advances this FY"
              value={formatCurrency(stats.advanceTotal)}
              caption={`${stats.advanceEmployees} ${stats.advanceEmployees === 1 ? 'employee' : 'employees'}`}
              icon={Banknote}
              iconClass="bg-secondary text-secondary-foreground"
            />
            <StatCard
              label="Paused loans"
              value={String(stats.pausedCount)}
              caption={`${stats.pausedInstallments} installments on hold`}
              captionClass={
                stats.pausedCount > 0
                  ? 'font-semibold text-destructive'
                  : 'text-muted-foreground'
              }
              icon={PauseCircle}
              iconClass="bg-destructive/10 text-destructive"
            />
          </div>
          <div className="grid gap-8 xl:grid-cols-4 xl:items-start">
            <div className="min-w-0 space-y-4 xl:col-span-3">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div
                  className="flex w-fit gap-1 rounded-xl bg-muted p-1"
                  role="group"
                  aria-label="Filter by type"
                >
                  {typeFilters.map(option => (
                    <Button
                      key={option}
                      type="button"
                      size="sm"
                      variant={typeFilter === option ? 'secondary' : 'ghost'}
                      aria-pressed={typeFilter === option}
                      onClick={() => setTypeFilter(option)}
                    >
                      {getFilterLabel(option, yearRecords)}
                    </Button>
                  ))}
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <FormField
                    label="Search employees"
                    name="loan-employee-search"
                    type="text"
                    value={search}
                    onChange={setSearch}
                    placeholder="Search employee(s)"
                    className="w-full sm:w-56"
                  />
                  <SegmentedControl
                    options={viewModeOptions}
                    value={viewMode}
                    onChange={setViewMode}
                    ariaLabel="Ongoing or closed"
                  />
                </div>
              </div>

              {visibleRecords.length === 0 ? (
                <EmptyState
                  hasRecords={yearRecords.length > 0}
                  onAddLoan={() => openDialog('Loan')}
                />
              ) : (
                <TanStackTable
                  data={visibleRecords}
                  columns={requestColumns}
                  enableSearch={false}
                  enableSorting={false}
                  enableColumnVisibility={false}
                  enablePagination={false}
                  hideFooter
                  getRowId={record => record.id}
                  emptyMessage="No loans or advances found."
                  className="space-y-0"
                />
              )}
            </div>
            <div className="min-w-0 xl:col-span-1">
              <NeedsAttentionCard
                records={ongoingRecords}
                onSelect={handleAttentionSelect}
              />
            </div>
          </div>
        </div>
      </Section>

      <Dialog
        open={isDialogOpen}
        onOpenChange={open => {
          setIsDialogOpen(open);
          if (!open) {
            resetForm();
          }
        }}
      >
        <DialogContent
          className="overflow-hidden p-0 sm:max-w-md"
          onInteractOutside={event => event.preventDefault()}
        >
          <Section title={`Add ${recordType.toLowerCase()}`}>
            <form onSubmit={handleCreateRecord} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <FormField
                  label="Employee"
                  name="employee"
                  value={employeeName}
                  onChange={setEmployeeName}
                  placeholder="Employee name"
                  required
                />
                <FormField
                  label="Type"
                  name="record-type"
                  type="select"
                  value={recordType}
                  onChange={value => setRecordType(value as RecordType)}
                  options={recordTypes}
                  required
                />
                <FormField
                  label="Amount (₹)"
                  name="record-amount"
                  type="number"
                  value={recordAmount}
                  onChange={setRecordAmount}
                  min="1"
                  step="1"
                  placeholder="Enter amount"
                  required
                />
                <FormField
                  label="Recovery period (months)"
                  name="record-months"
                  type="number"
                  value={recordMonths}
                  onChange={setRecordMonths}
                  min="1"
                  step="1"
                  placeholder="Enter recovery period"
                  required
                />
                <FormField
                  label="Purpose"
                  name="record-purpose"
                  value={recordPurpose}
                  onChange={setRecordPurpose}
                  placeholder="e.g. Home loan"
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Section>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isTypeDialogOpen}
        onOpenChange={open => setIsTypeDialogOpen(open)}
      >
        <DialogContent
          className="overflow-hidden p-0 sm:max-w-lg"
          onInteractOutside={event => event.preventDefault()}
        >
          <Section title="Loan types">
            <div className="grid gap-3 sm:grid-cols-2">
              {recordTypes.map(type => (
                <div
                  key={type.value}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <Badge
                    variant="secondary"
                    className={typeBadgeClass[type.value as RecordType]}
                  >
                    {type.label}
                  </Badge>
                  <p className="mt-3 text-sm text-muted-foreground">
                    View current {type.label.toLowerCase()} records or start a
                    new request.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        viewRecordsByType(type.value as RecordType)
                      }
                    >
                      View
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() =>
                        startRecordWorkflow(type.value as RecordType)
                      }
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      Add
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsTypeDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </Section>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isImportDialogOpen}
        onOpenChange={open => {
          setIsImportDialogOpen(open);
          if (!open) resetImportForm();
        }}
      >
        <DialogContent
          className="overflow-hidden p-0 sm:max-w-md"
          onInteractOutside={event => event.preventDefault()}
        >
          <Section
            title="Import records"
            className="w-full min-w-0 rounded-lg border-0 shadow-none"
            headerClassName="pr-10"
            contentClassName="space-y-4 p-4 sm:p-6"
          >
            <form onSubmit={handleImportSubmit} className="space-y-4">
              <FormField
                label="CSV file"
                name="loan-import-file"
                type="file"
                value={importFileName}
                accept=".csv,text/csv"
                hint={
                  importFileName
                    ? `Selected file: ${importFileName}`
                    : 'Upload a CSV file with employee loan or advance records.'
                }
                onFileChange={event =>
                  setImportFileName(event.target.files?.[0]?.name ?? '')
                }
                required
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetImportForm();
                    setIsImportDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <Upload className="h-4 w-4" aria-hidden="true" />
                  Import
                </Button>
              </DialogFooter>
            </form>
          </Section>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoanAndAdvancePage;
