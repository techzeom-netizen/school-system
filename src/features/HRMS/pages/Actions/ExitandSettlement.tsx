import { type FormEvent, useMemo, useRef, useState } from 'react';
import { ClipboardCheck, Mail, Plus } from 'lucide-react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import {
  exitClearanceItems,
  exitDecisionOptions,
  exitDepartmentOptions,
  exitPaymentModeOptions,
  exitReasonOptions,
  getSettlementNet,
  initialExitRecords,
  type ClearanceItemId,
  type ExitRecord,
} from '@/data/reusableDropdownData';

import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import NeedMyActionTab from './exit-settlement/NeedMyActionTab';
import InprogressTab, {
  type ProgressFilter,
} from './exit-settlement/InprogressTab';
import ExitedTab from './exit-settlement/ExitedTab';
import {
  formatDate,
  formatMoney,
  todayIso,
} from './exit-settlement/exitSettlementUtils';

type ExitTab = 'action' | 'progress' | 'exited';

interface AddForm extends Record<string, string> {
  name: string;
  department: string;
  position: string;
  reason: string;
  resignedOn: string;
  lastWorkingDay: string;
  monthlySalary: string;
}

const tabs: { key: ExitTab; label: string }[] = [
  { key: 'action', label: 'Needs my action' },
  { key: 'progress', label: 'In progress' },
  { key: 'exited', label: 'Exited' },
];

const formatDeduction = (amount: number) =>
  amount > 0 ? `− ${formatMoney(amount)}` : formatMoney(0);

const emptyAddForm: AddForm = {
  name: '',
  department: '',
  position: '',
  reason: '',
  resignedOn: todayIso(),
  lastWorkingDay: '',
  monthlySalary: '',
};

const SummaryLine = ({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) => (
  <div className="flex items-center justify-between gap-4 py-2 text-sm">
    <span className={strong ? 'font-semibold' : 'text-muted-foreground'}>
      {label}
    </span>
    <span className={strong ? 'text-base font-semibold' : 'font-medium'}>
      {value}
    </span>
  </div>
);

const ExitandSettlement = () => {
  const [records, setRecords] = useState<ExitRecord[]>(initialExitRecords);
  const [tab, setTab] = useState<ExitTab>('action');
  const [progressFilter, setProgressFilter] = useState<ProgressFilter>('all');

  const [reviewId, setReviewId] = useState<string | null>(null);
  const [decision, setDecision] = useState('accept');
  const [reviewLastDay, setReviewLastDay] = useState('');
  const [declineMessage, setDeclineMessage] = useState('');

  const [payId, setPayId] = useState<string | null>(null);
  const [paymentMode, setPaymentMode] = useState('Bank transfer');
  const [extraDeduction, setExtraDeduction] = useState('');
  const [extraNote, setExtraNote] = useState('');

  const [checklistId, setChecklistId] = useState<string | null>(null);
  const [checklistDraft, setChecklistDraft] = useState<Record<
    ClearanceItemId,
    boolean
  > | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<AddForm>(emptyAddForm);
  const nextId = useRef(initialExitRecords.length);

  const resignations = records.filter(record => record.stage === 'resignation');
  const payments = records.filter(record => record.stage === 'settlement');
  const inProgress = records.filter(
    record => record.stage === 'notice' || record.stage === 'clearance'
  );
  const exited = records.filter(record => record.stage === 'exited');
  const actionCount = resignations.length + payments.length;
  const paymentsTotal = payments.reduce(
    (sum, record) => sum + getSettlementNet(record.settlement),
    0
  );

  const visibleProgress = useMemo(
    () =>
      progressFilter === 'all'
        ? inProgress
        : inProgress.filter(record => record.stage === progressFilter),
    [inProgress, progressFilter]
  );

  const reviewRecord = records.find(record => record.id === reviewId) ?? null;
  const payRecord = records.find(record => record.id === payId) ?? null;
  const checklistRecord =
    records.find(record => record.id === checklistId) ?? null;

  const updateRecord = (id: string, changes: Partial<ExitRecord>) =>
    setRecords(current =>
      current.map(record =>
        record.id === id ? { ...record, ...changes } : record
      )
    );

  const openReview = (record: ExitRecord) => {
    setReviewId(record.id);
    setDecision('accept');
    setReviewLastDay(record.lastWorkingDay);
    setDeclineMessage('');
  };

  const handleReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reviewRecord) return;

    if (decision === 'decline') {
      if (!declineMessage.trim()) {
        toast.error('Write a short message for the employee.');
        return;
      }
      setRecords(current =>
        current.filter(record => record.id !== reviewRecord.id)
      );
      toast.success(
        `Resignation declined. ${reviewRecord.name} has been sent your message.`
      );
      setReviewId(null);
      return;
    }

    if (!reviewLastDay) {
      toast.error('Choose the last working day.');
      return;
    }
    if (reviewLastDay < todayIso()) {
      toast.error('The last working day cannot be in the past.');
      return;
    }
    updateRecord(reviewRecord.id, {
      stage: 'notice',
      lastWorkingDay: reviewLastDay,
    });
    toast.success(
      `Resignation accepted. ${reviewRecord.name}'s last working day is ${formatDate(reviewLastDay)}.`
    );
    setReviewId(null);
  };

  const handleStartClearance = (record: ExitRecord) => {
    updateRecord(record.id, { stage: 'clearance' });
    toast.success(`Clearance started for ${record.name}.`);
  };

  const openChecklist = (record: ExitRecord) => {
    setChecklistId(record.id);
    setChecklistDraft({ ...record.clearance });
  };

  const handleSendReminder = () => {
    if (!checklistRecord || !checklistDraft) return;
    const pending = exitClearanceItems.filter(item => !checklistDraft[item.id]);
    if (pending.length === 0) {
      toast.info('Nothing is pending, so there is no one to remind.');
      return;
    }
    const owners = Array.from(new Set(pending.map(item => item.owner)));
    toast.success(`Reminder sent to ${owners.join(', ')}.`);
  };

  const handleSaveChecklist = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!checklistRecord || !checklistDraft) return;

    const allDone = exitClearanceItems.every(item => checklistDraft[item.id]);
    updateRecord(checklistRecord.id, {
      clearance: checklistDraft,
      stage: allDone ? 'settlement' : checklistRecord.stage,
    });
    toast.success(
      allDone
        ? `All clearance done. ${checklistRecord.name}'s final payment is ready to approve.`
        : 'Clearance checklist saved.'
    );
    setChecklistId(null);
  };

  const openPayment = (record: ExitRecord) => {
    setPayId(record.id);
    setPaymentMode('Bank transfer');
    setExtraDeduction('');
    setExtraNote('');
  };

  const extraAmount = Number(extraDeduction) || 0;
  const payNet = payRecord
    ? getSettlementNet(payRecord.settlement) - extraAmount
    : 0;

  const handlePay = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!payRecord) return;

    if (getSettlementNet(payRecord.settlement) <= 0) {
      toast.error(
        'The settlement amount is not ready yet. Check payroll first.'
      );
      return;
    }
    if (extraDeduction !== '' && !/^\d+$/.test(extraDeduction.trim())) {
      toast.error('Enter the extra deduction as a whole number.');
      return;
    }
    if (extraAmount > getSettlementNet(payRecord.settlement)) {
      toast.error('The extra deduction is more than the amount due.');
      return;
    }
    if (extraAmount > 0 && !extraNote.trim()) {
      toast.error('Add a short reason for the extra deduction.');
      return;
    }

    updateRecord(payRecord.id, {
      stage: 'exited',
      exitedOn: todayIso(),
      finalAmount: payNet,
      paymentMode,
    });
    toast.success(
      `Final payment of ${formatMoney(payNet)} approved for ${payRecord.name}.`
    );
    setPayId(null);
  };

  const updateAddForm = (name: keyof AddForm, value: string) =>
    setAddForm(current => ({ ...current, [name]: value }));

  const handleAdd = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = addForm.name.trim().replace(/\s+/g, ' ');

    if (!name || !addForm.department || !addForm.reason) {
      toast.error('Enter the name, department and reason.');
      return;
    }
    if (!addForm.resignedOn || !addForm.lastWorkingDay) {
      toast.error('Choose the resignation date and the last working day.');
      return;
    }
    if (addForm.monthlySalary && !/^\d+$/.test(addForm.monthlySalary.trim())) {
      toast.error('Enter the monthly salary as a whole number.');
      return;
    }
    if (addForm.lastWorkingDay < addForm.resignedOn) {
      toast.error(
        'The last working day cannot be before the resignation date.'
      );
      return;
    }
    const alreadyLeaving = records.some(
      record =>
        record.stage !== 'exited' &&
        record.name.toLowerCase() === name.toLowerCase()
    );
    if (alreadyLeaving) {
      toast.error(`${name} is already in the exit process.`);
      return;
    }

    nextId.current += 1;
    const newRecord: ExitRecord = {
      id: `EXIT-${String(nextId.current).padStart(4, '0')}`,
      name,
      department: addForm.department,
      position: addForm.position.trim() || 'Employee',
      reason: addForm.reason,
      resignedOn: addForm.resignedOn,
      lastWorkingDay: addForm.lastWorkingDay,
      // Added by HR, so it goes straight to the notice period.
      stage: 'notice',
      clearance: {
        assets: false,
        idCard: false,
        handover: false,
        manager: false,
        finance: false,
      },

      settlement: {
        salaryDue: Number(addForm.monthlySalary) || 0,
        leaveEncashment: 0,
        bonus: 0,
        noticeShortfall: 0,
        assetRecovery: 0,
      },
      exitedOn: null,
      finalAmount: null,
      paymentMode: null,
    };
    setRecords(current => [newRecord, ...current]);
    setTab('progress');
    setAddForm({ ...emptyAddForm, resignedOn: todayIso() });
    setIsAddOpen(false);
    toast.success(`${name} added. They are now serving notice.`);
  };

  const counts: Record<ExitTab, number> = {
    action: actionCount,
    progress: inProgress.length,
    exited: exited.length,
  };

  return (
    <>
      <Section
        title="Exit & Settlements"
        menuId="exit-and-settlements"
        showBreadcrumbs
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              role="tablist"
              aria-label="Exit steps"
              className="flex flex-wrap gap-1"
            >
              {tabs.map(item => {
                const isActive = tab === item.key;
                return (
                  <Button
                    key={item.key}
                    type="button"
                    variant="ghost"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setTab(item.key)}
                    className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:bg-transparent hover:text-foreground'
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
                      {counts[item.key]}
                    </span>
                  </Button>
                );
              })}
            </div>
            <div className="ml-auto flex w-full justify-end sm:w-auto">
              <Button
                type="button"
                variant="default"
                className="w-full sm:w-44"
                onClick={() => setIsAddOpen(true)}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add resignation
              </Button>
            </div>
          </div>

          {tab === 'action' && (
            <NeedMyActionTab
              resignations={resignations}
              payments={payments}
              paymentsTotal={paymentsTotal}
              onReview={openReview}
              onPay={openPayment}
            />
          )}
          {tab === 'progress' && (
            <InprogressTab
              records={visibleProgress}
              filter={progressFilter}
              onFilterChange={setProgressFilter}
              onStartClearance={handleStartClearance}
              onOpenChecklist={openChecklist}
            />
          )}
          {tab === 'exited' && <ExitedTab records={exited} />}
        </div>
      </Section>

      <Dialog
        open={reviewRecord !== null}
        onOpenChange={open => {
          if (!open) setReviewId(null);
        }}
      >
        <DialogContent
          className="sm:max-w-lg"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Review resignation</DialogTitle>
            <DialogDescription>
              {reviewRecord
                ? `${reviewRecord.name} · ${reviewRecord.department}`
                : ''}
            </DialogDescription>
          </DialogHeader>
          {reviewRecord && (
            <form onSubmit={handleReview} className="space-y-4">
              <div className="divide-y divide-border rounded-md border border-border px-4">
                <SummaryLine label="Position" value={reviewRecord.position} />
                <SummaryLine
                  label="Submitted on"
                  value={formatDate(reviewRecord.resignedOn)}
                />
                <SummaryLine label="Reason" value={reviewRecord.reason} />
              </div>
              <FormField
                label="Your decision"
                name="exit-review-decision"
                type="select"
                value={decision}
                onChange={setDecision}
                options={exitDecisionOptions}
              />
              {decision === 'accept' ? (
                <FormField
                  label="Last working day"
                  name="exit-review-last-day"
                  type="date"
                  value={reviewLastDay}
                  onChange={setReviewLastDay}
                  hint="Based on the notice period, but you can change it."
                  required
                />
              ) : (
                <FormField
                  label="Message to the employee"
                  name="exit-review-message"
                  type="textarea"
                  value={declineMessage}
                  onChange={setDeclineMessage}
                  placeholder="Tell them why you would like them to stay"
                  rows={3}
                  required
                />
              )}
              <DialogFooter>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setReviewId(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {decision === 'accept' ? 'Accept resignation' : 'Decline'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={checklistRecord !== null}
        onOpenChange={open => {
          if (!open) setChecklistId(null);
        }}
      >
        <DialogContent
          className="sm:max-w-lg"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Clearance checklist</DialogTitle>
            <DialogDescription>
              {checklistRecord
                ? `${checklistRecord.name} · last working day ${formatDate(checklistRecord.lastWorkingDay)}`
                : ''}
            </DialogDescription>
          </DialogHeader>
          {checklistRecord && checklistDraft && (
            <form onSubmit={handleSaveChecklist} className="space-y-4">
              <div className="divide-y divide-border rounded-md border border-border px-4">
                {exitClearanceItems.map(item => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.owner}
                      </p>
                    </div>
                    <FormField
                      label={item.label}
                      name={`exit-clearance-${item.id}`}
                      type="toggle"
                      value={checklistDraft[item.id]}
                      onToggleChange={() =>
                        setChecklistDraft(current =>
                          current
                            ? { ...current, [item.id]: !current[item.id] }
                            : current
                        )
                      }
                      toggleActiveLabel="Done"
                      toggleInactiveLabel="Pending"
                    />
                  </div>
                ))}
              </div>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
                {
                  exitClearanceItems.filter(item => checklistDraft[item.id])
                    .length
                }{' '}
                of {exitClearanceItems.length} done. When everything is done,
                the final payment is ready to approve.
              </p>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendReminder}
                >
                  <Mail /> Send reminder
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setChecklistId(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save checklist</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={payRecord !== null}
        onOpenChange={open => {
          if (!open) setPayId(null);
        }}
      >
        <DialogContent
          className="sm:max-w-lg"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Approve final payment</DialogTitle>
            <DialogDescription>
              {payRecord
                ? `${payRecord.name} · last working day ${formatDate(payRecord.lastWorkingDay)}`
                : ''}
            </DialogDescription>
          </DialogHeader>
          {payRecord && (
            <form onSubmit={handlePay} className="space-y-4">
              <div className="divide-y divide-border rounded-md border border-border px-4">
                <SummaryLine
                  label="Salary due"
                  value={formatMoney(payRecord.settlement.salaryDue)}
                />
                <SummaryLine
                  label="Leave encashment"
                  value={formatMoney(payRecord.settlement.leaveEncashment)}
                />
                <SummaryLine
                  label="Bonus and others"
                  value={formatMoney(payRecord.settlement.bonus)}
                />
                <SummaryLine
                  label="Notice shortfall"
                  value={formatDeduction(payRecord.settlement.noticeShortfall)}
                />
                <SummaryLine
                  label="Asset recovery"
                  value={formatDeduction(payRecord.settlement.assetRecovery)}
                />
                {extraAmount > 0 && (
                  <SummaryLine
                    label="Extra deduction"
                    value={formatDeduction(extraAmount)}
                  />
                )}
                <SummaryLine
                  label="Amount to pay"
                  value={formatMoney(payNet)}
                  strong
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Extra deduction (optional)"
                  name="exit-pay-extra"
                  value={extraDeduction}
                  onChange={setExtraDeduction}
                  placeholder="0"
                />
                <FormField
                  label="Pay by"
                  name="exit-pay-mode"
                  type="select"
                  value={paymentMode}
                  onChange={setPaymentMode}
                  options={exitPaymentModeOptions}
                />
              </div>
              {extraAmount > 0 && (
                <FormField
                  label="Reason for the extra deduction"
                  name="exit-pay-note"
                  value={extraNote}
                  onChange={setExtraNote}
                  placeholder="For example: damaged equipment"
                  required
                />
              )}
              <DialogFooter>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setPayId(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">Approve and pay</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent
          className="sm:max-w-xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Add resignation</DialogTitle>
            <DialogDescription>
              Use this when an employee resigns in person or by email. They
              start serving notice right away.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Employee name"
                name="exit-add-name"
                value={addForm.name}
                onChange={value => updateAddForm('name', value)}
                placeholder="Full name"
                required
              />
              <FormField
                label="Department"
                name="exit-add-department"
                type="select"
                value={addForm.department}
                onChange={value => updateAddForm('department', value)}
                options={exitDepartmentOptions}
                placeholder="Select department"
                required
              />
              <FormField
                label="Position"
                name="exit-add-position"
                value={addForm.position}
                onChange={value => updateAddForm('position', value)}
                placeholder="Job title"
              />
              <FormField
                label="Monthly salary (optional)"
                name="exit-add-salary"
                value={addForm.monthlySalary}
                onChange={value => updateAddForm('monthlySalary', value)}
                placeholder="For the final settlement"
              />
              <FormField
                label="Reason"
                name="exit-add-reason"
                type="select"
                value={addForm.reason}
                onChange={value => updateAddForm('reason', value)}
                options={exitReasonOptions}
                placeholder="Select reason"
                required
              />
              <FormField
                label="Resignation date"
                name="exit-add-resigned-on"
                type="date"
                value={addForm.resignedOn}
                onChange={value => updateAddForm('resignedOn', value)}
                required
              />
              <FormField
                label="Last working day"
                name="exit-add-last-day"
                type="date"
                value={addForm.lastWorkingDay}
                onChange={value => updateAddForm('lastWorkingDay', value)}
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsAddOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add resignation</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExitandSettlement;
