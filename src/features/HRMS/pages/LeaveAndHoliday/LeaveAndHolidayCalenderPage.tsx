import { type FormEvent, useMemo, useState } from 'react';
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
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
import { cn } from '@/lib/utils';

type LeaveType = 'Casual leave' | 'Sick leave' | 'Earned leave' | 'Half day';
type LeaveStatus = 'pending' | 'approved' | 'rejected';
type HolidayType = 'Public holiday' | 'Company holiday' | 'Optional holiday';

interface LeaveRecord {
  id: string;
  employeeName: string;
  department: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  balance: number;
  status: LeaveStatus;
  managerNote?: string;
}

interface Holiday {
  id: string;
  name: string;
  date: string;
  type: HolidayType;
  repeatYearly: boolean;
}

interface CalendarCell {
  iso: string;
  day: number;
  inMonth: boolean;
}

const busyLimit = 5;
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const departmentSizes: Record<string, number> = {
  Engineering: 20,
  Finance: 8,
  Marketing: 6,
  Operations: 10,
  Sales: 12,
  HR: 4,
};

const createLeave = (
  id: string,
  employeeName: string,
  department: string,
  type: LeaveType,
  startDate: string,
  endDate: string,
  status: LeaveStatus = 'approved',
  reason = '',
  balance = 8
): LeaveRecord => ({
  id,
  employeeName,
  department,
  type,
  startDate,
  endDate,
  reason,
  balance,
  status,
});

const initialLeaves: LeaveRecord[] = [
  createLeave(
    'l1',
    'Neha Sharma',
    'Engineering',
    'Casual leave',
    '2026-10-12',
    '2026-10-15'
  ),
  createLeave(
    'l2',
    'Arjun Rao',
    'Engineering',
    'Sick leave',
    '2026-10-13',
    '2026-10-14'
  ),
  createLeave(
    'l3',
    'Sneha Iyer',
    'Marketing',
    'Half day',
    '2026-10-14',
    '2026-10-14'
  ),
  createLeave(
    'l4',
    'Dev Malhotra',
    'Operations',
    'Earned leave',
    '2026-10-14',
    '2026-10-16'
  ),
  createLeave(
    'l5',
    'Karan Patel',
    'Sales',
    'Casual leave',
    '2026-10-14',
    '2026-10-15'
  ),
  createLeave(
    'l6',
    'Ananya Das',
    'Finance',
    'Casual leave',
    '2026-10-21',
    '2026-10-22'
  ),
  createLeave(
    'l7',
    'Jay Kapoor',
    'Engineering',
    'Earned leave',
    '2026-10-21',
    '2026-10-23'
  ),
  createLeave(
    'l8',
    'Rahul Menon',
    'Engineering',
    'Casual leave',
    '2026-10-21',
    '2026-10-22'
  ),
  createLeave(
    'l9',
    'Vikram Singh',
    'Sales',
    'Casual leave',
    '2026-10-21',
    '2026-10-22'
  ),
  createLeave(
    'l10',
    'Isha Verma',
    'Marketing',
    'Earned leave',
    '2026-10-19',
    '2026-10-23'
  ),
  createLeave(
    'l11',
    'Rohan Shah',
    'Operations',
    'Casual leave',
    '2026-10-21',
    '2026-10-22'
  ),
  createLeave(
    'l12',
    'Meera S.',
    'HR',
    'Sick leave',
    '2026-10-22',
    '2026-10-22'
  ),
  createLeave(
    'l13',
    'Kavya Nair',
    'Finance',
    'Earned leave',
    '2026-10-26',
    '2026-10-28'
  ),
  createLeave(
    'l14',
    'Amit Lal',
    'Sales',
    'Casual leave',
    '2026-10-05',
    '2026-10-06'
  ),
  createLeave(
    'l15',
    'Pooja Rao',
    'HR',
    'Sick leave',
    '2026-10-07',
    '2026-10-08'
  ),
  createLeave(
    'p1',
    'Priya Nair',
    'Finance',
    'Casual leave',
    '2026-10-21',
    '2026-10-23',
    'pending',
    'Family function',
    8
  ),
  createLeave(
    'p2',
    'Siddharth Rao',
    'Engineering',
    'Sick leave',
    '2026-10-16',
    '2026-10-16',
    'pending',
    'Not feeling well',
    6
  ),
  createLeave(
    'p3',
    'Lakshmi Iyer',
    'HR',
    'Earned leave',
    '2026-10-26',
    '2026-10-28',
    'pending',
    'Short trip',
    12
  ),
  createLeave(
    'p4',
    'Nikhil Joshi',
    'Operations',
    'Casual leave',
    '2026-10-29',
    '2026-10-30',
    'pending',
    'Personal work',
    5
  ),
];

const initialHolidays: Holiday[] = [
  {
    id: 'h1',
    name: 'Gandhi Jayanti',
    date: '2026-10-02',
    type: 'Public holiday',
    repeatYearly: true,
  },
  {
    id: 'h2',
    name: 'Dussehra',
    date: '2026-10-20',
    type: 'Public holiday',
    repeatYearly: true,
  },
  {
    id: 'h3',
    name: 'Diwali',
    date: '2026-11-08',
    type: 'Public holiday',
    repeatYearly: true,
  },
  {
    id: 'h4',
    name: 'Christmas',
    date: '2026-12-25',
    type: 'Public holiday',
    repeatYearly: true,
  },
];

const holidayTypes: HolidayType[] = [
  'Public holiday',
  'Company holiday',
  'Optional holiday',
];

const leaveTypeStyles: Record<LeaveType, string> = {
  'Casual leave': 'bg-primary/10 text-primary',
  'Sick leave': 'bg-destructive/10 text-destructive',
  'Earned leave': 'bg-muted text-foreground',
  'Half day': 'bg-muted text-foreground',
};

const toIso = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${date.getFullYear()}-${month}-${day}`;
};

const fromIso = (iso: string) => new Date(`${iso}T00:00:00`);

const formatLongDay = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(fromIso(iso));

const formatShort = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(
    fromIso(iso)
  );

const formatRange = (start: string, end: string) => {
  if (start === end) return formatShort(start);

  const first = fromIso(start);
  const last = fromIso(end);

  if (
    first.getMonth() === last.getMonth() &&
    first.getFullYear() === last.getFullYear()
  ) {
    return `${first.getDate()}–${formatShort(end)}`;
  }

  return `${formatShort(start)} – ${formatShort(end)}`;
};

const getDayCount = (start: string, end: string) =>
  Math.round((fromIso(end).getTime() - fromIso(start).getTime()) / 86400000) +
  1;

const getDaysUntil = (iso: string, todayIso: string) =>
  Math.round((fromIso(iso).getTime() - fromIso(todayIso).getTime()) / 86400000);

const getInitials = (name: string) =>
  name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const eachDay = (start: string, end: string) => {
  const days: string[] = [];
  const current = fromIso(start);
  const last = fromIso(end);

  while (current <= last) {
    days.push(toIso(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
};

const getMonthCells = (year: number, month: number): CalendarCell[] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const start = new Date(year, month, 1 - firstDay.getDay());
  const end = new Date(year, month + 1, 6 - lastDay.getDay());
  const cells: CalendarCell[] = [];

  for (
    const current = new Date(start);
    current <= end;
    current.setDate(current.getDate() + 1)
  ) {
    cells.push({
      iso: toIso(current),
      day: current.getDate(),
      inMonth: current.getMonth() === month,
    });
  }

  return cells;
};

const isOnLeave = (leave: LeaveRecord, iso: string) =>
  leave.startDate <= iso && iso <= leave.endDate;

const LeaveAndHolidayCalenderPage = () => {
  const todayIso = toIso(new Date());
  const [leaves, setLeaves] = useState(initialLeaves);
  const [holidays, setHolidays] = useState(initialHolidays);
  const [viewDate, setViewDate] = useState(() => {
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  });
  const [selectedIso, setSelectedIso] = useState(todayIso);
  const [department, setDepartment] = useState('all');
  const [showAllRequests, setShowAllRequests] = useState(false);

  const [reviewId, setReviewId] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState('');

  const [isHolidayOpen, setIsHolidayOpen] = useState(false);
  const [holidayName, setHolidayName] = useState('');
  const [holidayDate, setHolidayDate] = useState('');
  const [holidayType, setHolidayType] = useState<HolidayType>('Public holiday');
  const [holidayRepeat, setHolidayRepeat] = useState(true);

  const departmentOptions = useMemo(
    () => [
      { value: 'all', label: 'Everyone' },
      ...Object.keys(departmentSizes).map(value => ({ value, label: value })),
    ],
    []
  );

  const approvedLeaves = useMemo(
    () =>
      leaves.filter(
        leave =>
          leave.status === 'approved' &&
          (department === 'all' || leave.department === department)
      ),
    [department, leaves]
  );

  const pendingLeaves = useMemo(
    () =>
      leaves
        .filter(
          leave =>
            leave.status === 'pending' &&
            (department === 'all' || leave.department === department)
        )
        .sort((first, second) =>
          first.startDate.localeCompare(second.startDate)
        ),
    [department, leaves]
  );
  const visibleRequests = showAllRequests
    ? pendingLeaves
    : pendingLeaves.slice(0, 3);

  const monthCells = useMemo(
    () => getMonthCells(viewDate.year, viewDate.month),
    [viewDate]
  );
  const monthLabel = new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(viewDate.year, viewDate.month, 1));

  const getHoliday = (iso: string) =>
    holidays.find(
      holiday =>
        holiday.date === iso ||
        (holiday.repeatYearly && holiday.date.slice(5) === iso.slice(5))
    );
  const getLeavesOn = (iso: string) =>
    approvedLeaves.filter(leave => isOnLeave(leave, iso));
  const isWeekend = (iso: string) => [0, 6].includes(fromIso(iso).getDay());

  const nextHoliday = useMemo(
    () =>
      holidays
        .filter(holiday => holiday.date >= todayIso)
        .sort((first, second) => first.date.localeCompare(second.date))[0],
    [holidays, todayIso]
  );

  const selectedHoliday = getHoliday(selectedIso);
  const selectedLeaves = getLeavesOn(selectedIso);

  const reviewLeave = leaves.find(leave => leave.id === reviewId) ?? null;

  const getClashCount = (leave: LeaveRecord) =>
    Math.max(
      0,
      ...eachDay(leave.startDate, leave.endDate).map(
        iso =>
          leaves.filter(
            other =>
              other.status === 'approved' &&
              other.id !== leave.id &&
              isOnLeave(other, iso)
          ).length
      )
    );

  const getDepartmentOut = (leave: LeaveRecord) =>
    Math.max(
      0,
      ...eachDay(leave.startDate, leave.endDate).map(
        iso =>
          leaves.filter(
            other =>
              other.status === 'approved' &&
              other.id !== leave.id &&
              other.department === leave.department &&
              isOnLeave(other, iso)
          ).length
      )
    );

  const changeMonth = (step: number) => {
    setViewDate(current => {
      const next = new Date(current.year, current.month + step, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };

  const goToToday = () => {
    const today = new Date();

    setViewDate({ year: today.getFullYear(), month: today.getMonth() });
    setSelectedIso(todayIso);
  };

  const openReview = (leave: LeaveRecord) => {
    setReviewId(leave.id);
    setReviewNote('');
  };

  const closeReview = () => {
    setReviewId(null);
    setReviewNote('');
  };

  const decideLeave = (status: 'approved' | 'rejected') => {
    if (!reviewLeave) return;

    setLeaves(currentLeaves =>
      currentLeaves.map(leave =>
        leave.id === reviewLeave.id
          ? { ...leave, status, managerNote: reviewNote.trim() }
          : leave
      )
    );
    toast.success(
      `${reviewLeave.employeeName}'s leave ${status === 'approved' ? 'approved' : 'rejected'}.`
    );
    closeReview();
  };

  const closeHolidayDialog = () => {
    setIsHolidayOpen(false);
    setHolidayName('');
    setHolidayDate('');
    setHolidayType('Public holiday');
    setHolidayRepeat(true);
  };

  const handleAddHoliday = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!holidayName.trim() || !holidayDate) {
      toast.error('Add a holiday name and a date.');
      return;
    }

    const newHoliday: Holiday = {
      id: `holiday-${Date.now()}`,
      name: holidayName.trim(),
      date: holidayDate,
      type: holidayType,
      repeatYearly: holidayRepeat,
    };
    const holidayDay = fromIso(holidayDate);

    setHolidays(currentHolidays => [...currentHolidays, newHoliday]);
    setViewDate({
      year: holidayDay.getFullYear(),
      month: holidayDay.getMonth(),
    });
    setSelectedIso(holidayDate);
    toast.success(`"${newHoliday.name}" added to the calendar.`);
    closeHolidayDialog();
  };

  const reviewClash = reviewLeave ? getClashCount(reviewLeave) : 0;
  const reviewDepartmentOut = reviewLeave ? getDepartmentOut(reviewLeave) : 0;

  return (
    <>
      <Section
        title="Leave & holiday calendar"
        menuId="leave-holiday-calander"
        showBreadcrumbs
      >
        <div className="space-y-5">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex items-center overflow-hidden rounded-lg border border-border bg-card">
              <Button
                type="button"
                variant="default"
                size="icon"
                aria-label="Previous month"
                onClick={() => changeMonth(-1)}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
              <span className="min-w-36 px-3 text-center text-sm font-semibold text-foreground">
                {monthLabel}
              </span>
              <Button
                type="button"
                variant="default"
                size="icon"
                aria-label="Next month"
                onClick={() => changeMonth(1)}
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <Button type="button" variant="default" onClick={goToToday}>
              Today
            </Button>
            <div className="ml-auto grid w-full grid-cols-2 items-end gap-3 sm:w-auto">
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => setIsHolidayOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Add holiday
              </Button>

              <FormField
                label="Show"
                name="calendar-department"
                type="select"
                value={department}
                onChange={setDepartment}
                options={departmentOptions}
              />
            </div>
          </div>

          <div className="grid items-start gap-5 lg:grid-cols-2">
            <div>
              <div className="overflow-hidden rounded-xl border border-border">
                <div className="grid grid-cols-7 bg-muted text-xs font-medium sm:text-sm">
                  {weekDays.map(day => (
                    <span key={day} className="px-2 py-2.5 sm:px-3">
                      {day}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-7 divide-x divide-y divide-border">
                  {monthCells.map(cell => {
                    const holiday = cell.inMonth
                      ? getHoliday(cell.iso)
                      : undefined;
                    const weekend = isWeekend(cell.iso);
                    const count =
                      cell.inMonth && !weekend
                        ? getLeavesOn(cell.iso).length
                        : 0;
                    const isBusy = count >= busyLimit;
                    const isToday = cell.iso === todayIso;
                    const isSelected = cell.iso === selectedIso;

                    return (
                      <Button
                        key={cell.iso}
                        type="button"
                        variant="ghost"
                        aria-pressed={isSelected}
                        aria-label={`${formatLongDay(cell.iso)}${holiday ? `, ${holiday.name}` : ''}${count ? `, ${count} on leave` : ''}`}
                        onClick={() => setSelectedIso(cell.iso)}
                        className={cn(
                          'h-auto min-h-20 w-full flex-col items-start gap-1.5 rounded-none p-1.5 text-left text-sm transition-colors hover:bg-primary/5 sm:min-h-24 sm:p-2',
                          !cell.inMonth && 'bg-muted/40 text-muted-foreground',
                          cell.inMonth && weekend && 'bg-muted/40',
                          isBusy && 'bg-primary/10',
                          isSelected && 'ring-2 ring-inset ring-primary'
                        )}
                      >
                        <span
                          className={cn(
                            'flex h-7 w-7 items-center justify-center rounded-full font-semibold',
                            isToday && 'bg-primary text-primary-foreground'
                          )}
                        >
                          {cell.day}
                        </span>
                        {holiday ? (
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-semibold leading-tight text-primary sm:text-xs">
                            {holiday.name}
                          </span>
                        ) : (
                          count > 0 && (
                            <span
                              className={cn(
                                'rounded-full px-2 py-0.5 text-[11px] font-semibold sm:text-xs',
                                isBusy
                                  ? 'bg-primary/20 text-primary'
                                  : 'bg-muted text-foreground'
                              )}
                            >
                              {count} on leave
                            </span>
                          )
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span
                    className="h-3.5 w-3.5 rounded bg-primary/10"
                    aria-hidden="true"
                  />
                  Holiday
                </span>
                <span className="flex items-center gap-2">
                  <span
                    className="h-3.5 w-3.5 rounded bg-primary/20"
                    aria-hidden="true"
                  />
                  Busy day ({busyLimit} or more on leave)
                </span>
                <span className="flex items-center gap-2">
                  <span
                    className="h-3.5 w-3.5 rounded border border-border bg-muted"
                    aria-hidden="true"
                  />
                  Weekend
                </span>
              </div>

              {nextHoliday && (
                <div className="mt-3 flex items-center gap-3 rounded-lg bg-primary/10 p-3 text-sm text-foreground">
                  <CalendarDays
                    className="h-4 w-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span>
                    Next holiday:{' '}
                    <span className="font-semibold">{nextHoliday.name}</span>,{' '}
                    {formatLongDay(nextHoliday.date)} (
                    {getDaysUntil(nextHoliday.date, todayIso) === 0
                      ? 'today'
                      : `in ${getDaysUntil(nextHoliday.date, todayIso)} days`}
                    )
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Card className="border-border p-4 sm:p-5">
                <h2 className="text-lg font-semibold text-foreground">
                  {formatLongDay(selectedIso)}
                </h2>
                <p className="mb-2 text-sm text-muted-foreground">
                  {selectedHoliday
                    ? `${selectedHoliday.name} · ${selectedHoliday.type}`
                    : isWeekend(selectedIso)
                      ? 'Weekend'
                      : `${selectedLeaves.length} ${selectedLeaves.length === 1 ? 'person is' : 'people are'} on leave`}
                </p>

                {selectedLeaves.length === 0 ? (
                  <p className="py-3 text-sm text-muted-foreground">
                    Nobody is on leave on this day.
                  </p>
                ) : (
                  <div className="divide-y divide-border">
                    {selectedLeaves.map(leave => (
                      <div
                        key={leave.id}
                        className="flex items-center gap-3 py-2.5"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                          {getInitials(leave.employeeName)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {leave.employeeName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {leave.department}
                          </p>
                          {leave.managerNote && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Manager note: {leave.managerNote}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant="secondary"
                          className={cn(
                            'whitespace-nowrap border-transparent',
                            leaveTypeStyles[leave.type]
                          )}
                        >
                          {leave.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card className="border-border p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-foreground">
                    Leave requests
                  </h2>
                  {pendingLeaves.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="border-transparent bg-muted text-muted-foreground"
                    >
                      {pendingLeaves.length} waiting
                    </Badge>
                  )}
                </div>
                <p className="mb-2 text-sm text-muted-foreground">
                  Open a request to approve or reject it.
                </p>

                {pendingLeaves.length === 0 ? (
                  <p className="py-3 text-sm text-muted-foreground">
                    No requests are waiting for you.
                  </p>
                ) : (
                  <div className="divide-y divide-border">
                    {visibleRequests.map(leave => {
                      const clash = getClashCount(leave);

                      return (
                        <div
                          key={leave.id}
                          className="flex items-center gap-3 py-3"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                            {getInitials(leave.employeeName)}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {leave.employeeName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {leave.type} ·{' '}
                              {formatRange(leave.startDate, leave.endDate)}
                            </p>
                            {clash >= busyLimit && (
                              <p className="text-xs font-semibold text-primary">
                                Busy days: {clash} others are out
                              </p>
                            )}
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            aria-label={`Review ${leave.employeeName}'s leave request`}
                            onClick={() => openReview(leave)}
                          >
                            Review
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {pendingLeaves.length > 3 && (
                  <Button
                    type="button"
                    variant="link"
                    className="px-0"
                    onClick={() => setShowAllRequests(show => !show)}
                  >
                    {showAllRequests
                      ? 'Show fewer requests'
                      : `View all ${pendingLeaves.length} requests →`}
                  </Button>
                )}
              </Card>
            </div>
          </div>
        </div>
      </Section>

      <Dialog
        open={Boolean(reviewLeave)}
        onOpenChange={open => !open && closeReview()}
      >
        <DialogContent
          className="sm:max-w-lg"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {reviewLeave?.employeeName} · {reviewLeave?.department}
            </DialogTitle>
            <DialogDescription>{reviewLeave?.type} request</DialogDescription>
          </DialogHeader>

          {reviewLeave && (
            <div className="space-y-4">
              <div className="text-sm">
                {[
                  [
                    'Dates',
                    reviewLeave.type === 'Half day'
                      ? `${formatRange(reviewLeave.startDate, reviewLeave.endDate)} (half day)`
                      : `${formatRange(reviewLeave.startDate, reviewLeave.endDate)} (${getDayCount(reviewLeave.startDate, reviewLeave.endDate)} days)`,
                  ],
                  [
                    'Leave balance',
                    `${reviewLeave.balance} days → ${Math.max(
                      reviewLeave.balance -
                        getDayCount(reviewLeave.startDate, reviewLeave.endDate),
                      0
                    )} days left`,
                  ],
                  ['Reason', reviewLeave.reason || '–'],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between gap-3 border-t border-border py-2.5 first:border-t-0"
                  >
                    <span className="text-muted-foreground">{label}</span>
                    <span className="text-right font-medium text-foreground">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className={cn(
                  'rounded-lg p-3 text-sm',
                  reviewClash >= busyLimit
                    ? 'bg-muted text-foreground'
                    : 'bg-primary/10 text-foreground'
                )}
              >
                {reviewClash === 0 ? (
                  <span className="font-semibold">
                    Nobody else is out on these days.
                  </span>
                ) : (
                  <span className="font-semibold">
                    {reviewClash}{' '}
                    {reviewClash === 1 ? 'person is' : 'people are'} already out
                    on these days.
                  </span>
                )}{' '}
                {reviewLeave.department} has {reviewDepartmentOut} of{' '}
                {departmentSizes[reviewLeave.department] ?? '–'} people out.
              </div>

              <FormField
                label={`Note for ${reviewLeave.employeeName.split(' ')[0]} (optional)`}
                name="leave-review-note"
                value={reviewNote}
                onChange={setReviewNote}
                placeholder="Add a note"
              />
            </div>
          )}

          <DialogFooter className="gap-2 sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() => decideLeave('rejected')}
            >
              Reject
            </Button>
            <Button type="button" onClick={() => decideLeave('approved')}>
              <Check className="h-4 w-4" aria-hidden="true" />
              Approve leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isHolidayOpen}
        onOpenChange={open => !open && closeHolidayDialog()}
      >
        <DialogContent
          className="sm:max-w-lg"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Add holiday</DialogTitle>
            <DialogDescription>
              Every employee will see it on their calendar.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddHoliday} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Holiday name"
                name="holiday-name"
                value={holidayName}
                onChange={setHolidayName}
                placeholder="e.g. Diwali"
                required
              />
              <FormField
                label="Date"
                name="holiday-date"
                type="date"
                value={holidayDate}
                onChange={setHolidayDate}
                required
              />
            </div>

            <div className="space-y-4">
              <FormField
                label="Type of holiday"
                name="holiday-type"
                type="radio"
                value={holidayType}
                onChange={value => {
                  if (holidayTypes.includes(value as HolidayType)) {
                    setHolidayType(value as HolidayType);
                  }
                }}
                options={holidayTypes.map(type => ({
                  value: type,
                  label: type,
                }))}
              />
              <FormField
                label="Repeat every year"
                name="holiday-repeat"
                type="checkbox"
                value={holidayRepeat}
                onCheckboxChange={setHolidayRepeat}
                className="rounded-lg border border-border bg-muted/40 p-3"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={closeHolidayDialog}
              >
                Cancel
              </Button>
              <Button type="submit">Add holiday</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeaveAndHolidayCalenderPage;
