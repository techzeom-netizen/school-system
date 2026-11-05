export type LeaveTypeId = 'casual' | 'sick' | 'earned' | 'compOff';

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

export type DayPart = 'full' | 'first' | 'second';

export interface LeaveType {
  id: LeaveTypeId;
  label: string;
  total: number;
  usedBefore: number;
}

export interface LeaveRequest {
  id: string;
  type: LeaveTypeId;
  startDate: string;
  endDate: string;
  days: number;
  part: DayPart;
  reason: string;
  status: RequestStatus;
  note: string;
}

export interface Holiday {
  date: string;
  name: string;
}

export interface TeamLeave {
  date: string;
  names: string[];
}

export interface RequestValues {
  type: LeaveTypeId;
  startDate: string;
  endDate: string;
  part: DayPart;
  reason: string;
}

export interface RequestCheck {
  workingDays: number;
  weekendDays: number;
  holidayDays: number;
  teamOff: string[];
  canHalfDay: boolean;
  days: number;
  error: string | null;
}

export interface LongWeekendIdea {
  date: string;
  holidayName: string;
}

export const statusFilterOptions: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

export const dayPartOptions = [
  { label: 'Full day', value: 'full' },
  { label: 'First half', value: 'first' },
  { label: 'Second half', value: 'second' },
];

export const leaveTypeOptions = [
  { label: 'Casual leave', value: 'casual' },
  { label: 'Sick leave', value: 'sick' },
  { label: 'Earned leave', value: 'earned' },
  { label: 'Comp-off', value: 'compOff' },
];

export const quickReasons = [
  'Family function',
  'Medical',
  'Personal work',
  'Travel',
];

export const leaveTypes: LeaveType[] = [
  {
    id: 'casual',
    label: 'Casual leave',
    total: 12,
    usedBefore: 4,
  },
  {
    id: 'sick',
    label: 'Sick leave',
    total: 8,
    usedBefore: 1,
  },
  {
    id: 'earned',
    label: 'Earned leave',
    total: 15,
    usedBefore: 0,
  },
  {
    id: 'compOff',
    label: 'Comp-off',
    total: 2,
    usedBefore: 0,
  },
];

export const statusBadgeClass: Record<RequestStatus, string> = {
  pending: 'bg-muted text-muted-foreground',
  approved: 'bg-primary/10 text-primary',
  rejected: 'bg-destructive/10 text-destructive',
  cancelled: 'bg-muted text-muted-foreground',
};

export const statusLabels: Record<RequestStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
};

export const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const pastDaysAllowed = 7;

export const managerName = 'Rahul Sharma';

export const lastMonthOffset = 2;
export const requestsShownFirst = 5;

export const showDemoControls = true;

export const emptyApplyForm: RequestValues = {
  type: 'casual',
  startDate: '',
  endDate: '',
  part: 'full',
  reason: '',
};

export const toIso = (date: Date) => date.toLocaleDateString('en-CA');

export const todayIso = () => toIso(new Date());

export const addDays = (iso: string, days: number) => {
  const date = new Date(`${iso}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toIso(date);
};

export const dateOffset = (days: number) => addDays(todayIso(), days);

export const isWeekend = (iso: string) => {
  const day = new Date(`${iso}T00:00:00`).getDay();
  return day === 0 || day === 6;
};

export const eachDay = (start: string, end: string) => {
  const days: string[] = [];
  for (let day = start; day <= end; day = addDays(day, 1)) days.push(day);
  return days;
};

export const formatDate = (iso: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-GB', options).format(new Date(`${iso}T00:00:00`));

export const formatRange = (start: string, end: string) =>
  start === end
    ? formatDate(start, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : `${formatDate(start, { weekday: 'short', day: 'numeric' })} â€“ ${formatDate(
        end,
        { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }
      )}`;

export const formatDays = (days: number) =>
  Number.isInteger(days) ? String(days) : days.toFixed(1);

export const pluralize = (
  count: number,
  singular: string,
  plural = `${singular}s`
) => (count === 1 ? singular : plural);

export const holidays: Holiday[] = [
  { date: dateOffset(6), name: 'Dussehra' },
  { date: dateOffset(25), name: 'Diwali' },
  { date: dateOffset(41), name: 'Guru Nanak Jayanti' },
  { date: dateOffset(72), name: 'Christmas' },
];

export const teamLeave: TeamLeave[] = [
  { date: dateOffset(7), names: ['Priya Nair', 'Rohan Iyer'] },
  { date: dateOffset(13), names: ['Aarav Mehta'] },
  { date: dateOffset(29), names: ['Karthik Rao', 'Sneha Reddy'] },
];

export const initialRequests: LeaveRequest[] = [
  {
    id: 'request-1',
    type: 'casual',
    startDate: dateOffset(5),
    endDate: dateOffset(7),
    days: 2,
    part: 'full',
    reason: 'Family function',
    status: 'pending',
    note: `Waiting for ${managerName}`,
  },
  {
    id: 'request-2',
    type: 'earned',
    startDate: dateOffset(29),
    endDate: dateOffset(30),
    days: 2,
    part: 'full',
    reason: 'Travel',
    status: 'approved',
    note: `Approved by ${managerName}`,
  },
  {
    id: 'request-3',
    type: 'sick',
    startDate: dateOffset(-30),
    endDate: dateOffset(-29),
    days: 2,
    part: 'full',
    reason: 'Medical',
    status: 'approved',
    note: `Approved by ${managerName}`,
  },
  {
    id: 'request-4',
    type: 'compOff',
    startDate: dateOffset(-40),
    endDate: dateOffset(-40),
    days: 1,
    part: 'full',
    reason: '',
    status: 'approved',
    note: `Approved by ${managerName}`,
  },
  {
    id: 'request-5',
    type: 'earned',
    startDate: dateOffset(-51),
    endDate: dateOffset(-47),
    days: 5,
    part: 'full',
    reason: 'Travel',
    status: 'approved',
    note: `Approved by ${managerName}`,
  },
  {
    id: 'request-6',
    type: 'casual',
    startDate: dateOffset(-131),
    endDate: dateOffset(-131),
    days: 1,
    part: 'full',
    reason: 'Personal work',
    status: 'rejected',
    note: 'Busy period, please pick another day',
  },
];

export const findLeaveType = (id: LeaveTypeId): LeaveType =>
  leaveTypes.find(type => type.id === id) ?? (leaveTypes[0] as LeaveType);

export const isHoliday = (iso: string) =>
  holidays.some(holiday => holiday.date === iso);

export const isWorkingDay = (iso: string) => !isWeekend(iso) && !isHoliday(iso);

export const isActiveRequest = (request: LeaveRequest) =>
  request.status === 'pending' || request.status === 'approved';

export const getRequestOn = (iso: string, requests: LeaveRequest[]) =>
  requests.find(
    request =>
      isActiveRequest(request) &&
      iso >= request.startDate &&
      iso <= request.endDate
  );

export const sumDays = (
  requests: LeaveRequest[],
  type: LeaveTypeId,
  status: RequestStatus
) =>
  requests
    .filter(request => request.type === type && request.status === status)
    .reduce((total, request) => total + request.days, 0);

export const getLeftDays = (type: LeaveType, requests: LeaveRequest[]) =>
  type.total -
  type.usedBefore -
  sumDays(requests, type.id, 'approved') -
  sumDays(requests, type.id, 'pending');

export const checkRequest = (
  values: RequestValues,
  requests: LeaveRequest[]
): RequestCheck => {
  const { startDate, endDate, type, part } = values;
  const days = endDate >= startDate ? eachDay(startDate, endDate) : [];
  const workingDays = days.filter(isWorkingDay);
  const weekendDays = days.filter(isWeekend).length;
  const holidayDays = days.filter(
    day => !isWeekend(day) && isHoliday(day)
  ).length;
  const teamOff = Array.from(
    new Set(
      teamLeave
        .filter(item => workingDays.includes(item.date))
        .flatMap(item => item.names)
    )
  );
  const canHalfDay = startDate === endDate && workingDays.length === 1;
  const leaveDays = canHalfDay && part !== 'full' ? 0.5 : workingDays.length;
  const leaveType = findLeaveType(type);
  const left = getLeftDays(leaveType, requests);

  let error: string | null = null;
  if (endDate < startDate) {
    error = 'The last day cannot be before the first day.';
  } else if (startDate < addDays(todayIso(), -pastDaysAllowed)) {
    error = `You can apply for past dates up to ${pastDaysAllowed} days back.`;
  } else if (workingDays.length === 0) {
    error =
      'Those days are weekends or holidays. Pick at least one working day.';
  } else if (workingDays.some(day => getRequestOn(day, requests))) {
    error =
      'You already have leave on some of these days. Pick different dates.';
  } else if (part !== 'full' && !canHalfDay) {
    error = 'Half-day leave is only for a single working day.';
  } else if (leaveDays > left) {
    error = `Not enough ${leaveType.label.toLowerCase()}. You have ${formatDays(
      left
    )} ${pluralize(left, 'day')} left.`;
  }

  return {
    workingDays: workingDays.length,
    weekendDays,
    holidayDays,
    teamOff,
    canHalfDay,
    days: leaveDays,
    error,
  };
};

export const getLongWeekendIdeas = (
  requests: LeaveRequest[]
): LongWeekendIdea[] =>
  holidays.flatMap(holiday => {
    const weekday = new Date(`${holiday.date}T00:00:00`).getDay();
    if (weekday !== 2 && weekday !== 4) return [];
    const bridgeDate = addDays(holiday.date, weekday === 2 ? -1 : 1);
    const isFree =
      bridgeDate >= todayIso() &&
      isWorkingDay(bridgeDate) &&
      !getRequestOn(bridgeDate, requests);
    return isFree ? [{ date: bridgeDate, holidayName: holiday.name }] : [];
  });
