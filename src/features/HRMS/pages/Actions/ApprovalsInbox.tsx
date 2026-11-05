import { type FormEvent, useMemo, useState } from 'react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { approvalDecisionOptions } from '@/data/reusableDropdownData';

import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import NeedMyApprovalTab from './approval-inbox/NeedMyApprovalTab';
import ApprovedTab from './approval-inbox/ApprovedTab';
import RejectedTab from './approval-inbox/RejectedTab';
import {
  formatDate,
  todayIso,
  type ApprovalRequest,
  type ApprovalStatus,
  type ApprovalType,
  typeLabels,
} from './approval-inbox/approvalInboxUtils';

// Sample data. Replace with your API response when it is ready.
const initialApprovalRequests: ApprovalRequest[] = [
  {
    id: 'APR-0001',
    name: 'Ananya Sharma',
    department: 'Design',
    position: 'UI Designer',
    type: 'leave',
    title: 'Casual leave · 2 days',
    details: '12 Nov – 13 Nov 2026',
    reason: 'Family function out of town.',
    submittedOn: '2026-10-19',
    status: 'pending',
    decidedOn: null,
    note: '',
  },
  {
    id: 'APR-0002',
    name: 'Rahul Verma',
    department: 'Engineering',
    position: 'Developer',
    type: 'shiftSwap',
    title: 'Night to Morning shift',
    details: 'Swap with Karan Joshi on 28 Oct 2026',
    reason: 'Doctor appointment in the evening.',
    submittedOn: '2026-10-21',
    status: 'pending',
    decidedOn: null,
    note: '',
  },
  {
    id: 'APR-0003',
    name: 'Priya Menon',
    department: 'Human Resources',
    position: 'HR Executive',
    type: 'overtime',
    title: 'Overtime · 2 h 30 min',
    details: '20 Oct 2026, 6:00 PM – 8:30 PM',
    reason: 'Month-end joining formalities.',
    submittedOn: '2026-10-21',
    status: 'pending',
    decidedOn: null,
    note: '',
  },
  {
    id: 'APR-0004',
    name: 'Sneha Patil',
    department: 'Finance',
    position: 'Accountant',
    type: 'regularization',
    title: 'Missed punch-out',
    details: '21 Oct 2026, actual out time 6:15 PM',
    reason: 'Forgot to punch out at the gate.',
    submittedOn: '2026-10-22',
    status: 'pending',
    decidedOn: null,
    note: '',
  },
  {
    id: 'APR-0005',
    name: 'Vikram Rao',
    department: 'Sales',
    position: 'Sales Manager',
    type: 'leave',
    title: 'Sick leave · 1 day',
    details: '22 Oct 2026',
    reason: 'Fever and cold.',
    submittedOn: '2026-10-22',
    status: 'pending',
    decidedOn: null,
    note: '',
  },
  {
    id: 'APR-0006',
    name: 'Divya Nair',
    department: 'Marketing',
    position: 'Content Writer',
    type: 'overtime',
    title: 'Overtime · 3 h',
    details: '18 Oct 2026, 7:00 PM – 10:00 PM',
    reason: 'Campaign launch deadline.',
    submittedOn: '2026-10-18',
    status: 'pending',
    decidedOn: null,
    note: '',
  },
  {
    id: 'APR-0007',
    name: 'Arjun Mehta',
    department: 'Engineering',
    position: 'QA Engineer',
    type: 'leave',
    title: 'Earned leave · 5 days',
    details: '02 Nov – 06 Nov 2026',
    reason: 'Planned family trip.',
    submittedOn: '2026-10-17',
    status: 'pending',
    decidedOn: null,
    note: '',
  },
  {
    id: 'APR-0008',
    name: 'Isha Kapoor',
    department: 'Support',
    position: 'Support Executive',
    type: 'shiftSwap',
    title: 'Morning to Evening shift',
    details: 'Swap with Neha Gupta on 30 Oct 2026',
    reason: 'Exam preparation class in the morning.',
    submittedOn: '2026-10-20',
    status: 'pending',
    decidedOn: null,
    note: '',
  },
  {
    id: 'APR-0009',
    name: 'Karan Joshi',
    department: 'Engineering',
    position: 'Developer',
    type: 'leave',
    title: 'Casual leave · 1 day',
    details: '15 Oct 2026',
    reason: 'Personal work.',
    submittedOn: '2026-10-12',
    status: 'approved',
    decidedOn: '2026-10-13',
    note: 'Approved. Please finish the handover.',
  },
  {
    id: 'APR-0010',
    name: 'Neha Gupta',
    department: 'Support',
    position: 'Support Executive',
    type: 'overtime',
    title: 'Overtime · 2 h',
    details: '10 Oct 2026, 6:00 PM – 8:00 PM',
    reason: 'Customer escalation.',
    submittedOn: '2026-10-11',
    status: 'approved',
    decidedOn: '2026-10-12',
    note: '',
  },
  {
    id: 'APR-0011',
    name: 'Rohit Sinha',
    department: 'Sales',
    position: 'Sales Executive',
    type: 'regularization',
    title: 'Missed punch-in',
    details: '09 Oct 2026, actual in time 9:30 AM',
    reason: 'Biometric machine was not working.',
    submittedOn: '2026-10-10',
    status: 'approved',
    decidedOn: '2026-10-10',
    note: '',
  },
  {
    id: 'APR-0012',
    name: 'Meera Iyer',
    department: 'Finance',
    position: 'Accounts Executive',
    type: 'leave',
    title: 'Earned leave · 4 days',
    details: '26 Oct – 29 Oct 2026',
    reason: 'Vacation.',
    submittedOn: '2026-10-09',
    status: 'rejected',
    decidedOn: '2026-10-11',
    note: 'Month-end closing. Please apply for November.',
  },
  {
    id: 'APR-0013',
    name: 'Sahil Khan',
    department: 'Engineering',
    position: 'Developer',
    type: 'shiftSwap',
    title: 'Morning to Night shift',
    details: 'Swap with Rahul Verma on 14 Oct 2026',
    reason: 'Personal reasons.',
    submittedOn: '2026-10-08',
    status: 'rejected',
    decidedOn: '2026-10-09',
    note: 'Swap notice is less than 2 days.',
  },
];

type ApprovalTab = ApprovalStatus;
type TypeFilter = 'all' | ApprovalType;

const tabs: { key: ApprovalTab; label: string }[] = [
  { key: 'pending', label: 'Needs my approval' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

const typeFilters: { key: TypeFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'leave', label: 'Leave' },
  { key: 'shiftSwap', label: 'Shift swap' },
  { key: 'overtime', label: 'Overtime' },
  { key: 'regularization', label: 'Attendance' },
];

const isTypeFilter = (value: string): value is TypeFilter =>
  typeFilters.some(filter => filter.key === value);

const SummaryLine = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-4 py-2 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-right font-medium">{value}</span>
  </div>
);

const ApprovalsInbox = () => {
  const [records, setRecords] = useState<ApprovalRequest[]>(
    initialApprovalRequests
  );
  const [tab, setTab] = useState<ApprovalTab>('pending');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [reviewId, setReviewId] = useState<string | null>(null);
  const [decision, setDecision] = useState('approve');
  const [note, setNote] = useState('');

  const pending = records.filter(record => record.status === 'pending');

  const tabRecords = useMemo(
    () => records.filter(record => record.status === tab),
    [records, tab]
  );

  const typeCounts = useMemo(() => {
    const counts: Record<TypeFilter, number> = {
      all: tabRecords.length,
      leave: 0,
      shiftSwap: 0,
      overtime: 0,
      regularization: 0,
    };
    tabRecords.forEach(record => {
      counts[record.type] += 1;
    });
    return counts;
  }, [tabRecords]);

  const visibleRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tabRecords.filter(record => {
      if (typeFilter !== 'all' && record.type !== typeFilter) return false;
      if (tab !== 'pending' || !query) return true;
      return [record.name, record.department, record.title, record.details]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [tabRecords, typeFilter, search, tab]);

  const selectedVisible = visibleRecords.filter(record =>
    selectedIds.includes(record.id)
  );
  const allSelected =
    visibleRecords.length > 0 &&
    selectedVisible.length === visibleRecords.length;

  const reviewRecord = records.find(record => record.id === reviewId) ?? null;

  const counts: Record<ApprovalTab, number> = {
    pending: pending.length,
    approved: records.filter(record => record.status === 'approved').length,
    rejected: records.filter(record => record.status === 'rejected').length,
  };

  const decideRecords = (
    ids: string[],
    status: ApprovalStatus,
    decisionNote: string
  ) =>
    setRecords(current =>
      current.map(record =>
        ids.includes(record.id)
          ? {
              ...record,
              status,
              decidedOn: status === 'pending' ? null : todayIso(),
              note: decisionNote,
            }
          : record
      )
    );

  const undoDecision = (ids: string[]) => decideRecords(ids, 'pending', '');

  const toggleSelected = (id: string) =>
    setSelectedIds(current =>
      current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id]
    );

  const toggleSelectAll = () =>
    setSelectedIds(allSelected ? [] : visibleRecords.map(record => record.id));

  const handleApprove = (record: ApprovalRequest) => {
    decideRecords([record.id], 'approved', '');
    toast.success(
      `Approved ${record.name}'s ${typeLabels[record.type].toLowerCase()} request.`,
      {
        action: { label: 'Undo', onClick: () => undoDecision([record.id]) },
      }
    );
  };

  const handleApproveSelected = () => {
    if (selectedVisible.length === 0) {
      toast.info('Select at least one request first.');
      return;
    }
    const ids = selectedVisible.map(record => record.id);
    decideRecords(ids, 'approved', '');
    setSelectedIds([]);
    toast.success(
      `Approved ${ids.length} ${ids.length === 1 ? 'request' : 'requests'}.`,
      {
        action: { label: 'Undo', onClick: () => undoDecision(ids) },
      }
    );
  };

  const openReview = (record: ApprovalRequest) => {
    setReviewId(record.id);
    setDecision('approve');
    setNote('');
  };

  const handleReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reviewRecord) return;

    if (decision === 'reject') {
      if (!note.trim()) {
        toast.error('Write a short reason for the employee.');
        return;
      }
      decideRecords([reviewRecord.id], 'rejected', note.trim());
      toast.success(
        `Request rejected. ${reviewRecord.name} has been sent your reason.`
      );
    } else {
      decideRecords([reviewRecord.id], 'approved', note.trim());
      toast.success(`Request approved for ${reviewRecord.name}.`);
    }
    setReviewId(null);
  };

  const changeTab = (next: ApprovalTab) => {
    setTab(next);
    setTypeFilter('all');
    setSelectedIds([]);
  };

  return (
    <>
      <Section title="Approval Inbox" menuId="approval-inbox" showBreadcrumbs>
        <div className="space-y-6">
          <div
            role="tablist"
            aria-label="Approval status"
            className="flex flex-wrap gap-1 "
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
                  onClick={() => changeTab(item.key)}
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

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div
              role="group"
              aria-label="Request type"
              className="flex flex-wrap gap-2"
            >
              {typeFilters.map(filter => {
                const isActive = typeFilter === filter.key;
                return (
                  <Button
                    key={filter.key}
                    type="button"
                    size="sm"
                    variant={isActive ? 'default' : 'outline'}
                    aria-pressed={isActive}
                    onClick={() => {
                      if (isTypeFilter(filter.key)) {
                        setTypeFilter(filter.key);
                      }
                    }}
                  >
                    {filter.label}
                    <span
                      className={`rounded-full px-1.5 text-xs ${
                        isActive ? 'bg-primary-foreground/20' : 'bg-muted'
                      }`}
                    >
                      {typeCounts[filter.key]}
                    </span>
                  </Button>
                );
              })}
            </div>
            {tab === 'pending' && (
              <div className="w-full sm:w-72">
                <FormField
                  label="Search"
                  name="approval-search"
                  value={search}
                  onChange={setSearch}
                  placeholder="Search by name or request"
                />
              </div>
            )}
          </div>

          {tab === 'pending' && (
            <NeedMyApprovalTab
              records={visibleRecords}
              pendingCount={pending.length}
              selectedIds={selectedIds}
              selectedCount={selectedVisible.length}
              allSelected={allSelected}
              onToggleSelectAll={toggleSelectAll}
              onToggleSelect={toggleSelected}
              onApproveSelected={handleApproveSelected}
              onReview={openReview}
              onApprove={handleApprove}
            />
          )}

          {tab === 'approved' && <ApprovedTab records={visibleRecords} />}
          {tab === 'rejected' && <RejectedTab records={visibleRecords} />}
        </div>
      </Section>

      {/* Review a request */}
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
            <DialogTitle>Review request</DialogTitle>
            <DialogDescription>
              {reviewRecord
                ? `${reviewRecord.name} · ${reviewRecord.department}`
                : ''}
            </DialogDescription>
          </DialogHeader>
          {reviewRecord && (
            <form onSubmit={handleReview} className="space-y-4">
              <div className="divide-y divide-border rounded-md border border-border px-4">
                <SummaryLine
                  label="Type"
                  value={typeLabels[reviewRecord.type]}
                />
                <SummaryLine label="Request" value={reviewRecord.title} />
                <SummaryLine label="Details" value={reviewRecord.details} />
                <SummaryLine label="Reason" value={reviewRecord.reason} />
                <SummaryLine
                  label="Submitted on"
                  value={formatDate(reviewRecord.submittedOn)}
                />
              </div>
              <FormField
                label="Your decision"
                name="approval-review-decision"
                type="select"
                value={decision}
                onChange={setDecision}
                options={approvalDecisionOptions}
              />
              <FormField
                label={
                  decision === 'reject'
                    ? 'Reason for the employee'
                    : 'Note (optional)'
                }
                name="approval-review-note"
                type="textarea"
                value={note}
                onChange={setNote}
                placeholder={
                  decision === 'reject'
                    ? 'Tell them why the request is not approved'
                    : 'Add a note for the employee'
                }
                rows={3}
                required={decision === 'reject'}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setReviewId(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {decision === 'reject' ? 'Reject request' : 'Approve request'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApprovalsInbox;
