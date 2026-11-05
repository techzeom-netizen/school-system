import { type FormEvent, useRef, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { FormField, TanStackTable } from '@/components/common';
import Section from '@/components/common/Section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  type DayPart,
  type LeaveRequest,
  type LeaveTypeId,
  type RequestValues,
  type StatusFilter,
  type LongWeekendIdea,
  emptyApplyForm,
  dayPartOptions,
  findLeaveType,
  formatRange,
  getLeftDays,
  getLongWeekendIdeas,
  initialRequests,
  leaveTypes,
  leaveTypeOptions,
  managerName,
  pluralize,
  statusBadgeClass,
  statusFilterOptions,
  statusLabels,
  sumDays,
  checkRequest,
  formatDate,
  formatDays,
  requestsShownFirst,
  lastMonthOffset,
  showDemoControls,
} from './my-leaves/myLeavesData';
import {
  BalanceCard,
  LeaveCalendar,
  RequestPanel,
  UpcomingHolidays,
} from './my-leaves/MyLeavesComponents';
const MyLeavesPage = () => {
  const [requests, setRequests] = useState(initialRequests);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [showAll, setShowAll] = useState(false);
  const requestSequence = useRef(initialRequests.length);

  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<string | null>(null);
  const [type, setType] = useState<LeaveTypeId>('casual');
  const [part, setPart] = useState<DayPart>('full');
  const [reason, setReason] = useState('');
  const [justSent, setJustSent] = useState(false);

  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [applyForm, setApplyForm] = useState<RequestValues>(emptyApplyForm);

  const selectionCheck =
    selectedStart && selectedEnd
      ? checkRequest(
          {
            type,
            startDate: selectedStart,
            endDate: selectedEnd,
            part,
            reason,
          },
          requests
        )
      : null;

  const longWeekendIdeas = getLongWeekendIdeas(requests);

  const statusCounts: Record<StatusFilter, number> = {
    all: requests.length,
    pending: requests.filter(request => request.status === 'pending').length,
    approved: requests.filter(request => request.status === 'approved').length,
    rejected: requests.filter(request => request.status === 'rejected').length,
  };

  const filteredRequests = requests
    .filter(
      request => statusFilter === 'all' || request.status === statusFilter
    )
    .sort((first, second) => (first.startDate < second.startDate ? 1 : -1));
  const visibleRequests = showAll
    ? filteredRequests
    : filteredRequests.slice(0, requestsShownFirst);

  const updateApplyForm = (changes: Partial<RequestValues>) =>
    setApplyForm(current => ({ ...current, ...changes }));

  const clearSelection = () => {
    setSelectedStart(null);
    setSelectedEnd(null);
    setPart('full');
  };

  const handlePickDay = (iso: string) => {
    setJustSent(false);
    setPart('full');

    if (!selectedStart || selectedEnd) {
      setSelectedStart(iso);
      setSelectedEnd(null);
    } else if (iso < selectedStart) {
      setSelectedStart(iso);
    } else {
      setSelectedEnd(iso);
    }
  };

  const handleChangeMonth = (direction: 1 | -1) =>
    setMonthOffset(current =>
      Math.min(lastMonthOffset, Math.max(0, current + direction))
    );

  const handlePlanIdea = (idea: LongWeekendIdea) => {
    const now = new Date();
    const date = new Date(`${idea.date}T00:00:00`);
    const offset =
      (date.getFullYear() - now.getFullYear()) * 12 +
      date.getMonth() -
      now.getMonth();
    setMonthOffset(Math.min(lastMonthOffset, Math.max(0, offset)));
    setSelectedStart(idea.date);
    setSelectedEnd(idea.date);
    setPart('full');
    setJustSent(false);
  };

  const submitRequest = (values: RequestValues) => {
    const check = checkRequest(values, requests);
    if (check.error) {
      toast.error(check.error);
      return false;
    }

    requestSequence.current += 1;
    setRequests(current => [
      {
        id: `request-${requestSequence.current}`,
        type: values.type,
        startDate: values.startDate,
        endDate: values.endDate,
        days: check.days,
        part: values.part,
        reason: values.reason,
        status: 'pending',
        note: `Waiting for ${managerName}`,
      },
      ...current,
    ]);
    setStatusFilter('all');
    setShowAll(false);
    toast.success(`Request sent. ${managerName} will be notified.`);
    return true;
  };

  const handleSendFromCalendar = () => {
    if (!selectedStart || !selectedEnd) return;
    const isSent = submitRequest({
      type,
      startDate: selectedStart,
      endDate: selectedEnd,
      part,
      reason,
    });
    if (isSent) {
      clearSelection();
      setReason('');
      setJustSent(true);
    }
  };

  const openApplyDialog = () => {
    setApplyForm({ ...emptyApplyForm, type });
    setIsApplyOpen(true);
  };

  const handleApplySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!applyForm.startDate || !applyForm.endDate) {
      toast.error('Pick the first and last day of your leave.');
      return;
    }
    if (submitRequest(applyForm)) setIsApplyOpen(false);
  };

  const updateRequest = (id: string, changes: Partial<LeaveRequest>) =>
    setRequests(current =>
      current.map(request =>
        request.id === id ? { ...request, ...changes } : request
      )
    );

  const handleCancel = (request: LeaveRequest) => {
    updateRequest(request.id, {
      status: 'cancelled',
      note: 'You cancelled this request',
    });
    toast.success('Request cancelled. The days are back in your balance.');
  };

  const handleDecision = (
    request: LeaveRequest,
    status: 'approved' | 'rejected'
  ) => {
    updateRequest(request.id, {
      status,
      note:
        status === 'approved'
          ? `Approved by ${managerName}`
          : 'Please pick another date',
    });
    toast.success(
      status === 'approved'
        ? 'Your leave was approved.'
        : 'Your leave was rejected.'
    );
  };

  const requestColumns: ColumnDef<LeaveRequest>[] = [
    {
      accessorKey: 'startDate',
      header: 'Dates',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-foreground">
            {formatRange(row.original.startDate, row.original.endDate)}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatDays(row.original.days)} working{' '}
            {pluralize(row.original.days, 'day')}
            {row.original.part !== 'full' &&
              `  ${row.original.part === 'first' ? 'first' : 'second'} half`}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Leave type',
      cell: ({ row }) => (
        <span className="font-medium text-foreground">
          {findLeaveType(row.original.type).label}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          className={`border-transparent ${statusBadgeClass[row.original.status]}`}
        >
          {statusLabels[row.original.status]}
        </Badge>
      ),
    },
    {
      accessorKey: 'note',
      header: 'Note',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.note}</span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: ({ row }) =>
        row.original.status === 'pending' ? (
          <div className="flex flex-wrap items-center gap-2">
            {showDemoControls && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  className="w-auto text-xs border-destructive/40 text-destructive hover:text-destructive"
                  onClick={() => handleCancel(row.original)}
                >
                  Cancel request
                </Button>

                <Button
                  type="button"
                  size="xs"
                  variant="success"
                  onClick={() => handleDecision(row.original, 'approved')}
                  className="w-auto text-xs"
                >
                  Manager approves
                </Button>
                <Button
                  type="button"
                  size="xs"
                  variant="destructive"
                  onClick={() => handleDecision(row.original, 'rejected')}
                  className="w-auto text-xs"
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        ) : null,
    },
  ];

  return (
    <>
      <Section title="My Leaves" menuId="my-leaves" showBreadcrumbs>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {leaveTypes.map(leaveType => (
              <BalanceCard
                key={leaveType.id}
                leaveType={leaveType}
                left={getLeftDays(leaveType, requests)}
                pending={sumDays(requests, leaveType.id, 'pending')}
                isSelected={leaveType.id === type}
                onSelect={() => setType(leaveType.id)}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-start gap-6">
            <LeaveCalendar
              monthOffset={monthOffset}
              selectedStart={selectedStart}
              selectedEnd={selectedEnd}
              requests={requests}
              onPickDay={handlePickDay}
              onChangeMonth={handleChangeMonth}
            />

            <div className="w-full space-y-6 lg:w-[25rem] lg:shrink-0">
              <RequestPanel
                selectedStart={selectedStart}
                selectedEnd={selectedEnd}
                check={selectionCheck}
                type={type}
                part={part}
                reason={reason}
                requests={requests}
                justSent={justSent}
                onTypeChange={setType}
                onPartChange={setPart}
                onReasonChange={setReason}
                onSend={handleSendFromCalendar}
                onClear={clearSelection}
              />
              <UpcomingHolidays />
              {longWeekendIdeas.slice(0, 1).map(idea => (
                <Card
                  key={idea.date}
                  className="space-y-3 border-primary/30 bg-primary/5 p-6"
                >
                  <h3 className="text-lg font-semibold text-foreground">
                    Long weekend ideas
                  </h3>
                  <p className="text-sm text-foreground">
                    Take{' '}
                    {formatDate(idea.date, {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}{' '}
                    off and get 4 days in a row with {idea.holidayName}. It
                    costs you 1 day of leave.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => handlePlanIdea(idea)}
                  >
                    Plan it on the calendar
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          <Section title="My requests" contentClassName="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div
                className="flex w-fit max-w-full gap-1 rounded-xl border border-border bg-card p-1"
                role="group"
                aria-label="Filter requests"
              >
                {statusFilterOptions.map(option => {
                  const isActive = statusFilter === option.value;
                  return (
                    <Button
                      key={option.value}
                      type="button"
                      size="sm"
                      variant={isActive ? 'default' : 'ghost'}
                      aria-pressed={isActive}
                      className=" gap-2 px-4"
                      onClick={() => {
                        setStatusFilter(option.value);
                        setShowAll(false);
                      }}
                    >
                      {option.label}
                      <span
                        className={`rounded-full px-2 text-xs font-semibold ${
                          isActive
                            ? 'bg-primary-foreground/20 text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        {statusCounts[option.value]}
                      </span>
                    </Button>
                  );
                })}
              </div>
              <div className="mr-auto grid w-full grid-cols-1 gap-3 sm:w-auto">
                <Button variant="default" size="lg" onClick={openApplyDialog}>
                  <Plus className="w-4 h-4" />
                  Apply for leave
                </Button>
              </div>
            </div>

            <TanStackTable
              data={visibleRequests}
              columns={requestColumns}
              enableSearch={false}
              enableSorting={false}
              showDownload={true}
              enablePagination={false}
              hideFooter
              emptyMessage="No requests here yet."
            />

            {filteredRequests.length > requestsShownFirst && (
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAll(current => !current)}
                >
                  {showAll
                    ? 'Show fewer requests'
                    : `Show all ${filteredRequests.length} requests`}
                </Button>
              </div>
            )}
          </Section>
        </div>
      </Section>

      <Dialog
        open={isApplyOpen}
        onOpenChange={open => !open && setIsApplyOpen(false)}
      >
        <DialogContent
          className="sm:max-w-lg"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Apply for leave</DialogTitle>
            <DialogDescription>
              Prefer typing dates? Fill this in. Weekends and holidays are not
              counted.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApplySubmit} className="space-y-4">
            <FormField
              label="Type of leave"
              name="apply-type"
              type="select"
              value={applyForm.type}
              onChange={value => {
                const match = leaveTypes.find(item => item.id === value);
                if (match) updateApplyForm({ type: match.id });
              }}
              options={leaveTypeOptions}
              required
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                label="First day"
                name="apply-start"
                type="date"
                value={applyForm.startDate}
                onChange={startDate => updateApplyForm({ startDate })}
                required
              />
              <FormField
                label="Last day"
                name="apply-end"
                type="date"
                value={applyForm.endDate}
                onChange={endDate => updateApplyForm({ endDate })}
                required
              />
            </div>
            <FormField
              label="Full day or half day?"
              name="apply-part"
              type="select"
              value={applyForm.part}
              onChange={value => {
                if (
                  value === 'full' ||
                  value === 'first' ||
                  value === 'second'
                ) {
                  updateApplyForm({ part: value });
                }
              }}
              options={dayPartOptions}
              required
            />
            <FormField
              label="Reason (optional)"
              name="apply-reason"
              type="textarea"
              value={applyForm.reason}
              onChange={reasonText => updateApplyForm({ reason: reasonText })}
              placeholder="e.g. Family function"
            />

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsApplyOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Send request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MyLeavesPage;
