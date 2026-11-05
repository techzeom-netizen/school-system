import { type FormEvent, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Send } from 'lucide-react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import {
  payslipDepartmentOptions,
  payslipTabOptions,
} from '@/data/reusableDropdownData';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SendTab from './pay-slip/SendTab';
import NeedaFixTab from './pay-slip/NeedaFixTab';
import ReadyToSendTab from './pay-slip/ReadyToSendTab';
import {
  buildPayslipCsv,
  downloadFile,
  fixReasons,
  formatCurrency,
  formatDate,
  formatMonth,
  getLines,
  todayIso,
  visibleCount,
  type FixReason,
  type FixForm,
  type PayslipRecord,
  type PayslipStatus,
} from './pay-slip/payslipUtils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type PayslipTab = PayslipStatus;

const monthsShown = 7;

const emptyFixForm: FixForm = {
  account: '',
  ifsc: '',
  pan: '',
  checked: false,
};

const offsetDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString('en-CA');
};

const monthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

// The last few months, oldest first. The newest is the current month.
const getMonths = () => {
  const now = new Date();
  return Array.from({ length: monthsShown }, (_, index) =>
    monthKey(
      new Date(now.getFullYear(), now.getMonth() - (monthsShown - 1 - index), 1)
    )
  );
};

const months = getMonths();
const currentMonth = months[months.length - 1];

const departments = [
  'Sales',
  'Engineering',
  'Finance',
  'HR',
  'Operations',
  'Marketing',
  'Support',
];
const firstNames = [
  'Aarav',
  'Bhavna',
  'Chirag',
  'Deepa',
  'Eshan',
  'Fatima',
  'Girish',
  'Hema',
  'Ishaan',
  'Jaya',
  'Kunal',
  'Lavanya',
  'Manish',
  'Nikita',
  'Omkar',
  'Payal',
  'Qasim',
  'Riya',
  'Suresh',
  'Tanvi',
];
const lastNames = [
  'Agarwal',
  'Bose',
  'Chopra',
  'Dutta',
  'Fernandes',
  'Ghosh',
  'Hegde',
  'Iyengar',
  'Jain',
  'Kapoor',
  'Lal',
  'Menon',
  'Naidu',
  'Oberoi',
  'Pillai',
  'Rao',
  'Sheikh',
  'Thakur',
  'Verma',
  'Yadav',
];

type EmployeeSeed = [string, string, number, number, FixReason | null];

// name, department, monthly pay, income tax, what is missing (if anything)
const namedEmployees: EmployeeSeed[] = [
  ['Rohan Iyer', 'Sales', 50000, 2200, null],
  ['Divya Nair', 'Finance', 42500, 1510, null],
  ['Sneha Patil', 'HR', 58000, 2716, null],
  ['Karan Mehta', 'Operations', 32000, 864, null],
  ['Isha Gupta', 'Finance', 37500, 1400, null],
  ['Rahul Verma', 'Operations', 30500, 1036, null],
  ['Amit Deshmukh', 'Engineering', 46000, 1900, 'bank'],
  ['Pooja Shah', 'Marketing', 39000, 1250, 'attendance'],
];

const buildEmployees = (): EmployeeSeed[] => {
  const generated: EmployeeSeed[] = Array.from({ length: 112 }, (_, index) => {
    const gross = 25000 + ((index * 37) % 30) * 1500;
    const name = `${firstNames[index % firstNames.length]} ${
      lastNames[
        (Math.floor(index / firstNames.length) + index * 3) % lastNames.length
      ]
    }`;
    return [
      name,
      departments[(index + 2) % departments.length],
      gross,
      Math.round(gross * 0.04),
      // Employees 8 to 13 of the generated list are the ones that need a fix.
      index >= 8 && index < 14
        ? (['bank', 'attendance', 'pan'] as FixReason[])[index % 3]
        : null,
    ];
  });
  return [...namedEmployees, ...generated];
};

const buildRecords = (): PayslipRecord[] => {
  const employees = buildEmployees();
  const records: PayslipRecord[] = [];

  months.forEach(month => {
    const isCurrent = month === currentMonth;
    const [year, monthNumber] = month.split('-').map(Number);
    const lastDay = new Date(year, monthNumber, 0).toLocaleDateString('en-CA');

    employees.forEach(([name, department, gross, tds, reason], index) => {
      // Positions 0-5 and 8-15 are ready, the ones with a reason need a fix.
      let status: PayslipStatus = 'sent';
      let fixReason: FixReason | null = null;
      if (isCurrent) {
        if (reason) {
          status = 'fix';
          fixReason = reason;
        } else if (index < 16) {
          status = 'ready';
        }
      }
      records.push({
        id: `PAY-${month}-${String(index + 1).padStart(3, '0')}`,
        name,
        department,
        month,
        gross,
        tds,
        status,
        fixReason,
        sentOn:
          status === 'sent'
            ? isCurrent
              ? offsetDate(-(index % 3))
              : lastDay
            : null,
      });
    });
  });
  return records;
};

const PayslipPage = () => {
  const [records, setRecords] = useState<PayslipRecord[]>(buildRecords);
  const [month, setMonth] = useState(currentMonth);
  const [tab, setTab] = useState<PayslipTab>('ready');
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const [previewId, setPreviewId] = useState<string | null>(null);
  const [fixId, setFixId] = useState<string | null>(null);
  const [fixForm, setFixForm] = useState<FixForm>(emptyFixForm);
  const [confirmAllOpen, setConfirmAllOpen] = useState(false);

  const monthRecords = useMemo(
    () => records.filter(record => record.month === month),
    [records, month]
  );
  const ready = monthRecords.filter(record => record.status === 'ready');
  const needFix = monthRecords.filter(record => record.status === 'fix');
  const sent = monthRecords
    .filter(record => record.status === 'sent')
    .sort(
      (first, second) =>
        (second.sentOn ?? '').localeCompare(first.sentOn ?? '') ||
        first.name.localeCompare(second.name)
    );

  const byDepartment = (record: PayslipRecord) =>
    department === 'all' || record.department === department;
  const query = search.trim().toLowerCase();
  const byName = (record: PayslipRecord) =>
    record.name.toLowerCase().includes(query);

  const activeAll = tab === 'ready' ? ready : needFix;
  const activeList = activeAll.filter(
    record => byDepartment(record) && byName(record)
  );
  const shownList = showAll ? activeList : activeList.slice(0, visibleCount);
  const sentList = sent.filter(byDepartment);

  const monthIndex = months.indexOf(month);
  const previewRecord = records.find(record => record.id === previewId);
  const fixRecord = records.find(record => record.id === fixId);

  const update = (id: string, changes: Partial<PayslipRecord>) =>
    setRecords(current =>
      current.map(record =>
        record.id === id ? { ...record, ...changes } : record
      )
    );

  const changeMonth = (step: number) => {
    const next = months[monthIndex + step];
    if (!next) return;
    setMonth(next);
    setTab('ready');
    setSearch('');
    setShowAll(false);
  };

  const changeTab = (next: PayslipTab) => {
    setTab(next);
    setSearch('');
    setShowAll(false);
  };

  const handleSend = (record: PayslipRecord) => {
    update(record.id, { status: 'sent', sentOn: todayIso() });
    toast.success(`Payslip sent to ${record.name}.`);
  };

  const handleResend = (record: PayslipRecord) => {
    update(record.id, { sentOn: todayIso() });
    toast.success(`Payslip sent to ${record.name} again.`);
  };

  const handleSendAll = () => {
    const ids = new Set(ready.map(record => record.id));
    setRecords(current =>
      current.map(record =>
        ids.has(record.id)
          ? { ...record, status: 'sent', sentOn: todayIso() }
          : record
      )
    );
    toast.success(
      `${ids.size} ${ids.size === 1 ? 'payslip' : 'payslips'} sent.`
    );
    setConfirmAllOpen(false);
  };

  const openFix = (record: PayslipRecord) => {
    setFixId(record.id);
    setFixForm(emptyFixForm);
  };

  const handleFix = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fixRecord || !fixRecord.fixReason) return;

    if (fixRecord.fixReason === 'bank') {
      if (!/^\d{9,18}$/.test(fixForm.account.trim())) {
        toast.error('Enter the bank account number (9 to 18 digits).');
        return;
      }
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(fixForm.ifsc.trim().toUpperCase())) {
        toast.error('Enter a valid IFSC code, for example HDFC0001234.');
        return;
      }
    }
    if (
      fixRecord.fixReason === 'pan' &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(fixForm.pan.trim().toUpperCase())
    ) {
      toast.error('Enter a valid PAN, for example ABCDE1234F.');
      return;
    }
    if (fixRecord.fixReason === 'attendance' && !fixForm.checked) {
      toast.error('Turn this on after you have checked the attendance.');
      return;
    }

    update(fixRecord.id, { status: 'ready', fixReason: null });
    toast.success(`Fixed. ${fixRecord.name}'s payslip is ready to send.`);
    setFixId(null);
  };

  const handleDownload = (record: PayslipRecord) => {
    downloadFile(
      buildPayslipCsv(record),
      `payslip-${record.name.toLowerCase().replace(/\s+/g, '-')}-${record.month}.csv`
    );
    toast.success('Payslip downloaded.');
  };

  const openPreview = (record: PayslipRecord) => setPreviewId(record.id);

  const previewLines = previewRecord ? getLines(previewRecord) : null;

  return (
    <>
      <Section title="Payslips" menuId="payslips" showBreadcrumbs>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              role="tablist"
              aria-label="Payslips"
              className="flex flex-wrap gap-1 "
            >
              {payslipTabOptions.map(option => {
                const item = {
                  key: option.value as PayslipTab,
                  label: option.label,
                  count:
                    option.value === 'ready'
                      ? ready.length
                      : option.value === 'fix'
                        ? needFix.length
                        : sent.length,
                };
                const isActive = tab === item.key;
                return (
                  <Button
                    key={item.key}
                    type="button"
                    variant="ghost"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => changeTab(item.key)}
                    className={`h-auto -mb-px flex items-center gap-2 rounded-none border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item.label}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {item.count}
                    </span>
                  </Button>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3">
              <Button
                type="button"
                size="icon"
                variant="default"
                aria-label="Previous month"
                disabled={monthIndex <= 0}
                onClick={() => changeMonth(-1)}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
              <span
                className="min-w-32 text-center text-sm font-semibold"
                aria-live="polite"
              >
                {formatMonth(month)}
              </span>
              <Button
                type="button"
                size="icon"
                variant="default"
                aria-label="Next month"
                disabled={monthIndex >= months.length - 1}
                onClick={() => changeMonth(1)}
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>

              <Button
                type="button"
                disabled={ready.length === 0}
                onClick={() => setConfirmAllOpen(true)}
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                Send all {ready.length}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-start gap-3">
            <FormField
              label="Department"
              name="payslip-department"
              type="select"
              value={department}
              onChange={value => {
                setDepartment(value);
                setShowAll(false);
              }}
              options={payslipDepartmentOptions}
            />

            {tab !== 'sent' && (
              <FormField
                label="Search by name"
                name="payslip-search"
                value={search}
                onChange={value => {
                  setSearch(value);
                  setShowAll(false);
                }}
                placeholder="Search by name"
              />
            )}
          </div>

          {tab === 'ready' && (
            <ReadyToSendTab
              records={shownList}
              totalReady={activeAll.length}
              filteredCount={activeList.length}
              showAll={showAll}
              onToggleShowAll={() => setShowAll(current => !current)}
              onPreview={openPreview}
              onSend={handleSend}
            />
          )}

          {tab === 'fix' && (
            <NeedaFixTab
              records={shownList}
              totalNeedingFix={activeAll.length}
              filteredCount={activeList.length}
              showAll={showAll}
              onToggleShowAll={() => setShowAll(current => !current)}
              onPreview={openPreview}
              onFix={openFix}
            />
          )}

          {tab === 'sent' && (
            <SendTab
              records={sentList}
              currentMonth={currentMonth}
              onView={openPreview}
              onResend={handleResend}
            />
          )}
        </div>

        {/* View one payslip */}
        <Dialog
          open={previewRecord !== undefined}
          onOpenChange={open => {
            if (!open) setPreviewId(null);
          }}
        >
          <DialogContent
            className="max-h-[90vh] overflow-y-auto sm:max-w-lg"
            onInteractOutside={event => event.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>
                {previewRecord ? `${previewRecord.name}'s payslip` : ''}
              </DialogTitle>
              <DialogDescription>
                {previewRecord
                  ? `${previewRecord.department} · ${formatMonth(previewRecord.month)}`
                  : ''}
              </DialogDescription>
            </DialogHeader>
            {previewRecord && previewLines && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">Pay</p>
                  <div className="divide-y divide-border rounded-lg border border-border text-sm">
                    {previewLines.earnings.map(item => (
                      <div
                        key={item.label}
                        className="flex justify-between gap-3 px-3 py-2"
                      >
                        <span>{item.label}</span>
                        <span>{formatCurrency(item.amount)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between gap-3 bg-muted/50 px-3 py-2 font-semibold">
                      <span>Total pay</span>
                      <span>{formatCurrency(previewLines.gross)}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    Deductions
                  </p>
                  <div className="divide-y divide-border rounded-lg border border-border text-sm">
                    {previewLines.deductionLines.map(item => (
                      <div
                        key={item.label}
                        className="flex justify-between gap-3 px-3 py-2"
                      >
                        <span>{item.label}</span>
                        <span>{formatCurrency(item.amount)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between gap-3 bg-muted/50 px-3 py-2 font-semibold">
                      <span>Total deductions</span>
                      <span>{formatCurrency(previewLines.deductions)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-lg bg-primary/10 px-4 py-3 text-primary">
                  <span className="font-semibold">Take-home pay</span>
                  <span className="text-xl font-bold">
                    {formatCurrency(previewLines.net)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Badge
                    variant="secondary"
                    className={
                      previewRecord.status === 'fix'
                        ? 'bg-destructive/10 text-destructive'
                        : undefined
                    }
                  >
                    {previewRecord.status === 'ready'
                      ? 'Ready to send'
                      : previewRecord.status === 'sent'
                        ? `Sent on ${formatDate(previewRecord.sentOn)}`
                        : 'Needs a fix'}
                  </Badge>
                  {previewRecord.fixReason && (
                    <span>{fixReasons[previewRecord.fixReason].label}</span>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setPreviewId(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="default"
                    onClick={() => handleDownload(previewRecord)}
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Download
                  </Button>
                  {previewRecord.status === 'ready' && (
                    <Button
                      type="button"
                      onClick={() => {
                        handleSend(previewRecord);
                        setPreviewId(null);
                      }}
                    >
                      Send payslip
                    </Button>
                  )}
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={fixRecord !== undefined && fixRecord.fixReason !== null}
          onOpenChange={open => {
            if (!open) setFixId(null);
          }}
        >
          <DialogContent
            className="sm:max-w-md"
            onInteractOutside={event => event.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>
                {fixRecord?.fixReason
                  ? fixReasons[fixRecord.fixReason].label
                  : ''}
              </DialogTitle>
              <DialogDescription>
                {fixRecord
                  ? `${fixRecord.name} · ${formatMonth(fixRecord.month)}`
                  : ''}
              </DialogDescription>
            </DialogHeader>
            {fixRecord?.fixReason && (
              <form onSubmit={handleFix} className="space-y-4">
                {fixRecord.fixReason === 'bank' && (
                  <>
                    <FormField
                      label="Bank account number"
                      name="payslip-fix-account"
                      value={fixForm.account}
                      onChange={value =>
                        setFixForm(current => ({ ...current, account: value }))
                      }
                      placeholder="For example: 123456789012"
                      required
                    />
                    <FormField
                      label="IFSC code"
                      name="payslip-fix-ifsc"
                      value={fixForm.ifsc}
                      onChange={value =>
                        setFixForm(current => ({ ...current, ifsc: value }))
                      }
                      placeholder="For example: HDFC0001234"
                      required
                    />
                  </>
                )}
                {fixRecord.fixReason === 'pan' && (
                  <FormField
                    label="PAN"
                    name="payslip-fix-pan"
                    value={fixForm.pan}
                    onChange={value =>
                      setFixForm(current => ({ ...current, pan: value }))
                    }
                    placeholder="For example: ABCDE1234F"
                    required
                  />
                )}
                {fixRecord.fixReason === 'attendance' && (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3">
                    <p className="text-sm text-foreground">
                      I have checked the attendance and it is correct.
                    </p>
                    <FormField
                      label="I have checked the attendance"
                      name="payslip-fix-attendance"
                      type="toggle"
                      value={fixForm.checked}
                      onToggleChange={() =>
                        setFixForm(current => ({
                          ...current,
                          checked: !current.checked,
                        }))
                      }
                      toggleActiveLabel="Yes"
                      toggleInactiveLabel="No"
                    />
                  </div>
                )}
                <DialogFooter>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setFixId(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save and continue</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={confirmAllOpen} onOpenChange={setConfirmAllOpen}>
          <DialogContent
            className="sm:max-w-md"
            onInteractOutside={event => event.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>
                Send {ready.length}{' '}
                {ready.length === 1 ? 'payslip' : 'payslips'}?
              </DialogTitle>
              <DialogDescription>
                Each employee gets their {formatMonth(month)} payslip by email
                and in their app. You cannot take it back.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setConfirmAllOpen(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleSendAll}>
                Send all {ready.length}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>
    </>
  );
};

export default PayslipPage;
